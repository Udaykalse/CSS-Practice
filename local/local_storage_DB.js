// DOM Elements
const searchInput = document.querySelector('#search');
const searchBtn = document.querySelector('#search-btn');
const addBtn = document.querySelector('#add');
const resultSpan = document.querySelector("#result");
const keyInput = document.querySelector("#key");
const valueInput = document.querySelector('#value');
const remInput = document.querySelector("#rem");
const deleteBtn = document.querySelector("#delete");
const viewAllBtn = document.querySelector("#view-all");
const entriesContainer = document.querySelector("#entries-container");

// Button event listeners
searchBtn.addEventListener("click", searchEntry);
addBtn.addEventListener("click", addEntry);
deleteBtn.addEventListener("click", deleteEntry);
viewAllBtn.addEventListener("click", viewAllEntries);

// Allow Enter key to trigger actions
keyInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addEntry();
    }
});

valueInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addEntry();
    }
});

searchInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        searchEntry();
    }
});

remInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        deleteEntry();
    }
});

// Functions
function searchEntry() {
    const key = searchInput.value.trim();
    
    if (!key) {
        alert("Please enter a key to search");
        return;
    }
    
    const value = localStorage.getItem(key);
    
    if (value !== null) {
        resultSpan.textContent = value;
        resultSpan.style.color = "#27ae60";
    } else {
        resultSpan.textContent = "Key not found";
        resultSpan.style.color = "#e74c3c";
    }
    
    searchInput.value = "";
}

function addEntry() {
    const key = keyInput.value.trim();
    const value = valueInput.value.trim();
    
    if (!key || !value) {
        alert("Please enter both key and value");
        return;
    }
    
    if (localStorage.getItem(key) !== null) {
        const confirmOverwrite = confirm(`Key "${key}" already exists. Do you want to overwrite it?`);
        if (!confirmOverwrite) {
            return;
        }
    }
    
    localStorage.setItem(key, value);
    alert(`Success! "${key}" has been added with value "${value}"`);
    
    // Clear inputs
    keyInput.value = '';
    valueInput.value = '';
    
    // Update entries display if it's visible
    if (entriesContainer.children.length > 0) {
        viewAllEntries();
    }
}

function deleteEntry() {
    const key = remInput.value.trim();
    
    if (!key) {
        alert("Please enter a key to delete");
        return;
    }
    
    if (localStorage.getItem(key) !== null) {
        const confirmDelete = confirm(`Are you sure you want to delete the key "${key}"?`);
        if (confirmDelete) {
            localStorage.removeItem(key);
            alert(`Key "${key}" has been deleted`);
            
            // Update entries display if it's visible
            if (entriesContainer.children.length > 0) {
                viewAllEntries();
            }
        }
    } else {
        alert(`Key "${key}" not found`);
    }
    
    remInput.value = '';
}

function viewAllEntries() {
    entriesContainer.innerHTML = '';
    
    if (localStorage.length === 0) {
        entriesContainer.innerHTML = '<div class="no-entries">No entries in local storage</div>';
        return;
    }
    
    // Create a sorted list of keys
    const keys = Object.keys(localStorage).sort();
    
    keys.forEach(key => {
        const value = localStorage.getItem(key);
        
        const entryElement = document.createElement('div');
        entryElement.className = 'entry-item';
        entryElement.innerHTML = `
            <div>
                <span class="entry-key">${escapeHtml(key)}:</span>
                <span class="entry-value">${escapeHtml(value)}</span>
            </div>
            <div class="entry-actions">
                <button class="btn btn-sm btn-secondary edit-entry" data-key="${escapeHtml(key)}">Edit</button>
                <button class="btn btn-sm btn-danger delete-entry" data-key="${escapeHtml(key)}">Delete</button>
            </div>
        `;
        
        entriesContainer.appendChild(entryElement);
    });
    
    // Add event listeners to the dynamically created buttons
    document.querySelectorAll('.edit-entry').forEach(button => {
        button.addEventListener('click', function() {
            const key = this.getAttribute('data-key');
            editEntry(key);
        });
    });
    
    document.querySelectorAll('.delete-entry').forEach(button => {
        button.addEventListener('click', function() {
            const key = this.getAttribute('data-key');
            deleteSpecificEntry(key);
        });
    });
}

function editEntry(key) {
    const currentValue = localStorage.getItem(key);
    const newValue = prompt(`Edit value for key "${key}":`, currentValue);
    
    if (newValue !== null) {
        localStorage.setItem(key, newValue);
        viewAllEntries(); // Refresh the display
    }
}

function deleteSpecificEntry(key) {
    const confirmDelete = confirm(`Are you sure you want to delete the key "${key}"?`);
    if (confirmDelete) {
        localStorage.removeItem(key);
        viewAllEntries(); // Refresh the display
    }
}

// Utility function to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize the app by showing all entries
document.addEventListener('DOMContentLoaded', function() {
    viewAllEntries();
});