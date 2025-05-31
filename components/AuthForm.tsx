
import React, { useState } from 'react';
import { GithubIcon, KeyIcon, EyeIcon, EyeSlashIcon } from './Icons';

interface AuthFormProps {
  onSubmit: (pat: string) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSubmit }) => {
  const [pat, setPat] = useState<string>('');
  const [showPat, setShowPat] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pat.trim()) {
      onSubmit(pat.trim());
    }
  };

  return (
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
      <form onSubmit={handleSubmit} className="space-y-6">
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
          Save Token
        </button>
      </form>
    </div>
  );
};
    