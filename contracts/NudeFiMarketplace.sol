// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title NudeFiMarketplace
 * @dev Smart contract for adult content NFT marketplace with Zora Coins integration
 * @notice This contract ONLY handles NFT minting and verification - coin functionality
 * is handled through Zora Coins SDK
 */
contract NudeFiMarketplace is ERC721Enumerable, Ownable, ReentrancyGuard {
    // Platform fee (3%)
    uint256 public platformFee = 300; // 3% (in basis points)
    uint256 public constant BASIS_POINTS = 10000;
    
    // Content verification status
    enum VerificationStatus { Pending, Approved, Rejected }
    
    // Content struct
    struct Content {
        string uri;                   // IPFS URI to content metadata
        address creator;              // Content creator address
        uint256 price;                // Price in ETH
        address coinAddress;          // Zora coin address for this content (set externally)
        bool isSubscription;          // Is this a subscription model
        uint256 subscriptionPrice;    // Subscription price in creator coins
        VerificationStatus status;    // Content verification status
        string contentType;           // "image", "video", "audio"
        uint256 mintCount;            // Number of times this content was minted
    }
    
    // Mapping from token ID to Content
    mapping(uint256 => Content) public contentInfo;
    
    // Mapping from creator to their content token IDs
    mapping(address => uint256[]) public creatorContent;
    
    // Mapping creator address to coin address - this is set from outside via SDK
    mapping(address => address) public creatorCoins;
    
    // Events
    event ContentCreated(uint256 indexed tokenId, address indexed creator, string uri);
    event ContentMinted(uint256 indexed tokenId, address indexed minter, uint256 price);
    event ContentVerificationChanged(uint256 indexed tokenId, VerificationStatus status);
    event CreatorCoinLinked(address indexed creator, address indexed coinAddress);
    
    constructor() ERC721("NudeFi Adult Content", "NUDE") {}
    
    /**
     * @dev Register content with an existing coin address (created via SDK)
     * @param _uri IPFS URI to content metadata
     * @param _price Price in ETH
     * @param _isSubscription Whether this is subscription content
     * @param _subscriptionPrice Price in creator coins for subscription
     * @param _contentType Type of content (image, video, audio)
     * @param _coinAddress Address of the creator's Zora coin (from SDK)
     */
    function registerContent(
        string memory _uri,
        uint256 _price,
        bool _isSubscription,
        uint256 _subscriptionPrice,
        string memory _contentType,
        address _coinAddress
    ) external returns (uint256) {
        // Require valid coin address
        require(_coinAddress != address(0), "Invalid coin address");
        
        // Create new token ID
        uint256 tokenId = totalSupply() + 1;
        
        // Store content info
        contentInfo[tokenId] = Content({
            uri: _uri,
            creator: msg.sender,
            price: _price,
            coinAddress: _coinAddress,
            isSubscription: _isSubscription,
            subscriptionPrice: _subscriptionPrice,
            status: VerificationStatus.Pending,
            contentType: _contentType,
            mintCount: 0
        });
        
        // Add to creator's content list
        creatorContent[msg.sender].push(tokenId);
        
        // Update creator coin mapping if not already set
        if (creatorCoins[msg.sender] == address(0)) {
            creatorCoins[msg.sender] = _coinAddress;
            emit CreatorCoinLinked(msg.sender, _coinAddress);
        }
        
        // Emit event
        emit ContentCreated(tokenId, msg.sender, _uri);
        
        return tokenId;
    }
    
    /**
     * @dev Mints content NFT to buyer and pays creator
     * @param _tokenId Token ID to mint
     */
    function mintContent(uint256 _tokenId) external payable nonReentrant {
        Content storage content = contentInfo[_tokenId];
        
        // Check content exists and is approved
        require(bytes(content.uri).length > 0, "Content does not exist");
        require(content.status == VerificationStatus.Approved, "Content not approved");
        require(msg.value >= content.price, "Insufficient payment");
        
        // Calculate fees
        uint256 platformAmount = (content.price * platformFee) / BASIS_POINTS;
        uint256 creatorAmount = content.price - platformAmount;
        
        // Pay creator
        payable(content.creator).transfer(creatorAmount);
        
        // Mint NFT to buyer
        _mint(msg.sender, _tokenId);
        
        // Increment mint count
        content.mintCount += 1;
        
        // Emit event
        emit ContentMinted(_tokenId, msg.sender, content.price);
    }
    
    /**
     * @dev Updates content verification status (admin only)
     * @param _tokenId Token ID
     * @param _status New verification status
     */
    function updateContentVerification(uint256 _tokenId, VerificationStatus _status) external onlyOwner {
        contentInfo[_tokenId].status = _status;
        emit ContentVerificationChanged(_tokenId, _status);
    }
    
    /**
     * @dev Returns URI for a token
     * @param tokenId Token ID
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return contentInfo[tokenId].uri;
    }
    
    /**
     * @dev Withdraws platform fees (admin only)
     */
    function withdrawPlatformFees() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    /**
     * @dev Updates platform fee (admin only)
     * @param _platformFee New platform fee in basis points
     */
    function updatePlatformFee(uint256 _platformFee) external onlyOwner {
        require(_platformFee <= 1000, "Fee too high"); // Max 10%
        platformFee = _platformFee;
    }
    
    /**
     * @dev Register coin address for a creator (can be called by the creator only)
     * @param _coinAddress Address of the creator's Zora coin
     */
    function registerCreatorCoin(address _coinAddress) external {
        require(_coinAddress != address(0), "Invalid coin address");
        creatorCoins[msg.sender] = _coinAddress;
        emit CreatorCoinLinked(msg.sender, _coinAddress);
    }
}
