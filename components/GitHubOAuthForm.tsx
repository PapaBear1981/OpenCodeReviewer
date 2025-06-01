import React, { useState } from 'react';
import { GithubIcon } from './Icons';
import { LoadingSpinner } from './LoadingSpinner';
import { AuthState, GitHubUser } from '../types';
import { initiateOAuthFlow, getCurrentUser, revokeToken } from '../services/githubOAuthService';

interface GitHubOAuthFormProps {
  onAuthSuccess: (authState: AuthState) => void;
  onAuthError: (error: string) => void;
  currentAuthState?: AuthState;
}

export const GitHubOAuthForm: React.FC<GitHubOAuthFormProps> = ({
  onAuthSuccess,
  onAuthError,
  currentAuthState
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const handleOAuthLogin = async () => {
    setIsLoading(true);
    setLoadingMessage('Opening GitHub authorization...');

    try {
      // Check if we're in Electron environment
      if (!window.electronAPI || typeof window.electronAPI.openOAuthWindow !== 'function') {
        throw new Error('OAuth authentication is only available in the desktop application');
      }

      setLoadingMessage('Waiting for GitHub authorization...');
      const tokenData = await initiateOAuthFlow();

      setLoadingMessage('Getting user information...');
      const user = await getCurrentUser(tokenData.access_token);

      const authState: AuthState = {
        isAuthenticated: true,
        authMethod: 'oauth',
        user: user,
        token: tokenData.access_token
      };

      onAuthSuccess(authState);
    } catch (error) {
      console.error('OAuth login failed:', error);
      onAuthError(error instanceof Error ? error.message : 'OAuth login failed');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleLogout = async () => {
    if (!currentAuthState?.token) return;

    setIsLoading(true);
    setLoadingMessage('Signing out...');

    try {
      // Revoke the token
      await revokeToken(currentAuthState.token);
    } catch (error) {
      console.warn('Failed to revoke token:', error);
      // Continue with logout even if revocation fails
    }

    // Clear auth state
    const authState: AuthState = {
      isAuthenticated: false,
      authMethod: null
    };

    onAuthSuccess(authState);
    setIsLoading(false);
    setLoadingMessage('');
  };

  if (currentAuthState?.isAuthenticated && currentAuthState.authMethod === 'oauth') {
    return (
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <GithubIcon className="w-8 h-8 text-primary-400" />
              <div>
                <h3 className="text-lg font-semibold text-slate-100">
                  Signed in as {currentAuthState.user?.login}
                </h3>
                <p className="text-sm text-slate-400">
                  {currentAuthState.user?.name || 'GitHub User'}
                </p>
              </div>
            </div>
            {currentAuthState.user?.avatar_url && (
              <img
                src={currentAuthState.user.avatar_url}
                alt="GitHub Avatar"
                className="w-10 h-10 rounded-full"
              />
            )}
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white rounded-lg transition-colors duration-200 text-sm"
          >
            {isLoading ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
        {isLoading && loadingMessage && (
          <div className="mt-4 flex items-center space-x-2 text-slate-400">
            <LoadingSpinner className="w-4 h-4" />
            <span className="text-sm">{loadingMessage}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md mx-auto">
      <div className="flex items-center justify-center mb-6">
        <GithubIcon className="w-12 h-12 text-primary-400" />
        <h2 className="ml-3 text-2xl font-semibold text-slate-100">GitHub OAuth</h2>
      </div>
      
      <p className="text-slate-400 text-sm mb-6 text-center">
        Sign in with your GitHub account to access repositories and create issues.
        This uses secure OAuth authentication.
      </p>

      <div className="space-y-4">
        <button
          onClick={handleOAuthLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-800 text-white rounded-lg transition-colors duration-200 font-medium"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <LoadingSpinner className="w-5 h-5" />
              <span>Authenticating...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <GithubIcon className="w-5 h-5" />
              <span>Sign in with GitHub</span>
            </div>
          )}
        </button>

        {isLoading && loadingMessage && (
          <div className="flex items-center justify-center space-x-2 text-slate-400">
            <LoadingSpinner className="w-4 h-4" />
            <span className="text-sm">{loadingMessage}</span>
          </div>
        )}

        <div className="text-xs text-slate-500 text-center">
          <p>By signing in, you agree to grant this application access to:</p>
          <ul className="mt-2 space-y-1">
            <li>• Read access to your repositories</li>
            <li>• Create issues in repositories you have access to</li>
            <li>• Read your basic profile information</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
