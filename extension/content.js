// StudySync content script — listens for text selection.
document.addEventListener("mouseup", () => {
  const sel = window.getSelection();
  if (sel && sel.toString().trim().length > 0) {
    chrome.runtime?.sendMessage?.({ type: "STUDYSYNC_SELECTION", text: sel.toString() });
  }
});
