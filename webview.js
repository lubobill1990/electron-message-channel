const result1 = document.getElementById("result1");
const result2 = document.getElementById("result2");

document
  .getElementById("establish_messagechannel")
  .addEventListener("click", () => {
    const { port1, port2 } = new MessageChannel();
    window.postMessage("proxyMessagePortToIndexPage", "*", [port2]);
    result1.innerHTML = "MessagePort sent to index page<br>";

    let sharedArrayBufferReceivedOnMessageChannel = false;
    setTimeout(() => {
      if (!sharedArrayBufferReceivedOnMessageChannel) {
        result1.innerHTML += "No response<br>";
      }
    }, 1000);
    port1.onmessage = function (event) {
      if (event.data == "MessagePortReceived") {
        result1.innerHTML +=
          "MessagePort received, sending SharedArrayBuffer<br>";
        return;
      }
      sharedArrayBufferReceivedOnMessageChannel = true;
      console.log(
        "SharedArrayBuffer is recieved from another renderer process to webview main world in MessageChannel"
      );
      const sab = event.data;
      const uint32Array = new Uint32Array(sab);
      uint32Array[0] = 123;
      console.log("Change the first element to 123 in webview main world");
      port1.postMessage("processed");
    };
  });

document
  .getElementById("establish_messagechannel_between_preload_and_main_world")
  .addEventListener("click", () => {
    const { port1, port2 } = new MessageChannel();
    window.postMessage(
      "sendMessagePortToPreloadAndCommunicateWithMainWorld",
      "*",
      [port2]
    );
    result2.innerHTML += "MessagePort sent to preload<br>";

    port1.onmessage = function (event) {
      if (event.data === "SharedArrayBufferProcessed") {
        result2.innerHTML += "Processed SharedArrayBuffer received in webview preload<br>";

        return;
      }
      result2.innerHTML += "SharedArrayBuffer received in webview main world<br>";

      console.log(
        "SharedArrayBuffer is recieved from webview preload to webview main world in MessageChannel"
      );
      const sab = event.data;
      const uint32Array = new Uint32Array(sab);
      uint32Array[0] = 123;
      console.log("Change the first element to 123 in webview main world");
      port1.postMessage("processed");
    };
  });
