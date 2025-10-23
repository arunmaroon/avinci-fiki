const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const http = require('http');
const socketIO = require('socket.io');
const { createTables, redis } = require('./models/database');
const { auth, cors: corsMiddleware, errorHandler, requestLogger, rateLimit } = require('./middleware/auth');
require('dotenv').config();

// FIX: Disable SSL verification globally for ElevenLabs API
// This fixes the "self-signed certificate in certificate chain" error
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
console.log('⚠️  SSL verification disabled for ElevenLabs API compatibility');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

const PORT = process.env.PORT || 3001;

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}
if (!fs.existsSync('uploads/ui')) {
    fs.mkdirSync('uploads/ui');
}
if (!fs.existsSync('uploads/audio')) {
    fs.mkdirSync('uploads/audio');
}
if (!fs.existsSync('uploads/audio/sessions')) {
    fs.mkdirSync('uploads/audio/sessions');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/ui/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files (PNG, JPG, JPEG) and PDF files are allowed'));
        }
    }
});

// Middleware
app.use(corsMiddleware);
app.use(requestLogger);
app.use(rateLimit(15 * 60 * 1000, 1000)); // 1000 requests per 15 minutes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static('uploads'));

// Debug middleware to log all requests
app.use((req, res, next) => {
    if (req.path.includes('process-speech')) {
        console.log(`🔍 DEBUG: Request received - ${req.method} ${req.path}`);
        console.log(`🔍 DEBUG: Request body:`, JSON.stringify(req.body, null, 2));
    }
    next();
});

// Socket.IO for real-time audio call events
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-call', (data) => {
        const callId = typeof data === 'string' ? data : data.callId;
        const roomName = typeof data === 'object' && data.roomName ? data.roomName : `call-${callId}`;
        
        socket.join(roomName);
        console.log(`🔌 Socket ${socket.id} joined room: ${roomName} (callId: ${callId})`);
        console.log(`🔌 Total rooms for this socket:`, Array.from(socket.rooms));
        socket.to(roomName).emit('user-joined', { socketId: socket.id });
    });

    socket.on('agent-response', (data) => {
        const { callId, audioUrl, responseText, agentName, delay = 0 } = data;
        
        // Add human-like delay for group calls (simulating thinking/overlap)
        setTimeout(() => {
            io.to(`call-${callId}`).emit('play-audio', {
                audioUrl,
                responseText,
                agentName,
                timestamp: new Date().toISOString()
            });
        }, delay);
    });

    socket.on('leave-call', (callId) => {
        socket.leave(`call-${callId}`);
        console.log(`Socket ${socket.id} left call ${callId}`);
        socket.to(`call-${callId}`).emit('user-left', { socketId: socket.id });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Make io available to routes
app.set('io', io);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'Avinci Backend',
        timestamp: new Date().toISOString(),
        port: PORT,
        aiProvider: process.env.AI_PROVIDER || 'grok'
    });
});

// Test transcript upload without authentication - with real AI processing
app.post('/api/test-transcript', async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: 'No text provided' });
        }
        
        console.log('📝 Processing transcript:', text.substring(0, 100) + '...');
        
        // Use OpenAI to extract persona from transcript
        const { ChatOpenAI } = require("@langchain/openai");
        const llm = new ChatOpenAI({
            modelName: "gpt-4o",
            temperature: 0.1,
            maxTokens: 4000,
            openAIApiKey: process.env.OPENAI_API_KEY
        });
        
        const prompt = `Extract a persona from this user research transcript with exact details.

IMPORTANT: This transcript follows a research interview format:
- "Moderator:" is the researcher asking questions (IGNORE their statements)
- "Respondent:" is the user being interviewed (EXTRACT ALL their information)

You must ONLY extract information from the Respondent's answers.

Extract the following fields as JSON:
{
  "name": string,
  "age": integer,
  "gender": string,
  "occupation": string,
  "location": string (include state, e.g., "Bangalore, Karnataka"),
  "key_quotes": [string] (exact quotes from Respondent only),
  "pain_points": [string],
  "goals": [string],
  "personality_traits": [string]
}

Example:
Respondent: "My name is Abdul, I live in Bangalore" → name: "Abdul", location: "Bangalore, Karnataka"

Transcript:
${text}

Return ONLY valid JSON, no other text.`;

        const response = await llm.invoke(prompt);
        
        // Clean up the response - remove markdown code blocks if present
        let jsonContent = response.content.trim();
        if (jsonContent.startsWith('```json')) {
            jsonContent = jsonContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (jsonContent.startsWith('```')) {
            jsonContent = jsonContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        const personaData = JSON.parse(jsonContent);
        
        console.log('✅ Extracted persona:', personaData.name);
        
        // Get image from Unsplash
        const UnsplashImageService = require('./services/unsplashImageService');
        const unsplashService = new UnsplashImageService();
        
        let imageUrl = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
        try {
            const imageResult = await unsplashService.fetchPersonaImage(personaData);
            imageUrl = imageResult.url;
        } catch (imgError) {
            console.warn('⚠️  Using fallback image:', imgError.message);
        }
        
        // Save to database
        const { pool } = require('./models/database');
        const insertQuery = `
            INSERT INTO ai_agents (
                name, occupation, location, age, gender, avatar_url, 
                pain_points, goals, personality, sample_quote,
                source_type, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING id, name, occupation, location, age, gender, avatar_url, created_at;
        `;
        
        const result = await pool.query(insertQuery, [
            personaData.name,
            personaData.occupation,
            personaData.location,
            personaData.age,
            personaData.gender,
            imageUrl,
            personaData.pain_points || [],
            personaData.goals || [],
            JSON.stringify({ traits: personaData.personality_traits || [] }),
            personaData.key_quotes?.[0] || '',
            'transcript_upload',
            new Date()
        ]);
        
        const savedAgent = result.rows[0];
        console.log('💾 Saved agent to database:', savedAgent.id);
        
        res.json({
            success: true,
            agents: [savedAgent],
            message: "Persona generated successfully from transcript"
        });
        
    } catch (error) {
        console.error('❌ Test transcript error:', error);
        res.status(500).json({ 
            error: 'Failed to process transcript', 
            details: error.message 
        });
    }
});

// Routes - Active Production Routes Only
app.use('/api/auth', require('./routes/auth'));
app.use('/api/simple-test', require('./routes/simpleTest'));
app.use('/api/test-persona', require('./routes/testPersona'));

// ✅ Core API Routes
app.use('/api/personas', require('./routes/personas')); // Enhanced personas with transcript analysis  
app.use('/api/agents/v5', require('./routes/agents_v5')); // Latest agent API with full features
app.use('/api/agents', require('./routes/agents')); // Legacy agent support
app.use('/api/agent/generate', require('./routes/agentGenerate')); // Agent generation with PersonaExtractor
app.use('/api/transcript', require('./routes/enhancedTranscriptUpload')); // Enhanced transcript upload and processing
app.use('/api/accurate-transcript', require('./routes/accurateTranscriptUpload')); // ACCURATE extraction from transcript
app.use('/api/transcript-map', require('./routes/transcriptMap')); // NEW: Comprehensive transcript mapping with Google Docs support

// ✅ Persona Management Routes (v2)
app.use('/api/personas/v2', require('./routes/personas_v2')); // Comprehensive persona CRUD

// ✅ Chat & AI Routes
app.use('/api/ai', require('./routes/aiChat')); // AI chat with GPT-4o vision & memory
app.use('/api/ai/parallel', require('./routes/parallelChat')); // Parallel chat processing
app.use('/api/enhanced-chat', require('./routes/enhancedChat')); // Enhanced persona-aware chat
app.use('/api/chat', require('./routes/chat')); // Base chat route
app.use('/api/chat', require('./routes/chatSummary')); // Chat summary and conversation saving

// ✅ Feedback & Analytics
app.use('/api/analytics', require('./routes/analytics')); // Analytics and insights
app.use('/api/design-feedback', require('./routes/designFeedback')); // Design feedback

// ✅ Upload Routes
app.use('/api/transcript-upload', require('./routes/transcriptUpload')); // Transcript upload for persona generation
app.use('/api/upload', require('./routes/upload')); // General file uploads

// ✅ User Research & Sessions
app.use('/api/research-agents', require('./routes/agentsForResearch')); // Agents for user research
app.use('/api/sessions', require('./routes/sessions')); // User research sessions (group & 1:1)

// ✅ Admin Panel & RBAC
app.use('/api/admin/roles', require('./routes/adminRoles')); // Admin roles management

// Moneyview OAuth routes
app.use('/api/moneyview', require('./routes/moneyviewAuth')); // Moneyview OAuth authentication

// ✅ Design & Figma Imports
app.use('/api/design', require('./routes/design'));

// ✅ Utility Routes
app.use('/api/generate', require('./routes/generate'));
app.use('/api/debug', require('./routes/debug'));

// ✅ User Interview (voice calls)
app.use('/api/call', (req, res, next) => {
    console.log(`🔍 DEBUG: Call route hit - ${req.method} ${req.path}`);
    next();
}, require('./routes/calls'));

// ✅ PRD Management
app.use('/api/products', require('./routes/products')); // Product management
app.use('/api/prds', require('./routes/prds')); // PRD management

// Note: Legacy routes (agents_v2-v4, chat_v2-v4, feedback_v2) moved to /tests folder

// Error handling
app.use(errorHandler);

app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

async function startServer() {
    try {
        await createTables();
        
        if (!redis.isOpen) {
            await redis.connect();
        }
        
        console.log('\n🎯 Avinci Configuration:');
        console.log(`   AI Provider: ${process.env.AI_PROVIDER || 'grok'}`);
        console.log(`   Database: ${process.env.DB_NAME || 'avinci'}`);
        
        server.listen(PORT, () => {
            console.log('\n🚀 Avinci Backend is running!');
            console.log(`   Port: ${PORT}`);
            console.log(`   Health: http://localhost:${PORT}/api/health`);
            console.log(`   Socket.IO: Real-time audio calls enabled`);
            console.log('\n✨ Ready to generate AI agents!\n');
        });
        
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

process.on('SIGTERM', async () => {
    if (redis.isOpen) await redis.disconnect();
    process.exit(0);
});

process.on('SIGINT', async () => {
    if (redis.isOpen) await redis.disconnect();
    process.exit(0);
});

startServer();
