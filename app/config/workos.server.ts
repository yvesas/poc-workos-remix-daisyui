import { WorkOS } from '@workos-inc/node';

/**
 * WorkOS Configuration
 * Centralized configuration for WorkOS SDK
 */

// Initialize WorkOS client
export const workos = new WorkOS(process.env.WORKOS_API_KEY);

// AuthKit configuration
export const authkitConfig = {
  clientId: process.env.WORKOS_CLIENT_ID!,
  apiKey: process.env.WORKOS_API_KEY!,
  redirectUri: process.env.WORKOS_REDIRECT_URI!,
  cookiePassword: process.env.WORKOS_COOKIE_PASSWORD!,
};

// Validate required environment variables
const requiredEnvVars = [
  'WORKOS_CLIENT_ID',
  'WORKOS_API_KEY',
  'WORKOS_REDIRECT_URI',
  'WORKOS_COOKIE_PASSWORD',
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
