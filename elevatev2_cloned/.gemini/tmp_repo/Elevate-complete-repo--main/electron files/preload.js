const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  startCapture: () => ipcRenderer.send('start-capture'),
  stopCapture: () => ipcRenderer.send('stop-capture'),
  onHint: (callback) => ipcRenderer.on('hint', callback)
});