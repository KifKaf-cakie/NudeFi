# NudeFi: Decentralized Adult Content Platform

NudeFi is a decentralized platform for adult content creators built on Base chain. We leverage Zora's Coins Protocol to create a unique ecosystem where creators can tokenize their content as NFTs and build sustainable communities around their creator coins.

## 🚀 Features

### For Creators
- Mint adult content (images, videos, audio) as NFTs on Base chain
- Automatic ERC-20 token (Zora Coins) generation for each creator
- Multiple revenue streams: primary sales, secondary trading, and token trading fees
- AI-powered trend prediction and content optimization suggestions

### For Fans & Collectors
- Purchase NFTs to unlock exclusive content
- Trade creator coins for potential investment returns
- Access subscription-only content through coin holdings
- Participate in creator governance and decisions

### Platform Highlights
- Age verification and content moderation
- Privacy-focused decentralized storage
- Community governance through creator coins
- AI-powered content analytics and recommendations

## 💡 How It Works

NudeFi integrates with Zora's Coins Protocol to enable a new economic model for adult content:

1. **Creator Registration**: Creators sign up and set up their profile
2. **Content Minting**: Creators upload content which is minted as NFTs
3. **Coin Creation**: Each creator automatically gets an ERC-20 token on first upload
4. **Community Building**: Fans buy creator coins to access premium features
5. **Trading & Economics**: Creator coins can be traded, with creators earning from trading fees

## 🛠️ Built With

- **Frontend**: Next.js, React, TailwindCSS
- **Blockchain**: Base chain (Ethereum L2)
- **Coin Management**: Zora Coins Protocol via `@zoralabs/coins-sdk`
- **Wallet Integration**: WAGMI, Viem, ConnectKit
- **AI Technology**: TensorFlow.js for trend analysis
- **Storage**: IPFS for decentralized content storage

## 🔧 Zora Coins SDK Integration

NudeFi makes extensive use of Zora's Coins Protocol to power its economy:

- **Creator Coin Generation**: Automatic coin creation for creators
- **Trading Interface**: Buy and sell creator coins using the protocol
- **Metadata Management**: Updating coin metadata with content information
- **Market Analysis**: Fetching trending coins and market data
- **User Holdings**: Managing user coin balances and portfolios

## 🏁 Getting Started

### Prerequisites
- Node.js (v16+)
- NPM or Yarn
- Metamask or another Web3 wallet with Base chain support
- Some ETH on Base chain for transactions

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/nudefi.git
cd nudefi
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```
NEXT_PUBLIC_BASE_RPC_URL=your_base_chain_rpc_url
NEXT_PUBLIC_PLATFORM_REFERRER=your_platform_address
NEXT_PUBLIC_IPFS_GATEWAY_URL=your_ipfs_gateway
NEXT_PUBLIC_ZORA_API_KEY=your_zora_api_key
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📊 Current Status

This project is currently in active development. Key features implemented:

- ✅ Creator profile management
- ✅ Content minting and NFT creation
- ✅ Creator coin integration with Zora
- ✅ Basic marketplace functionality
- ✅ Content display and management
- ⏳ Community governance (in progress)
- ⏳ Enhanced AI features (in progress)

## 🔮 Deployment Options

### Base Mainnet Deployment
For production deployment, you can deploy directly to Base Mainnet by configuring your environment variables to point to Base Mainnet RPC endpoints.

### Base Sepolia Testnet Deployment
For testing and development, you can deploy to Base Sepolia testnet:

1. Configure your wallet with Base Sepolia:
   - Network Name: Base Sepolia
   - RPC URL: https://sepolia.base.org
   - Chain ID: 84532
   - Currency Symbol: ETH

2. Get testnet ETH from a faucet like [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-sepolia-faucet)

3. Update your environment variables:
   ```
   NEXT_PUBLIC_BASE_RPC_URL=https://sepolia.base.org
   ```

4. Deploy your contracts to Base Sepolia:
   ```bash
   npx hardhat run scripts/deploy.js --network baseSepolia
   ```

### Deploying the Frontend
You can deploy the frontend to:

#### Vercel
1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

#### Render
1. Push your code to GitHub
2. Connect your GitHub repository to Render
3. Use the `render.yaml` file in the repository for configuration
4. Deploy

## 🔮 Future Plans

- Mobile application for iOS and Android
- Enhanced analytics dashboard for creators
- DAO creation for community governance
- NFT collection launches
- Farcaster integration for social features

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT
