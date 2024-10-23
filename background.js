let ime = chrome.input.ime;

var contextID; // we'll see what uninitialized contextID can do!!!

ime.onFocus.addListener((context) => contextID = context.contextID);

ime.onBlur.addListener((_) => contextID = 0);

ime.onKeyEvent.addListener((_, keyData, _) => {
  // if (keyData.evil) return false;

  if (keyData.key == "a") {
    (async () => {
      keyData.key = "b";
      await ime.sendKeyEvents({contextID, keyData: [keyData]});
      ime.keyEventHandled();
    })();
    return undefined;
  }

  return false;
});