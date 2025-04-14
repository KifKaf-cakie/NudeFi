/**
 * IPFS utility functions for uploading files and accessing content
 */

/**
 * Upload content to IPFS
 * @param {Buffer|File|string} content - Content to upload
 * @returns {Promise<{cid: string}>} - IPFS result with CID
 * 
 * Note: In a production environment, you would integrate with a real
 * IPFS service like Pinata or nft.storage. This mock implementation
 * returns a fake CID for demonstration purposes.
 */
export async function uploadToIPFS(content) {
  // Mock implementation - in production, connect to a real IPFS service
  console.log("Uploading to IPFS:", typeof content);
  
  // Generate a random CID-like string
  const randomCid = `bafybe${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    cid: randomCid,
    size: content instanceof File ? content.size : 
          typeof content === 'string' ? content.length : 
          content instanceof Buffer ? content.length : 
          1024 // default size
  };
}

/**
 * Get IPFS gateway URL for a CID
 * @param {string} cid - IPFS CID
 * @returns {string} - Gateway URL
 */
export function getIPFSGatewayURL(cid) {
  if (!cid) return null;
  
  // Remove ipfs:// prefix if present
  const cleanCid = cid.replace(/^ipfs:\/\//, '');
  
  // Use preferred gateway
  return `${process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL || 'https://ipfs.io/ipfs/'}${cleanCid}`;
}

/**
 * Create metadata and upload to IPFS
 * @param {Object} metadata - Metadata object
 * @returns {Promise<string>} - IPFS CID
 */
export async function uploadMetadataToIPFS(metadata) {
  // Convert metadata to JSON string
  const metadataString = JSON.stringify(metadata);
  
  // Upload to IPFS
  const result = await uploadToIPFS(metadataString);
  
  return result.cid;
}

/**
 * Get content from IPFS
 * @param {string} cid - IPFS CID
 * @param {boolean} parseJson - Whether to parse response as JSON
 * @returns {Promise<Buffer|Object>} - Content buffer or parsed JSON
 */
export async function getFromIPFS(cid, parseJson = false) {
  try {
    // Remove ipfs:// prefix if present
    const cleanCid = cid.replace(/^ipfs:\/\//, '');
    
    // In production, you would fetch from a real IPFS gateway
    const gatewayUrl = getIPFSGatewayURL(cleanCid);
    
    // Try to fetch from gateway
    const response = await fetch(gatewayUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
    }
    
    if (parseJson) {
      return await response.json();
    } else {
      return await response.arrayBuffer();
    }
  } catch (error) {
    console.error("Error getting content from IPFS:", error);
    throw error;
  }
}

/**
 * Validate IPFS URI format
 * @param {string} uri - IPFS URI to validate
 * @returns {boolean} - Whether the URI is valid
 */
export function isValidIPFSUri(uri) {
  if (!uri) return false;
  
  // Check for correct IPFS URI format
  return uri.startsWith('ipfs://') && uri.length > 7;
}

/**
 * Format a CID into a proper IPFS URI
 * @param {string} cid - IPFS CID
 * @returns {string} - Formatted IPFS URI
 */
export function formatIPFSUri(cid) {
  if (!cid) return null;
  
  // If already a proper URI, return as is
  if (cid.startsWith('ipfs://')) return cid;
  
  // Otherwise add the prefix
  return `ipfs://${cid}`;
}
