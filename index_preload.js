const { ipcRenderer } = require("electron");

ipcRenderer.on("sendMessagePortToMainWindow", (event) => {
  const port = event.ports[0];
  console.log(
    "MessagePort is recieved from webview main world to index renderer process"
  );
  const sab = new SharedArrayBuffer(1024);
  //   const sab = new ArrayBuffer(1024);
  port.onmessage = function (event) {
    if (event.data == "processed") {
      console.log(sab);
    }
  };
  port.postMessage("MessagePortReceived");
  console.log(
    "Transfer SharedArrayBuffer on MessageChannel from index renderer process to webview main world"
  );
  port.postMessage(sab);
});
