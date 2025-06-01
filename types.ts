
export interface GithubFile {
  path: string;
  type: 'blob' | 'tree'; // 'blob' for file, 'tree' for directory
  sha: string;
  url: string; // API URL to fetch content
}

export interface RepoInfo {
  owner: string;
  repo: string;
  branch: string;
}

export interface CodeIssue {
  id: string; // Client-side unique ID
  filePath: string; 
  lineNumber?: string;
  issueTitle: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
  category: 'Performance' | 'Security' | 'Integrity' | 'Scalability' | 'Maintainability' | 'BestPractice' | 'Other';
}

export interface AnalyzedFileReport {
  filePath: string;
  issues: CodeIssue[];
  error?: string;
  status: 'pending' | 'analyzing' | 'analyzed' | 'error';
}

export interface AlertInfo {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

// For GitHub API responses
export interface GithubTreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  url: string;
}

export interface GithubTreeResponse {
  sha: string;
  url: string;
  tree: GithubTreeItem[];
  truncated: boolean;
}

export interface GithubContentResponse {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: string; // 'file', 'dir' etc.
  content?: string; // Base64 encoded content if type is 'file'
  encoding?: 'base64';
  _links: {
    self: string;
    git: string;
    html: string;
  };
}

export interface GithubIssueResponse {
  id: number;
  node_id: string;
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  number: number;
  state: string;
  title: string;
  body?: string | null;
  // ... and many other fields
}

// OAuth-related types
export interface GitHubOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string;
}

export interface GitHubOAuthToken {
  access_token: string;
  token_type: string;
  scope: string;
  refresh_token?: string;
  expires_in?: number;
  refresh_token_expires_in?: number;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  email: string | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  authMethod: 'pat' | 'oauth' | null;
  user?: GitHubUser;
  token?: string;
}
