const express = require('express');
const router = express.Router();
const contentService = require('../services/contentService');
const trendPredictor = require('../ai/trendPredictor');
const { validateToken } = require('../middleware/auth');
const { upload } = require('../utils/storageUtils');

/**
 * Content API routes for NudeFi platform
 */

/**
 * @route GET /api/content
 * @desc Get a list of content with optional filters
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    const { 
      limit = 20, 
      offset = 0, 
      sort = 'newest', 
      creator, 
      contentType,
      minPrice,
      maxPrice,
      isSubscription
    } = req.query;
    
    // Convert query params to appropriate types
    const filters = {
      limit: parseInt(limit),
      offset: parseInt(offset),
      sort,
      creator,
      contentType,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      isSubscription: isSubscription === 'true'
    };
    
    const content = await contentService.getContent(filters);
    
    res.json({
      success: true,
      count: content.length,
      data: content
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching content'
    });
  }
});

/**
 * @route GET /api/content/trending
 * @desc Get trending content
 * @access Public
 */
router.get('/trending', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const trendingContent = await contentService.getTrendingContent(parseInt(limit));
    
    res.json({
      success: true,
      count: trendingContent.length,
      data: trendingContent
    });
  } catch (error) {
    console.error('Error fetching trending content:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching trending content'
    });
  }
});

/**
 * @route GET /api/content/:id
 * @desc Get a single content item by ID
 * @access Public
 */
router.get('/:id', async (req, res) => {
  try {
    const content = await contentService.getContentById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }
    
    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error(`Error fetching content ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching content'
    });
  }
});

/**
 * @route POST /api/content
 * @desc Create new content
 * @access Private (requires authentication)
 */
router.post('/', validateToken, upload.single('file'), async (req, res) => {
  try {
    const { 
      title, 
      description, 
      price, 
      isSubscription, 
      subscriptionPrice, 
      contentType,
      coinSymbol,
      coinName,
      tags
    } = req.body;
    
    // Validate required fields
    if (!title || !price || !contentType || !req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields'
      });
    }
    
    // Check age verification and content ownership
    if (req.body.ageVerification !== 'true' || req.body.contentOwnership !== 'true') {
      return res.status(400).json({
        success: false,
        error: 'You must confirm age verification and content ownership'
      });
    }
    
    // Create content
    const newContent = await contentService.createContent({
      creator: req.user.id,
      title,
      description,
      price: parseFloat(price),
      isSubscription: isSubscription === 'true',
      subscriptionPrice: subscriptionPrice ? parseFloat(subscriptionPrice) : undefined,
      contentType,
      coinSymbol,
      coinName,
      tags: tags ? JSON.parse(tags) : [],
      file: req.file
    });
    
    res.status(201).json({
      success: true,
      data: newContent
    });
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while creating content'
    });
  }
});

/**
 * @route GET /api/content/creator/:address
 * @desc Get content by creator address
 * @access Public
 */
router.get('/creator/:address', async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    
    const content = await contentService.getContentByCreator(
      req.params.address,
      parseInt(limit),
      parseInt(offset)
    );
    
    res.json({
      success: true,
      count: content.length,
      data: content
    });
  } catch (error) {
    console.error(`Error fetching creator content for ${req.params.address}:`, error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching creator content'
    });
  }
});

/**
 * @route GET /api/content/trends
 * @desc Get AI-powered content trend predictions
 * @access Public
 */
router.get('/trends', async (req, res) => {
  try {
    // Initialize trend predictor if needed
    if (!trendPredictor.initialized) {
      await trendPredictor.initialize();
    }
    
    // Get overall market trends
    const trends = await trendPredictor.getMarketTrends();
    
    res.json({
      success: true,
      count: trends.length,
      data: trends
    });
  } catch (error) {
    console.error('Error fetching content trends:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching content trends'
    });
  }
});

/**
 * @route POST /api/content/:id/predict
 * @desc Get AI prediction for specific content
 * @access Private (requires authentication)
 */
router.post('/:id/predict', validateToken, async (req, res) => {
  try {
    // Get content data
    const content = await contentService.getContentById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }
    
    // Check if user is the creator
    if (content.creator !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You can only get predictions for your own content'
      });
    }
    
    // Initialize trend predictor if needed
    if (!trendPredictor.initialized) {
      await trendPredictor.initialize();
    }
    
    // Get prediction for this content
    const prediction = await trendPredictor.predictTrend(content);
    
    res.json({
      success: true,
      data: prediction
    });
  } catch (error) {
    console.error(`Error predicting trends for content ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      error: 'Server error while predicting content trends'
    });
  }
});

module.exports = router;
