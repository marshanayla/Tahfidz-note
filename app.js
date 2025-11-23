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

// Surah entry elements
const surahForm = document.getElementById('surahForm');
const surahNameInput = document.getElementById('surahName');
const emojiButtons = document.querySelectorAll('.emoji-btn');
const entriesList = document.getElementById('entriesList');

// Store selected feeling
let selectedFeeling = null;

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

// Function to get today's date as string
function getTodayDateString() {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
}

// Function to format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Function to get all entries from localStorage
function getEntries() {
    const entries = localStorage.getItem('tahfidzEntries');
    return entries ? JSON.parse(entries) : [];
}

// Function to save entry
function saveEntry(surahName, feeling) {
    const entries = getEntries();
    const today = getTodayDateString();
    
    // Check if entry for today already exists
    const todayEntryIndex = entries.findIndex(entry => entry.date === today);
    
    const entry = {
        date: today,
        surah: surahName,
        feeling: feeling,
        timestamp: new Date().toISOString()
    };
    
    if (todayEntryIndex !== -1) {
        // Update existing entry for today
        entries[todayEntryIndex] = entry;
    } else {
        // Add new entry
        entries.unshift(entry); // Add to beginning
    }
    
    localStorage.setItem('tahfidzEntries', JSON.stringify(entries));
    displayEntries();
}

// Function to display entries
function displayEntries() {
    const entries = getEntries();
    
    if (entries.length === 0) {
        entriesList.innerHTML = '<p class="no-entries">No entries yet. Start tracking your memorization!</p>';
        return;
    }
    
    entriesList.innerHTML = entries.map(entry => {
        const emoji = entry.feeling === 'easy' ? '😊' : '😔';
        const feelingText = entry.feeling === 'easy' ? 'Easy' : 'Difficult';
        const feelingClass = entry.feeling === 'easy' ? 'easy' : 'difficult';
        
        return `
            <div class="entry-item">
                <div class="entry-date">${formatDate(entry.date)}</div>
                <div class="entry-content">
                    <div class="entry-surah">${entry.surah}</div>
                    <div class="entry-feeling ${feelingClass}">
                        <span class="emoji">${emoji}</span>
                        <span>${feelingText}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Handle emoji button clicks
emojiButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        emojiButtons.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        selectedFeeling = btn.dataset.feeling;
    });
});

// Handle surah form submission
surahForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const surahName = surahNameInput.value.trim();
    
    if (!surahName) {
        alert('Please enter a Surah name');
        return;
    }
    
    if (!selectedFeeling) {
        alert('Please select how you felt about memorizing this Surah');
        return;
    }
    
    saveEntry(surahName, selectedFeeling);
    
    // Reset form
    surahNameInput.value = '';
    emojiButtons.forEach(b => b.classList.remove('active'));
    selectedFeeling = null;
    
    // Show success message
    const submitBtn = surahForm.querySelector('.btn-save');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Saved! ✓';
    submitBtn.style.background = '#4caf50';
    
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
    }, 2000);
});

// Initialize app
if (savedName) {
    // Name is saved, show the app
    displayName.textContent = savedName;
    welcomeName.textContent = savedName;
    showApp();
    displayEntries(); // Load and display saved entries
} else {
    // No name saved, show the modal
    showNameModal();
}

