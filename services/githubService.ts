
import { GithubFile, GithubTreeResponse, GithubContentResponse, GithubIssueResponse } from '../types';

const GITHUB_API_BASE_URL = 'https://api.github.com';

async function githubApiFetch<T,>(endpoint: string, pat: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Authorization': `token ${pat}`,
    'Accept': 'application/vnd.github.v3+json',
    ...options.headers,
  };

  const response = await fetch(`${GITHUB_API_BASE_URL}${endpoint}`, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(`GitHub API Error: ${response.status} ${errorData.message || response.statusText}`);
  }
  // For 204 No Content, response.json() will fail.
  if (response.status === 204) {
    return undefined as T; // Or handle as appropriate for your use case
  }
  return response.json() as T;
}

export const fetchRepoFiles = async (owner: string, repo: string, branch: string, pat: string): Promise<GithubFile[]> => {
  // Get the SHA of the latest commit on the specified branch
  const branchData = await githubApiFetch<{ commit: { sha: string } }>(`/repos/${owner}/${repo}/branches/${branch}`, pat);
  const treeSha = branchData.commit.sha;

  // Fetch the tree recursively
  const data = await githubApiFetch<GithubTreeResponse>(`/repos/${owner}/${repo}/git/trees/${treeSha}?recursive=1`, pat);
  
  return data.tree
    .filter(item => item.type === 'blob') // Only files, not directories
    .map(item => ({
      path: item.path,
      type: item.type,
      sha: item.sha,
      url: item.url, // This URL points to the git blob, not directly to contents API for path
    }));
};

export const fetchFileContent = async (owner: string, repo: string, path: string, pat: string, branch?: string): Promise<string> => {
  let endpoint = `/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`;
  if (branch) {
    endpoint += `?ref=${encodeURIComponent(branch)}`;
  }
  const data = await githubApiFetch<GithubContentResponse>(endpoint, pat);

  if (data.encoding === 'base64' && data.content) {
    // Decode base64 content
    try {
      return atob(data.content);
    } catch (e) {
      console.error("Failed to decode base64 content for ", path, e);
      throw new Error(`Failed to decode base64 content for ${path}`);
    }
  }
  throw new Error(`File content not available or not base64 encoded for ${path}`);
};

export const createGithubIssue = async (
  owner: string,
  repo: string,
  pat: string,
  title: string,
  body: string,
  labels?: string[]
): Promise<GithubIssueResponse> => {
  const issueData = { title, body, labels };
  return githubApiFetch<GithubIssueResponse>(
    `/repos/${owner}/${repo}/issues`,
    pat,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(issueData),
    }
  );
};
    