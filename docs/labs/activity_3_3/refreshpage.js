// Refresh the page when the user comes back to the page
document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === 'visible') {
        location.reload();
    }
});