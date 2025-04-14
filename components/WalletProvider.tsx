'use client';

import { createConfig, http } from '@wagmi/core';
import { WagmiConfig } from 'wagmi';
import { base } from '@wagmi/core/chains';
import { injected, walletConnect, coinbaseWallet } from '@wagmi/connectors';
import { ConnectKitProvider } from 'connectkit';

const config = createConfig({
  chains: [base],
  connectors: [
    injected({ shimDisconnect: true }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID || '',
      metadata: {
        name: 'NudeFi',
        description: 'Decentralized adult content platform using Zora Coins Protocol',
        url: 'https://nudefi.xyz',
        icons: ['https://nudefi.xyz/icon.png']
      }
    }),
    coinbaseWallet({ appName: 'NudeFi' }),
  ],
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'),
  },
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider
        options={{
          language: 'ja',
          hideBalance: false,
          hideTooltips: false,
        }}
      >
        {children}
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
