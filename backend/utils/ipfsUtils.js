const { create } = require('ipfs-http-client');
const pinataSDK = require('@pinata/sdk');
const axios = require('axios');
const fs = require('fs');
const { Readable } = require('stream');

/**
 * Utility functions for IPFS operations
 */

// Initialize Pinata client
const pinata = process.env.PINATA_API_KEY && process.env.PINATA_API_SECRET
  ? pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET)
  : null;

// Initialize IPFS client (fallback if Pinata not configured)
const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
});

/**
 * Upload content to IPFS
 * @param {Buffer|Stream|string} content - Content to upload
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - IPFS result with CID
 */
async function uploadToIPFS(content, options = {}) {
  try {
    // Prefer Pinata if configured (for persistence)
    if (pinata) {
      return await uploadToPinata(content, options);
    }
    
    // Fallback to direct IPFS upload
    let result;
    
    if (typeof content === 'string') {
      // Upload string content
      const buffer = Buffer.from(content);
      result = await ipfs.add(buffer, options);
    } else if (Buffer.isBuffer(content)) {
      // Upload buffer directly
      result = await ipfs.add(content, options);
    } else if (content.path && content.buffer) {
      // Upload file object from multer
      result = await ipfs.add({
        path: content.originalname || 'file',
        content: content.buffer
      }, options);
    } else {
      // Assume it's a readable stream
      result = await ipfs.add(content, options);
    }
    
    return {
      cid: result.cid.toString(),
      size: result.size,
      path: result.path
    };
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw new Error(`IPFS upload failed: ${error.message}`);
  }
}

/**
 * Upload content to Pinata
 * @param {Buffer|Stream|string} content - Content to upload
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Upload result with CID
 */
async function uploadToPinata(content, options = {}) {
  try {
    let result;
    
    if (typeof content === 'string') {
      // Upload JSON or string content
      try {
        // Try parsing as JSON if it looks like it
        const json = content.trim().startsWith('{') ? JSON.parse(content) : content;
        result = await pinata.pinJSONToIPFS(
          typeof json === 'string' ? { content: json } : json,
          { pinataMetadata: options.metadata }
        );
      } catch (e) {
        // Not valid JSON, pin as string
        result = await pinata.pinJSONToIPFS(
          { content },
          { pinataMetadata: options.metadata }
        );
      }
    } else if (Buffer.isBuffer(content)) {
      // Convert buffer to readable stream
      const stream = Readable.from(content);
      result = await pinata.pinFileToIPFS(stream, {
        pinataMetadata: options.metadata,
        pinataOptions: options.pinataOptions
      });
    } else if (content.path && content.buffer) {
      // Upload file object from multer
      const stream = Readable.from(content.buffer);
      result = await pinata.pinFileToIPFS(stream, {
        pinataMetadata: {
          name: content.originalname,
          ...options.metadata
        },
        pinataOptions: options.pinataOptions
      });
    } else {
      // Assume it's a readable stream
      result = await pinata.pinFileToIPFS(content, {
        pinataMetadata: options.metadata,
        pinataOptions: options.pinataOptions
      });
    }
    
    return {
      cid: result.IpfsHash,
      size: result.PinSize,
      timestamp: result.Timestamp
    };
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    throw new Error(`Pinata upload failed: ${error.message}`);
  }
}

/**
 * Retrieve content from IPFS
 * @param {string} cid - IPFS CID
 * @returns {Promise<Buffer>} - Content buffer
 */
async function getFromIPFS(cid) {
  try {
    // Try public gateways first (faster response)
    try {
      const { data } = await axios.get(`https://ipfs.io/ipfs/${cid}`, {
        responseType: 'arraybuffer',
        timeout: 10000
      });
      return Buffer.from(data);
    } catch (gatewayError) {
      console.warn("IPFS gateway error, falling back to direct IPFS:", gatewayError.message);
    }
    
    // Fallback to direct IPFS retrieval
    const chunks = [];
    for await (const chunk of ipfs.cat(cid)) {
      chunks.push(chunk);
    }
    
    return Buffer.concat(chunks);
  } catch (error) {
    console.error("Error retrieving from IPFS:", error);
    throw new Error(`IPFS retrieval failed: ${error.message}`);
  }
}

/**
 * Get IPFS gateway URL for a CID
 * @param {string} cid - IPFS CID
 * @returns {string} - Gateway URL
 */
function getIPFSGatewayURL(cid) {
  if (!cid) return null;
  
  // Remove ipfs:// prefix if present
  const cleanCid = cid.replace(/^ipfs:\/\//, '');
  
  // Use preferred gateway
  return `${process.env.IPFS_GATEWAY_URL || 'https://ipfs.io/ipfs/'}${cleanCid}`;
}

module.exports = {
  uploadToIPFS,
  getFromIPFS,
  getIPFSGatewayURL
};
