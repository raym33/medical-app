export const APP_CONFIG = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: 10000,
  },
  auth: {
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
  },
  security: {
    encryptionKey: process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-key',
    mfaIssuer: 'Medical App',
    mfaDigits: 6,
    mfaPeriod: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
  },
  blockchain: {
    rpcUrl: process.env.NEXT_PUBLIC_BLOCKCHAIN_RPC_URL || 'http://localhost:8545',
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '',
    networkId: process.env.NEXT_PUBLIC_NETWORK_ID || '1',
    gasLimit: 3000000,
  },
} as const;