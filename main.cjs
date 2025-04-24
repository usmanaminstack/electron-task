const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');



function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.loadURL('http://localhost:5173');
  console.log('Electron app is running...');
  win.webContents.openDevTools(); // Open DevTools

  // More main process logs
  win.webContents.on('did-finish-load', () => {
    console.log('Main process: React app has finished loading!');
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('save-image', async (_event, dataUrl) => {
  try {
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '')
    const picturesPath = app.getPath('pictures') // could also use 'documents'
    const fileName = `snapshot_${Date.now()}.png`
    const fullPath = path.join(picturesPath, fileName)

    fs.writeFileSync(fullPath, base64Data, 'base64')
    return fullPath
  } catch (error) {
    console.error('Error saving image:', error)
    throw error
  }
})
ipcMain.handle('save-audio', async (_event, audioData) => {
  try {
    const { buffer, type } = audioData;
    // Save the audio file to a specific location (make sure to adjust the path)
    const filePath = path.join(__dirname, 'saved-audio.webm');
    console.log("🚀 ~ ipcMain.handle ~ filePath:", filePath)
    fs.writeFileSync(filePath, Buffer.from(buffer));
    return filePath;  // Send back the file path
  } catch (error) {
    console.error("Error saving audio:", error);
    throw new Error("Failed to save audio");
  }
});
