const greetingElement = document.getElementById('greeting');
const welcomeMessage = document.getElementById('welcome-message');
const themeToggle = document.getElementById('theme-toggle');
const refreshButton = document.getElementById('refresh-greeting');
const currentTimeElement = document.getElementById('current-time');
const currentDateElement = document.getElementById('current-date');

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeButtonText();
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    updateThemeButtonText();
    updateWelcomeMessage();
}

function updateThemeButtonText() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    themeToggle.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
}

function getGreeting(hour) {
    if (hour < 5) {
        return { greeting: "Good Night, Uday!", emoji: "🌙" };
    } else if (hour < 12) {
        return { greeting: "Good Morning, Uday!", emoji: "☀️" };
    } else if (hour < 17) {
        return { greeting: "Good Afternoon, Uday!", emoji: "🌤️" };
    } else if (hour < 21) {
        return { greeting: "Good Evening, Uday!", emoji: "🌆" };
    } else {
        return { greeting: "Good Night, Uday!", emoji: "🌙" };
    }
}

function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    const { greeting, emoji } = getGreeting(hour);
    
    greetingElement.classList.remove('greeting-change');
    void greetingElement.offsetWidth;
    greetingElement.classList.add('greeting-change');
    
    greetingElement.textContent = greeting;
    updateWelcomeMessage(emoji);
}

function updateWelcomeMessage(emoji = null) {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const messages = [
        "Hope you're having a wonderful day!",
        "Make today amazing!",
        "You're doing great!",
        "Stay positive!",
        "Keep shining!",
        "Enjoy every moment!"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const themeEmoji = isDarkMode ? "✨" : "😊";
    welcomeMessage.textContent = `${randomMessage} ${emoji || themeEmoji}`;
}

function updateDateTime() {
    const now = new Date();
    
    const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
    };
    currentTimeElement.textContent = now.toLocaleTimeString('en-US', timeOptions);
    
    const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    currentDateElement.textContent = now.toLocaleDateString('en-US', dateOptions);
}

themeToggle.addEventListener('click', toggleTheme);
refreshButton.addEventListener('click', updateGreeting);

document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    updateGreeting();
    updateDateTime();
    
    setInterval(updateDateTime, 1000);
    
    setInterval(updateGreeting, 60000);
});

document.addEventListener('keydown', function(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === 't') {
        event.preventDefault();
        toggleTheme();
    }
    
    if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault();
        updateGreeting();
    }
    
    if (event.code === 'Space' && event.target === document.body) {
        event.preventDefault();
        updateGreeting();
    }
});