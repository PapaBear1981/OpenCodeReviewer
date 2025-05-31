
import React from 'react';
import { CodeIssue } from '../types';
import { BugAntIcon, LightBulbIcon, ShieldExclamationIcon, BoltIcon, ScaleIcon, WrenchScrewdriverIcon, TagIcon, IssueOpenedIcon } from './Icons'; // Assuming you have these

interface ReviewPanelProps {
  issues: CodeIssue[];
  onCreateIssue: (issue: CodeIssue) => void;
  isLoading: boolean; // To disable button during global loading
}

const getCategoryIcon = (category: CodeIssue['category']) => {
  switch (category) {
    case 'Performance': return <BoltIcon className="w-5 h-5 text-yellow-400" />;
    case 'Security': return <ShieldExclamationIcon className="w-5 h-5 text-red-400" />;
    case 'Integrity': return <BugAntIcon className="w-5 h-5 text-orange-400" />;
    case 'Scalability': return <ScaleIcon className="w-5 h-5 text-teal-400" />;
    case 'Maintainability': return <WrenchScrewdriverIcon className="w-5 h-5 text-sky-400" />;
    case 'BestPractice': return <LightBulbIcon className="w-5 h-5 text-green-400" />;
    default: return <TagIcon className="w-5 h-5 text-slate-400" />;
  }
};

const getSeverityClass = (severity: CodeIssue['severity']): string => {
  switch (severity) {
    case 'Critical': return 'border-red-500 bg-red-900 bg-opacity-30';
    case 'High': return 'border-orange-500 bg-orange-900 bg-opacity-30';
    case 'Medium': return 'border-yellow-500 bg-yellow-900 bg-opacity-30';
    case 'Low': return 'border-sky-500 bg-sky-900 bg-opacity-30';
    case 'Informational': return 'border-slate-600 bg-slate-700 bg-opacity-50';
    default: return 'border-slate-600';
  }
};


export const ReviewPanel: React.FC<ReviewPanelProps> = ({ issues, onCreateIssue, isLoading }) => {
  if (issues.length === 0) {
    return null; // Caller should handle "No issues found" message if appropriate for context
  }

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <div key={issue.id} className={`p-4 rounded-md border-l-4 ${getSeverityClass(issue.severity)} bg-slate-800 shadow`}>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-md font-semibold text-slate-100 flex items-center">
              {getCategoryIcon(issue.category)}
              <span className="ml-2">{issue.issueTitle}</span>
            </h4>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
              issue.severity === 'Critical' ? 'bg-red-500 text-white' :
              issue.severity === 'High' ? 'bg-orange-500 text-white' :
              issue.severity === 'Medium' ? 'bg-yellow-500 text-slate-900' :
              issue.severity === 'Low' ? 'bg-sky-500 text-white' :
              'bg-slate-600 text-slate-200'
            }`}>
              {issue.severity}
            </span>
          </div>
          
          <p className="text-sm text-slate-300 whitespace-pre-wrap mb-1">
            {issue.description}
          </p>
          {issue.lineNumber && (
            <p className="text-xs text-slate-400 mb-3">Approx. Line: {issue.lineNumber}</p>
          )}
          <button
            onClick={() => onCreateIssue(issue)}
            disabled={isLoading}
            className="mt-2 inline-flex items-center px-3 py-1.5 border border-slate-600 text-xs font-medium rounded-md text-primary-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IssueOpenedIcon className="w-4 h-4 mr-1.5" />
            Create GitHub Issue
          </button>
        </div>
      ))}
    </div>
  );
};

    