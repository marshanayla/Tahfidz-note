// Check if user name is saved
const savedName = localStorage.getItem('tahfidzUserName');

// Get DOM elements
const nameModal = document.getElementById('nameModal');
const app = document.getElementById('app');
const nameForm = document.getElementById('nameForm');
const userNameInput = document.getElementById('userName');
const displayName = document.getElementById('displayName');
const welcomeName = document.getElementById('welcomeName');
const changeNameBtn = document.getElementById('changeNameBtn');

// Function to save name
function saveName(name) {
    localStorage.setItem('tahfidzUserName', name);
    displayName.textContent = name;
    welcomeName.textContent = name;
}

// Function to show app and hide modal
function showApp() {
    nameModal.classList.add('hidden');
    app.classList.remove('hidden');
}

// Function to show modal and hide app
function showNameModal() {
    nameModal.classList.remove('hidden');
    app.classList.add('hidden');
    userNameInput.value = '';
    userNameInput.focus();
}

// Handle form submission
nameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = userNameInput.value.trim();
    
    if (name) {
        saveName(name);
        showApp();
    }
});

// Handle change name button
changeNameBtn.addEventListener('click', () => {
    showNameModal();
});

// Initialize app
if (savedName) {
    // Name is saved, show the app
    displayName.textContent = savedName;
    welcomeName.textContent = savedName;
    showApp();
} else {
    // No name saved, show the modal
    showNameModal();
}

