import React, { useState } from 'react';
import { GithubIcon, KeyIcon, EyeIcon, EyeSlashIcon } from './Icons';

interface ApiKeysFormProps {
  onGithubPATSubmit: (pat: string) => void;
  onGeminiApiKeySubmit: (apiKey: string) => void;
  githubPAT?: string | null;
  geminiApiKey?: string | null;
}

export const ApiKeysForm: React.FC<ApiKeysFormProps> = ({ 
  onGithubPATSubmit, 
  onGeminiApiKeySubmit, 
  githubPAT, 
  geminiApiKey 
}) => {
  const [pat, setPat] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [showPat, setShowPat] = useState<boolean>(false);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);

  const handleGithubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pat.trim()) {
      onGithubPATSubmit(pat.trim());
      setPat('');
    }
  };

  const handleGeminiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onGeminiApiKeySubmit(apiKey.trim());
      setApiKey('');
    }
  };

  return (
    <div className="space-y-8">
      {/* GitHub PAT Section */}
      {!githubPAT && (
        <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md mx-auto">
          <div className="flex items-center justify-center mb-6">
            <GithubIcon className="w-12 h-12 text-primary-400" />
            <h2 className="ml-3 text-2xl font-semibold text-slate-100">GitHub Authentication</h2>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            Please provide a GitHub Personal Access Token (PAT) with <code className="bg-slate-700 px-1 rounded text-primary-300">repo</code> scope.
            This token will be stored in your browser's local storage.
          </p>
          <p className="text-yellow-400 text-xs mb-6 bg-yellow-900 bg-opacity-50 p-2 rounded border border-yellow-700">
            Warning: Storing PATs in local storage is convenient for development but not recommended for production environments. Ensure you understand the risks.
          </p>
          <form onSubmit={handleGithubSubmit} className="space-y-6">
            <div>
              <label htmlFor="pat" className="block text-sm font-medium text-slate-300 mb-1">
                Personal Access Token
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyIcon className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="pat"
                  type={showPat ? 'text' : 'password'}
                  value={pat}
                  onChange={(e) => setPat(e.target.value)}
                  className="bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-400 focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 pr-10 sm:text-sm rounded-md py-2.5"
                  placeholder="ghp_YourTokenHere"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPat(!showPat)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                  aria-label={showPat ? "Hide token" : "Show token"}
                >
                  {showPat ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-primary-500 transition duration-150"
            >
              Save GitHub Token
            </button>
          </form>
        </div>
      )}

      {/* Gemini API Key Section */}
      {githubPAT && !geminiApiKey && (
        <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md mx-auto">
          <div className="flex items-center justify-center mb-6">
            <KeyIcon className="w-12 h-12 text-green-400" />
            <h2 className="ml-3 text-2xl font-semibold text-slate-100">Google Gemini API Key</h2>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            Please provide your Google Gemini API key to enable code analysis.
            This key will be stored in your browser's local storage.
          </p>
          <p className="text-blue-400 text-xs mb-4 bg-blue-900 bg-opacity-50 p-2 rounded border border-blue-700">
            You can get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300">Google AI Studio</a>.
          </p>
          <p className="text-yellow-400 text-xs mb-6 bg-yellow-900 bg-opacity-50 p-2 rounded border border-yellow-700">
            Warning: Storing API keys in local storage is convenient for development but not recommended for production environments. Ensure you understand the risks.
          </p>
          <form onSubmit={handleGeminiSubmit} className="space-y-6">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-slate-300 mb-1">
                Gemini API Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyIcon className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="apiKey"
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-400 focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 pr-10 sm:text-sm rounded-md py-2.5"
                  placeholder="AIza..."
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                  aria-label={showApiKey ? "Hide API key" : "Show API key"}
                >
                  {showApiKey ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500 transition duration-150"
            >
              Save API Key
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
