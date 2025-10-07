const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { createTables, redis } = require('./models/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 9001;

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static('uploads'));

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

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/agents/v5', require('./routes/agents_v5')); // New enhanced agents with short/full views
app.use('/api/agents/v4', require('./routes/agents_v4'));
app.use('/api/agents/v3', require('./routes/agents_v3'));
app.use('/api/agents', require('./routes/agents'));
app.use('/api/agent/generate', require('./routes/agentGenerate')); // New agent generation with PersonaExtractor
app.use('/api/ai', require('./routes/aiChat')); // AI chat with generated agents
app.use('/api/analytics', require('./routes/analytics')); // Analytics and insights
app.use('/api/chat/v4', require('./routes/chat_v4')); // New SSE streaming chat
app.use('/api/chat', require('./routes/chat'));
app.use('/api/chat/v2', require('./routes/chat_v2'));
app.use('/api/chat/v3', require('./routes/chat_v3'));
app.use('/api/feedback/v2', require('./routes/feedback_v2')); // New multi-agent feedback
app.use('/api/design-feedback', require('./routes/designFeedback'));
app.use('/api/transcript-upload', require('./routes/transcriptUpload')); // New transcript upload for personas
app.use('/api/upload', require('./routes/upload'));
app.use('/api/generate', require('./routes/generate'));

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

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
        
        app.listen(PORT, () => {
            console.log('\n🚀 Avinci Backend is running!');
            console.log(`   Port: ${PORT}`);
            console.log(`   Health: http://localhost:${PORT}/api/health`);
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
