import { createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { walletConnect } from 'wagmi/connectors/walletConnect';
import { coinbaseWallet } from 'wagmi/connectors/coinbaseWallet';

export const config = createConfig({
  chains: [base],
  connectors: [
    injected({ shimDisconnect: true }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID || 'your-walletconnect-project-id',
      metadata: {
        name: 'NudeFi',
        description: 'Decentralized adult NFT and creator token platform',
        url: 'https://nudefi.xyz',
        icons: ['https://nudefi.xyz/favicon.ico'],
      },
    }),
    coinbaseWallet({
      appName: 'NudeFi',
    }),
  ],
  transports: {
    [base.id]: http(),
  },
});
