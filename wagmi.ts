import { configureChains, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { base } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// Configure chains
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [base],
  [publicProvider()]
)

// Create wagmi config
export const config = createConfig({
  autoConnect: true,
  connectors: [
    injected({
      shimDisconnect: true, 
      // optional: target, unstable_shimAsyncInject, etc.
    }),
  ],
  publicClient,
  webSocketPublicClient,
})
