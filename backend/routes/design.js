const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// Import services
const figmaService = require('../services/figma');
const figmaParser = require('../services/figmaParser');
const codeGenerationService = require('../services/codeGenerationService');

// Database pool
const pool = new Pool({
    user: process.env.DB_USER || 'avinci_admin',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'avinci',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

// Middleware to check admin permissions
const requireAdmin = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
        return res.status(401).json({ error: 'User ID required' });
    }
    // For now, accept any user ID as admin
    // In production, check against admin_users table
    req.userId = userId;
    next();
};

/**
 * GET /api/design/admin/oauth
 * Initiate OAuth flow with Figma
 */
router.get('/admin/oauth', requireAdmin, async (req, res) => {
    try {
        console.log('🔐 Initiating Figma OAuth flow');
        
        const state = figmaService.generateState();
        const authUrl = figmaService.getOAuthUrl(state);
        
        // Store state in session or database for validation
        // For now, we'll store it in memory (in production, use Redis or database)
        req.session = req.session || {};
        req.session.figmaOAuthState = state;
        
        console.log('✅ OAuth URL generated:', authUrl);
        
        res.json({
            success: true,
            authUrl: authUrl,
            state: state
        });
    } catch (error) {
        console.error('❌ OAuth initiation failed:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to initiate OAuth flow',
            details: error.message
        });
    }
});

// OAuth callback moved to /api/figma-oauth/callback

/**
 * POST /api/design/admin/import
 * Import a Figma file using OAuth token
 */
router.post('/admin/import', requireAdmin, async (req, res) => {
    try {
        const { fileKey, accessToken, productId } = req.body;
        
        if (!fileKey) {
            return res.status(400).json({
                success: false,
                error: 'File key is required'
            });
        }
        
        if (!figmaService.validateFileKey(fileKey)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid file key format'
            });
        }
        
        console.log(`📥 Importing Figma file: ${fileKey}`);
        
        // Get OAuth token if not provided
        let token = accessToken;
        if (!token) {
            // Try to get token from stored OAuth state
            // This is a simplified approach - in production, you'd store user tokens
            const storedToken = await figmaService.getTokenForState('default');
            if (storedToken) {
                token = storedToken.access_token;
            } else {
                return res.status(400).json({
                    success: false,
                    error: 'No access token provided and no OAuth token found. Please authenticate first.'
                });
            }
        }
        
        // Fetch Figma file
        const figmaData = await figmaService.getFigmaFile(fileKey, token);
        
        // Generate AST
        console.log('🔍 Generating AST from Figma data');
        const ast = figmaParser.getAst(figmaData);
        
        // Get file name from Figma data
        const fileName = figmaData.name || `Figma File ${fileKey}`;
        
        // Store in database
        const prototypeId = uuidv4();
        const result = await pool.query(
            `INSERT INTO design_prototypes (id, file_key, name, version, ast, imported_by, product_id, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
             RETURNING id, created_at`,
            [prototypeId, fileKey, fileName, 1, JSON.stringify(ast), req.userId, productId || null]
        );
        
        // Generate AI validation (simplified)
        const validation = await generateAIValidation(ast, figmaData);
        
        // Update with validation results
        await pool.query(
            'UPDATE design_prototypes SET validation = $1 WHERE id = $2',
            [JSON.stringify(validation), prototypeId]
        );
        
        console.log(`✅ Figma file imported successfully: ${prototypeId}`);
        
        res.json({
            success: true,
            prototypeId: prototypeId,
            message: 'Prototype imported successfully',
            validation: validation,
            ast: ast
        });
    } catch (error) {
        console.error('❌ Figma import failed:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to import Figma file',
            details: error.message
        });
    }
});

/**
 * POST /api/design/admin/import-direct
 * Direct import with personal access token
 */
router.post('/admin/import-direct', requireAdmin, async (req, res) => {
    try {
        const { fileKey, accessToken, productId } = req.body;
        
        if (!fileKey || !accessToken) {
            return res.status(400).json({
                success: false,
                error: 'File key and access token are required'
            });
        }
        
        if (!figmaService.validateFileKey(fileKey)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid file key format'
            });
        }
        
        console.log(`📥 Direct importing Figma file: ${fileKey}`);
        
        // Test connection first
        const isConnected = await figmaService.testConnection(accessToken);
        if (!isConnected) {
            return res.status(400).json({
                success: false,
                error: 'Invalid access token or connection failed'
            });
        }
        
        // Fetch Figma file
        const figmaData = await figmaService.getFigmaFile(fileKey, accessToken);
        
        // Generate AST
        console.log('🔍 Generating AST from Figma data');
        const ast = figmaParser.getAst(figmaData);
        
        // Get file name from Figma data
        const fileName = figmaData.name || `Figma File ${fileKey}`;
        
        // Store in database
        const prototypeId = uuidv4();
        const result = await pool.query(
            `INSERT INTO design_prototypes (id, file_key, name, version, ast, imported_by, product_id, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
             RETURNING id, created_at`,
            [prototypeId, fileKey, fileName, 1, JSON.stringify(ast), req.userId, productId || null]
        );
        
        // Generate AI validation
        const validation = await generateAIValidation(ast, figmaData);
        
        // Update with validation results
        await pool.query(
            'UPDATE design_prototypes SET validation = $1 WHERE id = $2',
            [JSON.stringify(validation), prototypeId]
        );
        
        console.log(`✅ Figma file imported successfully: ${prototypeId}`);
        
        res.json({
            success: true,
            prototypeId: prototypeId,
            message: 'Prototype imported successfully',
            validation: validation,
            ast: ast
        });
    } catch (error) {
        console.error('❌ Direct Figma import failed:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to import Figma file',
            details: error.message
        });
    }
});

/**
 * GET /api/design/admin/prototypes
 * List all imported prototypes
 */
router.get('/admin/prototypes', requireAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 20, search = '', productId } = req.query;
        const offset = (page - 1) * limit;
        
        let query = `
            SELECT 
                dp.id,
                dp.file_key,
                dp.name,
                dp.version,
                dp.validation,
                dp.created_at,
                dp.imported_by,
                dp.product_id,
                p.name as product_name,
                p.category as product_category
            FROM design_prototypes dp
            LEFT JOIN products p ON dp.product_id = p.id
            WHERE 1=1
        `;
        
        const queryParams = [];
        let paramCount = 0;
        
        if (search) {
            paramCount++;
            query += ` AND (dp.name ILIKE $${paramCount} OR dp.file_key ILIKE $${paramCount})`;
            queryParams.push(`%${search}%`);
        }
        
        if (productId) {
            paramCount++;
            query += ` AND dp.product_id = $${paramCount}`;
            queryParams.push(productId);
        }
        
        query += ` ORDER BY dp.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
        queryParams.push(limit, offset);
        
        const result = await pool.query(query, queryParams);
        
        // Get total count
        let countQuery = 'SELECT COUNT(*) FROM design_prototypes dp WHERE 1=1';
        const countParams = [];
        let countParamCount = 0;
        
        if (search) {
            countParamCount++;
            countQuery += ` AND (dp.name ILIKE $${countParamCount} OR dp.file_key ILIKE $${countParamCount})`;
            countParams.push(`%${search}%`);
        }
        
        if (productId) {
            countParamCount++;
            countQuery += ` AND dp.product_id = $${countParamCount}`;
            countParams.push(productId);
        }
        
        const countResult = await pool.query(countQuery, countParams);
        const total = parseInt(countResult.rows[0].count);
        
        res.json({
            success: true,
            prototypes: result.rows.map(row => ({
                id: row.id,
                fileKey: row.file_key,
                name: row.name,
                version: row.version,
                validation: row.validation ? (typeof row.validation === 'string' ? JSON.parse(row.validation) : row.validation) : null,
                createdAt: row.created_at,
                importedBy: row.imported_by,
                productId: row.product_id,
                productName: row.product_name,
                productCategory: row.product_category
            })),
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('❌ Failed to fetch prototypes:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch prototypes',
            details: error.message
        });
    }
});

/**
 * GET /api/design/admin/prototypes/:id
 * Get specific prototype details
 */
router.get('/admin/prototypes/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(
            `SELECT 
                dp.*,
                p.name as product_name,
                p.category as product_category
             FROM design_prototypes dp
             LEFT JOIN products p ON dp.product_id = p.id
             WHERE dp.id = $1`,
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Prototype not found'
            });
        }
        
        const prototype = result.rows[0];
        
        res.json({
            success: true,
            prototype: {
                id: prototype.id,
                fileKey: prototype.file_key,
                name: prototype.name,
                version: prototype.version,
                ast: prototype.ast ? JSON.parse(prototype.ast) : null,
                validation: prototype.validation ? JSON.parse(prototype.validation) : null,
                createdAt: prototype.created_at,
                updatedAt: prototype.updated_at,
                importedBy: prototype.imported_by,
                productId: prototype.product_id,
                productName: prototype.product_name,
                productCategory: prototype.product_category
            }
        });
    } catch (error) {
        console.error('❌ Failed to fetch prototype:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch prototype',
            details: error.message
        });
    }
});

/**
 * GET /api/design/admin/prototypes/:id/ast
 * Get prototype AST structure
 */
router.get('/admin/prototypes/:id/ast', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(
            'SELECT ast FROM design_prototypes WHERE id = $1',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Prototype not found'
            });
        }
        
        const ast = result.rows[0].ast ? JSON.parse(result.rows[0].ast) : [];
        const screenCount = figmaParser.getScreenCount(ast);
        
        res.json({
            success: true,
            ast: ast,
            screenCount: screenCount
        });
    } catch (error) {
        console.error('❌ Failed to fetch AST:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch AST',
            details: error.message
        });
    }
});

/**
 * POST /api/design/admin/prototypes/:id/export
 * Export prototype as code
 */
router.post('/admin/prototypes/:id/export', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { format = 'html', includeStyles = true, minify = false } = req.body;
        
        if (!['html', 'react', 'vue', 'moneyview'].includes(format)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid format. Supported formats: html, react, vue, moneyview'
            });
        }
        
        console.log(`📤 Exporting prototype ${id} as ${format}`);
        
        // Get prototype AST
        const result = await pool.query(
            'SELECT ast, name FROM design_prototypes WHERE id = $1',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Prototype not found'
            });
        }
        
        const ast = result.rows[0].ast ? JSON.parse(result.rows[0].ast) : [];
        const prototypeName = result.rows[0].name;
        
        // Generate code
        const zipBuffer = await codeGenerationService.generateCodeExport(ast, format, {
            includeStyles,
            minify,
            componentName: prototypeName.replace(/[^a-zA-Z0-9]/g, '')
        });
        
        // Set response headers
        res.set({
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="prototype-${format}-${Date.now()}.zip"`,
            'Content-Length': zipBuffer.length
        });
        
        res.send(zipBuffer);
        
        console.log(`✅ Prototype exported successfully as ${format}`);
    } catch (error) {
        console.error('❌ Export failed:', error);
        res.status(500).json({
            success: false,
            error: 'Export failed',
            details: error.message
        });
    }
});

/**
 * DELETE /api/design/admin/prototypes/:id
 * Delete a prototype
 */
router.delete('/admin/prototypes/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(
            'DELETE FROM design_prototypes WHERE id = $1 RETURNING name',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Prototype not found'
            });
        }
        
        console.log(`✅ Prototype deleted: ${result.rows[0].name}`);
        
        res.json({
            success: true,
            message: 'Prototype deleted successfully'
        });
    } catch (error) {
        console.error('❌ Delete failed:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete prototype',
            details: error.message
        });
    }
});

/**
 * Generate AI validation for prototype
 * @param {Array} ast - AST data
 * @param {Object} figmaData - Original Figma data
 * @returns {Object} Validation results
 */
const generateAIValidation = async (ast, figmaData) => {
    try {
        // Simplified AI validation - in production, use OpenAI API
        const screenCount = figmaParser.getScreenCount(ast);
        const textCount = figmaParser.extractAllText(ast).length;
        
        let score = 0.8; // Base score
        const issues = [];
        const recommendations = [];
        
        // Check for common issues
        if (screenCount === 0) {
            issues.push('No screens found in prototype');
            score -= 0.3;
        }
        
        if (textCount === 0) {
            issues.push('No text content found');
            score -= 0.2;
        }
        
        // Check for images
        const hasImages = ast.some(page => 
            page.children && page.children.some(child => 
                child.metadata && child.metadata.hasImage
            )
        );
        
        if (!hasImages) {
            recommendations.push('Consider adding images to make the prototype more engaging');
        }
        
        // Check for interactions
        const hasInteractions = ast.some(page => 
            page.children && page.children.some(child => 
                child.interactions && child.interactions.length > 0
            )
        );
        
        if (!hasInteractions) {
            recommendations.push('Add interactive elements to improve user experience');
        }
        
        return {
            score: Math.max(0, Math.min(1, score)),
            issues: issues,
            recommendations: recommendations,
            message: issues.length === 0 ? 'Prototype looks good!' : 'Some issues found'
        };
    } catch (error) {
        console.error('AI validation failed:', error);
        return {
            score: 0.5,
            issues: ['AI validation failed'],
            recommendations: ['Please check the prototype manually'],
            message: 'AI validation failed'
        };
    }
};

module.exports = router;