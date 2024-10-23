let qwerty =
  [
    "-", "=",
    "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
    "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'",
    "z", "x", "c", "v", "b", "n", "m", ",", ".", "/",

    "_", "+",
    "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "{", "}",
    "A", "S", "D", "F", "G", "H", "J", "K", "L", ":", '"',
    "Z", "X", "C", "V", "B", "N", "M", "<", ">", "?",
  ];

let dvorak =
  [
    "[", "]",
    "'", ",", ".", "p", "y", "f", "g", "c", "r", "l", "/", "=",
    "a", "o", "e", "u", "i", "d", "h", "t", "n", "s", "-",
    ";", "q", "j", "k", "x", "b", "m", "w", "v", "z",

    "{", "}",
    '"', "<", ">", "P", "Y", "F", "G", "C", "R", "L", "?", "+",
    "A", "O", "E", "U", "I", "D", "H", "T", "N", "S", "_",
    ":", "Q", "J", "K", "X", "B", "M", "W", "V", "Z",
  ];

var mapping = new Map(qwerty.map((v, i) => [v, dvorak[i]]));


var contextID; // we'll see what uninitialized contextID can do!!!

chrome.input.ime.onFocus.addListener((context) =>
  contextID = context.contextID);

chrome.input.ime.onBlur.addListener((_context) => contextID = 0);

chrome.input.ime.onKeyEvent.addListener((_engineID, keyData, requestID) => {
  // let's not mess with modifiers, kay?
  if (keyData.altKey || keyData.ctrlKey) return false;

  if (mapping.has(keyData.key)) {
    keyData.key = mapping.get(keyData.key);
    (async () => {
      // living in the future
      await chrome.input.ime.sendKeyEvents({ contextID, keyData: [keyData] });
      chrome.input.ime.keyEventHandled(requestID, true);
    })();
    return undefined;
  }

  return false;
});