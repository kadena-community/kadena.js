/**
 * Detect what context the app is running in.
 *
 * Mainly used for detecting extension context which needs a different routing strategy
 */
export const getScriptType = () => {
  const { chrome } = window as any;
  if (
    chrome &&
    chrome.extension &&
    chrome.extension.getBackgroundPage &&
    chrome.extension.getBackgroundPage() === window
  ) {
    return "BACKGROUND";
  } else if (
    chrome &&
    chrome.extension &&
    chrome.extension.getBackgroundPage &&
    chrome.extension.getBackgroundPage() !== window
  ) {
    return "POPUP";
  } else if (!chrome || !chrome.runtime || !chrome.runtime.onMessage) {
    return "WEB";
  } else {
    return "CONTENT";
  }
};
