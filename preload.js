// import { contextBridge, ipcRenderer } from 'electron';
// import fs from 'fs';
// import path from 'path';
// import os from 'os';

// contextBridge.exposeInMainWorld('electronAPI', {
//   // Save image or audio file to disk
//   saveFile: (filename, buffer) => {
//     const filePath = path.join(os.homedir(), 'VoiceNotes', filename);

//     // Ensure directory exists
//     fs.mkdirSync(path.dirname(filePath), { recursive: true });

//     fs.writeFileSync(filePath, buffer);
//     return filePath;
//   },

//   // Show an open file dialog (e.g., to pick audio or images if needed)
//   openFileDialog: async () => {
//     return await ipcRenderer.invoke('dialog:openFile');
//   },

//   // Send data to main process if needed (e.g., for debug or extended file operations)
//   sendToMain: (channel, data) => {
//     ipcRenderer.send(channel, data);
//   },
// });
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("electronAPI", {
  saveAudio: (audioBuffer, type) => ipcRenderer.send('save-audio', { buffer: audioBuffer, type }),
  saveImage: (dataUrl) => ipcRenderer.invoke("save-image", dataUrl),
});
