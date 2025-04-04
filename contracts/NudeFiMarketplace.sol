// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@zoralabs/coins-sdk/contracts/interfaces/IZoraFactory.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title NudeFiMarketplace
 * @dev Smart contract for adult content NFT marketplace with Zora Coins integration
 */
contract NudeFiMarketplace is ERC721Enumerable, Ownable, ReentrancyGuard {
    // Zora Factory contract for creating coins
    IZoraFactory public zoraFactory;
    
    // Base chain WETH address
    address public constant WETH = 0x4200000000000000000000000000000000000006;
    
    // Content verification status
    enum VerificationStatus { Pending, Approved, Rejected }
    
    // Platform fee (3%)
    uint256 public platformFee = 300; // 3% (in basis points)
    uint256 public constant BASIS_POINTS = 10000;
    
    // Content struct
    struct Content {
        string uri;                   // IPFS URI to content metadata
        address creator;              // Content creator address
        uint256 price;                // Price in ETH
        address coinAddress;          // Zora coin address for this content
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
    
    // Mapping creator address to coin address
    mapping(address => address) public creatorCoins;
    
    // Events
    event ContentCreated(uint256 indexed tokenId, address indexed creator, string uri);
    event ContentMinted(uint256 indexed tokenId, address indexed minter, uint256 price);
    event CoinCreated(address indexed creator, address indexed coinAddress, string symbol);
    event ContentVerificationChanged(uint256 indexed tokenId, VerificationStatus status);
    
    constructor(address _zoraFactory) ERC721("NudeFi Adult Content", "NUDE") {
        zoraFactory = IZoraFactory(_zoraFactory);
    }
    
    /**
     * @dev Creates new adult content NFT and associated Zora coin if creator doesn't have one
     * @param _uri IPFS URI to content metadata
     * @param _price Price in ETH
     * @param _isSubscription Whether this is subscription content
     * @param _subscriptionPrice Price in creator coins for subscription
     * @param _contentType Type of content (image, video, audio)
     * @param _coinSymbol Symbol for creator coin (only used if creator doesn't have a coin yet)
     * @param _coinName Name for creator coin (only used if creator doesn't have a coin yet)
     */
    function createContent(
        string memory _uri,
        uint256 _price,
        bool _isSubscription,
        uint256 _subscriptionPrice,
        string memory _contentType,
        string memory _coinSymbol,
        string memory _coinName
    ) external returns (uint256) {
        // Create creator coin if they don't have one yet
        if (creatorCoins[msg.sender] == address(0)) {
            _createCreatorCoin(msg.sender, _coinName, _coinSymbol, _uri);
        }
        
        // Create new token ID
        uint256 tokenId = totalSupply() + 1;
        
        // Store content info
        contentInfo[tokenId] = Content({
            uri: _uri,
            creator: msg.sender,
            price: _price,
            coinAddress: creatorCoins[msg.sender],
            isSubscription: _isSubscription,
            subscriptionPrice: _subscriptionPrice,
            status: VerificationStatus.Pending,
            contentType: _contentType,
            mintCount: 0
        });
        
        // Add to creator's content list
        creatorContent[msg.sender].push(tokenId);
        
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
     * @dev Creates a Zora coin for a creator
     * @param _creator Creator address
     * @param _name Coin name
     * @param _symbol Coin symbol
     * @param _uri Metadata URI for the coin
     */
    function _createCreatorCoin(
        address _creator,
        string memory _name,
        string memory _symbol,
        string memory _uri
    ) internal {
        // Setup owners array (just the creator for now)
        address[] memory owners = new address[](1);
        owners[0] = _creator;
        
        // Deploy coin through Zora Factory
        // Note: In production, you would handle this through the Zora SDK
        // This is a simplified version for the contract
        (address coinAddress, ) = zoraFactory.deploy(
            _creator,                   // payoutRecipient
            owners,                     // owners
            _uri,                       // uri
            _name,                      // name
            _symbol,                    // symbol
            address(this),              // platformReferrer (the marketplace gets referral fees)
            WETH,                       // currency (WETH on Base)
            -199200,                    // tickLower (default for WETH pairs)
            0                           // orderSize (no initial purchase)
        );
        
        // Store creator's coin address
        creatorCoins[_creator] = coinAddress;
        
        // Emit event
        emit CoinCreated(_creator, coinAddress, _symbol);
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
}
