const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
// const url = require('url'); // url module is not used

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
    mainWindow.loadURL('http://localhost:5173');
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