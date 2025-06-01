import { GitHubOAuthConfig, GitHubOAuthToken, GitHubUser } from '../types';

// GitHub OAuth configuration
const GITHUB_OAUTH_CONFIG: GitHubOAuthConfig = {
  clientId: process.env.GITHUB_CLIENT_ID || '',
  clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  redirectUri: 'gemini-code-reviewer://auth/callback',
  scope: 'repo user:email'
};

// Declare electronAPI for TypeScript
declare global {
  interface Window {
    electronAPI: {
      getApiKey: () => Promise<string | undefined>;
      openOAuthWindow: (url: string) => Promise<string>;
      getGitHubOAuthConfig: () => Promise<GitHubOAuthConfig>;
    };
  }
}

/**
 * Generate the GitHub OAuth authorization URL
 */
export const generateOAuthUrl = (state?: string): string => {
  if (!GITHUB_OAUTH_CONFIG.clientId) {
    throw new Error('GitHub OAuth client ID is not configured');
  }

  const params = new URLSearchParams({
    client_id: GITHUB_OAUTH_CONFIG.clientId,
    redirect_uri: GITHUB_OAUTH_CONFIG.redirectUri,
    scope: GITHUB_OAUTH_CONFIG.scope,
    state: state || generateRandomState(),
    allow_signup: 'true'
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
};

/**
 * Generate a random state parameter for OAuth security
 */
export const generateRandomState = (): string => {
  // Use crypto.getRandomValues() for cryptographically secure random generation
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Exchange authorization code for access token
 */
export const exchangeCodeForToken = async (code: string, state?: string): Promise<GitHubOAuthToken> => {
  const config = await getOAuthConfig();
  
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code: code,
      redirect_uri: config.redirectUri,
      state: state
    })
  });

  if (!response.ok) {
    throw new Error(`OAuth token exchange failed: ${response.statusText}`);
  }

  const tokenData = await response.json();
  
  if (tokenData.error) {
    throw new Error(`OAuth error: ${tokenData.error_description || tokenData.error}`);
  }

  return tokenData as GitHubOAuthToken;
};

/**
 * Get the current user information using the access token
 */
export const getCurrentUser = async (accessToken: string): Promise<GitHubUser> => {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/vnd.github.v3+json',
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to get user info: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Get OAuth configuration from environment or Electron main process
 */
export const getOAuthConfig = async (): Promise<GitHubOAuthConfig> => {
  // Try to get config from Electron main process first
  if (window.electronAPI && typeof window.electronAPI.getGitHubOAuthConfig === 'function') {
    try {
      const config = await window.electronAPI.getGitHubOAuthConfig();
      if (config.clientId && config.clientSecret) {
        return config;
      }
    } catch (error) {
      console.warn('Failed to get OAuth config from Electron:', error);
    }
  }

  // Fallback to environment variables
  if (!GITHUB_OAUTH_CONFIG.clientId || !GITHUB_OAUTH_CONFIG.clientSecret) {
    throw new Error('GitHub OAuth is not configured. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET environment variables.');
  }

  return GITHUB_OAUTH_CONFIG;
};

/**
 * Initiate OAuth flow using Electron's OAuth window
 */
export const initiateOAuthFlow = async (): Promise<GitHubOAuthToken> => {
  if (!window.electronAPI || typeof window.electronAPI.openOAuthWindow !== 'function') {
    throw new Error('OAuth flow is only available in the Electron app');
  }

  const state = generateRandomState();
  const authUrl = generateOAuthUrl(state);

  try {
    // Open OAuth window and wait for callback
    const callbackUrl = await window.electronAPI.openOAuthWindow(authUrl);

    // Parse the callback URL to extract code and state
    // For custom protocol: gemini-code-reviewer://auth/callback?code=...&state=...
    const url = new URL(callbackUrl);
    const code = url.searchParams.get('code');
    const returnedState = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    if (error) {
      throw new Error(`OAuth authorization failed: ${url.searchParams.get('error_description') || error}`);
    }

    if (!code) {
      throw new Error('No authorization code received from GitHub');
    }

    if (returnedState !== state) {
      throw new Error('OAuth state mismatch - possible security issue');
    }

    // Exchange code for token
    return await exchangeCodeForToken(code, state);
  } catch (error) {
    console.error('OAuth flow failed:', error);
    throw error;
  }
};

/**
 * Validate if a token is still valid
 */
export const validateToken = async (accessToken: string): Promise<boolean> => {
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      }
    });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Revoke a GitHub access token
 */
export const revokeToken = async (accessToken: string): Promise<void> => {
  const config = await getOAuthConfig();
  
  const response = await fetch(`https://api.github.com/applications/${config.clientId}/token`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Basic ${btoa(`${config.clientId}:${config.clientSecret}`)}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_token: accessToken
    })
  });

  if (!response.ok && response.status !== 404) {
    throw new Error(`Failed to revoke token: ${response.statusText}`);
  }
};
