document.getElementById("ai").addEventListener("click", () => {
  chrome.tabs.create({ url: "https://studysync.app" });
});
document.getElementById("bm").addEventListener("click", () => {
  chrome.tabs.create({ url: "https://studysync.app/bookmarks" });
});