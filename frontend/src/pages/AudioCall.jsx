import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Device } from '@twilio/voice-sdk';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import MessageBeautifier from '../components/MessageBeautifier';
import { 
    FaMicrophoneSlash as MicOff, 
    FaMicrophone as Mic, 
    FaPhoneSlash as PhoneOff, 
    FaCommentDots as MessageSquare,
    FaImage as PhotoIcon
} from 'react-icons/fa';
import axios from 'axios';

const AudioCall = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { agentIds: initialAgentIds, topic: initialTopic, type: initialType = 'group' } = location.state || {};
    
    // ===== STATE =====
    const [agentIds, setAgentIds] = useState(initialAgentIds);
    const [topic, setTopic] = useState(initialTopic);
    const [type, setType] = useState(initialType);
    const [callState, setCallState] = useState('idle'); // idle, connecting, connected, ended
    const [isMuted, setIsMuted] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [callId, setCallId] = useState(null);
    const [token, setToken] = useState(null);
    const [roomName, setRoomName] = useState(null);
    const [error, setError] = useState('');
    const [typingAgents, setTypingAgents] = useState(new Set());
    const [speakingAgents, setSpeakingAgents] = useState(new Set());
    const [callDuration, setCallDuration] = useState(0);
    const [showTranscript, setShowTranscript] = useState(true);
    const [recognitionTranscript, setRecognitionTranscript] = useState('');
    const [isSpeechRecognitionActive, setIsSpeechRecognitionActive] = useState(false);
    const [uploadedImagePath, setUploadedImagePath] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [audioQueue, setAudioQueue] = useState([]);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [currentSpeakingAgent, setCurrentSpeakingAgent] = useState(null);
    
    // ===== REFS =====
    const deviceRef = useRef(null);
    const socketRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const streamRef = useRef(null);
    const recognitionRef = useRef(null);
    const currentTranscriptRef = useRef(''); // Store current transcript directly
    const fileInputRef = useRef(null);
    const processedResponsesRef = useRef(new Set());

    // ===== FUNCTION DEFINITIONS (BEFORE USE EFFECTS) =====
    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const cleanup = () => {
        try {
            if (socketRef.current) {
                socketRef.current.emit('leave-call', callId);
                socketRef.current.disconnect();
            }
            if (deviceRef.current) {
                if (deviceRef.current.state === 'registered') {
                    deviceRef.current.unregister();
                }
                deviceRef.current.destroy();
            }
            if (isRecording) {
                stopRecording();
            }
            // Stop speech recognition
            stopSpeechRecognition();
            processedResponsesRef.current.clear();
        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    };

    const initSpeechRecognition = () => {
        console.log('🔊 Checking Web Speech API support...');
        
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            console.log('✅ Web Speech API supported');
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-IN'; // Indian English
            
            recognition.onstart = () => {
                console.log('🗣️ Speech recognition started');
                setIsSpeechRecognitionActive(true);
            };
            
            recognition.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';
                
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const result = event.results[i];
                    if (result.isFinal) {
                        finalTranscript += result[0].transcript;
                    } else {
                        interimTranscript += result[0].transcript;
                    }
                }
                
                const fullTranscript = finalTranscript + interimTranscript;
                setRecognitionTranscript(fullTranscript);
                currentTranscriptRef.current = fullTranscript; // Store in ref for immediate access
                
                if (finalTranscript) {
                    console.log('🗣️ Speech recognized (final):', finalTranscript);
                }
                if (interimTranscript) {
                    console.log('🗣️ Speech recognized (interim):', interimTranscript);
                }
            };
            
            recognition.onerror = (event) => {
                console.error('❌ Speech recognition error:', event.error);
                if (event.error === 'no-speech') {
                    setRecognitionTranscript('');
                    console.log('No speech detected');
                } else if (event.error === 'not-allowed') {
                    console.log('Speech recognition not allowed');
                }
            };
            
            recognition.onend = () => {
                console.log('🗣️ Speech recognition ended');
                setIsSpeechRecognitionActive(false);
            };
            
            recognitionRef.current = recognition;
            console.log('✅ Speech recognition initialized successfully');
            return recognition;
        } else {
            console.warn('❌ Web Speech API not supported in this browser');
            console.log('Falling back to Deepgram STT');
            return null;
        }
    };

    const startSpeechRecognition = () => {
        if (recognitionRef.current && !isSpeechRecognitionActive) {
            try {
                recognitionRef.current.start();
                setIsSpeechRecognitionActive(true);
                console.log('🗣️ Started speech recognition');
                setRecognitionTranscript('');
            } catch (error) {
                console.error('Failed to start speech recognition:', error);
                setIsSpeechRecognitionActive(false);
            }
        } else {
            console.log('Speech recognition already running or not available');
        }
    };

    const stopSpeechRecognition = () => {
        if (recognitionRef.current && isSpeechRecognitionActive) {
            try {
                recognitionRef.current.stop();
                setIsSpeechRecognitionActive(false);
                console.log('🗣️ Stopped speech recognition');
            } catch (error) {
                console.error('Error stopping speech recognition:', error);
                setIsSpeechRecognitionActive(false);
            }
        }
    };

    const initializeCall = async () => {
        try {
            setCallState('connecting');
            toast.loading('Connecting to call...', { id: 'call-connect' });

            // Debug logging
            console.log('Initializing call with:', { agentIds, topic, type });

            // Create call session
            let response;
            try {
                response = await axios.post('/api/call/create', {
                    agentIds,
                    topic,
                    type
                });
                console.log('Call creation response:', response);
            } catch (axiosError) {
                console.error('Axios error:', axiosError);
                throw new Error(`Network error: ${axiosError.message}`);
            }

            // Check if response and data exist
            if (!response || !response.data) {
                console.error('Invalid response:', response);
                throw new Error('Invalid response from server');
            }

            const { callId: newCallId, roomName: newRoom, audioEnabled, method } = response.data;
            
            // Validate required fields (token is optional for WebRTC)
            if (!newCallId || !newRoom) {
                console.error('Missing required fields:', { newCallId, newRoom });
                throw new Error('Invalid call data received from server');
            }
            
            // Check if audio is enabled
            if (!audioEnabled) {
                throw new Error('Audio calling is not available. Please check your configuration.');
            }
            
            setCallId(newCallId);
            setToken(null); // No token needed for WebRTC
            setRoomName(newRoom);

            // Set state to connected so user can start speaking
            setCallState('connected');
            toast.success('Connected to call! Click "Press to Speak" to start.', { id: 'call-connect' });

            // Fetch participants (agents)
            try {
                const agentsResponse = await axios.post('/api/research-agents/by-ids', {
                    agentIds
                });
                setParticipants(agentsResponse.data?.agents || []);
                console.log('✅ Agents loaded:', agentsResponse.data?.agents?.length || 0);
            } catch (agentError) {
                console.warn('Failed to fetch agents:', agentError);
                setParticipants([]);
            }

        } catch (error) {
            console.error('Failed to initialize call:', error);
            
            // Check if error has response property and audioEnabled flag
            const hasResponse = error && typeof error === 'object' && 'response' in error;
            const isAudioDisabled = hasResponse && error.response?.data?.audioEnabled === false;
            
            if (isAudioDisabled) {
                toast.error('Audio calling not available. Please configure audio services.', { id: 'call-connect' });
                setError('Audio services (Twilio, Deepgram, ElevenLabs) are not configured. Please see AUDIO_CALLING_QUICKSTART.md for setup instructions.');
            } else if (error?.message?.includes('Network error')) {
                toast.error('Network error. Please check your connection.', { id: 'call-connect' });
                setError('Network error: Unable to connect to the server. Please check your internet connection.');
            } else {
                const errorMessage = error?.message || 'Unknown error';
                toast.error('Failed to connect to call', { id: 'call-connect' });
                setError(`Call initialization failed: ${errorMessage}`);
            }
            setCallState('idle');
        }
    };

    const processAudio = async (audioBlob, speechTranscript = '') => {
        console.log('🎤 processAudio called with:', { 
            hasBlob: !!audioBlob, 
            hasCallId: !!callId, 
            size: audioBlob?.size,
            type: audioBlob?.type,
            speechTranscript
        });
        
        if (!callId) {
            console.log('⚠️ No callId available');
            return;
        }

        // Always send the speech transcript if available
        const hasValidTranscript = speechTranscript && speechTranscript.trim().length > 0 && 
                                  !speechTranscript.includes('No speech detected');
        
        console.log('🗣️ Using transcript:', hasValidTranscript ? speechTranscript : 'none (will use Deepgram)');

        try {
            // If we have a valid transcript, send it directly (skip audio processing)
            if (hasValidTranscript) {
                console.log('🚀 Sending transcript directly to backend');
                
                // Add user speech to transcript
                setTranscript(prev => [...prev, {
                    speaker: 'You',
                    text: speechTranscript,
                    timestamp: new Date().toISOString(),
                    type: 'user'
                }]);

                // Send transcript to backend with UI context if available
                const response = await axios.post('/api/call/process-speech', {
                    callId,
                    type,
                    transcript: speechTranscript,
                    ui_path: uploadedImagePath // Include uploaded image path
                });
                
                console.log('✅ Backend response:', response.data);
                const { responseText, audioUrl, agentName } = response.data;

                // Agent response will come via socket
                if (responseText) {
                    socketRef.current?.emit('agent-response', {
                        callId,
                        audioUrl,
                        responseText,
                        agentName,
                        delay: Math.random() * 1000 + 500
                    });
                }
                return;
            }

            // Fallback to audio processing if no speech transcript
            if (!audioBlob || audioBlob.size < 1000) {
                console.log('⚠️ Skipping audio processing - too small or missing data');
                return;
            }

            console.log('🎤 Processing audio blob:', { size: audioBlob.size, callId, type });

            // Convert blob to base64
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            
            reader.onloadend = async () => {
                const base64Audio = reader.result.split(',')[1];
                console.log('📤 Sending audio to backend, base64 length:', base64Audio.length);

                // Add user speech to transcript (placeholder)
                setTranscript(prev => [...prev, {
                    speaker: 'You',
                    text: 'Processing...',
                    timestamp: new Date().toISOString(),
                    type: 'user'
                }]);

                // Send to backend for processing with UI context if available
                console.log('🚀 Making request to /api/call/process-speech');
                const response = await axios.post('/api/call/process-speech', {
                    audio: base64Audio,
                    callId,
                    type,
                    transcript: speechTranscript || undefined,
                    ui_path: uploadedImagePath // Include uploaded image path
                });
                console.log('✅ Backend response:', response.data);

                const { responseText, audioUrl, transcript: userTranscript, agentName, region } = response.data;

                // Update user transcript
                setTranscript(prev => {
                    const updated = [...prev];
                    const lastIndex = updated.length - 1;
                    if (updated[lastIndex]?.type === 'user' && updated[lastIndex]?.text === 'Processing...') {
                        updated[lastIndex].text = userTranscript || '(No speech detected)';
                    }
                    return updated;
                });

                // Agent response will come via socket
                if (responseText && audioUrl) {
                    socketRef.current.emit('agent-response', {
                        callId,
                        audioUrl,
                        responseText,
                        agentName,
                        delay: Math.random() * 1000 + 500
                    });
                }
            };
        } catch (error) {
            console.error('Error processing speech:', error);
            console.error('Error response:', error.response?.data);
            
            if (error.response?.status !== 400) {
                const errorDetails = error.response?.data?.details || error.message;
                const errorStep = error.response?.data?.step || 'unknown';
                toast.error(`Failed at ${errorStep}: ${errorDetails}`);
                console.error('Processing failed at step:', errorStep, 'Details:', errorDetails);
            }
        }
    };

    const handleAgentResponse = (data) => {
        if (!data) return;
        const { responseText, agentName } = data;
        if (!responseText || !agentName) {
            console.log('handleAgentResponse skipped - missing responseText or agentName', data);
            return;
        }

        const responseRegion = data.region || 'north';
        const responseTimestamp = data.timestamp || new Date().toISOString();
        const candidateKeys = [];

        if (agentName && responseTimestamp) {
            candidateKeys.push(`${agentName}|${responseTimestamp}`);
        }
        if (agentName && responseText) {
            candidateKeys.push(`${agentName}|${responseText}`);
        }

        const seenSet = processedResponsesRef.current;
        if (seenSet.size > 200) {
            seenSet.clear();
        }
        const isDuplicate = candidateKeys.some(key => seenSet.has(key));

        if (isDuplicate) {
            console.log('handleAgentResponse skipped duplicate:', { agentName, responseTimestamp });
            return;
        }

        candidateKeys.forEach(key => seenSet.add(key));
        console.log('handleAgentResponse processing:', { ...data, region: responseRegion, timestamp: responseTimestamp });
        
        // Add to transcript
        setTranscript(prev => {
            const newTranscript = [...prev, {
                speaker: agentName,
                text: responseText,
                timestamp: responseTimestamp,
                type: 'agent',
                region: responseRegion
            }];
            console.log('Updated transcript:', newTranscript);
            return newTranscript;
        });

        // Queue audio for sequential playback
        const audioData = {
            audioUrl: data.audioUrl,
            responseText,
            agentName,
            region: responseRegion,
            timestamp: responseTimestamp
        };
        
        setAudioQueue(prev => [...prev, audioData]);
        console.log('🎵 Queued audio for:', agentName);
    };

    // Process audio queue sequentially
    useEffect(() => {
        if (audioQueue.length > 0 && !isPlayingAudio) {
            const nextAudio = audioQueue[0];
            playQueuedAudio(nextAudio);
        }
    }, [audioQueue, isPlayingAudio]);

    // Browser TTS fallback function
    const playBrowserTTS = (text, agentName) => {
        console.log('🎤 Using browser TTS for:', agentName);
        
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Select a voice based on agent gender
            const voices = speechSynthesis.getVoices();
            const isFemale = agentName.includes('Elena') || agentName.includes('Sarah') || agentName.includes('Maria');
            const selectedVoice = voices.find(voice => 
                voice.lang.startsWith('en') && 
                (isFemale ? voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('woman') : 
                           voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('man'))
            ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
            
            if (selectedVoice) {
                utterance.voice = selectedVoice;
                console.log('🎤 Using voice:', selectedVoice.name);
            }
            
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            utterance.volume = 0.8;
            
            utterance.onend = () => {
                console.log('🎤 Browser TTS finished for:', agentName);
                setIsPlayingAudio(false);
                setAudioQueue(prev => prev.slice(1));
            };
            
            utterance.onerror = (error) => {
                console.error('❌ Browser TTS error:', error);
                setIsPlayingAudio(false);
                setAudioQueue(prev => prev.slice(1));
            };
            
            speechSynthesis.speak(utterance);
        } else {
            console.warn('⚠️ Speech synthesis not supported');
            setIsPlayingAudio(false);
            setAudioQueue(prev => prev.slice(1));
        }
    };

    const playQueuedAudio = (audioData) => {
        const { audioUrl, responseText, agentName, region } = audioData;
        setIsPlayingAudio(true);
        setCurrentSpeakingAgent(agentName); // Show which agent is currently speaking
        
        console.log('🎵 Playing queued audio for:', agentName);
        
        // Play audio if available; fallback to natural Indian voice TTS if not
        if (audioUrl) {
            console.log('Playing audio:', audioUrl);
            const audio = new Audio(`${audioUrl}`);
            
            audio.onended = () => {
                console.log('🎵 Audio finished for:', agentName);
                setIsPlayingAudio(false);
                setAudioQueue(prev => prev.slice(1)); // Remove first item from queue
                
                // Add a small delay before playing the next audio to prevent overlap
                setTimeout(() => {
                    if (audioQueue.length > 1) {
                        console.log('🎵 Starting next audio in queue...');
                    }
                }, 200); // 200ms delay between audio clips
            };
            
            audio.onerror = () => {
                console.error('❌ Audio error for:', agentName);
                console.log('🔄 Falling back to browser TTS for:', agentName);
                playBrowserTTS(responseText, agentName);
            };
            
            audio.play().catch(err => {
                console.error('❌ Error playing audio:', err);
                console.log('🔄 Falling back to browser TTS for:', agentName);
                playBrowserTTS(responseText, agentName);
            });
        } else {
            console.log('⚠️ No ElevenLabs audio, using browser TTS for:', agentName);
            playBrowserTTS(responseText, agentName);
        }
    };

    const playAgentAudio = (data) => {
        if (!data) return;
        const { audioUrl, responseText, agentName } = data;
        const safeTimestamp = data.timestamp || new Date().toISOString();
        const region = data.region || 'north';

        if (!audioUrl) {
            console.log('⚠️ No ElevenLabs audio provided, using browser TTS for:', agentName);
            playBrowserTTS(responseText, agentName);
        } else {
            console.log('🎵 playAgentAudio received audio stream:', { audioUrl, agentName });
        }

        handleAgentResponse({
            ...data,
            region,
            timestamp: safeTimestamp,
            responseText,
            agentName,
            audioUrl
        });
    };

    const toggleMute = async () => {
        try {
            if (!isMuted) {
                // Muting - stop recording
                stopRecording();
                setIsMuted(true);
            } else {
                // Unmuting - start recording
                await startRecording();
                setIsMuted(false);
            }
        } catch (error) {
            console.error('❌ Error in toggleMute:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        stopSpeechRecognition();
        setIsRecording(false);
    };

    const endCall = async () => {
        try {
            if (callId) {
                await axios.post(`/api/call/${callId}/end`).catch(error => {
                    console.error('❌ Error calling end call API:', error);
                });
            }
            cleanup();
            setCallState('ended');
            toast.success('Call ended');
            setTimeout(() => {
                try {
                    navigate('/user-research');
                } catch (error) {
                    console.error('❌ Error navigating to user research:', error);
                }
            }, 2000);
        } catch (error) {
            console.error('❌ Error ending call:', error);
            cleanup();
            try {
                navigate('/user-research');
            } catch (navError) {
                console.error('❌ Error navigating after call end:', navError);
            }
        }
    };

    const startRecording = async () => {
        // Prevent multiple recordings
        if (isRecording) {
            console.log('Already recording, ignoring start request');
            return;
        }

        try {
            console.log('🎤 Starting recording...');
            
            // Get microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 48000
                }
            });
            streamRef.current = stream;
            console.log('✅ Microphone access granted');

            // Start speech recognition FIRST
            startSpeechRecognition();

            // Create MediaRecorder (prefer opus in webm)
            const preferredMimeTypes = [
                'audio/webm;codecs=opus',
                'audio/webm',
                'audio/ogg;codecs=opus'
            ];
            const supportedType = preferredMimeTypes.find(t => MediaRecorder.isTypeSupported?.(t));
            console.log('🎵 Using media type:', supportedType || 'default');
            
            const mediaRecorder = supportedType ? 
                new MediaRecorder(stream, { mimeType: supportedType }) : 
                new MediaRecorder(stream);
            
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];
            setRecognitionTranscript('');
            currentTranscriptRef.current = ''; // Clear ref for new recording

            mediaRecorder.ondataavailable = (event) => {
                console.log('🎤 Audio data available:', event.data.size, 'bytes');
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                } else {
                    console.warn('⚠️ Empty audio data received');
                }
            };

            mediaRecorder.onstop = async () => {
                try {
                    console.log('⏹️ MediaRecorder stopped');
                    
                    // Wait a moment for any final recognition results BEFORE stopping
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Increased delay
                    
                    // Capture the transcript from ref (immediate access) BEFORE stopping speech recognition
                    const finalTranscript = currentTranscriptRef.current.trim() || 'Hello';
                    console.log('🗣️ Captured transcript from ref:', finalTranscript);
                    console.log('🗣️ State transcript was:', recognitionTranscript);
                    
                    // Stop speech recognition AFTER capturing transcript
                    stopSpeechRecognition();
                    
                    // Process recorded audio
                    const blobType = supportedType || 'audio/webm';
                    const audioBlob = new Blob(audioChunksRef.current, { type: blobType });
                    console.log('🎤 Audio blob created:', audioBlob.size, 'bytes, type:', blobType);
                    
                    await processAudio(audioBlob, finalTranscript).catch(error => {
                        console.error('❌ Error in processAudio:', error);
                    });
                    audioChunksRef.current = [];
                    
                    // Stop recording - don't auto-restart
                    setIsRecording(false);
                    console.log('✅ Recording session complete');
                } catch (error) {
                    console.error('❌ Error in mediaRecorder.onstop:', error);
                    setIsRecording(false);
                }
            };

            // Start recording for 6 seconds to give speech recognition more time
            mediaRecorder.start();
            setIsRecording(true);
            console.log('▶️ Recording started (6 seconds)');

            // Stop after 6 seconds to process
            setTimeout(() => {
                if (mediaRecorder.state === 'recording') {
                    console.log('⏱️ Recording timeout reached (6s), stopping...');
                    mediaRecorder.stop();
                }
            }, 6000);

        } catch (error) {
            console.error('❌ Error starting recording:', error);
            toast.error('Microphone access denied: ' + error.message);
            stopSpeechRecognition();
            setIsRecording(false);
        }
    };

    // ===== IMAGE UPLOAD FUNCTIONS =====
    const handleUpload = () => {
        if (callState !== 'connected') {
            toast.error('Please connect to the call first.');
            return;
        }
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type and size
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file (PNG, JPG, etc.)');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('agentId', agentIds[0] || 'group'); // Use first agent ID or 'group'
            formData.append('callId', callId); // Pass callId to store image path

            const response = await axios.post('/api/ai/upload-ui', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const imagePath = response.data.ui_path;
            setUploadedImagePath(imagePath);

            // Add image to transcript
            setTranscript(prev => [...prev, {
                id: Date.now(),
                type: 'system',
                content: `Uploaded reference: ${file.name}`,
                imagePath: imagePath,
                timestamp: new Date().toISOString(),
            }]);

            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    // ===== USE EFFECTS =====
    // Global error handler for unhandled promise rejections
    useEffect(() => {
        const handleUnhandledRejection = (event) => {
            console.error('❌ Unhandled promise rejection:', event.reason);
            console.error('❌ Promise rejection stack:', event.reason?.stack);
            console.error('❌ Event details:', event);
            event.preventDefault(); // Prevent the default browser behavior
        };

        const handleError = (event) => {
            console.error('❌ Global error:', event.error);
            console.error('❌ Error stack:', event.error?.stack);
        };

        window.addEventListener('unhandledrejection', handleUnhandledRejection);
        window.addEventListener('error', handleError);
        
        return () => {
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
            window.removeEventListener('error', handleError);
        };
    }, []);

    // Initialize speech recognition
    useEffect(() => {
        try {
            initSpeechRecognition();
        } catch (error) {
            console.error('Error initializing speech recognition:', error);
        }
    }, []);

    // Set default agents if none provided
    useEffect(() => {
        if (!agentIds || agentIds.length === 0) {
            console.log('No agents provided, using default agents for testing');
            const defaultAgentIds = ['b64ef359-e65a-475c-89fd-6411767473ec']; // Use test agent
            setAgentIds(defaultAgentIds);
            setTopic('Test Call');
            setType('1on1');
        }
    }, []);

    // Initialize call when agentIds are available
    useEffect(() => {
        if (agentIds && agentIds.length > 0) {
            initializeCall().catch(error => {
                console.error('Error in initializeCall useEffect:', error);
            });
        }
    }, [agentIds]);

    // Socket.IO setup
    useEffect(() => {
        if (!callId || !roomName) return;

        try {
            console.log('🔌 Initializing Socket.IO...');
            socketRef.current = io();
            
            socketRef.current.on('connect', () => {
                console.log('🔌 Socket connected');
                console.log('🔌 Joining call room:', { callId, roomName });
                try {
                    socketRef.current.emit('join-call', { callId, roomName });
                } catch (error) {
                    console.error('❌ Error emitting join-call:', error);
                }
            });

            socketRef.current.on('play-audio', (data) => {
                try {
                    playAgentAudio(data);
                } catch (error) {
                    console.error('❌ Error in play-audio handler:', error);
                }
            });

            socketRef.current.on('user-joined', (data) => {
                console.log('User joined:', data);
            });

            socketRef.current.on('agent-response', (data) => {
                try {
                    console.log('🤖 Received agent-response:', data);
                    console.log('🤖 Socket.IO room:', socketRef.current?.rooms);
                    handleAgentResponse(data);
                    setTypingAgents(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(data.agentName);
                        return newSet;
                    });
                    setSpeakingAgents(prev => new Set(prev).add(data.agentName));
                } catch (error) {
                    console.error('❌ Error in agent-response handler:', error);
                }
            });

            socketRef.current.on('agent-typing', (data) => {
                try {
                    console.log('⌨️ Received agent-typing:', data);
                    setTypingAgents(prev => new Set(prev).add(data.agentName));
                } catch (error) {
                    console.error('❌ Error in agent-typing handler:', error);
                }
            });

            socketRef.current.on('disconnect', () => {
                console.log('🔌 Socket.IO disconnected');
            });

            socketRef.current.on('connect_error', (error) => {
                console.error('🔌 Socket.IO connection error:', error);
            });

        } catch (error) {
            console.error('❌ Error setting up Socket.IO:', error);
        }

        return () => {
            try {
                if (socketRef.current) {
                    socketRef.current.disconnect();
                }
            } catch (error) {
                console.error('❌ Error disconnecting Socket.IO:', error);
            }
        };
    }, [callId, roomName]);

    // Twilio device setup (optional - not required for audio calling)
    useEffect(() => {
        // Skip Twilio device registration entirely since we're using MediaRecorder
        console.log('ℹ️ Skipping Twilio device registration - using MediaRecorder for audio calling');
        console.log('ℹ️ Audio calling features:');
        console.log('  - Audio capture: MediaRecorder API');
        console.log('  - Speech recognition: Web Speech API');
        console.log('  - Text-to-speech: Browser SpeechSynthesis');
        console.log('  - Real-time communication: Socket.IO');
        
        // Set call state to connected immediately since we don't need Twilio
        if (callId && callState === 'connecting') {
            setCallState('connected');
            console.log('✅ Audio calling ready (WebRTC-based)');
        }

        return () => {
            // Clean up any existing Twilio device
            try {
                if (deviceRef.current) {
                    if (deviceRef.current.state === 'registered') {
                        deviceRef.current.unregister().catch(error => {
                            console.error('❌ Error unregistering Twilio device:', error);
                        });
                    }
                    deviceRef.current.destroy();
                }
            } catch (error) {
                console.error('❌ Error cleaning up Twilio device:', error);
            }
        };
    }, [callId, callState]);

    // Call duration timer
    useEffect(() => {
        if (callState === 'connected') {
            const timer = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [callState]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cleanup();
        };
    }, []);

    // ===== RENDER =====
    // Show error state if audio services not available
    if (error && error.includes('Audio services')) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                        <div className="text-6xl mb-4">🎙️</div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Audio Calling Not Available</h1>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-blue-900 mb-2">To enable audio calling:</h3>
                            <ol className="text-left text-blue-800 space-y-1">
                                <li>1. Get API keys from Twilio, ElevenLabs, and Deepgram</li>
                                <li>2. Update your .env file with the keys</li>
                                <li>3. Restart the backend server</li>
                                <li>4. See AUDIO_CALLING_QUICKSTART.md for detailed instructions</li>
                            </ol>
                        </div>
                        <button
                            onClick={() => navigate('/user-research')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold"
                        >
                            Back to User Research
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen max-h-screen bg-gray-900 flex flex-col overflow-hidden">
            {/* Top Bar - Google Meet Style */}
            <div className="bg-gray-800 text-white p-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-semibold">{topic || 'User Research Call'}</h1>
                    <span className="text-sm text-gray-400">|</span>
                    <span className="text-sm text-gray-400">{formatDuration(callDuration)}</span>
                </div>
                <div className="flex items-center space-x-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        callState === 'connected' ? 'bg-green-600' :
                        callState === 'connecting' ? 'bg-yellow-600' :
                        'bg-gray-600'
                    }`}>
                        {callState === 'connected' ? '● Live' :
                         callState === 'connecting' ? '○ Connecting...' :
                         '○ Idle'}
                    </div>
                    <button
                        onClick={() => setShowTranscript(!showTranscript)}
                        className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm"
                    >
                        {showTranscript ? 'Hide Chat' : 'Show Chat'}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden h-full">
                {/* Video Grid Area */}
                <div className="flex-1 p-6 overflow-hidden h-full">
                    {/* Agent Video Tiles - Google Meet Style */}
                    <div className={`grid gap-4 h-full ${
                        participants.length === 1 ? 'grid-cols-1' :
                        participants.length <= 2 ? 'grid-cols-2' :
                        participants.length <= 4 ? 'grid-cols-2' :
                        'grid-cols-3'
                    }`}>
                        {participants.map((agent) => (
                            <div 
                                key={agent.id}
                                className={`relative bg-gray-800 rounded-lg overflow-hidden ${
                                    speakingAgents.has(agent.name) ? 'ring-4 ring-green-500' :
                                    typingAgents.has(agent.name) ? 'ring-4 ring-blue-500' :
                                    ''
                                }`}
                            >
                                {/* Agent Avatar/Video */}
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
                                    {agent.avatar_url ? (
                                        <img 
                                            src={agent.avatar_url} 
                                            alt={agent.name}
                                            className="w-32 h-32 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center text-white text-5xl font-bold">
                                            {agent.name?.charAt(0) || 'A'}
                                        </div>
                                    )}
                                </div>

                                {/* Agent Name Bar */}
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            {speakingAgents.has(agent.name) && (
                                                <div className="flex space-x-1">
                                                    <div className="w-1 h-4 bg-green-500 rounded-full animate-pulse"></div>
                                                    <div className="w-1 h-4 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
                                                    <div className="w-1 h-4 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                                </div>
                                            )}
                                            {typingAgents.has(agent.name) && (
                                                <div className="text-blue-400 text-sm">typing...</div>
                                            )}
                                            <span className="font-medium">{agent.name}</span>
                                        </div>
                                        <div className="text-xs text-gray-300">{agent.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Sidebar - Google Meet Style */}
                {showTranscript && (
                    <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="font-semibold text-gray-900">In-call messages</h2>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {transcript.length === 0 ? (
                                <div className="text-center text-gray-400 py-20">
                                    <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p className="text-sm">No messages yet</p>
                                    <p className="text-xs mt-1">Start speaking to begin the conversation</p>
                                </div>
                            ) : (
                                transcript.map((entry, index) => (
                                    <MessageBeautifier
                                        key={index}
                                        message={{
                                            content: entry.text,
                                            agentName: entry.type === 'user' ? 'You' : entry.speaker,
                                            timestamp: entry.timestamp,
                                            image: entry.imagePath,
                                            audioUrl: entry.audioUrl
                                        }}
                                        type={entry.type === 'user' ? 'user' : 'call'}
                                        showAvatar={entry.type !== 'user'}
                                        showTimestamp={true}
                                        compact={true}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Control Bar - Google Meet Style */}
            <div className="bg-gray-800 text-white p-4 flex-shrink-0">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    {/* Call Info */}
                    <div className="flex items-center space-x-4">
                        {isRecording && (
                            <div className="flex items-center space-x-2 text-red-400">
                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-sm">Recording...</span>
                            </div>
                        )}
                        {typingAgents.size > 0 && (
                            <div className="flex items-center space-x-2 text-blue-400">
                                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                                <span className="text-sm">
                                    {Array.from(typingAgents)[0]} is thinking...
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Main Controls */}
                    <div className="flex items-center space-x-3">
                        {/* Image Upload Button */}
                        <div className="flex items-center space-x-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <button
                                onClick={handleUpload}
                                disabled={callState !== 'connected' || isUploading}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Upload image for agents to analyze"
                            >
                                <PhotoIcon className="h-4 w-4" />
                                <span>{isUploading ? 'Uploading...' : uploadedImagePath ? '✓ Image loaded' : 'Add image'}</span>
                            </button>
                        </div>

                        {/* Press to Speak Button - Large and prominent */}
                        <button
                            onClick={isRecording ? stopRecording : startRecording}
                            disabled={callState !== 'connected'}
                            className={`px-6 py-4 rounded-full transition-all font-medium ${
                                isRecording 
                                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                            title={isRecording ? 'Stop Speaking' : 'Press to Speak'}
                        >
                            {isRecording ? (
                                <div className="flex items-center space-x-2">
                                    <MicOff className="w-5 h-5" />
                                    <span>Stop Speaking</span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Mic className="w-5 h-5" />
                                    <span>Press to Speak</span>
                                </div>
                            )}
                        </button>

                        {/* End Call Button */}
                        <button
                            onClick={endCall}
                            className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-all"
                            title="End Call"
                        >
                            <PhoneOff className="w-6 h-6" />
                        </button>

                        {/* Mute/Unmute Button - Smaller and different style */}
                        <button
                            onClick={toggleMute}
                            disabled={callState !== 'connected'}
                            className={`p-3 rounded-full transition-all ${
                                isMuted 
                                    ? 'bg-red-500 text-white' 
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                            title={isMuted ? 'Unmute' : 'Mute'}
                        >
                            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Right Info */}
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-300">{participants.length} participants</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AudioCall;
