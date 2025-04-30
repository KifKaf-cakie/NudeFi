import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { WagmiConfig, createConfig } from 'wagmi'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { baseSepolia } from 'viem/chains'
import { setApiKey } from '@zoralabs/coins-sdk'
import '../styles/globals.css'

// Use QueryClient hook
const useQueryClient = () => {
  return useState(() => new QueryClient())[0]
}

const config = createConfig(
  getDefaultConfig({
    appName: "NudeFi",
    appDescription: "Adult content NFT platform powered by Zora's Coins Protocol",
    appUrl: "https://nudefi.xyz",
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    chains: [baseSepolia],
  })
)

function MyApp({ Component, pageProps }) {
  const queryClient = useQueryClient()
  const [mounted, setMounted] = useState(false)

  // Set Zora API key
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ZORA_API_KEY) {
      setApiKey(process.env.NEXT_PUBLIC_ZORA_API_KEY)
    }
  }, [])

  // Prevent hydration issues by only rendering on the client
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <ConnectKitProvider 
          theme="midnight"
          customTheme={{
            "--ck-connectbutton-background": "#db2777",
            "--ck-connectbutton-hover-background": "#be185d",
            "--ck-primary-button-background": "#db2777",
            "--ck-primary-button-hover-background": "#be185d",
          }}
        >
          <Component {...pageProps} />
        </ConnectKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  )
}

export default MyApp
