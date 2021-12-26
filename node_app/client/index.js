// Prevent reloading the page with submit form
function logSubmit(event) {
    console.log(`Form Submitted! Time stamp: ${event.timeStamp}`);
    event.preventDefault();
}

const form = document.getElementById('generateTrack');

form.addEventListener("submit", logSubmit);