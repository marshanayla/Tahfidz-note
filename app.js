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

// Current user name
let currentUserName = savedName || null;

// Surah entry elements
const surahForm = document.getElementById('surahForm');
const surahNameInput = document.getElementById('surahName');
const versesInput = document.getElementById('verses');
const emojiButtons = document.querySelectorAll('.emoji-btn');
const entriesList = document.getElementById('entriesList');
const exitSection = document.getElementById('exitSection');
const exitBtn = document.getElementById('exitBtn');
const encouragementModal = document.getElementById('encouragementModal');
const closeEncouragementBtn = document.getElementById('closeEncouragementBtn');

// Store selected feeling
let selectedFeeling = null;

// Function to normalize username (trim and handle case consistently)
function normalizeUserName(userName) {
    if (!userName) return '';
    return userName.trim();
}

// Function to migrate old data if username format changed
function migrateUserData(oldName, newName) {
    const oldKey = `tahfidzEntries_${oldName}`;
    const newKey = `tahfidzEntries_${newName}`;
    
    // If old data exists and new data doesn't, migrate it
    const oldData = localStorage.getItem(oldKey);
    const newData = localStorage.getItem(newKey);
    
    if (oldData && !newData && oldName !== newName) {
        localStorage.setItem(newKey, oldData);
        // Keep old data as backup, or remove it
        // localStorage.removeItem(oldKey); // Uncomment if you want to remove old data
    }
}

// Function to get storage key for user entries
function getUserEntriesKey(userName) {
    const normalized = normalizeUserName(userName);
    return `tahfidzEntries_${normalized}`;
}

// Function to save name
function saveName(name) {
    const normalizedName = normalizeUserName(name);
    currentUserName = normalizedName;
    localStorage.setItem('tahfidzUserName', normalizedName);
    displayName.textContent = normalizedName;
    welcomeName.textContent = normalizedName;
    
    // Load this user's entries
    displayEntries();
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
    // Clear current user when switching
    currentUserName = null;
}

// Handle form submission
nameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = userNameInput.value.trim();
    
    if (name) {
        const normalizedName = normalizeUserName(name);
        
        // If switching from another user, check for data migration
        if (currentUserName && currentUserName !== normalizedName) {
            // This is a profile switch, data should already be separate
            // But we ensure the new user's data is loaded correctly
        }
        
        saveName(normalizedName);
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

// Function to get all entries from localStorage for current user
function getEntries() {
    if (!currentUserName) {
        return [];
    }
    const normalizedName = normalizeUserName(currentUserName);
    const entriesKey = getUserEntriesKey(normalizedName);
    const entries = localStorage.getItem(entriesKey);
    
    // If entries exist, return them; otherwise return empty array
    if (entries) {
        try {
            return JSON.parse(entries);
        } catch (e) {
            console.error('Error parsing entries:', e);
            return [];
        }
    }
    return [];
}

// Function to save entry
function saveEntry(surahName, verses, feeling) {
    if (!currentUserName) {
        alert('Please enter your name first');
        return;
    }
    
    const normalizedName = normalizeUserName(currentUserName);
    const entries = getEntries();
    const today = getTodayDateString();
    
    // Check if entry for today already exists
    const todayEntryIndex = entries.findIndex(entry => entry.date === today);
    
    const entry = {
        date: today,
        surah: surahName,
        verses: verses,
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
    
    // Save to current user's storage with normalized name
    const entriesKey = getUserEntriesKey(normalizedName);
    localStorage.setItem(entriesKey, JSON.stringify(entries));
    
    // Ensure currentUserName is normalized
    currentUserName = normalizedName;
    
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
        const verses = entry.verses || 'N/A';
        
        return `
            <div class="entry-item">
                <div class="entry-date">${formatDate(entry.date)}</div>
                <div class="entry-content">
                    <div class="entry-details">
                        <div class="entry-surah">${entry.surah}</div>
                        <div class="entry-verses">Verses: ${verses}</div>
                    </div>
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
    const verses = versesInput.value.trim();
    
    if (!surahName) {
        alert('Please enter a Surah name');
        return;
    }
    
    if (!verses) {
        alert('Please enter the verses (Ayat)');
        return;
    }
    
    if (!selectedFeeling) {
        alert('Please select how you felt about memorizing this Surah');
        return;
    }
    
    saveEntry(surahName, verses, selectedFeeling);
    
    // Hide form and show exit button
    surahForm.classList.add('hidden');
    exitSection.classList.remove('hidden');
});

// Handle exit button click
exitBtn.addEventListener('click', () => {
    encouragementModal.classList.remove('hidden');
});

// Function to close encouragement modal and reset form
function closeEncouragementAndReset() {
    encouragementModal.classList.add('hidden');
    // Reset form and show it again
    surahForm.classList.remove('hidden');
    exitSection.classList.add('hidden');
    surahNameInput.value = '';
    versesInput.value = '';
    emojiButtons.forEach(b => b.classList.remove('active'));
    selectedFeeling = null;
    surahNameInput.focus();
}

// Handle close encouragement modal
closeEncouragementBtn.addEventListener('click', closeEncouragementAndReset);

// Close modal when clicking outside
encouragementModal.addEventListener('click', (e) => {
    if (e.target === encouragementModal) {
        closeEncouragementAndReset();
    }
});

// Initialize app
if (savedName) {
    // Name is saved, show the app
    // Normalize the saved name to ensure consistency
    const normalizedName = normalizeUserName(savedName);
    currentUserName = normalizedName;
    displayName.textContent = normalizedName;
    welcomeName.textContent = normalizedName;
    
    // Update localStorage with normalized name if it was different
    if (savedName !== normalizedName) {
        localStorage.setItem('tahfidzUserName', normalizedName);
    }
    
    showApp();
    displayEntries(); // Load and display saved entries for this user
} else {
    // No name saved, show the modal
    showNameModal();
}

