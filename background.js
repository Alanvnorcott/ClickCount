// background.js

let totalClicks = 0;
let stopwatchStartTime;
let timer;

chrome.runtime.onInstalled.addListener(function () {
    // Initialize statistics when the extension is installed or updated
    chrome.storage.local.get('mouseClicks', function (result) {
        totalClicks = result.mouseClicks || 0; // Set totalClicks to the stored value or 0 if not present
        chrome.storage.local.set({
            pagesVisited: 0,
            mostVisitedPage: {},
            charactersTyped: 0,
            wordsTyped: 0,
            timeOnline: 0,
            mouseClicks: totalClicks, // Set mouseClicks to the stored value
            favoriteSites: {},
            stopwatchStartTime: new Date().getTime(),
        }, function () {
            startStopwatch();
        });
    });
});

chrome.runtime.onStartup.addListener(function () {
    // Uncommented the startStopwatch call from onStartup
    startStopwatch();
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'mouseClicks') {
        totalClicks += request.clicks;
        chrome.storage.local.set({ mouseClicks: totalClicks });
    }
});

function startStopwatch() {
    // Retrieve the start time and total clicks from storage
    chrome.storage.local.get(['stopwatchStartTime', 'mouseClicks'], function (result) {
        stopwatchStartTime = result.stopwatchStartTime || new Date().getTime();
        totalClicks = result.mouseClicks || 0;

        timer = setInterval(function () {
            chrome.storage.local.get('timeOnline', function (result) {
                chrome.storage.local.set({ timeOnline: result.timeOnline + 1 });
            });
        }, 1000);
    });
}

// ... rest of your code


chrome.webNavigation.onCompleted.addListener(function (details) {
    chrome.storage.local.get(['pagesVisited', 'lastVisitedUrl'], function (result) {
        const currentUrl = details.url;
        if (currentUrl !== result.lastVisitedUrl) {
            // Update statistics
            chrome.storage.local.set({
                pagesVisited: result.pagesVisited + 1,
                lastVisitedUrl: currentUrl
            }, function () {
                // Call getMostVisitedPage using topSites API
                getMostVisitedPageFromTopSites(function (mostVisitedDomain) {
                    updateStatistics({ url: currentUrl }, mostVisitedDomain);
                });
            });
        }
    });
});


function getMostVisitedPageFromTopSites(callback) {
    chrome.topSites.get(function (topSites) {
        console.log('Top Sites:', topSites);


        if (topSites.length > 0) {
            const mostVisitedUrl = topSites[0].url;
            console.log('Most Visited URL:', mostVisitedUrl);


            const urlObject = new URL(mostVisitedUrl);
            const mostVisitedDomain = urlObject.hostname;
            console.log('Most Visited Domain:', mostVisitedDomain);


            callback(mostVisitedDomain);
        } else {
            console.log('No top sites available.');
            callback(''); // Pass an empty string if no top sites are available
        }
    });
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'updateStats') {
        // Update statistics based on the received data
        getMostVisitedPageFromTopSites(function (mostVisitedDomain) {
            updateStatistics(request, mostVisitedDomain);
        });
    }
});


function updateStatistics(data, mostVisitedDomain) {
    chrome.storage.local.get(['pagesVisited', 'charactersTyped', 'wordsTyped', 'mostVisitedPage'], function (result) {
        // Calculate the time spent on the current page
        const currentTime = new Date().getTime();
        const timeOnCurrentPage = (currentTime - stopwatchStartTime) / 1000; // in seconds


        // Ensure mostVisitedDomain is a string
        mostVisitedDomain = mostVisitedDomain.toString();


        // Check if mostVisitedPage is defined in result, initialize if not
        const mostVisitedPage = result.mostVisitedPage || {};


        // Update statistics in local storage
        chrome.storage.local.set({
            pagesVisited: result.pagesVisited + 1,
            mostVisitedPage: { ...mostVisitedPage, [mostVisitedDomain]: (mostVisitedPage[mostVisitedDomain] || 0) + 1 },
            charactersTyped: result.charactersTyped + data.charactersTyped,
            wordsTyped: result.wordsTyped + data.wordsTyped,
            timeOnline: result.timeOnline + timeOnCurrentPage
        }, function () {
            updateTimeOnline();
        });
    });
}


// Function to update the timeOnline


function updateTimeOnline() {
    chrome.storage.local.get(['timeOnline'], function (result) {
        // Send the raw time value without formatting it
        chrome.runtime.sendMessage({ action: 'updateTimeOnline', timeOnline: result.timeOnline });
    });
}
