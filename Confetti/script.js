// Configuration object
const config = {
    particleCount: 150,
    sizeRange: 8,
    colorScheme: 'rainbow',
    confettiType: 'burst',
    soundEnabled: true,
    autoMode: false,
    autoInterval: null
};

// Statistics tracking
const stats = {
    activeParticles: 0,
    totalClicks: 0,
    totalParticlesCreated: 0
};

// Color palettes
const colorPalettes = {
    rainbow: ['#FF5252', '#FF9800', '#FFEB3B', '#4CAF50', '#2196F3', '#9C27B0'],
    pastel: ['#FFB6C1', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA', '#FF9AA2'],
    monochrome: ['#FFFFFF', '#E0E0E0', '#BDBDBD', '#9E9E9E', '#757575'],
    holiday: ['#D32F2F', '#388E3C', '#FFA000', '#1976D2', '#FBC02D'],
    neon: ['#FF00FF', '#00FFFF', '#FFFF00', '#FF0000', '#00FF00']
};

// Confetti shapes
const shapes = ['circle', 'square', 'triangle', 'star', 'heart'];

// DOM Elements
const confettiTypeSelect = document.getElementById('confetti-type');
const colorSchemeSelect = document.getElementById('color-scheme');
const particleCountSlider = document.getElementById('particle-count');
const countValue = document.getElementById('count-value');
const sizeRangeSlider = document.getElementById('size-range');
const sizeValue = document.getElementById('size-value');
const autoModeBtn = document.getElementById('auto-mode');
const clearConfettiBtn = document.getElementById('clear-confetti');
const toggleSoundBtn = document.getElementById('toggle-sound');
const demoArea = document.getElementById('demo-area');
const confettiSound = document.getElementById('confetti-sound');
const activeParticlesEl = document.querySelector('.stat-value:first-child');
const totalClicksEl = document.querySelectorAll('.stat-value')[1];
const presetButtons = document.querySelectorAll('.preset-btn');

// Preset configurations
const presets = {
    celebration: {
        type: 'burst',
        colors: 'rainbow',
        count: 200,
        size: 10
    },
    fireworks: {
        type: 'fireworks',
        colors: 'neon',
        count: 120,
        size: 12
    },
    rain: {
        type: 'rain',
        colors: 'pastel',
        count: 80,
        size: 6
    },
    spiral: {
        type: 'spiral',
        colors: 'holiday',
        count: 180,
        size: 8
    }
};

// Initialize the application
function init() {
    // Set initial values
    updateCountValue();
    updateSizeValue();
    updateStats();
    
    // Event listeners for controls
    confettiTypeSelect.addEventListener('change', (e) => {
        config.confettiType = e.target.value;
    });
    
    colorSchemeSelect.addEventListener('change', (e) => {
        config.colorScheme = e.target.value;
    });
    
    particleCountSlider.addEventListener('input', (e) => {
        config.particleCount = parseInt(e.target.value);
        updateCountValue();
    });
    
    sizeRangeSlider.addEventListener('input', (e) => {
        config.sizeRange = parseInt(e.target.value);
        updateSizeValue();
    });
    
    autoModeBtn.addEventListener('click', toggleAutoMode);
    clearConfettiBtn.addEventListener('click', clearAllConfetti);
    toggleSoundBtn.addEventListener('click', toggleSound);
    
    // Preset buttons
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = presets[btn.dataset.preset];
            applyPreset(preset);
        });
    });
    
    // Event listener for clicks in the demo area
    demoArea.addEventListener('click', (e) => {
        stats.totalClicks++;
        updateStats();
        createConfetti(e.clientX, e.clientY);
    });
    
    // For continuous confetti on mouse hold
    let isMouseDown = false;
    let mouseHoldInterval;
    
    demoArea.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        // Create initial burst
        stats.totalClicks++;
        updateStats();
        createConfetti(e.clientX, e.clientY, 30);
        
        // Set up continuous bursts while holding
        mouseHoldInterval = setInterval(() => {
            if (isMouseDown) {
                createConfetti(e.clientX, e.clientY, 10);
            }
        }, 100);
    });
    
    document.addEventListener('mouseup', () => {
        isMouseDown = false;
        if (mouseHoldInterval) {
            clearInterval(mouseHoldInterval);
        }
    });
    
    // Create confetti on drag
    demoArea.addEventListener('mousemove', (e) => {
        if (isMouseDown) {
            createConfetti(e.clientX, e.clientY, 3);
        }
    });
    
    // Touch support for mobile
    demoArea.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        stats.totalClicks++;
        updateStats();
        createConfetti(touch.clientX, touch.clientY);
    });
    
    console.log('Enhanced Confetti Effect Initialized!');
}

// Update particle count display
function updateCountValue() {
    countValue.textContent = config.particleCount;
}

// Update size range display
function updateSizeValue() {
    const minSize = Math.max(3, Math.floor(config.sizeRange / 3));
    const maxSize = config.sizeRange + 4;
    sizeValue.textContent = `${minSize}-${maxSize}px`;
}

// Update statistics display
function updateStats() {
    activeParticlesEl.textContent = stats.activeParticles;
    totalClicksEl.textContent = stats.totalClicks;
}

// Apply preset configuration
function applyPreset(preset) {
    config.confettiType = preset.type;
    config.colorScheme = preset.colors;
    config.particleCount = preset.count;
    config.sizeRange = preset.size;
    
    // Update UI elements
    confettiTypeSelect.value = preset.type;
    colorSchemeSelect.value = preset.colors;
    particleCountSlider.value = preset.count;
    sizeRangeSlider.value = preset.size;
    
    updateCountValue();
    updateSizeValue();
}

// Get random color from selected palette
function getRandomColor() {
    const palette = colorPalettes[config.colorScheme];
    return palette[Math.floor(Math.random() * palette.length)];
}

// Get random shape
function getRandomShape() {
    return shapes[Math.floor(Math.random() * shapes.length)];
}

// Create confetti particles
function createConfetti(x, y, customCount = null) {
    const count = customCount || config.particleCount;
    
    // Play sound if enabled
    if (config.soundEnabled) {
        confettiSound.currentTime = 0;
        confettiSound.play().catch(e => console.log("Audio play failed:", e));
    }
    
    stats.activeParticles += count;
    stats.totalParticlesCreated += count;
    updateStats();
    
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");
        
        // Random size based on config
        const minSize = Math.max(3, Math.floor(config.sizeRange / 3));
        const maxSize = config.sizeRange + 4;
        const size = Math.random() * (maxSize - minSize) + minSize;
        
        // Set shape and styling
        const shape = getRandomShape();
        confetti.classList.add(shape);
        
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.backgroundColor = getRandomColor();
        confetti.style.top = `${y}px`;
        confetti.style.left = `${x}px`;
        
        // Random rotation
        const rotation = Math.random() * 720 - 360; // -360 to 360 degrees
        confetti.style.setProperty("--rotation", `${rotation}deg`);
        
        // Set animation based on confetti type
        let animationName = 'burst';
        let duration = Math.random() * 1.5 + 0.5;
        
        switch(config.confettiType) {
            case 'burst':
                const burstRadius = 200 + Math.random() * 100;
                const angle = Math.random() * Math.PI * 2;
                const xDirection = Math.cos(angle) * burstRadius;
                const yDirection = Math.sin(angle) * burstRadius;
                
                confetti.style.setProperty("--x", `${xDirection}px`);
                confetti.style.setProperty("--y", `${yDirection}px`);
                animationName = 'burst';
                break;
                
            case 'fountain':
                const fountainX = (Math.random() - 0.5) * 300;
                const fountainY = -Math.random() * 400 - 100;
                
                confetti.style.setProperty("--x", `${fountainX}px`);
                confetti.style.setProperty("--y", `${fountainY}px`);
                animationName = 'fountain';
                duration = Math.random() * 1.5 + 1.5;
                break;
                
            case 'spiral':
                const spiralRadius = 100 + Math.random() * 150;
                const spiralAngle = Math.random() * Math.PI * 2;
                
                confetti.style.setProperty("--radius", `${spiralRadius}px`);
                confetti.style.setProperty("--angle", `${spiralAngle}rad`);
                animationName = 'spiral';
                duration = Math.random() * 1.5 + 1;
                break;
                
            case 'rain':
                const rainX = (Math.random() - 0.5) * 400;
                
                confetti.style.setProperty("--x", `${rainX}px`);
                animationName = 'rain';
                duration = Math.random() * 2 + 2;
                break;
                
            case 'fireworks':
                const fireworkRadius = 50 + Math.random() * 150;
                const fireworkAngle = Math.random() * Math.PI * 2;
                const fireworkX = Math.cos(fireworkAngle) * fireworkRadius;
                const fireworkY = Math.sin(fireworkAngle) * fireworkRadius;
                const fireworkXEnd = fireworkX * 0.3;
                const fireworkYEnd = fireworkY * 0.3 + 50;
                
                confetti.style.setProperty("--x", `${fireworkX}px`);
                confetti.style.setProperty("--y", `${fireworkY}px`);
                confetti.style.setProperty("--x-end", `${fireworkXEnd}px`);
                confetti.style.setProperty("--y-end", `${fireworkYEnd}px`);
                animationName = 'fireworks';
                duration = Math.random() * 1 + 1.5;
                break;
        }
        
        // Apply animation
        confetti.style.animation = `${animationName} ${duration}s ease-out forwards`;
        
        // Add slight delay for staggered effect
        confetti.style.animationDelay = `${Math.random() * 0.2}s`;
        
        // Add to document
        document.body.appendChild(confetti);
        
        // Clean up after animation completes
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.remove();
                stats.activeParticles--;
                updateStats();
            }
        }, (duration + 0.2) * 1000);
    }
}

// Toggle auto mode
function toggleAutoMode() {
    if (config.autoMode) {
        // Stop auto mode
        clearInterval(config.autoInterval);
        config.autoMode = false;
        autoModeBtn.innerHTML = '<i class="fas fa-play"></i><span>Auto Mode</span>';
        autoModeBtn.classList.remove('btn-danger');
        autoModeBtn.classList.add('btn-primary');
    } else {
        // Start auto mode
        config.autoMode = true;
        autoModeBtn.innerHTML = '<i class="fas fa-stop"></i><span>Stop Auto</span>';
        autoModeBtn.classList.remove('btn-primary');
        autoModeBtn.classList.add('btn-danger');
        
        config.autoInterval = setInterval(() => {
            const rect = demoArea.getBoundingClientRect();
            const x = rect.left + Math.random() * rect.width;
            const y = rect.top + Math.random() * rect.height;
            createConfetti(x, y, Math.floor(config.particleCount / 2));
        }, 1000);
    }
}

// Clear all confetti
function clearAllConfetti() {
    const confettiElements = document.querySelectorAll('.confetti');
    confettiElements.forEach(confetti => {
        confetti.style.animation = 'none';
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.remove();
                stats.activeParticles--;
                updateStats();
            }
        }, 50);
    });
}

// Toggle sound
function toggleSound() {
    config.soundEnabled = !config.soundEnabled;
    if (config.soundEnabled) {
        toggleSoundBtn.innerHTML = '<i class="fas fa-volume-up"></i><span>Sound On</span>';
        toggleSoundBtn.classList.remove('btn-secondary');
        toggleSoundBtn.classList.add('btn-success');
    } else {
        toggleSoundBtn.innerHTML = '<i class="fas fa-volume-mute"></i><span>Sound Off</span>';
        toggleSoundBtn.classList.remove('btn-success');
        toggleSoundBtn.classList.add('btn-secondary');
    }
}

document.addEventListener('DOMContentLoaded', init);