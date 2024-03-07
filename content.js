//content.js
// content.js


window.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: 'mouseClicks', clicks: 1 });
});

