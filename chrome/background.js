"use strict";

// Invoke the Desktop Capture API to capture the screen's media stream
const session = ['screen', 'window'];

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(portOnMessageHanlder);

  // Called for each message from content.js
  function portOnMessageHanlder(message) {
    if (message == 'get-sourceId') {
      chrome.desktopCapture.chooseDesktopMedia(session, port.sender.tab, onAccessApproved);
    }
  }

  // Getting the source id
  // sourceId will be empty if permission is denied
  function onAccessApproved(sourceId) {
    console.log('sourceId', sourceId);

    // if "cancel" button is clicked
    if (!sourceId || !sourceId.length) {
      return port.postMessage('PermissionDeniedError');
    }

    // "ok" button is clicked; share "sourceId" with the
    // content-script which will forward it to the webpage
    port.postMessage({
      sourceId: sourceId
    });
  }
});
