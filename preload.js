const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getApiKey: () => ipcRenderer.invoke('get-api-key'),
  getGitHubOAuthConfig: () => ipcRenderer.invoke('get-github-oauth-config'),
  openOAuthWindow: (authUrl) => ipcRenderer.invoke('open-oauth-window', authUrl),
});