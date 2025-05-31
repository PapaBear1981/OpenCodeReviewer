
import React, { useState } from 'react';
import { GithubIcon, BranchIcon } from './Icons';

interface RepoFormProps {
  onSubmit: (owner: string, repo: string, branch: string) => void;
  isLoading: boolean;
}

export const RepoForm: React.FC<RepoFormProps> = ({ onSubmit, isLoading }) => {
  const [repoUrl, setRepoUrl] = useState<string>('');
  const [branch, setBranch] = useState<string>('main'); // Default branch
  const [error, setError] = useState<string>('');

  const parseRepoUrl = (url: string): { owner: string; repo: string } | null => {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname !== 'github.com') return null;
      const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
      if (pathParts.length >= 2) {
        return { owner: pathParts[0], repo: pathParts[1].replace('.git', '') };
      }
      return null;
    } catch (e) { // Handle non-URL inputs like "owner/repo"
      const parts = url.split('/').filter(Boolean);
      if (parts.length === 2) {
        return { owner: parts[0], repo: parts[1].replace('.git', '') };
      }
      return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const parsed = parseRepoUrl(repoUrl);
    if (parsed) {
      onSubmit(parsed.owner, parsed.repo, branch);
    } else {
      setError('Invalid GitHub repository URL or format. Use full URL or "owner/repo".');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="repoUrl" className="block text-sm font-medium text-slate-300 mb-1">
          GitHub Repository URL or Owner/Repo
        </label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <GithubIcon className="h-5 w-5 text-slate-500" />
            </div>
            <input
              id="repoUrl"
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-400 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm rounded-md py-2.5 pl-10"
              placeholder="https://github.com/owner/repository or owner/repo"
              required
              disabled={isLoading}
            />
        </div>
      </div>
      <div>
        <label htmlFor="branch" className="block text-sm font-medium text-slate-300 mb-1">
          Branch
        </label>
         <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BranchIcon className="h-5 w-5 text-slate-500" />
            </div>
            <input
              id="branch"
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-400 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm rounded-md py-2.5 pl-10"
              placeholder="main"
              required
              disabled={isLoading}
            />
        </div>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
      >
        {isLoading ? 'Fetching...' : 'Fetch Repository Files'}
      </button>
    </form>
  );
};
    