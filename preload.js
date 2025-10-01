const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  saveLatex: (content) => ipcRenderer.invoke('save-latex', content),
  openFile: () => ipcRenderer.invoke('open-file'),
  openGuide: () => ipcRenderer.invoke('open-guide')
});

