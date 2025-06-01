
import React, { useState, useCallback, useEffect } from 'react';
import { AuthForm } from './components/AuthForm';
import { ApiKeysForm } from './components/ApiKeysForm';
import { RepoForm } from './components/RepoForm';
import { FileList } from './components/FileList';
import { ReviewPanel } from './components/ReviewPanel';
import { LoadingSpinner } from './components/LoadingSpinner';
import { AlertMessage } from './components/AlertMessage';
import { ProgressBar } from './components/ProgressBar'; // New import
import { GithubFile, CodeIssue, AnalyzedFileReport, RepoInfo, AlertInfo, AuthState } from './types';
import { fetchRepoFiles, fetchFileContent, createGithubIssue as apiCreateGithubIssue } from './services/githubService';
import { reviewCodeWithGemini, SUPPORTED_FILE_EXTENSIONS } from './services/geminiService';
import { GithubIcon, CodeIcon, LightBulbIcon, ChevronDownIcon, ChevronUpIcon, IssueOpenedIcon, CheckCircleIcon, XCircleIcon, InformationCircleIcon, KeyIcon } from './components/Icons';
import useLocalStorage from './hooks/useLocalStorage';

const AVERAGE_ANALYSIS_TIME_PER_FILE_MS = 20000; // 20 seconds per file for initial estimate

const App: React.FC = () => {
  const [githubPAT, setGithubPAT] = useLocalStorage<string | null>('githubPAT', null);
  const [githubAuthState, setGithubAuthState] = useLocalStorage<AuthState | null>('githubAuthState', null);
  const [geminiApiKey, setGeminiApiKey] = useLocalStorage<string | null>('geminiApiKey', null);
  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null);
  const [files, setFiles] = useState<GithubFile[]>([]);
  const [analyzedReports, setAnalyzedReports] = useState<AnalyzedFileReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<string>('');
  const [alertInfo, setAlertInfo] = useState<AlertInfo | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  // State for progress tracking
  const [totalFilesToAnalyze, setTotalFilesToAnalyze] = useState<number>(0);
  const [filesAnalyzedCount, setFilesAnalyzedCount] = useState<number>(0);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | null>(null);
  const [analysisStartTime, setAnalysisStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (isLoading && analysisStartTime && totalFilesToAnalyze > 0 && filesAnalyzedCount <= totalFilesToAnalyze) {
      if (filesAnalyzedCount === 0) {
         // Initial estimate based on average time
        const initialETC = Math.round(totalFilesToAnalyze * (AVERAGE_ANALYSIS_TIME_PER_FILE_MS / 1000));
        setEstimatedTimeRemaining(initialETC > 0 ? initialETC : null);
      } else {
        const elapsedTimeMs = Date.now() - analysisStartTime;
        const avgTimePerFileMs = elapsedTimeMs / filesAnalyzedCount;
        const remainingFiles = totalFilesToAnalyze - filesAnalyzedCount;
        const newEtcSeconds = Math.round((remainingFiles * avgTimePerFileMs) / 1000);
        setEstimatedTimeRemaining(newEtcSeconds > 0 ? newEtcSeconds : null);
      }

      if (filesAnalyzedCount === totalFilesToAnalyze) {
        // Analysis complete
        setEstimatedTimeRemaining(null);
        // setCurrentTask(''); // Task message will be updated by handleAnalyzeFiles completion
      }
    } else if (!isLoading) {
        setEstimatedTimeRemaining(null); // Clear ETC when not loading
    }
  }, [filesAnalyzedCount, totalFilesToAnalyze, analysisStartTime, isLoading]);


  const handlePATSubmit = (pat: string) => {
    setGithubPAT(pat);
    setAlertInfo({ type: 'success', message: 'GitHub PAT saved successfully.' });
  };

  const handleGeminiApiKeySubmit = (apiKey: string) => {
    setGeminiApiKey(apiKey);
    setAlertInfo({ type: 'success', message: 'Google Gemini API key saved successfully.' });
  };

  const handleGithubOAuthSubmit = (authState: AuthState) => {
    setGithubAuthState(authState);
    if (authState.isAuthenticated) {
      setAlertInfo({ type: 'success', message: `Successfully signed in as ${authState.user?.login}` });
    } else {
      setAlertInfo({ type: 'info', message: 'Signed out from GitHub' });
      // Clear related data when signing out
      setRepoInfo(null);
      setFiles([]);
      setAnalyzedReports([]);
    }
  };

  const getGitHubToken = (): string | null => {
    if (githubPAT) return githubPAT;
    if (githubAuthState?.isAuthenticated && githubAuthState.token) return githubAuthState.token;
    return null;
  };

  const handleRepoSubmit = async (owner: string, repo: string, branch: string) => {
    const token = getGitHubToken();
    if (!token) {
      setAlertInfo({ type: 'error', message: 'GitHub authentication is not set.' });
      return;
    }
    setRepoInfo({ owner, repo, branch });
    setIsLoading(true);
    setCurrentTask(`Fetching files from ${owner}/${repo} (branch: ${branch})...`);
    setFiles([]);
    setAnalyzedReports([]);
    setTotalFilesToAnalyze(0);
    setFilesAnalyzedCount(0);
    setEstimatedTimeRemaining(null);
    setAnalysisStartTime(null);
    try {
      const fetchedFiles = await fetchRepoFiles(owner, repo, branch, token);
      const codeFiles = fetchedFiles.filter(file =>
        SUPPORTED_FILE_EXTENSIONS.some(ext => file.path.endsWith(ext))
      );
      setFiles(codeFiles);
      setAlertInfo({ type: 'success', message: `Found ${codeFiles.length} code files.` });
    } catch (error) {
      console.error('Error fetching repository files:', error);
      setAlertInfo({ type: 'error', message: `Failed to fetch repository files: ${error instanceof Error ? error.message : String(error)}` });
    } finally {
      setIsLoading(false);
      setCurrentTask('');
    }
  };

  const analyzeSingleFile = useCallback(async (file: GithubFile, filePathsContext?: string) => {
    const token = getGitHubToken();
    if (!token || !repoInfo) {
      // This case should ideally be prevented by UI logic, but as a safeguard:
      setAlertInfo({ type: 'error', message: 'Missing GitHub authentication or repository information for analysis.' });
      // Update report status to error for this file
      setAnalyzedReports(prev => prev.map(r => r.filePath === file.path ? { ...r, status: 'error', error: 'Pre-analysis check failed: Missing auth/repo info.' } : r));
      return; // Exit if critical info is missing
    }

    // No individual setCurrentTask here as it's handled by the loop in handleAnalyzeFiles
    setAnalyzedReports(prev => prev.map(r => r.filePath === file.path ? { ...r, status: 'analyzing' } : r));
    
    let report: AnalyzedFileReport = { filePath: file.path, issues: [], status: 'analyzing' };

    try {
      const content = await fetchFileContent(repoInfo.owner, repoInfo.repo, file.path, token, repoInfo.branch);
      if (!content) {
        throw new Error('File content is empty or could not be fetched.');
      }
      const issues = await reviewCodeWithGemini(content, file.path, filePathsContext);
      report = { filePath: file.path, issues, status: 'analyzed' };
      // Individual file completion alert can be noisy, moved to batch completion.
      // setAlertInfo({ type: 'info', message: `Finished analyzing ${file.path}. Found ${issues.length} potential issues.`});
    } catch (error) {
      console.error(`Error analyzing file ${file.path}:`, error);
      report = { filePath: file.path, issues: [], status: 'error', error: error instanceof Error ? error.message : String(error) };
      // Individual error alert can be noisy if many files fail. Batch error summary might be better.
      // setAlertInfo({ type: 'error', message: `Error analyzing ${file.path}: ${report.error}` });
    }
    
    setAnalyzedReports(prev => {
      const existingIndex = prev.findIndex(r => r.filePath === file.path);
      if (existingIndex !== -1) {
        const updatedReports = [...prev];
        updatedReports[existingIndex] = report;
        return updatedReports;
      }
      // Should not happen if initialized correctly in handleAnalyzeFiles
      return [...prev, report]; 
    });
    // No individual setCurrentTask('') here
  }, [githubPAT, githubAuthState, repoInfo, getGitHubToken]);


  const handleAnalyzeFiles = async (selectedFiles: GithubFile[]) => {
    const token = getGitHubToken();
    if (!token || !repoInfo) {
      setAlertInfo({ type: 'error', message: 'Missing GitHub authentication or repository information.' });
      return;
    }
    if (selectedFiles.length === 0) {
      setAlertInfo({ type: 'info', message: 'No files selected for analysis.' });
      return;
    }

    setIsLoading(true);
    setAnalyzedReports(selectedFiles.map(f => ({ filePath: f.path, issues: [], status: 'pending' })));
    
    setTotalFilesToAnalyze(selectedFiles.length);
    setFilesAnalyzedCount(0); // Reset count
    setAnalysisStartTime(Date.now()); // Record start time
    setCurrentTask(`Preparing to analyze ${selectedFiles.length} files...`); // Initial task

    const filePathsContext = selectedFiles.map(f => f.path).join(', ');
    let filesProcessed = 0;

    for (const file of selectedFiles) {
      filesProcessed++;
      setCurrentTask(`Analyzing ${file.path} (${filesProcessed} of ${selectedFiles.length})...`);
      await analyzeSingleFile(file, filePathsContext);
      setFilesAnalyzedCount(prev => prev + 1); // Increment after each file analysis completes
    }
    
    setIsLoading(false);
    setCurrentTask('');
    setAlertInfo({ type: 'success', message: `Analysis complete for ${selectedFiles.length} files.` });
    // ETC and start time will be reset by useEffect or naturally become irrelevant
  };

  const createGithubIssue = async (issue: CodeIssue) => {
    const token = getGitHubToken();
    if (!token || !repoInfo) {
      setAlertInfo({ type: 'error', message: 'Cannot create issue: Missing GitHub authentication or repository info.'});
      return;
    }
    setIsLoading(true);
    setCurrentTask(`Creating GitHub issue for: ${issue.issueTitle}`);
    try {
      const title = `[CodeReview] ${issue.issueTitle} (${issue.filePath})`;
      let body = `**File:** \`${issue.filePath}\`\n\n`;
      body += `**Severity:** ${issue.severity}\n`;
      body += `**Category:** ${issue.category}\n\n`;
      if(issue.lineNumber) {
        body += `**Approx. Line:** ${issue.lineNumber}\n\n`;
      }
      body += `**Description:**\n${issue.description}\n\n`;
      body += `*This issue was auto-generated by Gemini Code Reviewer.*`;

      const newIssue = await apiCreateGithubIssue(repoInfo.owner, repoInfo.repo, token, title, body, [issue.category, issue.severity]);
      setAlertInfo({ type: 'success', message: `Successfully created GitHub issue #${newIssue.number}: ${newIssue.title}` });
      // Optionally, update the issue in analyzedReports to mark it as "created"
    } catch (error) {
      console.error('Error creating GitHub issue:', error);
      setAlertInfo({ type: 'error', message: `Failed to create GitHub issue: ${error instanceof Error ? error.message : String(error)}` });
    } finally {
      setIsLoading(false);
      setCurrentTask('');
    }
  };

  const toggleAccordion = (filePath: string) => {
    setActiveAccordion(activeAccordion === filePath ? null : filePath);
  };
  
  const handleClearPAT = () => {
    setGithubPAT(null);
    setRepoInfo(null);
    setFiles([]);
    setAnalyzedReports([]);
    setAlertInfo({type: 'info', message: 'GitHub PAT cleared.'});
    setTotalFilesToAnalyze(0);
    setFilesAnalyzedCount(0);
    setEstimatedTimeRemaining(null);
  };

  const handleClearAuth = () => {
    setGithubPAT(null);
    setGithubAuthState(null);
    setRepoInfo(null);
    setFiles([]);
    setAnalyzedReports([]);
    setAlertInfo({type: 'info', message: 'GitHub authentication cleared.'});
    setTotalFilesToAnalyze(0);
    setFilesAnalyzedCount(0);
    setEstimatedTimeRemaining(null);
  };

  const handleClearGeminiApiKey = () => {
    setGeminiApiKey(null);
    setAlertInfo({ type: 'info', message: 'Google Gemini API key cleared. You will need to re-enter it to perform new analysis.' });
  };

  const progressPercentage = totalFilesToAnalyze > 0 ? (filesAnalyzedCount / totalFilesToAnalyze) * 100 : 0;
  const isGitHubAuthenticated = githubPAT || (githubAuthState?.isAuthenticated && githubAuthState.authMethod === 'oauth');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 md:p-8">
      <header className="w-full max-w-4xl mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary-400 flex items-center justify-center space-x-3">
          <LightBulbIcon className="w-10 h-10" />
          <span>Gemini Code Reviewer</span>
        </h1>
        <p className="text-slate-400 mt-2">Automated code analysis and GitHub issue creation powered by Gemini.</p>
      </header>

      {alertInfo && (
        <div className="w-full max-w-4xl my-4">
          <AlertMessage
            type={alertInfo.type}
            message={alertInfo.message}
            onDismiss={() => setAlertInfo(null)}
          />
        </div>
      )}

      {isLoading && currentTask && (
         <div className="fixed inset-0 bg-slate-900 bg-opacity-80 flex flex-col items-center justify-center z-50 p-4">
          <LoadingSpinner />
          <p className="text-primary-400 mt-4 text-lg text-center">{currentTask}</p>
          {analysisStartTime && totalFilesToAnalyze > 0 && filesAnalyzedCount <= totalFilesToAnalyze && (
            <div className="w-full max-w-sm mt-3">
              <ProgressBar percentage={progressPercentage} />
              {estimatedTimeRemaining !== null && estimatedTimeRemaining > 0 && (
                <p className="text-sm text-slate-300 text-center mt-2">
                  Estimated time remaining: {estimatedTimeRemaining}s
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <main className="w-full max-w-4xl space-y-8">
        {!isGitHubAuthenticated || !geminiApiKey ? (
          <ApiKeysForm
            onGithubPATSubmit={handlePATSubmit}
            onGeminiApiKeySubmit={handleGeminiApiKeySubmit}
            onGithubOAuthSubmit={handleGithubOAuthSubmit}
            githubPAT={githubPAT}
            geminiApiKey={geminiApiKey}
            githubAuthState={githubAuthState}
          />
        ) : (
          <>
            <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center text-green-400">
                  <CheckCircleIcon className="w-6 h-6 mr-2" />
                  {githubPAT ? (
                    <p>GitHub PAT is set. <button onClick={handleClearPAT} className="ml-2 text-primary-400 hover:text-primary-300 underline text-sm">(Clear PAT)</button></p>
                  ) : githubAuthState?.isAuthenticated ? (
                    <p>GitHub OAuth authenticated as {githubAuthState.user?.login}. <button onClick={handleClearAuth} className="ml-2 text-primary-400 hover:text-primary-300 underline text-sm">(Sign Out)</button></p>
                  ) : (
                    <p>GitHub authentication is set.</p>
                  )}
                </div>
                <div className="flex items-center text-green-400">
                  <KeyIcon className="w-6 h-6 mr-2" />
                  <p>Google Gemini API key is set. <button onClick={handleClearGeminiApiKey} className="ml-2 text-primary-400 hover:text-primary-300 underline text-sm">(Clear API Key)</button></p>
                </div>
              </div>
              <div className="mt-6">
                <RepoForm onSubmit={handleRepoSubmit} isLoading={isLoading && !analysisStartTime /* Only disable repo form during repo fetch */} />
              </div>
            </div>

            {files.length > 0 && (
              <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
                <h2 className="text-2xl font-semibold text-primary-400 mb-4 flex items-center"><CodeIcon className="w-7 h-7 mr-2"/>Files to Analyze</h2>
                <FileList files={files} onAnalyze={handleAnalyzeFiles} isLoading={isLoading && !!analysisStartTime /* Disable file list interactions during analysis */} />
              </div>
            )}
            
            {analyzedReports.length > 0 && (
              <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
                <h2 className="text-2xl font-semibold text-primary-400 mb-6 flex items-center"><IssueOpenedIcon className="w-7 h-7 mr-2" />Review Results</h2>
                {analyzedReports.map((report) => (
                  <div key={report.filePath} className="mb-6 bg-slate-700 rounded-lg shadow-md">
                    <button
                      onClick={() => toggleAccordion(report.filePath)}
                      className="w-full flex justify-between items-center p-4 text-left text-lg font-medium text-slate-100 hover:bg-slate-600 rounded-t-lg focus:outline-none"
                      aria-expanded={activeAccordion === report.filePath}
                      aria-controls={`report-content-${report.filePath.replace(/[^a-zA-Z0-9]/g, '-')}`}
                    >
                      <span>{report.filePath} ({report.issues.length} issues) - Status: <span className={`font-semibold ${report.status === 'analyzed' ? 'text-green-400' : report.status === 'error' ? 'text-red-400' : report.status === 'pending' ? 'text-slate-400' : 'text-yellow-400'}`}>{report.status}</span></span>
                      {activeAccordion === report.filePath ? <ChevronUpIcon className="w-6 h-6" /> : <ChevronDownIcon className="w-6 h-6" />}
                    </button>
                    {activeAccordion === report.filePath && (
                      <div 
                        id={`report-content-${report.filePath.replace(/[^a-zA-Z0-9]/g, '-')}`}
                        className="p-4 border-t border-slate-600"
                        role="region"
                      >
                        {report.status === 'analyzing' && <div className="flex items-center text-yellow-400"><LoadingSpinner size="sm" /><span className="ml-2">Analyzing...</span></div>}
                        {report.status === 'error' && <p className="text-red-400">Error: {report.error}</p>}
                        {report.status === 'pending' && <p className="text-slate-300">Analysis pending for this file.</p>}
                        {report.issues.length === 0 && report.status === 'analyzed' && <p className="text-slate-300">No issues found by Gemini for this file.</p>}
                        <ReviewPanel
                          issues={report.issues}
                          onCreateIssue={createGithubIssue}
                          isLoading={isLoading && !!currentTask.startsWith('Creating GitHub issue')}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <footer className="w-full max-w-4xl mt-12 text-center text-slate-500 text-sm">
        <p>Ensure your GitHub PAT has `repo` scope for reading repositories and creating issues.</p>
        <p>Get your Google Gemini API key from <a href="https://ai.google.dev/gemini-api/docs/api-key" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 underline">Google AI Studio</a>.</p>
        <p>Gemini Code Reviewer &copy; 2024. For demonstration purposes.</p>
      </footer>
    </div>
  );
};

export default App;
