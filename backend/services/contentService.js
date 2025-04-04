const { createCoin, updateCoinURI } = require('@zoralabs/coins-sdk');
const { Address, parseEther } = require('viem');
const { base } = require('viem/chains');
const { uploadToIPFS } = require('../utils/ipfsUtils');
const db = require('../models/db');
const trendPredictor = require('../ai/trendPredictor');
const walletClient = require('../utils/walletClient');
const publicClient = require('../utils/publicClient');

/**
 * Service for content-related operations
 */
class ContentService {
  /**
   * Create new content
   * @param {Object} contentData - Content data
   * @returns {Promise<Object>} - Created content
   */
  async createContent(contentData) {
    try {
      // 1. Upload content file to IPFS
      const contentCid = await this.uploadContentToIPFS(contentData.file);
      
      // 2. Upload metadata to IPFS
      const metadataCid = await this.createMetadata(contentData, contentCid);
      
      // 3. Check if creator already has a coin
      const existingCoin = await this.getCreatorCoin(contentData.creator);
      
      // 4. If no coin exists, create one
      if (!existingCoin) {
        const coinAddress = await this.createCreatorCoin(contentData, metadataCid);
        console.log(`Created new coin for creator: ${coinAddress}`);
      } else {
        console.log(`Creator already has coin: ${existingCoin}`);
      }
      
      // 5. Create content in database
      const newContent = await this.saveContentToDatabase(contentData, metadataCid, contentCid);
      
      return newContent;
    } catch (error) {
      console.error("Error creating content:", error);
      throw error;
    }
  }
  
  /**
   * Upload content file to IPFS
   * @param {Object} file - File object
   * @returns {Promise<string>} - IPFS CID
   */
  async uploadContentToIPFS(file) {
    try {
      // Upload to IPFS
      const result = await uploadToIPFS(file.buffer);
      return result.cid;
    } catch (error) {
      console.error("Error uploading content to IPFS:", error);
      throw error;
    }
  }
  
  /**
   * Create and upload metadata to IPFS
   * @param {Object} contentData - Content data
   * @param {string} contentCid - Content IPFS CID
   * @returns {Promise<string>} - Metadata IPFS CID
   */
  async createMetadata(contentData, contentCid) {
    try {
      // Construct metadata JSON
      const metadata = {
        name: contentData.title,
        description: contentData.description || "",
        image: `ipfs://${contentCid}`,
        properties: {
          creator: contentData.creator,
          contentType: contentData.contentType,
          price: contentData.price.toString(),
          isSubscription: contentData.isSubscription,
          tags: contentData.tags || []
        }
      };
      
      // Add content specific properties
      if (contentData.isSubscription) {
        metadata.properties.subscriptionPrice = contentData.subscriptionPrice.toString();
      }
      
      // Add animation_url for video and audio
      if (contentData.contentType === 'video' || contentData.contentType === 'audio') {
        metadata.animation_url = `ipfs://${contentCid}`;
      }
      
      // Add content object for better compatibility
      metadata.content = {
        mime: file.mimetype,
        uri: `ipfs://${contentCid}`
      };
      
      // Upload metadata to IPFS
      const result = await uploadToIPFS(JSON.stringify(metadata));
      return result.cid;
    } catch (error) {
      console.error("Error creating metadata:", error);
      throw error;
    }
  }
  
  /**
   * Create a Zora coin for a creator
   * @param {Object} contentData - Content data
   * @param {string} metadataCid - Metadata IPFS CID
   * @returns {Promise<string>} - Coin address
   */
  async createCreatorCoin(contentData, metadataCid) {
    try {
      // Set up coin creation parameters
      const coinParams = {
        name: contentData.coinName || `${contentData.title} Fan Token`,
        symbol: contentData.coinSymbol || contentData.title.substring(0, 5).toUpperCase(),
        uri: `ipfs://${metadataCid}`,
        payoutRecipient: contentData.creator,
        platformReferrer: process.env.PLATFORM_REFERRER_ADDRESS || "0xYourPlatformReferrerAddress",
        initialPurchaseWei: parseEther("0.01"), // Small initial purchase
      };
      
      // Create the coin using Zora SDK
      const result = await createCoin(coinParams, walletClient, publicClient);
      
      // Save coin info to database
      await db.collection('creatorCoins').insertOne({
        creator: contentData.creator,
        coinAddress: result.address,
        name: coinParams.name,
        symbol: coinParams.symbol,
        createdAt: new Date()
      });
      
      return result.address;
    } catch (error) {
      console.error("Error creating creator coin:", error);
      throw error;
    }
  }
  
  /**
   * Save content to database
   * @param {Object} contentData - Content data
   * @param {string} metadataCid - Metadata IPFS CID
   * @param {string} contentCid - Content IPFS CID
   * @returns {Promise<Object>} - Saved content
   */
  async saveContentToDatabase(contentData, metadataCid, contentCid) {
    try {
      // Get creator's coin address
      const creatorCoin = await this.getCreatorCoin(contentData.creator);
      
      // Create content object
      const content = {
        title: contentData.title,
        description: contentData.description || "",
        creator: contentData.creator,
        contentType: contentData.contentType,
        price: contentData.price,
        isSubscription: contentData.isSubscription,
        subscriptionPrice: contentData.isSubscription ? contentData.subscriptionPrice : 0,
        metadataUri: `ipfs://${metadataCid}`,
        contentUri: `ipfs://${contentCid}`,
        coinAddress: creatorCoin,
        coinSymbol: contentData.coinSymbol,
        status: "pending", // Needs verification
        mintCount: 0,
        tags: contentData.tags || [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Insert into database
      const result = await db.collection('content').insertOne(content);
      
      // Get AI prediction for this content
      try {
        const prediction = await trendPredictor.predictTrend({
          ...content,
          id: result.insertedId.toString()
        });
        
        // Save prediction to database
        await db.collection('contentPredictions').insertOne({
          contentId: result.insertedId,
          prediction,
          createdAt: new Date()
        });
        
        // Add prediction to returned content
        content.prediction = prediction;
      } catch (predictionError) {
        console.error("Error getting content prediction:", predictionError);
        // Non-critical error, continue without prediction
      }
      
      return {
        id: result.insertedId,
        ...content
      };
    } catch (error) {
      console.error("Error saving content to database:", error);
      throw error;
    }
  }
  
  /**
   * Get creator's coin address
   * @param {string} creatorAddress - Creator address
   * @returns {Promise<string|null>} - Coin address or null
   */
  async getCreatorCoin(creatorAddress) {
    try {
      const result = await db.collection('creatorCoins').findOne({ creator: creatorAddress });
      return result ? result.coinAddress : null;
    } catch (error) {
      console.error("Error getting creator coin:", error);
      throw error;
    }
  }
  
  /**
   * Get content by ID
   * @param {string} id - Content ID
   * @returns {Promise<Object|null>} - Content or null
   */
  async getContentById(id) {
    try {
      const content = await db.collection('content').findOne({ _id: id });
      
      if (!content) {
        return null;
      }
      
      // Get creator info
      const creator = await db.collection('users').findOne({ address: content.creator });
      
      // Format response
      return {
        id: content._id,
        ...content,
        creator: {
          address: content.creator,
          name: creator ? creator.name : null,
          profileImage: creator ? creator.profileImage : null
        }
      };
    } catch (error) {
      console.error("Error getting content by ID:", error);
      throw error;
    }
  }
  
  /**
   * Get content with filters
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} - Array of content items
   */
  async getContent(filters) {
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
      } = filters;
      
      // Build query
      const query = { status: "approved" }; // Only approved content
      
      if (creator) {
        query.creator = creator;
      }
      
      if (contentType) {
        query.contentType = contentType;
      }
      
      if (minPrice !== undefined || maxPrice !== undefined) {
        query.price = {};
        if (minPrice !== undefined) {
          query.price.$gte = minPrice;
        }
        if (maxPrice !== undefined) {
          query.price.$lte = maxPrice;
        }
      }
      
      if (isSubscription !== undefined) {
        query.isSubscription = isSubscription;
      }
      
      // Build sort
      let sortQuery = {};
      switch (sort) {
        case 'newest':
          sortQuery = { createdAt: -1 };
          break;
        case 'oldest':
          sortQuery = { createdAt: 1 };
          break;
        case 'price-asc':
          sortQuery = { price: 1 };
          break;
        case 'price-desc':
          sortQuery = { price: -1 };
          break;
        case 'popular':
          sortQuery = { mintCount: -1 };
          break;
        default:
          sortQuery = { createdAt: -1 };
      }
      
      // Get content from database
      const contents = await db.collection('content')
        .find(query)
        .sort(sortQuery)
        .skip(offset)
        .limit(limit)
        .toArray();
      
      // Get creator info for each content
      const creatorAddresses = [...new Set(contents.map(c => c.creator))];
      const creators = await db.collection('users')
        .find({ address: { $in: creatorAddresses } })
        .toArray();
      
      // Map creators by address
      const creatorsMap = {};
      creators.forEach(c => {
        creatorsMap[c.address] = c;
      });
      
      // Format response
      return contents.map(content => ({
        id: content._id,
        ...content,
        creator: {
          address: content.creator,
          name: creatorsMap[content.creator] ? creatorsMap[content.creator].name : null,
          profileImage: creatorsMap[content.creator] ? creatorsMap[content.creator].profileImage : null
        }
      }));
    } catch (error) {
      console.error("Error getting content:", error);
      throw error;
    }
  }
  
  /**
   * Get trending content
   * @param {number} limit - Limit
   * @returns {Promise<Array>} - Array of trending content
   */
  async getTrendingContent(limit = 10) {
    try {
      // In a real implementation, this would use on-chain data and AI model
      // to determine trending content. For now, use mint count as a proxy
      
      const contents = await db.collection('content')
        .find({ status: "approved" })
        .sort({ mintCount: -1, createdAt: -1 })
        .limit(limit)
        .toArray();
      
      // Get creator info for each content
      const creatorAddresses = [...new Set(contents.map(c => c.creator))];
      const creators = await db.collection('users')
        .find({ address: { $in: creatorAddresses } })
        .toArray();
      
      // Map creators by address
      const creatorsMap = {};
      creators.forEach(c => {
        creatorsMap[c.address] = c;
      });
      
      // Format response
      return contents.map(content => ({
        id: content._id,
        ...content,
        creator: {
          address: content.creator,
          name: creatorsMap[content.creator] ? creatorsMap[content.creator].name : null,
          profileImage: creatorsMap[content.creator] ? creatorsMap[content.creator].profileImage : null
        },
        trendScore: Math.floor(50 + Math.random() * 50) // Mock trend score
      }));
    } catch (error) {
      console.error("Error getting trending content:", error);
      throw error;
    }
  }
  
  /**
   * Get content by creator address
   * @param {string} creatorAddress - Creator address
   * @param {number} limit - Limit
   * @param {number} offset - Offset
   * @returns {Promise<Array>} - Array of creator's content
   */
  async getContentByCreator(creatorAddress, limit = 20, offset = 0) {
    try {
      const contents = await db.collection('content')
        .find({ creator: creatorAddress })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .toArray();
      
      // Get creator info
      const creator = await db.collection('users').findOne({ address: creatorAddress });
      
      // Format response
      return contents.map(content => ({
        id: content._id,
        ...content,
        creator: {
          address: creatorAddress,
          name: creator ? creator.name : null,
          profileImage: creator ? creator.profileImage : null
        }
      }));
    } catch (error) {
      console.error("Error getting creator content:", error);
      throw error;
    }
  }
}

module.exports = new ContentService();
