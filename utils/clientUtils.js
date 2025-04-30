import { createPublicClient, createWalletClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { CHAIN_CONFIG } from '../config/chains';

/**
 * Get a viem public client for the Base Sepolia chain
 * @returns {import('viem').PublicClient} Public client
 */
export function getPublicClient() {
  return createPublicClient({
    chain: baseSepolia,
    transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || CHAIN_CONFIG.rpcUrl),
  });
}

/**
 * Creates a wallet client with the provided account
 * @param {string} account - User's wallet address
 * @returns {Promise<import('viem').WalletClient>} - Viem wallet client
 */
export async function getWalletClient(account) {
  // In a real app, you would connect to the user's wallet provider
  // For this implementation, we'll create a wallet client with their address
  return createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || CHAIN_CONFIG.rpcUrl),
  });
}

/**
 * Check if an account is connected
 * @param {string} account - Account address to check
 * @returns {boolean} - Whether the account is connected
 */
export function isAccountConnected(account) {
  return Boolean(account && account.startsWith('0x'));
}
