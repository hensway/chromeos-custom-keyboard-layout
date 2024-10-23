var contextID; // we'll see what uninitialized contextID can do!!!

chrome.input.ime.onFocus.addListener((context) => contextID = context.contextID);

chrome.input.ime.onBlur.addListener((_context) => contextID = 0);

chrome.input.ime.onKeyEvent.addListener((_engineID, keyData, _requestID) => {
  if (keyData.evil) return false;

  if (keyData.key == "a") {
    (async () => {
      keyData.key = "b";
      keyData.evil = true;
      await chrome.input.ime.sendKeyEvents({contextID, keyData: [keyData]});
      chrome.input.ime.keyEventHandled();
    })();
    return undefined;
  }

  return false;
});