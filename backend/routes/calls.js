const express = require('express');
const router = express.Router();
const { pool } = require('../models/database');
const { v4: uuidv4 } = require('uuid');
const twilio = require('twilio');
const { createClient } = require('@deepgram/sdk');
const { ElevenLabsClient } = require('elevenlabs');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');
const OpenAI = require('openai');

// Helper function to determine region from location
function getRegion(location) {
    if (!location) return 'north';
    
    const locationLower = location.toLowerCase();
    if (locationLower.includes('tamil') || locationLower.includes('chennai') || locationLower.includes('madras')) {
        return 'tamil';
    } else if (locationLower.includes('mumbai') || locationLower.includes('pune') || locationLower.includes('maharashtra')) {
        return 'west';
    } else if (locationLower.includes('kolkata') || locationLower.includes('bengal') || locationLower.includes('odisha')) {
        return 'east';
    } else if (locationLower.includes('bangalore') || locationLower.includes('karnataka') || locationLower.includes('kerala')) {
        return 'south';
    } else {
        return 'north';
    }
}

// Initialize OpenAI for vision analysis
let openai = null;
// Dynamic AI provider with fallback
const getAIClient = async () => {
    const providers = [
        { name: 'openai', key: 'OPENAI_API_KEY', client: null },
        { name: 'anthropic', key: 'ANTHROPIC_API_KEY', client: null },
        { name: 'grok', key: 'GROK_API_KEY', client: null }
    ];
    
    // Initialize clients
    for (const provider of providers) {
        if (process.env[provider.key]) {
            try {
                if (provider.name === 'openai') {
                    provider.client = new OpenAI({ apiKey: process.env[provider.key] });
                } else if (provider.name === 'anthropic') {
                    const { Anthropic } = require('@anthropic-ai/sdk');
                    provider.client = new Anthropic({ apiKey: process.env[provider.key] });
                } else if (provider.name === 'grok') {
                    provider.client = new OpenAI({ 
                        apiKey: process.env[provider.key],
                        baseURL: 'https://api.x.ai/v1'
                    });
                }
                console.log(`✅ ${provider.name} client initialized`);
            } catch (error) {
                console.warn(`⚠️ Failed to initialize ${provider.name}:`, error.message);
            }
        }
    }
    
    // Try providers in order of preference
    for (const provider of providers) {
        if (provider.client) {
            try {
                // Test the provider with a simple request
                if (provider.name === 'openai' || provider.name === 'grok') {
                    await provider.client.chat.completions.create({
                        model: provider.name === 'grok' ? 'grok-beta' : 'gpt-4o',
                        messages: [{ role: 'user', content: 'test' }],
                        max_tokens: 1
                    });
                } else if (provider.name === 'anthropic') {
                    await provider.client.messages.create({
                        model: 'claude-3-sonnet-20240229',
                        max_tokens: 1,
                        messages: [{ role: 'user', content: 'test' }]
                    });
                }
                console.log(`🎯 Using ${provider.name} as AI provider`);
                return { client: provider.client, provider: provider.name };
            } catch (error) {
                console.warn(`⚠️ ${provider.name} test failed:`, error.message);
            }
        }
    }
    
    throw new Error('No working AI provider available');
};

// Legacy function for backward compatibility
const getOpenAI = () => {
    if (!openai) {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY environment variable is required');
        }
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }
    return openai;
};

// Generate group responses with vision analysis (like Group Chat)
async function generateGroupResponsesWithVision(agentIds, transcript, ui_path, callId) {
    try {
        console.log('🔍 generateGroupResponsesWithVision called with:', { agentIds, transcript, ui_path, callId });
        const responses = [];
        
        for (const agentId of agentIds) {
            console.log('🔍 Processing agent ID:', agentId);
            try {
                // Get agent data
                const agentResult = await pool.query(
                    'SELECT * FROM ai_agents WHERE id = $1',
                    [agentId]
                );
                
                if (agentResult.rows.length === 0) {
                    console.log('❌ No agent found for ID:', agentId);
                    continue;
                }
                
                const agent = agentResult.rows[0];
                console.log('✅ Found agent:', agent.name);
                const region = getRegion(agent.location);
                
                // Build context for the agent
                const context = `You are ${agent.name}, a ${agent.occupation} from ${agent.location}. 
                You are participating in a group discussion about: "${transcript}".
                ${ui_path ? 'The user has shared an image for you to analyze and provide feedback on.' : ''}
                
                Your personality: ${JSON.stringify(agent.personality || {})}
                Your background: ${agent.background_story || 'No specific background provided'}
                Your goals: ${JSON.stringify(agent.goals || [])}
                Your pain points: ${JSON.stringify(agent.pain_points || [])}
                
                IMPORTANT CONVERSATION RULES:
                - Respond naturally as this person would, considering your background and personality
                - Share your thoughts, experiences, and opinions on the topic
                - Only ask questions if you genuinely need clarification or have a specific doubt
                - Do NOT end every response with questions like "What about you?" or "Where are you from?"
                - Keep responses conversational but focused on the topic
                - Use natural Indian expressions and speaking patterns
                ${ui_path ? 'Analyze the uploaded image and provide specific feedback about what you see.' : ''}`;
                
                // Prepare messages for OpenAI
                const messages = [
                    {
                        role: "system",
                        content: context
                    }
                ];
                
                // Add image analysis if ui_path is provided
                if (ui_path) {
                    try {
                        const imagePath = `.${ui_path}`;
                        const imageBuffer = fs.readFileSync(imagePath);
                        const base64Image = imageBuffer.toString('base64');
                        
                        const mimeType = ui_path.endsWith('.png') ? 'image/png' : 
                                        ui_path.endsWith('.jpg') || ui_path.endsWith('.jpeg') ? 'image/jpeg' : 
                                        'image/png';
                        
                        messages.push({
                            role: "user",
                            content: [
                                {
                                    type: "text",
                                    text: transcript
                                },
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: `data:${mimeType};base64,${base64Image}`,
                                        detail: "high"
                                    }
                                }
                            ]
                        });
                    } catch (error) {
                        console.error('Error reading image file:', error);
                        messages.push({
                            role: "user",
                            content: transcript
                        });
                    }
                } else {
                    messages.push({
                        role: "user",
                        content: transcript
                    });
                }
                
                // Generate response using dynamic AI provider with fallback
                let responseText;
                try {
                    const { client, provider } = await getAIClient();
                    
                    if (provider === 'anthropic') {
                        // Anthropic Claude
                        const response = await client.messages.create({
                            model: 'claude-3-sonnet-20240229',
                            messages: messages,
                            max_tokens: 500
                        });
                        responseText = response.content[0].text;
                    } else {
                        // OpenAI or Grok
                        const model = provider === 'grok' ? 'grok-beta' : 'gpt-4o';
                        const response = await client.chat.completions.create({
                            model: model,
                            messages: messages,
                            temperature: 0.7,
                            max_tokens: 500
                        });
                        responseText = response.choices[0].message.content;
                    }
                } catch (aiError) {
                    console.error('❌ AI provider failed, trying fallback:', aiError.message);
                    // Fallback to basic OpenAI
                    const response = await getOpenAI().chat.completions.create({
                        model: "gpt-4o",
                        messages: messages,
                        temperature: 0.7,
                        max_tokens: 500
                    });
                    responseText = response.choices[0].message.content;
                }
                console.log('✅ Generated response for', agent.name, ':', responseText.substring(0, 100) + '...');
                
                responses.push({
                    agentName: agent.name,
                    responseText: responseText,
                    region: region
                });
                
            } catch (error) {
                console.error(`❌ Error generating response for agent ${agentId}:`, error);
                console.error('Error details:', error.message);
            }
        }
        
        console.log('🔍 generateGroupResponsesWithVision returning:', responses.length, 'responses');
        return responses;
    } catch (error) {
        console.error('❌ Error in generateGroupResponsesWithVision:', error);
        console.error('Error details:', error.message);
        console.error('Stack trace:', error.stack);
        return [];
    }
}

// Initialize services lazily (only when audio features are used)
let twilioClient = null;
let deepgramClient = null;
let elevenlabsClient = null;

// Ensure ElevenLabs client is always available
function ensureElevenLabsClient() {
    if (!elevenlabsClient && process.env.ELEVENLABS_API_KEY) {
        console.log('🔧 Ensuring ElevenLabs client is initialized...');
        console.log('🔑 ElevenLabs API Key:', process.env.ELEVENLABS_API_KEY ? 'Present' : 'Missing');
        console.log('🔑 Key length:', process.env.ELEVENLABS_API_KEY?.length || 0);
        
        try {
            elevenlabsClient = new ElevenLabsClient({ 
                apiKey: process.env.ELEVENLABS_API_KEY
            });
            console.log('✅ ElevenLabs client ensured and initialized');
        } catch (error) {
            console.error('❌ Failed to initialize ElevenLabs client:', error.message);
            return null;
        }
    }
    return elevenlabsClient;
}

// Generate voice audio for agent response
async function generateVoiceAudio(responseText, agentName, callId) {
    try {
        console.log(`🎙️ [generateVoiceAudio] Starting audio generation for ${agentName}...`);
        console.log(`🎙️ [generateVoiceAudio] Response text: "${responseText.substring(0, 50)}..."`);
        console.log(`🎙️ [generateVoiceAudio] Call ID: ${callId}`);
        
        // Get agent data
        const agentResult = await pool.query(
            'SELECT voice_id, location, gender, speech_patterns, english_savvy, demographics FROM ai_agents WHERE name = $1',
            [agentName]
        );
        
        if (agentResult.rows.length === 0) {
            console.warn(`⚠️ [generateVoiceAudio] Agent ${agentName} not found in database`);
            return null;
        }
        
        const agent = agentResult.rows[0];
        console.log(`🎙️ [generateVoiceAudio] Agent data:`, {
            name: agentName,
            gender: agent.gender,
            location: agent.location,
            voice_id: agent.voice_id
        });
        
        const region = getRegion(agent.location);
        const voiceId = getVoiceId(agent, region);
        const voiceSettings = VOICE_SETTINGS[region] || VOICE_SETTINGS.default;
        
        console.log(`🎙️ [generateVoiceAudio] Voice settings:`, {
            region,
            voiceId,
            voiceSettings
        });
        
        // Ensure ElevenLabs client is available
        const client = ensureElevenLabsClient();
        if (!client) {
            console.error(`❌ [generateVoiceAudio] ElevenLabs client not available`);
            throw new Error('ElevenLabs client not available');
        }
        
        console.log(`🎙️ [generateVoiceAudio] Calling ElevenLabs API...`);
        
        // Generate audio
        const audioStream = await client.textToSpeech.convert(voiceId, {
            text: responseText,
            model_id: 'eleven_multilingual_v2',
            voice_settings: voiceSettings
        });
        
        console.log(`🎙️ [generateVoiceAudio] ElevenLabs API call successful, processing stream...`);
        
        // Save audio file
        const filename = `call_${callId}_${Date.now()}_${Math.random().toString(36).substring(7)}.mp3`;
        const filepath = path.join(audioTempDir, filename);
        
        console.log(`🎙️ [generateVoiceAudio] Saving to: ${filepath}`);
        
        const chunks = [];
        for await (const chunk of audioStream) {
            chunks.push(chunk);
        }
        const audioBuffer = Buffer.concat(chunks);
        fs.writeFileSync(filepath, audioBuffer);
        
        console.log(`✅ [generateVoiceAudio] Audio generated successfully: ${filepath}`);
        console.log(`✅ [generateVoiceAudio] File size: ${audioBuffer.length} bytes`);
        return filepath;
        
    } catch (error) {
        console.error(`❌ [generateVoiceAudio] Audio generation failed for ${agentName}:`, error.message);
        console.error(`❌ [generateVoiceAudio] Full error:`, error);
        return null;
    }
}

function initializeAudioServices() {
    if (!twilioClient && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        // Check if we have an API Key (starts with SK) or Account SID (starts with AC)
        if (process.env.TWILIO_ACCOUNT_SID.startsWith('SK')) {
            // This is an API Key, we need to find the Account SID
            console.warn('⚠️  Twilio Account SID appears to be an API Key. Attempting to use API Key directly...');
            // For now, we'll skip Twilio initialization until we have the Account SID
            // The Twilio Voice SDK requires the Account SID for token generation
        } else if (process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
            twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        }
    }
        if (!deepgramClient && process.env.DEEPGRAM_API_KEY) {
            deepgramClient = createClient(process.env.DEEPGRAM_API_KEY, {
                global: {
                    url: 'https://api.deepgram.com',
                    headers: {
                        'User-Agent': 'avinci-voice/1.0'
                    }
                }
            });
        }
    if (!elevenlabsClient && process.env.ELEVENLABS_API_KEY) {
        console.log('🔧 Initializing ElevenLabs client...');
        elevenlabsClient = new ElevenLabsClient({ 
            apiKey: process.env.ELEVENLABS_API_KEY
        });
        console.log('✅ ElevenLabs client initialized successfully');
    } else if (elevenlabsClient) {
        console.log('✅ ElevenLabs client already initialized');
    } else {
        console.log('❌ ElevenLabs client not initialized - no API key');
    }
    
    // Check if essential services are available (Twilio is optional for WebRTC)
    const missingServices = [];
    if (!deepgramClient) missingServices.push('Deepgram');
    if (!elevenlabsClient) missingServices.push('ElevenLabs');
    
    if (missingServices.length > 0) {
        console.warn(`⚠️  Essential audio services not configured. Missing: ${missingServices.join(', ')}. Audio calling will be disabled.`);
        console.warn(`   To enable audio calling, configure Deepgram and ElevenLabs API keys.`);
        return false;
    }
    
    // Twilio is optional for WebRTC-based calling
    if (!twilioClient) {
        console.log('ℹ️  Twilio not configured - using WebRTC for audio calling');
    }
    
    return true;
}

// Create audio temp directory
const audioTempDir = path.join(__dirname, '../uploads/audio');
if (!fs.existsSync(audioTempDir)) {
    fs.mkdirSync(audioTempDir, { recursive: true });
}

// Regional-specific voices from ElevenLabs Voice Library
// Authentic Indian voices for different regions and genders
const INDIAN_VOICES = {
    north: 'EXAVITQu4vr4xnSDxMaL', // Sarah - Female, supports Hindi
    south: 'EXAVITQu4vr4xnSDxMaL', // Sarah - Female, supports Hindi
    west: 'EXAVITQu4vr4xnSDxMaL', // Sarah - Female, supports Hindi
    east: 'EXAVITQu4vr4xnSDxMaL', // Sarah - Female, supports Hindi
    tamil: 'EXAVITQu4vr4xnSDxMaL', // Sarah - Female, supports Hindi
    default: 'EXAVITQu4vr4xnSDxMaL' // Sarah - Female, supports Hindi
};

        // Gender and English proficiency-based voice selection with authentic Indian voices
        function getVoiceId(agent, region) {
            console.log(`🎙️ Assigning voice for ${agent.name} (${agent.gender}, ${region})`);
            
            // Get English proficiency level from agent data
            const englishLevel = agent.speech_patterns?.english_level || 
                                agent.english_savvy || 
                                agent.demographics?.english_level || 
                                'intermediate';
            
            const isIntermediateOrAbove = ['intermediate', 'advanced', 'expert', 'high', 'medium'].includes(
                englishLevel.toLowerCase()
            );
            
            console.log(`🎙️ English level: ${englishLevel}, Intermediate+: ${isIntermediateOrAbove}`);
            
            // Select voice based on gender and English proficiency
            let voiceId;
            if (agent.gender === 'F') {
                // Female voices - using WORKING voice IDs only
                voiceId = 'EXAVITQu4vr4xnSDxMaL'; // Sarah - Female, works for all levels
                console.log(`🎙️ Selected female voice: ${voiceId}`);
            } else {
                // Male voices - using WORKING voice IDs only
                voiceId = 'rgltZvTfiMmgWweZhh7n'; // Kumaran - Male, South Indian, works for all levels
                console.log(`🎙️ Selected male voice: ${voiceId}`);
            }
            
            return voiceId;
        }
        
        // Optimized voice settings per region
        // Tamil voice (rgltZvTfiMmgWweZhh7n) uses tuned settings for natural Tamil accent
        const VOICE_SETTINGS = {
            north: {
                stability: 0.6,        // Balanced for natural variation and speed
                similarity_boost: 0.8, // High for voice quality
                style: 0.5,           // Moderate for natural expressiveness
                use_speaker_boost: true
            },
            south: {
                stability: 0.6,        // Balanced for natural variation and speed
                similarity_boost: 0.8, // High for voice quality
                style: 0.5,           // Moderate for natural expressiveness
                use_speaker_boost: true
            },
            west: {
                stability: 0.6,        // Balanced for natural variation and speed
                similarity_boost: 0.8, // High for voice quality
                style: 0.5,           // Moderate for natural expressiveness
                use_speaker_boost: true
            },
            east: {
                stability: 0.6,        // Balanced for natural variation and speed
                similarity_boost: 0.8, // High for voice quality
                style: 0.5,           // Moderate for natural expressiveness
                use_speaker_boost: true
            },
            tamil: {
                stability: 0.65,       // Slightly higher stability for clear Tamil pronunciation
                similarity_boost: 0.85, // Higher for authentic Tamil voice
                style: 0.6,            // Enhanced expressiveness for Tamil intonation
                use_speaker_boost: true
            },
            default: {
                stability: 0.6,        // Balanced for natural variation and speed
                similarity_boost: 0.8, // High for voice quality
                style: 0.5,           // Moderate for natural expressiveness
                use_speaker_boost: true
            }
        };

// Check audio services status
router.get('/status', (req, res) => {
    const audioServicesAvailable = initializeAudioServices();
    
    res.json({
        audioEnabled: audioServicesAvailable,
        services: {
            twilio: !!twilioClient,
            deepgram: !!deepgramClient,
            elevenlabs: !!elevenlabsClient
        },
        message: audioServicesAvailable 
            ? 'Audio calling is available' 
            : 'Audio services not configured. See AUDIO_CALLING_QUICKSTART.md'
    });
});

router.get('/test-debug', (req, res) => {
    console.log('🔍 DEBUG: test-debug route hit!');
    res.json({ message: 'Debug route working!' });
});

// Create a new User Interview call session (WebRTC-based, no Twilio required)
// Body: { agentIds: UUID[], topic: string, type: 'group' | '1on1', region?: string }
router.post('/create', async (req, res) => {
    try {
        console.log('🔍 DEBUG: Call route hit - POST /create');
        
        // Initialize audio services (ElevenLabs and Deepgram only)
        const audioServicesAvailable = initializeAudioServices();
        
        const { agentIds = [], topic = '', type = 'group', region = 'north' } = req.body || {};
        if (!Array.isArray(agentIds) || agentIds.length === 0) {
            return res.status(400).json({ error: 'agentIds (non-empty array) is required' });
        }

        // Check if we have at least ElevenLabs and Deepgram (Twilio is optional for WebRTC)
        const hasElevenLabs = !!process.env.ELEVENLABS_API_KEY;
        const hasDeepgram = !!process.env.DEEPGRAM_API_KEY;
        
        if (!hasElevenLabs || !hasDeepgram) {
            return res.status(400).json({ 
                error: 'Audio calling not available',
                message: 'ElevenLabs and Deepgram API keys are required for audio calling.',
                audioEnabled: false,
                missing: {
                    elevenlabs: !hasElevenLabs,
                    deepgram: !hasDeepgram
                }
            });
        }

        // Create call in database
        const result = await pool.query(
            'INSERT INTO voice_calls (agent_ids, topic, status) VALUES ($1, $2, $3) RETURNING id, created_at',
            [agentIds, topic, 'open']
        );

        const callId = result.rows[0].id;
        const roomName = `call-${callId}`;

        // For WebRTC-based calling, we don't need Twilio tokens
        // Return call information for Socket.IO connection
        res.json({ 
            callId, 
            roomName,
            type,
            region,
            created_at: result.rows[0].created_at,
            audioEnabled: true,
            method: 'webrtc', // Indicate this is WebRTC-based
            services: {
                elevenlabs: hasElevenLabs,
                deepgram: hasDeepgram,
                twilio: false
            }
        });
    } catch (error) {
        console.error('Create call error:', error);
        res.status(500).json({ error: 'Failed to create call', details: error.message });
    }
});

// Process speech input (STT → AI → TTS)
// Body: { audio: base64, callId: UUID, type: 'group' | '1on1' }
router.post('/process-speech', async (req, res) => {
    console.log('🔍 DEBUG: process-speech route hit!');
    try {
        console.log('=== Processing speech request ===');
        console.log('🔍 DEBUG: Updated calls.js is being used!');
        
        // Initialize audio services
        const audioServicesAvailable = initializeAudioServices();
        console.log('Audio services available:', audioServicesAvailable);
        
        if (!audioServicesAvailable) {
            return res.status(400).json({ 
                error: 'Audio services not configured',
                message: 'Please configure Twilio, Deepgram, and ElevenLabs API keys'
            });
        }
        
        const { audio, callId, type = 'group', transcript: providedTranscript, ui_path } = req.body;
        console.log('Request params:', { callId, type, audioLength: audio?.length, hasTranscript: !!providedTranscript, ui_path });
        console.log('🔍 DEBUG: Full request body:', JSON.stringify(req.body, null, 2));

        if (!callId) {
            return res.status(400).json({ error: 'callId is required' });
        }

        let tempAudioPath = null;
        if (audio) {
            // Decode base64 audio
            console.log('Decoding base64 audio...');
            const audioBuffer = Buffer.from(audio, 'base64');
            console.log('Audio buffer size:', audioBuffer.length);
            
            // Check if audio buffer is too small (likely not real audio)
            if (audioBuffer.length >= 1000) {
                // Save temporary audio file (use webm format since that's what frontend sends)
                tempAudioPath = path.join(audioTempDir, `${uuidv4()}.webm`);
                fs.writeFileSync(tempAudioPath, audioBuffer);
            } else {
                console.log('⚠️ Audio buffer too small, skipping STT from audio');
            }
        }

        // Step 1: Speech-to-Text with Deepgram (skip if client provided transcript)
        let transcript = (providedTranscript && providedTranscript.trim()) ? providedTranscript.trim() : undefined;
        if (transcript) {
            console.log(`📝 Using client-provided transcript: "${transcript}"`);
        } else if (tempAudioPath) {
            try {
                const audioFile = fs.readFileSync(tempAudioPath);
                console.log('🎤 Sending audio to Deepgram...', {
                    fileSize: audioFile.length,
                    filePath: tempAudioPath
                });
                
                const { result, error: dgError } = await deepgramClient.listen.prerecorded.transcribeFile(
                    audioFile,
                    { 
                        model: 'nova-2',
                        smart_format: true,
                        language: 'en-IN', // Indian English
                        punctuate: true,
                        diarize: false,
                        mimetype: 'audio/webm'
                    }
                );

                if (dgError) {
                    console.error('❌ Deepgram API error:', dgError);
                    throw new Error(`Deepgram error: ${dgError.message}`);
                }

                if (!result || !result.results || !result.results.channels || !result.results.channels[0]) {
                    console.error('❌ Unexpected Deepgram response structure:', result);
                    throw new Error('Invalid response from Deepgram');
                }

                transcript = result.results.channels[0].alternatives[0].transcript;
                console.log(`✅ Deepgram transcript: "${transcript}"`);
            } catch (sttError) {
                console.error('❌ Deepgram STT error:', sttError);
                console.error('❌ Error details:', sttError.message);
            }
        }

        if (!transcript) {
            // As a last resort, fallback to a simple prompt to keep the flow alive
            console.log('⚠️ No transcript available; falling back to generic greeting');
            transcript = 'Hello';
        }
        
        if (!transcript || transcript.trim() === '') {
            console.log('No speech detected, returning empty response');
            return res.json({ responseText: '', audioUrl: null, transcript: '' });
        }

        console.log(`Transcript: ${transcript}`);

        // Step 2: Get AI response using direct OpenAI vision (like Group Chat)
        let responseText = '', agentName = '', region = 'north', responses = [];
        
        // For group calls, use direct OpenAI vision analysis
        if (type === 'group') {
            try {
                console.log('🎭 Processing group call with image analysis...');
                console.log('🔍 Type check passed, processing group call');
                // Load agent_ids for the call
                console.log('🔍 Querying call data for callId:', callId);
                const callRow = await pool.query('SELECT agent_ids FROM voice_calls WHERE id = $1', [callId]);
                console.log('🔍 Call query result:', callRow.rows.length, 'rows');
                const agentIds = (callRow.rows[0]?.agent_ids || []).filter(Boolean);
                console.log('🔍 Agent IDs extracted:', agentIds);
                
                // Use direct OpenAI vision analysis like Group Chat
                console.log('🔍 About to call generateGroupResponsesWithVision with agentIds:', agentIds);
                responses = await generateGroupResponsesWithVision(agentIds, transcript, ui_path, callId);
                console.log('🔍 generateGroupResponsesWithVision returned:', responses.length, 'responses');
                
                if (responses && responses.length > 0) {
                    console.log(`🎭 Group call: Generated ${responses.length} responses with vision`);
                    console.log('🔍 Debug responses:', responses.map(r => ({ agentName: r.agentName, hasText: !!r.responseText })));
                    const ioLocal = req.app.get('io');
                    const roomName = `call-${callId}`;
                    const baseGap = 400 + Math.floor(Math.random() * 300);
                    
                    responses.forEach((resp, index) => {
                        const startDelay = index * baseGap;
                        setTimeout(() => {
                            ioLocal && ioLocal.to(roomName).emit('agent-typing', {
                                callId,
                                agentName: resp.agentName,
                                isTyping: true
                            });
                            const speakDelay = 200 + Math.floor(Math.random() * 200);
                            setTimeout(async () => {
                                // Generate audio for this agent response
                                let audioUrl = null;
                                try {
                                    const agentResult = await pool.query(
                                        'SELECT voice_id, location, gender, speech_patterns, english_savvy, demographics FROM ai_agents WHERE name = $1',
                                        [resp.agentName]
                                    );
                                    
                                    if (agentResult.rows.length > 0) {
                                        const agent = agentResult.rows[0];
                                        const region = resp.region || getRegion(agent.location);
                                        const voiceId = getVoiceId(agent, region);
                                        const voiceSettings = VOICE_SETTINGS[region] || VOICE_SETTINGS.default;
                                        
                                        // Ensure ElevenLabs client is available
                                        const client = ensureElevenLabsClient();
                                        if (!client) {
                                            console.error('❌ ElevenLabs client not available for audio generation');
                                            throw new Error('ElevenLabs client not available');
                                        }
                                        
                                        console.log(`🎙️ Generating audio for ${resp.agentName} with voice ${voiceId}`);
                                        console.log(`🎙️ Text: "${resp.responseText.substring(0, 50)}..."`);
                                        
                                        const audioStream = await client.textToSpeech.convert(voiceId, {
                                            text: resp.responseText,
                                            model_id: 'eleven_multilingual_v2',
                                            voice_settings: voiceSettings
                                        });
                                        
                                        console.log(`✅ Audio stream generated for ${resp.agentName}`);
                                        
                                        const filename = `call_${callId}_${Date.now()}_${Math.random().toString(36).substring(7)}.mp3`;
                                        const filepath = path.join(audioTempDir, filename);
                                        
                                        const chunks = [];
                                        for await (const chunk of audioStream) {
                                            chunks.push(chunk);
                                        }
                                        const audioBuffer = Buffer.concat(chunks);
                                        fs.writeFileSync(filepath, audioBuffer);
                                        
                                        audioUrl = `/uploads/audio/${filename}`;
                                    }
                                } catch (audioError) {
                                    console.warn('⚠️ Audio generation failed:', audioError.message);
                                }
                                
                                if (!audioUrl) {
                                    try {
                                        console.log(`🎙️ Attempting fallback audio generation for ${resp.agentName}...`);
                                        const generatedPath = await generateVoiceAudio(resp.responseText, resp.agentName, callId);
                                        if (generatedPath) {
                                            audioUrl = `/uploads/audio/${path.basename(generatedPath)}`;
                                            console.log(`✅ Fallback ElevenLabs audio generated via helper: ${audioUrl}`);
                                        } else {
                                            console.warn(`⚠️ Fallback audio generation returned null for ${resp.agentName}`);
                                        }
                                    } catch (fallbackError) {
                                        console.warn('⚠️ Fallback audio generation failed:', fallbackError.message);
                                        console.error('Fallback error details:', fallbackError);
                                    }
                                }
                                
                                ioLocal && ioLocal.to(roomName).emit('agent-response', {
                                    callId,
                                    agentName: resp.agentName,
                                    responseText: resp.responseText,
                                    audioUrl,
                                    timestamp: new Date().toISOString(),
                                    region: resp.region || 'north'
                                });
                            }, speakDelay);
                        }, startDelay);
                    });
                    
                    // Return the first response for the main response
                    ({ responseText, agentName, region = 'north' } = responses[0]);
                } else {
                    console.warn('No responses generated, falling back to persona generation');
                    // Fall through to persona generation below
                }
            } catch (error) {
                console.error('Group call with vision failed:', error);
                // Fall through to persona generation
            }
        }
        
        // Fallback to persona generation if group call failed
        if (!responseText) {
            try {
                console.log('🎭 Fallback: Using persona generation...');
                const callRow = await pool.query('SELECT agent_ids FROM voice_calls WHERE id = $1', [callId]);
                const agentIds = (callRow.rows[0]?.agent_ids || []).filter(Boolean);
                
                // Try data-processing service first
                try {
                    const groupResponse = await axios.post(
                        `${process.env.DATA_PROCESSING_URL || 'http://localhost:8000'}/process-group-overlap`,
                        { transcript, callId, type, agentIds, ui_path: ui_path },
                        { timeout: 6000 }
                    );
                
                    if (groupResponse.data && Array.isArray(groupResponse.data) && groupResponse.data.length > 0) {
                        console.log(`🎭 Group call: Generated ${groupResponse.data.length} raw agent responses`);
                        // Ensure unique agents and sequence them with short staggered delays
                        const seen = new Set();
                        const deduped = groupResponse.data.filter(r => {
                            const k = (r.agentName || '').trim().toLowerCase();
                            if (!k || seen.has(k)) return false;
                            seen.add(k);
                            return true;
                        });
                        const emitList = deduped.slice(0, Math.max(2, Math.min(4, agentIds.length || 3)));
                        const ioLocal = req.app.get('io');
                        const roomName = `call-${callId}`;
                        const baseGap = 2000 + Math.floor(Math.random() * 1000); // 2000-3000ms between speakers
                        console.log(`🎭 Emitting ${emitList.length} unique agents sequentially (gap ~${baseGap}ms)`);
                        emitList.forEach((resp, index) => {
                            const startDelay = index * baseGap;
                            setTimeout(() => {
                                ioLocal && ioLocal.to(roomName).emit('agent-typing', {
                                    callId,
                                    agentName: resp.agentName,
                                    isTyping: true
                                });
                                const speakDelay = 500 + Math.floor(Math.random() * 500); // 500-1000ms
                                setTimeout(async () => {
                                    // Generate audio for this agent response
                                    let audioUrl = null;
                                    try {
                                        // Get agent data to find voice_id
                                        const agentResult = await pool.query(
                                            'SELECT voice_id, location, gender, speech_patterns, english_savvy, demographics FROM ai_agents WHERE name = $1',
                                            [resp.agentName]
                                        );
                                        
                                        if (agentResult.rows.length > 0) {
                                            const agent = agentResult.rows[0];
                                            const region = resp.region || getRegion(agent.location);
                                            const voiceId = getVoiceId(agent, region);
                                            const voiceSettings = VOICE_SETTINGS[region] || VOICE_SETTINGS.default;
                                            
                                            console.log(`🎙️ Generating voice for ${resp.agentName} (${region}): ${voiceId}`);
                                            
                                            // Ensure ElevenLabs client is available
                                            const client = ensureElevenLabsClient();
                                            if (!client) {
                                                throw new Error('ElevenLabs client not available');
                                            }
                                            
                                            const audioStream = await client.textToSpeech.convert(voiceId, {
                                                text: resp.responseText,
                                                model_id: 'eleven_multilingual_v2',
                                                voice_settings: voiceSettings
                                            });
                                            
                                            const filename = `call_${callId}_${Date.now()}_${Math.random().toString(36).substring(7)}.mp3`;
                                            const filepath = path.join(audioTempDir, filename);
                                            
                                            const chunks = [];
                                            for await (const chunk of audioStream) {
                                                chunks.push(chunk);
                                            }
                                            const audioBuffer = Buffer.concat(chunks);
                                            fs.writeFileSync(filepath, audioBuffer);
                                            
                                            audioUrl = `/uploads/audio/${filename}`;
                                            console.log(`✅ Audio generated: ${audioUrl}`);
                                        }
                                    } catch (audioError) {
                                        console.warn('⚠️ Audio generation failed:', audioError.message);
                                    }
                                    
                                    if (!audioUrl) {
                                        try {
                                            const generatedPath = await generateVoiceAudio(resp.responseText, resp.agentName, callId);
                                            if (generatedPath) {
                                                audioUrl = `/uploads/audio/${path.basename(generatedPath)}`;
                                                console.log(`✅ Fallback ElevenLabs audio generated via helper: ${audioUrl}`);
                                            }
                                        } catch (fallbackError) {
                                            console.warn('⚠️ Fallback audio generation failed:', fallbackError.message);
                                        }
                                    }
                                    
                                    ioLocal && ioLocal.to(roomName).emit('agent-response', {
                                        callId,
                                        agentName: resp.agentName,
                                        responseText: resp.responseText,
                                        audioUrl,
                                        timestamp: new Date().toISOString(),
                                        region: resp.region || region
                                    });
                                    console.log(`✅ Agent responded: ${resp.agentName}`);
                                }, speakDelay);
                            }, startDelay);
                        });
                        
                        // Return the first response for the main response
                        ({ responseText, agentName, region = 'north' } = groupResponse.data[0]);
                    } else {
                        console.warn('Group overlap service returned empty response, falling back to persona generation');
                        // Don't fall through to single response logic for group calls
                        // The persona generation logic below will handle group calls
                    }
                } catch (groupError) {
                    console.warn('Group overlap service unavailable, falling back to multiple single responses:', groupError.message);
                    
                    // Fallback: Generate multiple responses by calling single response multiple times
                    try {
                        const fallbackResponses = [];
                        // Fetch call data to get agent_ids
                        const callDataResponse = await pool.query('SELECT agent_ids FROM voice_calls WHERE id = $1', [callId]);
                        const callData = callDataResponse.rows[0] || {};
                        const agentIds = callData.agent_ids || [];
                        
                        // Get 2-3 agents to respond
                        const numResponders = Math.min(2, agentIds.length);
                        const respondingAgents = agentIds.slice(0, numResponders);
                        
                        console.log(`🎭 Fallback: Generating ${respondingAgents.length} single responses`);
                        
                        // Generate responses from multiple agents
                        for (let i = 0; i < respondingAgents.length; i++) {
                            try {
                                const singleResponse = await axios.post(
                                    `${process.env.DATA_PROCESSING_URL || 'http://localhost:8000'}/process-input`,
                                    { transcript, callId, type: '1on1', ui_path: ui_path },
                                    { timeout: 5000 }
                                );
                                
                                if (singleResponse.data && singleResponse.data.responseText) {
                                    fallbackResponses.push({
                                        agentName: singleResponse.data.agentName || `Agent ${i + 1}`,
                                        responseText: singleResponse.data.responseText,
                                        region: singleResponse.data.region || 'north'
                                    });
                                }
                            } catch (singleError) {
                                console.warn(`Single response ${i + 1} failed:`, singleError.message);
                            }
                        }
                        
                        if (fallbackResponses.length > 0) {
                            console.log(`🎭 Fallback: Generated ${fallbackResponses.length} responses`);
                            const ioLocal = req.app.get('io');
                            const roomName = `call-${callId}`;
                            const baseGap = 400 + Math.floor(Math.random() * 300);
                            fallbackResponses.forEach((response, index) => {
                                const startDelay = index * baseGap;
                                setTimeout(() => {
                                    ioLocal && ioLocal.to(roomName).emit('agent-typing', {
                                        callId,
                                        agentName: response.agentName,
                                        isTyping: true
                                    });
                                    const speakDelay = 200 + Math.floor(Math.random() * 200);
                                    setTimeout(async () => {
                                        let emittedAudioUrl = null;
                                        try {
                                            const generatedPath = await generateVoiceAudio(response.responseText, response.agentName, callId);
                                            if (generatedPath) {
                                                emittedAudioUrl = `/uploads/audio/${path.basename(generatedPath)}`;
                                                console.log(`✅ Fallback ElevenLabs audio generated via helper: ${emittedAudioUrl}`);
                                            }
                                        } catch (fallbackError) {
                                            console.warn('⚠️ Fallback audio generation failed:', fallbackError.message);
                                        }
                                        
                                        ioLocal && ioLocal.to(roomName).emit('agent-response', {
                                            callId,
                                            agentName: response.agentName,
                                            responseText: response.responseText,
                                            audioUrl: emittedAudioUrl,
                                            timestamp: new Date().toISOString(),
                                            region: response.region || 'north'
                                        });
                                        console.log(`✅ Fallback response sent:`, response.agentName);
                                    }, speakDelay);
                                }, startDelay);
                            });
                            
                            // Use first response for main response
                            ({ responseText, agentName, region = 'north' } = fallbackResponses[0]);
                        }
                    } catch (fallbackError) {
                        console.warn('Fallback multiple responses failed:', fallbackError.message);
                        // Fall through to single response logic
                    }
                }
            } catch (error) {
                console.error('Persona generation failed:', error);
                // Fall through to single response logic
            }
        }
        
        // If no group response or single call, get single response
        if (!responseText) {
            try {
                const aiResponse = await axios.post(
                    `${process.env.DATA_PROCESSING_URL || 'http://localhost:8000'}/process-input`,
                    { transcript, callId, type },
                    { timeout: 5000 }
                );
                
                const { responseText: aiResponseText, agentName: aiAgentName, region: aiRegion } = aiResponse.data;
                
                // Only use the response if it's not empty
                if (aiResponseText && aiResponseText.trim() !== '') {
                    responseText = aiResponseText;
                    agentName = aiAgentName;
                    region = aiRegion || 'north';
                    console.log(`✅ Using data-processing response: ${agentName} - ${responseText}`);
                } else {
                    console.warn('Data-processing service returned empty response, falling back to persona generation');
                    // Explicitly set responseText to empty to trigger persona generation
                    responseText = '';
                }
            } catch (aiError) {
                console.warn('Single AI service unavailable, using fallback:', aiError.message);
                // Fall through to fallback logic
            }
        }
        
        // If still no response, generate persona-based response directly
        console.log(`🔍 Debug: Before persona check - responseText: "${responseText}", type: ${typeof responseText}, empty: ${!responseText}, trim empty: ${responseText && responseText.trim() === ''}`);
        console.log(`🔍 Debug: About to check persona generation - responseText: "${responseText}", type: ${type}`);
        if (!responseText || responseText.trim() === '') {
            console.warn('Data processing service unavailable, generating persona response directly');
            console.log(`🔍 Debug: responseText is empty, callId: ${callId}, transcript: ${transcript}`);
            console.log(`🔍 Debug: responseText value: "${responseText}", type: ${typeof responseText}`);
            
            // Get agent data from database to generate persona-based response
            try {
                console.log(`🔍 Debug: Querying call data for callId: ${callId}`);
                const callData = await pool.query('SELECT agent_ids FROM voice_calls WHERE id = $1', [callId]);
                console.log(`🔍 Debug: Call data result:`, callData.rows);
                const agentIds = callData.rows[0]?.agent_ids || [];
                console.log(`🔍 Debug: Agent IDs:`, agentIds);
                
                if (agentIds.length > 0) {
                    // For group calls, generate responses for multiple agents
                    if (type === 'group') {
                        console.log(`🎭 Generating persona responses for ${agentIds.length} agents in group call`);
                        const ioLocal = req.app.get('io');
                        const roomName = `call-${callId}`;
                        const baseGap = 400 + Math.floor(Math.random() * 300);
                        
                        console.log(`🔍 Socket.IO available:`, !!ioLocal);
                        console.log(`🔍 Room name:`, roomName);
                        
                        // Generate responses for all agents
                        console.log(`🎭 Scheduling ${agentIds.length} agents with ${baseGap}ms gap`);
                
                for (let i = 0; i < agentIds.length; i++) {
                    const agentResult = await pool.query('SELECT * FROM ai_agents WHERE id = $1', [agentIds[i]]);
                    const agent = agentResult.rows[0];
                    
                    if (agent) {
                        const currentAgentName = agent.name;
                        const currentRegion = getRegion(agent.location);
                        const englishLevel = agent.speech_patterns?.english_level || agent.english_savvy || 'Intermediate';
                        
                        console.log(`🔍 Debug: Agent ${currentAgentName}, English Level: ${englishLevel}, Location: ${agent.location}`);
                        
                        // Get uploaded image path from call data
                        let imagePath = null;
                        try {
                            const callDataResult = await pool.query('SELECT ui_path FROM calls WHERE id = $1', [callId]);
                            if (callDataResult.rows.length > 0 && callDataResult.rows[0].ui_path) {
                                imagePath = callDataResult.rows[0].ui_path;
                                console.log(`🖼️ Found uploaded image for call: ${imagePath}`);
                            }
                        } catch (imageError) {
                            console.warn('⚠️ Could not fetch image path:', imageError.message);
                        }
                        
                        // Use enhanced response generation (Group Strategy Conversation logic)
                        let agentResponseText = '';
                        try {
                            agentResponseText = await generateEnhancedVoiceResponse(agent, transcript, callId, imagePath);
                            console.log(`✅ Generated enhanced persona response for ${currentAgentName}: ${agentResponseText}`);
                        } catch (enhancedError) {
                            console.warn(`⚠️ Enhanced response generation failed for ${currentAgentName}, using fallback:`, enhancedError.message);
                            
                            // Fallback to simple persona response
                            const lowerTranscript = transcript.toLowerCase();
                            if (lowerTranscript.includes('hello') || lowerTranscript.includes('hi')) {
                                agentResponseText = `Hello! I'm ${agent.name}. It's wonderful to be participating in this research discussion. How are you today?`;
                            } else {
                                agentResponseText = `That's an interesting point. I'm ${agent.name}, and I'd be delighted to share my insights on this topic. What aspects would you like to explore further?`;
                            }
                            console.log(`✅ Generated fallback response for ${currentAgentName}: ${agentResponseText}`);
                        }
                        
                        // Generate audio for this agent response
                        let audioUrl = null;
                        try {
                            const voiceId = getVoiceId(agent, currentRegion);
                            const voiceSettings = VOICE_SETTINGS[currentRegion] || VOICE_SETTINGS.default;
                            
                            console.log(`🎙️ Generating voice for ${currentAgentName} (${currentRegion}): ${voiceId}`);
                            
                            // Use axios directly to bypass SSL issues
                            const response = await axios.post(
                                `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
                                {
                                    text: agentResponseText,
                                    model_id: 'eleven_multilingual_v2',
                                    voice_settings: voiceSettings
                                },
                                {
                                    headers: {
                                        'Accept': 'audio/mpeg',
                                        'Content-Type': 'application/json',
                                        'xi-api-key': process.env.ELEVENLABS_API_KEY
                                    },
                                    responseType: 'arraybuffer',
                                    httpsAgent: new https.Agent({
                                        rejectUnauthorized: false
                                    })
                                }
                            );
                            
                            const filename = `call_${callId}_${Date.now()}_${Math.random().toString(36).substring(7)}.mp3`;
                            const filepath = path.join(audioTempDir, filename);
                            
                            fs.writeFileSync(filepath, response.data);
                            
                            audioUrl = `/uploads/audio/${filename}`;
                            console.log(`✅ Audio generated: ${audioUrl}`);
                        } catch (audioError) {
                            console.warn('⚠️ Audio generation failed:', audioError.message);
                        }
                        
                        // Emit agent response with delay
                        const startDelay = i * baseGap;
                        console.log(`🔍 Scheduling response for ${currentAgentName} with delay: ${startDelay}ms`);
                        setTimeout(async () => {
                            console.log(`🔍 Emitting typing for ${currentAgentName}`);
                            ioLocal && ioLocal.to(roomName).emit('agent-typing', {
                                callId,
                                agentName: currentAgentName,
                                isTyping: true
                            });
                            const speakDelay = 200 + Math.floor(Math.random() * 200);
                            setTimeout(async () => {
                                if (!audioUrl) {
                                    try {
                                        const generatedPath = await generateVoiceAudio(agentResponseText, currentAgentName, callId);
                                        if (generatedPath) {
                                            audioUrl = `/uploads/audio/${path.basename(generatedPath)}`;
                                            console.log(`✅ Fallback ElevenLabs audio generated via helper: ${audioUrl}`);
                                        }
                                    } catch (fallbackError) {
                                        console.warn('⚠️ Fallback audio generation failed:', fallbackError.message);
                                    }
                                }
                                
                                console.log(`🔍 Emitting response for ${currentAgentName}: ${agentResponseText}`);
                                ioLocal && ioLocal.to(roomName).emit('agent-response', {
                                    callId,
                                    agentName: currentAgentName,
                                    responseText: agentResponseText,
                                    audioUrl,
                                    timestamp: new Date().toISOString(),
                                    region: currentRegion
                                });
                                console.log(`✅ Agent responded: ${currentAgentName}`);
                            }, speakDelay);
                        }, startDelay);
                        
                        // Use first agent's response for the main response
                        if (i === 0) {
                            responseText = agentResponseText;
                            agentName = currentAgentName;
                            region = currentRegion;
                        }
                    } else {
                        console.warn(`❌ No agent found with ID: ${agentIds[i]}`);
                    }
                }
                    } else {
                        // Single call - generate response for first agent only
                        console.log(`🔍 Debug: Querying agent data for ID: ${agentIds[0]}`);
                        const agentResult = await pool.query('SELECT * FROM ai_agents WHERE id = $1', [agentIds[0]]);
                        console.log(`🔍 Debug: Agent result:`, agentResult.rows[0] ? 'Found agent' : 'No agent found');
                        const agent = agentResult.rows[0];
                        
                        if (agent) {
                            agentName = agent.name;
                            region = getRegion(agent.location);
                            
                    // Get uploaded image path from call data
                    let imagePath = null;
                    try {
                        const callDataResult = await pool.query('SELECT ui_path FROM calls WHERE id = $1', [callId]);
                        if (callDataResult.rows.length > 0 && callDataResult.rows[0].ui_path) {
                            imagePath = callDataResult.rows[0].ui_path;
                            console.log(`🖼️ Found uploaded image for call: ${imagePath}`);
                        }
                    } catch (imageError) {
                        console.warn('⚠️ Could not fetch image path:', imageError.message);
                    }
                    
                    // Use enhanced response generation (Group Strategy Conversation logic)
                    try {
                        responseText = await generateEnhancedVoiceResponse(agent, transcript, callId, imagePath);
                        console.log(`✅ Generated enhanced persona response for ${agentName}: ${responseText}`);
                    } catch (enhancedError) {
                                console.warn(`⚠️ Enhanced response generation failed, using fallback:`, enhancedError.message);
                                
                                // Fallback to simple response
                                const lowerTranscript = transcript.toLowerCase();
                                if (lowerTranscript.includes('hello') || lowerTranscript.includes('hi')) {
                                    responseText = `Hello! I'm ${agent.name}. It's wonderful to be participating in this research discussion. How are you today?`;
                                } else {
                                    responseText = `That's an interesting point. I'm ${agent.name}, and I'd be delighted to share my insights on this topic. What aspects would you like to explore further?`;
                                }
                                console.log(`✅ Generated fallback response for ${agentName}: ${responseText}`);
                            }
                        } else {
                            console.warn(`❌ No agent found with ID: ${agentIds[0]}`);
                        }
                    }
                } else {
                    console.warn(`❌ No agent IDs found for call: ${callId}`);
                }
            } catch (dbError) {
                console.error('❌ Error generating persona response:', dbError);
            }
            
            // If still no response, return empty (no AI Assistant)
            if (!responseText) {
                console.warn('❌ Could not generate persona response, returning empty');
                return res.json({ responseText: '', audioUrl: null, transcript });
            }
        }

        if (!responseText) {
            return res.json({ responseText: '', audioUrl: null, transcript });
        }

        // For group calls, we already emitted Socket.IO events and the frontend does TTS.
        // Return the first response for compatibility.
        if (type === 'group') {
            console.log('🔍 Debug: Returning group response. Responses length:', responses?.length || 0);
            console.log('🔍 Debug: First response:', responses?.[0]);
            const firstResponse = responses && responses.length > 0 ? responses[0] : null;
            const responseText = firstResponse?.responseText || '';
            const agentName = firstResponse?.agentName || '';
            console.log('🔍 Debug: Final responseText:', responseText);
            console.log('🔍 Debug: Final agentName:', agentName);
            return res.json({ 
                responseText, 
                audioUrl: null, 
                transcript,
                agentName,
                region: firstResponse?.region || 'north'
            });
        }

        // Step 3: Text-to-Speech with ElevenLabs (Enhanced Indian accent)
        const voiceId = INDIAN_VOICES[region] || INDIAN_VOICES.default;
        const voiceSettings = VOICE_SETTINGS[region] || VOICE_SETTINGS.default;
        
        console.log(`Generating TTS for: "${responseText}" with unified voice: ${voiceId} (${region} accent)`);
        
        let ttsAudioPath;
        try {
            // Ensure ElevenLabs client is available
            const client = ensureElevenLabsClient();
            if (!client) {
                throw new Error('ElevenLabs client not available');
            }
            
            const audioStream = await client.textToSpeech.convert(voiceId, {
                text: responseText,
                model_id: 'eleven_multilingual_v2',
                voice_settings: voiceSettings
            });

            // Save TTS audio
            ttsAudioPath = path.join(audioTempDir, `${uuidv4()}.mp3`);
            const writeStream = fs.createWriteStream(ttsAudioPath);
            
            for await (const chunk of audioStream) {
                writeStream.write(chunk);
            }
            
            await new Promise((resolve, reject) => {
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
                writeStream.end();
            });
            
            console.log(`TTS audio saved to: ${ttsAudioPath}`);
        } catch (ttsError) {
            console.error('ElevenLabs TTS error:', ttsError);
            console.log('TTS failed, returning response without audio');
            ttsAudioPath = null;
        }

        // Generate public URL for audio
        const audioUrl = ttsAudioPath ? `/uploads/audio/${path.basename(ttsAudioPath)}` : null;

        // Log event to database
        await pool.query(
            'INSERT INTO voice_events (call_id, speaker, kind, text, audio_url) VALUES ($1, $2, $3, $4, $5)',
            [callId, agentName || 'Agent', 'agent-response', responseText, audioUrl]
        );

        // Emit agent response to all clients in the call with human-like behavior
        const io = req.app.get('io');
        if (io) {
            const roomName = `call-${callId}`;
            console.log(`🔌 Emitting to room: ${roomName}, agent: ${agentName}`);
            console.log(`🔌 Socket.IO connected clients:`, io.sockets.sockets.size);
            
            // Show typing indicator first
            io.to(roomName).emit('agent-typing', {
                callId,
                agentName,
                isTyping: true
            });
            console.log(`⌨️ Sent agent-typing to room ${roomName}`);
            
            // Generate audio first, then emit response
            const generateAudioAndEmit = async () => {
                let finalAudioUrl = audioUrl; // Start with the provided audioUrl
                
                // If no audioUrl provided, generate one
                if (!finalAudioUrl) {
                    try {
                        console.log(`🎙️ Generating audio for ${agentName}...`);
                        const ttsAudioPath = await generateVoiceAudio(responseText, agentName, callId);
                        if (ttsAudioPath) {
                            finalAudioUrl = `/uploads/audio/${path.basename(ttsAudioPath)}`;
                            console.log(`✅ Audio generated: ${finalAudioUrl}`);
                        }
                    } catch (audioError) {
                        console.warn('⚠️ Audio generation failed:', audioError.message);
                    }
                }
                
                // Add some human-like delay (1-3 seconds)
                const delay = Math.random() * 2000 + 1000;
                
                setTimeout(() => {
                    console.log(`🤖 Sending agent response to room ${roomName}: "${responseText.substring(0, 50)}..."`);
                    io.to(roomName).emit('agent-response', {
                        callId,
                        agentName,
                        responseText,
                        audioUrl: finalAudioUrl,
                        timestamp: new Date().toISOString(),
                        isTyping: false,
                        isSpeaking: true
                    });
                    console.log(`✅ Agent response sent to room ${roomName}`);
                }, delay);
            };
            
            generateAudioAndEmit();
        } else {
            console.warn('❌ Socket.IO not available, cannot emit agent response');
        }

        // Clean up temp input file if it exists
        if (tempAudioPath && fs.existsSync(tempAudioPath)) {
            fs.unlinkSync(tempAudioPath);
        }

        res.json({ 
            responseText, 
            audioUrl,
            transcript,
            agentName,
            region
        });

    } catch (error) {
        console.error('Process speech error:', error);
        console.error('Error stack:', error.stack);
        
        // Provide more specific error information
        let errorMessage = error.message;
        if (error.response) {
            errorMessage = `External service error: ${error.response.status} - ${error.response.statusText}`;
        }
        
        res.status(500).json({ 
            error: 'Failed to process speech', 
            details: errorMessage,
            step: error.step || 'unknown'
        });
    }
});

// Get call status and last 100 events
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const call = await pool.query('SELECT * FROM voice_calls WHERE id = $1', [id]);
        if (call.rows.length === 0) {
            return res.status(404).json({ error: 'Call not found' });
        }

        const events = await pool.query(
            'SELECT speaker, kind, text, audio_url, created_at FROM voice_events WHERE call_id = $1 ORDER BY created_at DESC LIMIT 100',
            [id]
        );

        res.json({ call: call.rows[0], events: events.rows });
    } catch (error) {
        console.error('Get call error:', error);
        res.status(500).json({ error: 'Failed to fetch call', details: error.message });
    }
});

// End call
router.post('/:id/end', async (req, res) => {
    try {
        const { id } = req.params;
        
        try {
            await pool.query(
                'UPDATE voice_calls SET status = $1, ended_at = NOW() WHERE id = $2',
                ['closed', id]
            );
        } catch (dbError) {
            // If ended_at column doesn't exist, just update status
            if (dbError.code === '42703') {
                await pool.query(
                    'UPDATE voice_calls SET status = $1 WHERE id = $2',
                    ['closed', id]
                );
            } else {
                throw dbError;
            }
        }

        res.json({ success: true, message: 'Call ended' });
    } catch (error) {
        console.error('End call error:', error);
        res.status(500).json({ error: 'Failed to end call', details: error.message });
    }
});

// Use the exact same response generation as GroupChat
async function generateEnhancedVoiceResponse(agent, transcript, callId, imagePath = null) {
    try {
        // Import the same functions from aiChat.js
        const { buildEnhancedContext, generateEnhancedResponse } = require('./aiChat');
        
        // Use the same logic as GroupChat, but pass the image path
        const context = buildEnhancedContext(agent, [], transcript, imagePath);
        const response = await generateEnhancedResponse(context, transcript, imagePath);
        
        return response;
        
    } catch (error) {
        console.error('Enhanced voice response generation failed:', error);
        throw error;
    }
}

module.exports = router;
