let qwerty = `
qwert yuiop
asdfg hjkl;'
zxcvb nm,./

QWERT YUIOP
ASDFG HJKL:"
ZXCVB NM<>?
`.replaceAll(/\s/g, "").split("");

let focal = `
vlhgk qfouj
srntb ycaei/
zxmdp 'w.;,

VLHGK QFOUJ
SRNTB YCAEI?
ZXMDP "W>:<
`.replaceAll(/\s/g, "").split("");

var mapping = new Map(qwerty.map((v, i) => [v, focal[i]]));

var contextID; // we'll see what uninitialized contextID can do!!!

chrome.input.ime.onFocus.addListener((context) =>
  contextID = context.contextID);

chrome.input.ime.onBlur.addListener((_context) => contextID = 0);

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