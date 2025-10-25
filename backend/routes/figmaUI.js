const express = require('express');
const router = express.Router();
const FigmaParser = require('../services/figmaParser');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../models/database');

const figmaParser = new FigmaParser();

// Convert Figma prototype to working UI
router.post('/convert', async (req, res) => {
  const { figmaUrl, componentName } = req.body;
  
  if (!figmaUrl) {
    return res.status(400).json({
      success: false,
      error: 'Figma URL is required'
    });
  }

  try {
    console.log('🎨 Starting Figma UI conversion...');
    
    const result = await figmaParser.parseFigmaToUI(figmaUrl);
    
    // Save to database
    const conversionId = uuidv4();
    await pool.query(
      `INSERT INTO figma_ui_conversions (id, figma_url, component_name, figma_data, ui_html, components, frames, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
      [
        conversionId,
        figmaUrl,
        componentName || 'FigmaUI',
        JSON.stringify(result),
        result.html,
        JSON.stringify(result.components),
        JSON.stringify(result.frames)
      ]
    );

    res.json({
      success: true,
      conversionId,
      result: result,
      message: 'Figma prototype converted to working UI successfully'
    });
    
  } catch (error) {
    console.error('❌ Figma UI conversion failed:', error.message);
    res.status(500).json({
      success: false,
      error: 'Figma UI conversion failed',
      details: error.message
    });
  }
});

// Test Figma connection
router.get('/test', async (req, res) => {
  try {
    // Test with a simple Figma file
    const testUrl = 'https://www.figma.com/file/hch8Y0gaUIhQ8Ck0Hn0SXo/Test-File';
    const result = await figmaParser.parseFigmaToUI(testUrl);
    
    res.json({
      success: true,
      message: 'Figma connection successful',
      testResult: {
        componentsCount: result.components.length,
        framesCount: result.frames.length,
        hasText: result.metadata.hasText,
        hasShapes: result.metadata.hasShapes
      }
    });
  } catch (error) {
    console.error('❌ Figma test failed:', error.message);
    res.status(500).json({
      success: false,
      error: 'Figma test failed',
      details: error.message
    });
  }
});

// Get conversion history
router.get('/conversions', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM figma_ui_conversions ORDER BY created_at DESC LIMIT 50'
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

module.exports = router;

