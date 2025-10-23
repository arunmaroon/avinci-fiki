# Avinci v0.1 Release Notes

## 🎉 Initial Stable Release - avinci 0.1

**Release Date:** January 2025  
**Version:** 0.1.0  
**Codename:** "Stable Foundation"

## 🚀 What's New

### Port Configuration Updates
- **Fixed Port Issues**: Moved from port 1000 to 3000/3001 to avoid admin permission requirements
- **Frontend**: Now runs on port 3000 (no sudo required)
- **Backend API**: Now runs on port 3001
- **Proxy Configuration**: Updated frontend proxy to point to backend on port 3001

### API Integration
- **OpenAI**: GPT-4 Turbo integration with real API keys
- **Grok (X.AI)**: Alternative AI provider integration
- **Claude (Anthropic)**: Advanced AI capabilities
- **ElevenLabs**: Speech synthesis and voice generation
- **Deepgram**: Speech recognition and transcription
- **Figma**: Design system integration
- **Unsplash**: Image services
- **Twilio**: Communication services (configured)

### Development Environment
- **Environment Configuration**: Complete .env setup with all required API keys
- **CORS Settings**: Updated to allow new port configuration
- **Database**: PostgreSQL and Redis integration ready
- **Real-time Features**: Socket.IO enabled for audio calls

## 🔧 Technical Improvements

### Configuration Files Updated
- `frontend/package.json`: Port 3000, proxy to 3001
- `backend/server.js`: Port 3001, CORS for 3000
- `env.example`: Complete API key configuration
- `.env`: Production-ready environment variables

### Dependencies
- All npm packages installed and up to date
- Concurrently package for parallel development
- All AI service SDKs properly configured

## 🌐 Access Information

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## 🚀 Quick Start

```bash
# Install dependencies
npm run install:all

# Start development environment
npm run dev

# Or start individually
npm run dev:backend  # Backend on port 3001
npm run dev:frontend # Frontend on port 3000
```

## 🔑 API Keys Configured

All major AI services are configured and ready:
- OpenAI GPT-4 Turbo
- Grok (X.AI)
- Claude (Anthropic)
- ElevenLabs
- Deepgram
- Figma
- Unsplash
- Twilio

## 📋 Known Issues

- Some React warnings in development (non-blocking)
- Twilio configuration needs account SID for full audio calling
- Database services (PostgreSQL/Redis) need to be running for full functionality

## 🎯 Next Steps

- Set up PostgreSQL and Redis for full database functionality
- Configure Twilio account SID for audio calling
- Add more AI agent templates
- Implement advanced persona generation features

---

**Full Changelog**: https://github.com/arunmaroon/avinci-fiki/compare/de5dbd6...v0.1
