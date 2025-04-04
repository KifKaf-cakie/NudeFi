// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NudeFiGovernance
 * @dev Community governance contract for creator communities
 */
contract NudeFiGovernance is Ownable {
    // Proposal struct
    struct Proposal {
        uint256 id;
        address creator;
        address coinAddress;    // Creator coin address used for voting
        string title;
        string description;
        uint256 createdAt;
        uint256 endTime;
        uint256 yesVotes;
        uint256 noVotes;
        bool executed;
        mapping(address => bool) hasVoted;
    }
    
    // Mapping from proposal ID to Proposal
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    
    // Mapping from coin address to minimum coin balance required to create proposal
    mapping(address => uint256) public proposalThresholds;
    
    // Default voting period (3 days)
    uint256 public defaultVotingPeriod = 3 days;
    
    // Events
    event ProposalCreated(uint256 indexed proposalId, address indexed creator, string title);
    event Voted(uint256 indexed proposalId, address indexed voter, bool support, uint256 amount);
    event ProposalExecuted(uint256 indexed proposalId);
    
    constructor() {}
    
    /**
     * @dev Creates a new proposal
     * @param _coinAddress Creator coin address for voting
     * @param _title Proposal title
     * @param _description Proposal description
     * @param _votingPeriod Voting period in seconds (0 for default)
     */
    function createProposal(
        address _coinAddress,
        string memory _title,
        string memory _description,
        uint256 _votingPeriod
    ) external returns (uint256) {
        // Require minimum coin balance to create proposal
        uint256 threshold = proposalThresholds[_coinAddress];
        if (threshold > 0) {
            // In production, check ERC20 balance here
        }
        
        // Create new proposal
        uint256 proposalId = proposalCount + 1;
        Proposal storage proposal = proposals[proposalId];
        proposal.id = proposalId;
        proposal.creator = msg.sender;
        proposal.coinAddress = _coinAddress;
        proposal.title = _title;
        proposal.description = _description;
        proposal.createdAt = block.timestamp;
        
        // Set voting period
        uint256 votingPeriod = _votingPeriod > 0 ? _votingPeriod : defaultVotingPeriod;
        proposal.endTime = block.timestamp + votingPeriod;
        
        // Increment proposal count
        proposalCount++;
        
        // Emit event
        emit ProposalCreated(proposalId, msg.sender, _title);
        
        return proposalId;
    }
    
    /**
     * @dev Votes on a proposal
     * @param _proposalId Proposal ID
     * @param _support Whether to support the proposal
     */
    function vote(uint256 _proposalId, bool _support) external {
        Proposal storage proposal = proposals[_proposalId];
        
        // Check proposal exists and voting is open
        require(proposal.id == _proposalId, "Proposal does not exist");
        require(block.timestamp < proposal.endTime, "Voting has ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        
        // Get voter's coin balance
        // Note: In production you would check the actual ERC20 balance
        uint256 voteWeight = 1; // Simplified for this example
        
        // Record vote
        if (_support) {
            proposal.yesVotes += voteWeight;
        } else {
            proposal.noVotes += voteWeight;
        }
        
        // Mark as voted
        proposal.hasVoted[msg.sender] = true;
        
        // Emit event
        emit Voted(_proposalId, msg.sender, _support, voteWeight);
    }
    
    /**
     * @dev Executes a proposal after voting ends
     * @param _proposalId Proposal ID
     */
    function executeProposal(uint256 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        
        // Check proposal exists, voting has ended, and not already executed
        require(proposal.id == _proposalId, "Proposal does not exist");
        require(block.timestamp >= proposal.endTime, "Voting has not ended");
        require(!proposal.executed, "Proposal already executed");
        
        // Check proposal passed
        require(proposal.yesVotes > proposal.noVotes, "Proposal did not pass");
        
        // Mark as executed
        proposal.executed = true;
        
        // Emit event
        emit ProposalExecuted(_proposalId);
        
        // Note: In a real contract, you would execute the proposal's action here
        // This might involve calling other contracts or changing state
    }
    
    /**
     * @dev Sets the proposal threshold for a coin
     * @param _coinAddress Coin address
     * @param _threshold Minimum balance required to create proposal
     */
    function setProposalThreshold(address _coinAddress, uint256 _threshold) external onlyOwner {
        proposalThresholds[_coinAddress] = _threshold;
    }
    
    /**
     * @dev Sets the default voting period
     * @param _votingPeriod New voting period in seconds
     */
    function setDefaultVotingPeriod(uint256 _votingPeriod) external onlyOwner {
        defaultVotingPeriod = _votingPeriod;
    }
}
