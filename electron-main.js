const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { URL } = require('url');
const http = require('http');

// Register custom protocol scheme
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('gemini-code-reviewer', process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient('gemini-code-reviewer');
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, // Recommended for security
      nodeIntegration: false, // Recommended for security
    },
    icon: path.join(__dirname, 'assets', 'icon.png') // Optional: if you add an icon
  });

  // Load index.html from dist directory after build, or from root for development
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  // Add event listeners to verify the app is loading correctly
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('✓ App loaded successfully');
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.log('✗ Failed to load app:', errorDescription);
  });

  // Open DevTools - remove for production
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    // Dereference the window object, usually:
    // mainWindow = null;
    // However, mainWindow is local to createWindow, so it will be garbage collected.
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle API key request from renderer process
ipcMain.handle('get-api-key', async (event) => {
  return process.env.API_KEY;
});

// Handle GitHub OAuth configuration request
ipcMain.handle('get-github-oauth-config', async (event) => {
  return {
    clientId: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    redirectUri: 'http://localhost:8080/auth/callback',
    scope: 'repo user:email'
  };
});

// Handle OAuth window opening
ipcMain.handle('open-oauth-window', async (event, authUrl) => {
  return new Promise((resolve, reject) => {
    // Create a temporary HTTP server to handle the callback
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, 'http://localhost:8080');

      if (url.pathname === '/auth/callback') {
        // Send a success page
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <head><title>Authorization Successful</title></head>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
              <h1>✅ Authorization Successful!</h1>
              <p>You can close this window and return to the application.</p>
              <script>window.close();</script>
            </body>
          </html>
        `);

        // Resolve with the full callback URL
        const callbackUrl = `http://localhost:8080${req.url}`;
        server.close();
        oauthWindow.close();
        resolve(callbackUrl);
      } else {
        res.writeHead(404);
        res.end('Not found');
      }
    });

    // Start server on port 8080
    server.listen(8080, 'localhost', () => {
      console.log('OAuth callback server started on http://localhost:8080');
    });

    // Handle server errors
    server.on('error', (err) => {
      console.error('OAuth callback server error:', err);
      reject(err);
    });

    const oauthWindow = new BrowserWindow({
      width: 500,
      height: 600,
      show: true,
      modal: true,
      parent: BrowserWindow.getFocusedWindow(),
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    oauthWindow.loadURL(authUrl);

    // Handle window closed without completing OAuth
    oauthWindow.on('closed', () => {
      server.close();
      reject(new Error('OAuth window was closed before completing authentication'));
    });

    // Clean up server after 5 minutes timeout
    setTimeout(() => {
      if (server.listening) {
        server.close();
        oauthWindow.close();
        reject(new Error('OAuth timeout - please try again'));
      }
    }, 300000); // 5 minutes
  });
});