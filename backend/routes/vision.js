const express = require('express');
const router = express.Router();
const multer = require('multer');
const AIVisionService = require('../services/aiVisionService');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../models/database');
const path = require('path');
const fs = require('fs');

const aiVisionService = new AIVisionService();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log('📁 File upload attempt:', file.originalname, file.mimetype, file.size);
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      console.error('❌ Invalid file type:', file.mimetype);
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Convert image to base64
function imageToBase64(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    return imageBuffer.toString('base64');
  } catch (error) {
    throw new Error('Failed to read image file');
  }
}

// Convert design image to code using AI Vision
router.post('/convert-image', (req, res) => {
  upload.single('image')(req, res, async (err) => {
    try {
      // Handle multer errors
      if (err) {
        console.error('❌ Multer error:', err.message);
        return res.status(400).json({
          success: false,
          error: 'File upload error',
          details: err.message
        });
      }

      const {
        framework = 'react',
        styling = 'tailwind',
        componentType = 'component',
        aiProvider = 'auto',
        customPrompt = ''
      } = req.body;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No image file provided'
        });
      }

    console.log('🎨 Converting image to code with AI Vision...');
    console.log('Framework:', framework, 'Styling:', styling, 'Provider:', aiProvider);

    // Convert image to base64
    const imageBase64 = imageToBase64(req.file.path);
    
    // Analyze with AI Vision
    let result;
    try {
      result = await aiVisionService.analyzeDesign(imageBase64, {
        framework,
        styling,
        componentType,
        aiProvider,
        customPrompt
      });
    } catch (aiError) {
      console.error('❌ AI Vision analysis failed:', aiError);
      return res.status(500).json({
        success: false,
        error: 'AI Vision analysis failed',
        details: aiError.message
      });
    }

    // Save conversion to database
    const conversionId = uuidv4();
    try {
      await pool.query(
        `INSERT INTO vision_conversions (id, image_path, image_name, framework, styling, component_type, ai_provider, custom_prompt, generated_code, tokens_used, processing_time_ms, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())`,
        [
          conversionId,
          req.file.path,
          req.file.originalname,
          framework,
          styling,
          componentType,
          aiProvider,
          customPrompt,
          result.code,
          result.tokensUsed,
          Date.now() // We'll calculate actual processing time later
        ]
      );
    } catch (dbError) {
      console.error('❌ Database save failed:', dbError);
      // Continue with response even if DB save fails
    }

    // Clean up uploaded file
    try {
      fs.unlinkSync(req.file.path);
    } catch (fileError) {
      console.error('❌ File cleanup failed:', fileError);
      // Continue with response even if file cleanup fails
    }

    res.json({
      success: true,
      conversionId,
      result: {
        code: result.code,
        tokensUsed: result.tokensUsed,
        model: result.model,
        provider: result.provider
      },
      message: 'Image converted to code successfully using MoneyView Design System'
    });

    } catch (error) {
      console.error('❌ Image conversion failed:', error.message);
      
      // Clean up uploaded file on error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({
        success: false,
        error: 'Image conversion failed',
        details: error.message
      });
    }
  });
});

// Get conversion history
router.get('/conversions', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM vision_conversions ORDER BY created_at DESC LIMIT 50'
    );
    
    res.json({
      success: true,
      conversions: result.rows
    });
  } catch (error) {
    console.error('❌ Failed to fetch conversions:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversions',
      details: error.message
    });
  }
});

// Test AI Vision connection
router.get('/test', async (req, res) => {
  try {
    const { provider = 'claude' } = req.query;
    
    // Test with a simple base64 image (1x1 pixel)
    const testImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    const result = await aiVisionService.analyzeDesign(testImage, {
      framework: 'react',
      styling: 'tailwind',
      componentType: 'component',
      aiProvider: provider,
      customPrompt: 'Generate a simple div component'
    });

    res.json({
      success: true,
      message: `${provider} AI Vision connection successful`,
      provider: result.provider,
      model: result.model,
      tokensUsed: result.tokensUsed
    });
  } catch (error) {
    console.error('❌ AI Vision test failed:', error.message);
    res.status(500).json({
      success: false,
      error: 'AI Vision test failed',
      details: error.message
    });
  }
});

module.exports = router;
