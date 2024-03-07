// popup.js

let formattedTime; // Declare formattedTime outside the event listener

document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.local.get(['pagesVisited', 'mostVisitedPage', 'charactersTyped', 'wordsTyped', 'timeOnline', 'mouseClicks'], function (result) {
        document.getElementById('pagesVisited').innerText = result.pagesVisited;

        // Display the most visited page domain and count
        const mostVisitedPage = result.mostVisitedPage || {};
        const mostVisitedDomain = Object.keys(mostVisitedPage).length > 0 ? Object.keys(mostVisitedPage)[0] : 'No visits recorded';
        const mostVisitedCount = mostVisitedPage[mostVisitedDomain] || 0;
        document.getElementById('mostVisitedPage').innerText = `${mostVisitedDomain} `;

        document.getElementById('mouseClicks').innerText = result.mouseClicks || 0;
        formattedTime = formatTime(result.timeOnline); // Assign formattedTime here
        document.getElementById('timeOnline').innerText = formattedTime;
        document.getElementById('clearAllButton').addEventListener('click', function () {
            clearAll();
        });

        var clearAllDialog = document.getElementById('clearAllMessage');
        clearAllDialog.querySelector('#closeDialog').addEventListener('click', function () {
            clearAllDialog.close();
        });
    });
});

function formatTime(totalTimeInSeconds) {
    const seconds = Math.floor(totalTimeInSeconds % 60);
    const minutes = Math.floor((totalTimeInSeconds / 60) % 60);
    const hours = Math.floor((totalTimeInSeconds / 3600) % 24);
    const days = Math.floor(totalTimeInSeconds / (3600 * 24));

    // Create a formatted string
    const formattedTime = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    return formattedTime;
}

function clearAll() {
    var deleteStatsButton;
    if (confirm("Are you sure?")) {
        chrome.storage.local.set({
            pagesVisited: 0,
            mostVisitedPage: {},
            charactersTyped: 0,
            wordsTyped: 0,
            timeOnline: 0,
            mouseClicks: 0
        }, function () {
            // Stats cleared, show the dialog
            deleteStatsButton = "Stats cleared! Please close and reopen";
            document.getElementById('clearAllMessage').innerText = deleteStatsButton;
            var clearAllDialog = document.getElementById('clearAllMessage');
            clearAllDialog.showModal();
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('contactsButton').addEventListener('click', function () {
        // Change to alert instead of showModal
        alert("Email: alanvnorcott@gmail.com\nLinkedIn: https://www.linkedin.com/in/alan-norcott-31161523b/");
    });
});

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('achievementsButton').addEventListener('click', function () {
        // Change to alert instead of showModal
        alert("Sorry, still working on this part");
    });
});