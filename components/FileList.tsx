
import React, { useState } from 'react';
import { GithubFile } from '../types';
import { CodeIcon, CheckSquareIcon } from './Icons'; // Assuming you have CheckSquareIcon

interface FileListProps {
  files: GithubFile[];
  onAnalyze: (selectedFiles: GithubFile[]) => void;
  isLoading: boolean;
}

export const FileList: React.FC<FileListProps> = ({ files, onAnalyze, isLoading }) => {
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  const handleFileSelect = (filePath: string) => {
    setSelectedFiles(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(filePath)) {
        newSelected.delete(filePath);
      } else {
        newSelected.add(filePath);
      }
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    if (selectedFiles.size === files.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(files.map(f => f.path)));
    }
  };

  const handleSubmit = () => {
    const filesToAnalyze = files.filter(f => selectedFiles.has(f.path));
    onAnalyze(filesToAnalyze);
  };

  if (files.length === 0) {
    return <p className="text-slate-400">No code files found or repository not loaded yet.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleSelectAll}
          disabled={isLoading}
          className="px-4 py-2 border border-slate-600 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-primary-500 disabled:opacity-50"
        >
          {selectedFiles.size === files.length ? 'Deselect All' : 'Select All'} ({files.length} files)
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading || selectedFiles.size === 0}
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Analyze Selected ({selectedFiles.size})
        </button>
      </div>
      <ul className="max-h-96 overflow-y-auto bg-slate-700 rounded-md divide-y divide-slate-600 border border-slate-600">
        {files.map(file => (
          <li key={file.sha} className="p-3 hover:bg-slate-650 transition-colors duration-150">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                className="h-5 w-5 rounded text-primary-600 bg-slate-800 border-slate-500 focus:ring-primary-500 focus:ring-offset-slate-700"
                checked={selectedFiles.has(file.path)}
                onChange={() => handleFileSelect(file.path)}
                disabled={isLoading}
              />
              <CodeIcon className="w-5 h-5 text-slate-400" />
              <span className="text-sm text-slate-200">{file.path}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};
    