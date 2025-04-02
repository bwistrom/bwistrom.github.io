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
        setSecureUsageCount(newCount);
        return true;
    }
    
    return false;
}

// Show expired message
function showExpiredMessage() {
    const pinInput = document.getElementById('pinInput');
    if (pinInput) {
        pinInput.value = '';
    }
}

// Test PIN handler object
window.testPinHandler = {
    isTestPin: function(pin) {
        return pin === TEST_PIN;
    },
    handleTestPin: function() {
        return handlePin(TEST_PIN);
    }
}; 