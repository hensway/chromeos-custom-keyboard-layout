let qwerty = `
-=
qwertyuiop[]
asdfghjkl;'
zxcvbnm,./

_+
QWERTYUIOP{}
ASDFGHJKL:"
ZXCVBNM<>?
`.replaceAll("\n", "").split("");

let dvorak = `
[]
',.pyfgcrl/=
aoeuidhtns-
;qjkxbmwvz

{}
"<>PYFGCRL?+
AOEUIDHTNS_
:QJKXBMWVZ
`.replaceAll("\n", "").split("");

var mapping = new Map(qwerty.map((v, i) => [v, dvorak[i]]));

var contextID; // we'll see what uninitialized contextID can do!!!

chrome.input.ime.onFocus.addListener((context) =>
  contextID = context.contextID);

// i think this causes problems
// chrome.input.ime.onBlur.addListener((_context) => contextID = 0);

chrome.input.ime.onKeyEvent.addListener((_engineID, keyData, _requestID) => {
  // only handle original KeyboardEvents
  if (keyData.extensionId) return false;

  if (keyData.altKey || keyData.ctrlKey) return false;

  if (mapping.has(keyData.key)) {
    keyData.key = mapping.get(keyData.key);
    chrome.input.ime.sendKeyEvents({ contextID, keyData: [keyData] });
    return true;
  }

  return false;
});
