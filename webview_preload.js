const { ipcRenderer } = require("electron");
window.addEventListener("message", (event) => {
  const port = event.ports[0];

  if (event.data == "sendMessagePortToPreloadAndCommunicateWithMainWorld") {
    const sab = new SharedArrayBuffer(1024);

    port.onmessage = function (event) {
      if (event.data == "processed") {
        const uint32Array = new Uint32Array(sab);
        port.postMessage("SharedArrayBufferProcessed");
        console.log(
          "SharedArrayBuffer is supported on MessageChannel between webview preload and main world",
          "The first element should have been changed to `123`",
          uint32Array[0]
        );
      }
    };
    port.postMessage(sab);
  } else if (event.data == "proxyMessagePortToIndexPage") {
    ipcRenderer.postMessage("sendMessagePortToMainProcess", "*", [port]);
  }
});
