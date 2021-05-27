# Electron SharedArrayBuffer on MessageChannel

The purpose of this project is to prove:

1. SharedArrayBuffer is ONLY supported to be transferred through MessageChannel between JavaScript context in the same process.
2. SharedArrayBuffer can NOT be transferred between Electron renderer/webview processes.

## Structure

1. main.js is to create index page.
2. index.html, index.js, index.css, index_preload.js is the resources for index page.
3. webview.html, webview.js, webview_preload.js is the resources for webview page.

## How to use

In the webview page, click the `Go!` button to test the two scenarios.

### First scenario: different processes

1. the MessagePorts are created in the webview page.
2. One MessagePort is postMessaged to the index page.
3. New a SharedArrayBuffer in the index page and try to postMessage to webview page through MessagePort.

The demo shows, when calling MessagePort.postMessage(SharedArrayBuffer) in the index page, the SharedArrayBuffer is not transferred to the webview page.


### Second scenario: different JavaScript context, same process

1. the MessagePorts are created in the webview page.
2. One MessagePOrt is postMessaged to the webview preload.
3. New a SharedArrayBuffer in the webview preload and postMessage the SharedArrayBuffer to the webview page.

The demos shows, the webview main world JavaScript can receive the SharedArrayBuffer.