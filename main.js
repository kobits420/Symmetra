const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

let guideWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#1e1e1e',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    autoHideMenuBar: true,
    titleBarStyle: 'default',
    icon: path.join(__dirname, 'assets', 'icon.png')
  });

  mainWindow.loadFile('src/index.html');

  // Open DevTools in development
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createGuideWindow() {
  if (guideWindow) {
    guideWindow.focus();
    return;
  }

  guideWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 600,
    minHeight: 400,
    backgroundColor: '#ffffff',
    parent: mainWindow,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  guideWindow.loadFile('src/guide.html');

  guideWindow.on('closed', () => {
    guideWindow = null;
  });
}

// Handle save dialog
ipcMain.handle('save-latex', async (event, latexContent) => {
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Save LaTeX Document',
    defaultPath: 'notes.tex',
    filters: [
      { name: 'LaTeX Files', extensions: ['tex'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (!canceled && filePath) {
    try {
      fs.writeFileSync(filePath, latexContent, 'utf-8');
      return { success: true, path: filePath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  return { success: false, canceled: true };
});

// Handle open dialog
ipcMain.handle('open-file', async (event) => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Open Text File',
    filters: [
      { name: 'Text Files', extensions: ['txt', 'md'] },
      { name: 'All Files', extensions: ['*'] }
    ],
    properties: ['openFile']
  });

  if (!canceled && filePaths.length > 0) {
    try {
      const content = fs.readFileSync(filePaths[0], 'utf-8');
      return { success: true, content, path: filePaths[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  return { success: false, canceled: true };
});

// Handle guide window
ipcMain.handle('open-guide', () => {
  createGuideWindow();
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

