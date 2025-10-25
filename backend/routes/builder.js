const express = require('express');
const router = express.Router();
const BuilderService = require('../services/builderService');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../models/database');

const builderService = new BuilderService();

// Convert design to Builder.io blocks
router.post('/convert', async (req, res) => {
  const { designData, componentName } = req.body;
  
  if (!designData) {
    return res.status(400).json({
      success: false,
      error: 'Design data is required'
    });
  }

  try {
    console.log('🎨 Starting Builder.io conversion...');
    
    const result = await builderService.convertDesignToCode(designData);
    
    // Save to database
    const conversionId = uuidv4();
    await pool.query(
      `INSERT INTO builder_conversions (id, design_data, builder_blocks, react_code, preview_url, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [
        conversionId,
        JSON.stringify(designData),
        JSON.stringify(result.blocks),
        result.reactCode,
        result.previewUrl
      ]
    );

    res.json({
      success: true,
      conversionId,
      result: result,
      message: 'Design converted to Builder.io blocks successfully'
    });
    
  } catch (error) {
    console.error('❌ Builder.io conversion failed:', error.message);
    res.status(500).json({
      success: false,
      error: 'Builder.io conversion failed',
      details: error.message
    });
  }
});

// Test Builder.io connection
router.get('/test', async (req, res) => {
  try {
    const result = await builderService.testConnection();
    res.json(result);
  } catch (error) {
    console.error('❌ Builder.io test failed:', error.message);
    res.status(500).json({
      success: false,
      error: 'Builder.io test failed',
      details: error.message
    });
  }
});

// Get Builder.io content types
router.get('/content-types', async (req, res) => {
  try {
    const result = await builderService.getContentTypes();
    res.json(result);
  } catch (error) {
    console.error('❌ Failed to fetch Builder.io content types:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Builder.io content types',
      details: error.message
    });
  }
});

// Convert Figma file to Builder.io blocks
router.post('/convert-figma', async (req, res) => {
  try {
    const { figmaUrl } = req.body;
    
    if (!figmaUrl) {
      return res.status(400).json({
        success: false,
        error: 'Figma URL is required'
      });
    }

    console.log('🎨 Converting Figma to Builder.io:', figmaUrl);
    
    const result = await builderService.convertFigmaToBuilder(figmaUrl);
    
    // Save conversion to database
    const client = await pool.connect();
    try {
      await client.query(
        'INSERT INTO builder_conversions (design_data, builder_blocks, react_code, preview_url, created_at) VALUES ($1, $2, $3, $4, NOW())',
        [
          JSON.stringify({ figmaUrl, figmaData: result.figmaData }),
          JSON.stringify(result.blocks),
          result.reactCode,
          result.previewUrl || 'https://builder.io/preview/placeholder'
        ]
      );
    } finally {
      client.release();
    }
    
    res.json(result);
  } catch (error) {
    console.error('❌ Figma to Builder.io conversion failed:', error.message);
    res.status(500).json({
      success: false,
      error: 'Figma to Builder.io conversion failed',
      details: error.message
    });
  }
});

// Get conversion history
router.get('/conversions', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM builder_conversions ORDER BY created_at DESC LIMIT 50'
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
