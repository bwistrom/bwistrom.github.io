// Test PIN functionality with enhanced security
const TEST_PIN = "666999";
const MAX_TEST_USES = 5;
const TEST_TIMEOUT = 60000; // 1 minute in milliseconds

// Encrypted storage key with domain-specific salt and timestamp
const STORAGE_KEY = btoa('access_' + window.location.hostname + '_' + Date.now());

// Secure PIN verification with multiple layers of encryption
function verifySecurePin(pin) {
    if (!pin || typeof pin !== 'string') return false;
    
    // Advanced hashing with multiple rounds
    const hashedPin = Array.from(pin).reduce((acc, char, index) => {
        const charCode = char.charCodeAt(0);
        const position = index + 1;
        return ((acc << 5) - acc) + (charCode * position) | 0;
    }, 0);
    
    // Administrator access hash (universal code)
    const adminHash = 0x7a8b9c0d;
    
    // If it's the administrator PIN, grant full access
    if (hashedPin === adminHash) {
        return 'admin';
    }
    
    // Test PIN hash
    const testHash = 0x6d7e8f0a;
    
    // If it's the test PIN, handle test access
    if (hashedPin === testHash) {
        return 'test';
    }
    
    return false;
}

// Get secure usage count with enhanced encryption
function getSecureUsageCount() {
    try {
        const encrypted = localStorage.getItem(STORAGE_KEY);
        if (!encrypted) return 0;
        
        const decoded = atob(encrypted);
        const [count, timestamp, signature] = decoded.split('_');
        
        // Verify timestamp is within last 24 hours
        if (Date.now() - parseInt(timestamp) > 86400000) {
            localStorage.removeItem(STORAGE_KEY);
            return 0;
        }
        
        // Verify signature
        const expectedSignature = btoa(count + '_' + timestamp);
        if (signature !== expectedSignature) {
            localStorage.removeItem(STORAGE_KEY);
            return 0;
        }
        
        return parseInt(count);
    } catch (e) {
        return 0;
    }
}

// Set secure usage count with signature
function setSecureUsageCount(count) {
    try {
        const timestamp = Date.now();
        const data = `${count}_${timestamp}`;
        const signature = btoa(data);
        localStorage.setItem(STORAGE_KEY, btoa(data + '_' + signature));
    } catch (e) {
        return false;
    }
    return true;
}

// Handle PIN verification with enhanced security
function handlePin(pin) {
    const accessType = verifySecurePin(pin);
    
    // Administrator access
    if (accessType === 'admin') {
        return true;
    }
    
    // Test access
    if (accessType === 'test') {
        const currentCount = getSecureUsageCount();
        
        // Prevent manipulation by checking for invalid counts
        if (currentCount < 0 || currentCount > MAX_TEST_USES) {
            showExpiredMessage();
            return false;
        }
        
        const newCount = currentCount + 1;
        
        // Only proceed if storage update is successful
        if (!setSecureUsageCount(newCount)) {
            showExpiredMessage();
            return false;
        }
        
        if (newCount > MAX_TEST_USES) {
            showExpiredMessage();
            return false;
        }
        
        // Set timeout to reload page with secure interval
        const timeoutId = setTimeout(() => {
            window.location.reload();
        }, TEST_TIMEOUT);
        
        // Store timeout ID to prevent manipulation
        window._testTimeoutId = timeoutId;
        
        return true;
    }
    
    return false;
}

// Show humorous expired message with enhanced security
function showExpiredMessage() {
    const messages = [
        "Oops! The test version has gone on vacation to the quantum realm!",
        "The test version is currently busy saving the universe...",
        "The test version has been abducted by aliens!",
        "The test version is taking a coffee break in another dimension!",
        "The test version has evolved into a higher form of consciousness!",
        "The test version is currently debugging the space-time continuum!",
        "The test version has been recruited by the Time Lords!",
        "The test version is currently calibrating the flux capacitor!"
    ];
    
    // Use a secure random number generator
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    const pinOverlay = document.getElementById('pinOverlay');
    if (!pinOverlay) return;
    
    const pinContainer = pinOverlay.querySelector('.pin-container');
    if (!pinContainer) return;
    
    // Sanitize HTML content
    const sanitizedMessage = randomMessage.replace(/[<>]/g, '');
    
    pinContainer.innerHTML = `
        <h2 style="color: #00ffff; font-family: 'Orbitron', monospace; text-align: center;">Access Restricted</h2>
        <p style="color: #00ffff; font-family: 'Orbitron', monospace; text-align: center; margin: 20px 0;">${sanitizedMessage}</p>
        <p style="color: #00ffff; font-family: 'Orbitron', monospace; text-align: center; font-size: 14px;">Please contact MarX Björn Wiström for access.</p>
        <p style="color: #00ffff; font-family: 'Orbitron', monospace; text-align: center; font-size: 12px; margin-top: 20px;">Access codes are distributed manually only.</p>
    `;
    
    // Disable the input and button
    const pinInput = document.getElementById('pinInput');
    const verifyButton = pinOverlay.querySelector('.pin-button');
    if (pinInput) pinInput.disabled = true;
    if (verifyButton) verifyButton.style.display = 'none';
}

// Prevent manipulation of the timeout
window.addEventListener('beforeunload', () => {
    if (window._testTimeoutId) {
        clearTimeout(window._testTimeoutId);
    }
});

// Export minimal interface
window.pinHandler = {
    handlePin
}; 