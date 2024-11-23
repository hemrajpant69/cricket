// Reference HTML elements
const videoPlayer = document.getElementById('videoPlayer');
const importVideoBtn = document.getElementById('importVideo');
const releasePointBtn = document.getElementById('releasePoint');
const reachPointBtn = document.getElementById('reachPoint');
const timeDisplay = document.querySelector('.time-display');
const howToUseBtn = document.getElementById('howToUse');
const howToUseModal = document.getElementById('howToUseModal');
const closeModalBtn = document.querySelector('.close');
const howToUseText = document.getElementById('howToUseText');
const languageSelect = document.getElementById('languageSelect');

// Create an overlay for displaying messages
const messageOverlay = document.createElement('div');
messageOverlay.className = 'message-overlay';
document.body.appendChild(messageOverlay);

let releaseTime = 0;
let reachTime = 0;

// Video Import Event
importVideoBtn.addEventListener('click', () => {
  let fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'video/*';
  fileInput.onchange = (event) => {
    let file = event.target.files[0];
    videoPlayer.src = URL.createObjectURL(file);
    videoPlayer.load();
  };
  fileInput.click();
});
// Show How to Use Modal
howToUseBtn.addEventListener('click', () => {
  howToUseModal.style.display = 'block';
});

// Close How to Use Modal
closeModalBtn.addEventListener('click', () => {
  howToUseModal.style.display = 'none';
});

// Close the modal when clicking outside of it
window.addEventListener('click', (event) => {
  if (event.target === howToUseModal) {
    howToUseModal.style.display = 'none';
  }
});

// Mark Release Point
releasePointBtn.addEventListener('click', () => {
  releaseTime = videoPlayer.currentTime;
  showMessage(`Release Point set at: ${releaseTime.toFixed(3)} seconds`);
});

// Mark Reach Point
reachPointBtn.addEventListener('click', () => {
  reachTime = videoPlayer.currentTime;
  showMessage(`Reach Point set at: ${reachTime.toFixed(3)} seconds`);
  calculateSpeed();
});

// Display Speed and Motivational Message
function calculateSpeed() {
  if (releaseTime > 0 && reachTime > 0 && releaseTime < reachTime) {
    const distance = 20.12; // Pitch length in meters
    const timeTaken = reachTime - releaseTime;
    const speed = (distance / timeTaken) * 3.6; // Convert m/s to km/h
    
    let message;
    if (speed < 60) {
      message = `Speed: ${speed.toFixed(2)} km/h. Let's pick up the pace! You've got this!`;
    } else if (speed < 100) {
      message = `Speed: ${speed.toFixed(2)} km/h. Nice throw! Keep pushing for even faster!`;
    } else {
      message = `Speed: ${speed.toFixed(2)} km/h. Incredible! You're throwing like a pro!`;
    }

    showMessage(message);
  } else {
    showMessage('Please set both Release and Reach points correctly.');
  }
}

// Function to display messages with animation
function showMessage(text) {
  messageOverlay.textContent = text;
  messageOverlay.classList.add('show'); // Trigger the animation

  setTimeout(() => {
    messageOverlay.classList.remove('show'); // Hide message after delay
  }, 3000); // Duration to display the message
}

// Time Adjustment Buttons
document.querySelectorAll('.adjust-btn').forEach(button => {
  button.addEventListener('click', () => {
    const adjustment = parseFloat(button.dataset.adjust);
    const newTime = Math.max(0, videoPlayer.currentTime + adjustment / 1000);
    videoPlayer.currentTime = newTime; // Update video time
    updateTimeDisplay();
  });
});

// Display the Current Video Time
function updateTimeDisplay() {
  const currentTime = videoPlayer.currentTime;
  const minutes = Math.floor(currentTime / 60);
  const seconds = Math.floor(currentTime % 60);
  const milliseconds = Math.floor((currentTime % 1) * 1000);
  timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(3, '0')}`;
}

// Update time display every time the video is played or paused
videoPlayer.addEventListener('timeupdate', updateTimeDisplay);
