// DOM Elements
const inputText = document.getElementById("input-text");
const outputText = document.getElementById("output-text");
const truncateBtn = document.getElementById("truncate");
const copyBtn = document.getElementById("copy");
const clearBtn = document.getElementById("clear");
const lengthInput = document.getElementById("len");

// Character count elements
const inputCount = document.getElementById("input-count");
const outputCount = document.getElementById("output-count");

// Stats elements
const originalLength = document.getElementById("original-length");
const truncatedLength = document.getElementById("truncated-length");
const charactersSaved = document.getElementById("characters-saved");

// Initialize the app
function init() {
    updateCharacterCounts();
    updateStats();
    
    // Event listeners
    inputText.addEventListener("input", updateCharacterCounts);
    truncateBtn.addEventListener("click", truncateText);
    copyBtn.addEventListener("click", copyToClipboard);
    clearBtn.addEventListener("click", clearAll);
    lengthInput.addEventListener("input", validateLengthInput);
    
    // Add real-time truncation on length change
    lengthInput.addEventListener("input", function() {
        if (inputText.value && lengthInput.value) {
            truncateText();
        }
    });
}

// Update character counts
function updateCharacterCounts() {
    const inputLength = inputText.value.length;
    const outputLength = outputText.value.length;
    
    inputCount.textContent = inputLength;
    outputCount.textContent = outputLength;
    
    updateStats();
}

// Update statistics
function updateStats() {
    const inputLength = inputText.value.length;
    const outputLength = outputText.value.length;
    const saved = Math.max(0, inputLength - outputLength);
    
    originalLength.textContent = inputLength;
    truncatedLength.textContent = outputLength;
    charactersSaved.textContent = saved;
}

// Validate length input
function validateLengthInput() {
    const len = parseInt(lengthInput.value);
    
    if (len < 1) {
        lengthInput.value = 1;
    } else if (len > 1000) {
        lengthInput.value = 1000;
    }
}

// Truncate text function
function truncateText() {
    const len = parseInt(lengthInput.value);
    
    // Validate input
    if (!len || len <= 0) {
        showToast("Please enter a valid length", "error");
        return;
    }
    
    if (!inputText.value) {
        showToast("Please enter some text to truncate", "error");
        return;
    }
    
    // Truncate text
    if (inputText.value.length > len) {
        outputText.value = inputText.value.slice(0, len);
        showToast(`Text truncated to ${len} characters`, "success");
    } else {
        outputText.value = inputText.value;
        showToast("Text is shorter than the specified length", "info");
    }
    
    updateCharacterCounts();
}

// Copy to clipboard function
function copyToClipboard() {
    if (!outputText.value) {
        showToast("No text to copy", "error");
        return;
    }
    
    navigator.clipboard.writeText(outputText.value)
        .then(() => {
            showToast("Text copied to clipboard", "success");
        })
        .catch(err => {
            console.error("Failed to copy text: ", err);
            showToast("Failed to copy text", "error");
        });
}

// Clear all function
function clearAll() {
    inputText.value = "";
    outputText.value = "";
    lengthInput.value = "50";
    updateCharacterCounts();
    showToast("All fields cleared", "info");
}

// Show toast notification
function showToast(message, type = "info") {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    // Set icon based on type
    let icon = 'info-circle';
    let bgColor = '#6c63ff';
    
    if (type === 'success') {
        icon = 'check-circle';
        bgColor = '#38a169';
    } else if (type === 'error') {
        icon = 'exclamation-circle';
        bgColor = '#e53e3e';
    }
    
    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    toast.style.backgroundColor = bgColor;
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);