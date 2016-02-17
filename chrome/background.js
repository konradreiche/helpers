// Background page, which is responsible for choosing media source
"use strict";

const chooseDesktopMedia = chrome.desktopCapture.chooseDesktopMedia;
const streamIdCallback = function (message, callback) {
  return function (streamId) {
    message.type = 'gotScreen';
    message.sourceId = streamId;
    callback(message);
    return false;
  };
};

chrome.runtime.onMessageExternal.addListener(function (message, sender, callback) {
  switch(message.type) {
    case 'getScreen':
      let sourceTypes = message.options || ['screen', 'window'];
      let pending = chooseDesktopMedia(sourceTypes, sender.tab, streamIdCallback(message, callback));
      return true;
    case 'cancelGetScreen':
      chrome.desktopCapture.cancelChooseDesktopMedia(message.request);
      message.type = 'canceledGetScreen';
      callback(message);
      return false;
  }
});
