const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "/index_preload.js"),
      enableRemoteModule: false,
      contextIsolation: true,
      worldSafeExecuteJavaScript: true,
      sandbox: true,
      webviewTag: true,
    },
  });

  mainWindow.loadFile("index.html");
  mainWindow.webContents.openDevTools();
  mainWindow.webContents.on("will-attach-webview", (e, webPreferences, ps) => {
    webPreferences.preload = path.join(__dirname, "webview_preload.js");
    webPreferences.enableRemoteModule = false;
    webPreferences.contextIsolation = true;
    webPreferences.sandbox = true;
    webPreferences.worldSafeExecuteJavaScript = true;
  });

  ipcMain.on("sendMessagePortToMainProcess", (event) => {
    mainWindow.webContents.postMessage("sendMessagePortToMainWindow", "*", [
      event.ports[0],
    ]);
  });
}

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
