// Enhanced Features for Warehouse 2 Clone
// Advanced functionality and security enhancements

class SecurityManager {
    constructor() {
        this.attempts = 0;
        this.maxAttempts = 3;
        this.lockoutTime = 30000; // 30 seconds
        this.isLockedOut = false;
        this.suspiciousActivity = false;
        this.validPins = ["911876418", "000000000"]; // Test PIN added
    }
    
    validatePin(pin) {
        if (this.isLockedOut) {
            this.showError("System locked. Please wait.");
            return false;
        }
        
        if (this.validPins.includes(pin)) {
            this.attempts = 0;
            this.logAccess(pin);
            return true;
        }
        
        this.attempts++;
        this.logFailedAttempt(pin);
        
        if (this.attempts >= this.maxAttempts) {
            this.lockout();
            return false;
        }
        
        this.showError(`Invalid PIN. ${this.maxAttempts - this.attempts} attempts remaining.`);
        return false;
    }
    
    lockout() {
        this.isLockedOut = true;
        this.showError("Too many failed attempts. System locked for 30 seconds.");
        this.logSecurityEvent("LOCKOUT_INITIATED");
        
        setTimeout(() => {
            this.isLockedOut = false;
            this.attempts = 0;
            this.hideError();
            this.logSecurityEvent("LOCKOUT_RELEASED");
        }, this.lockoutTime);
    }
    
    showError(message) {
        console.log(`Security Error: ${message}`);
        // In a real implementation, this would show UI feedback
    }
    
    hideError() {
        console.log("Security: Error cleared");
    }
    
    logAccess(pin) {
        const timestamp = new Date().toISOString();
        console.log(`Security Log [${timestamp}]: Successful access with PIN ${pin.substring(0, 3)}***`);
    }
    
    logFailedAttempt(pin) {
        const timestamp = new Date().toISOString();
        console.log(`Security Log [${timestamp}]: Failed attempt with PIN ${pin.substring(0, 3)}***`);
    }
    
    logSecurityEvent(event) {
        const timestamp = new Date().toISOString();
        console.log(`Security Event [${timestamp}]: ${event}`);
    }
}

class PerformanceMonitor {
    constructor() {
        this.startTime = performance.now();
        this.frameCount = 0;
        this.lastTime = this.startTime;
        this.fps = 60;
        this.memory = 0;
        this.objects = 0;
        this.enabled = true;
    }
    
    update() {
        if (!this.enabled) return;
        
        this.frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - this.lastTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            // Update memory usage (if available)
            if (performance.memory) {
                this.memory = Math.round(performance.memory.usedJSHeapSize / 1048576);
            }
            
            this.logPerformance();
        }
    }
    
    logPerformance() {
        console.log(`Performance: FPS=${this.fps}, Memory=${this.memory}MB, Objects=${this.objects}`);
    }
    
    setObjectCount(count) {
        this.objects = count;
    }
    
    toggle() {
        this.enabled = !this.enabled;
        console.log(`Performance monitoring: ${this.enabled ? 'enabled' : 'disabled'}`);
    }
}

class CommunicationManager {
    constructor() {
        this.commandCenterWindow = null;
        this.messageQueue = [];
        this.isConnected = false;
        this.setupMessageListener();
    }
    
    setupMessageListener() {
        window.addEventListener('message', (event) => this.handleMessage(event));
    }
    
    connectToCommandCenter() {
        try {
            if (window.opener && !window.opener.closed) {
                this.commandCenterWindow = window.opener;
                this.isConnected = true;
                this.sendMessage('WAREHOUSE2_CONNECTED', { timestamp: Date.now() });
                console.log('Communication: Connected to Command Center');
                return true;
            }
        } catch (error) {
            console.error('Communication: Failed to connect to Command Center:', error);
        }
        return false;
    }
    
    sendMessage(type, data) {
        if (this.isConnected && this.commandCenterWindow) {
            try {
                this.commandCenterWindow.postMessage({ type, data }, window.location.origin);
                console.log(`Communication: Sent ${type}`, data);
            } catch (error) {
                console.error('Communication: Failed to send message:', error);
                this.isConnected = false;
            }
        } else {
            // Queue message for later
            this.messageQueue.push({ type, data });
        }
    }
    
    handleMessage(event) {
        if (event.origin !== window.location.origin) return;
        
        const { type, data } = event.data;
        console.log(`Communication: Received ${type}`, data);
        
        switch (type) {
            case 'SYNC_TIME':
                this.handleTimeSync(data);
                break;
            case 'SYNC_COORDINATES':
                this.handleCoordinateSync(data);
                break;
            case 'TELEPORT':
                this.handleTeleport(data);
                break;
            case 'AUTHENTICATE':
                this.handleAuthentication(data);
                break;
            default:
                console.log(`Communication: Unknown message type: ${type}`);
        }
    }
    
    handleTimeSync(data) {
        console.log('Communication: Time synchronized with Command Center');
    }
    
    handleCoordinateSync(data) {
        console.log('Communication: Coordinates synchronized with Command Center');
    }
    
    handleTeleport(data) {
        console.log('Communication: Teleport request received', data);
    }
    
    handleAuthentication(data) {
        console.log('Communication: Authentication request received');
    }
}

class MemoryManager {
    constructor() {
        this.memories = [];
        this.maxMemories = 100;
        this.compressionThreshold = 50;
    }
    
    storeMemory(memoryData) {
        const memory = {
            id: this.generateId(),
            timestamp: Date.now(),
            data: memoryData,
            type: memoryData.type || 'general',
            priority: memoryData.priority || 1
        };
        
        this.memories.push(memory);
        this.optimizeStorage();
        
        console.log(`Memory: Stored memory ${memory.id} of type ${memory.type}`);
        return memory.id;
    }
    
    retrieveMemory(id) {
        return this.memories.find(memory => memory.id === id);
    }
    
    getMemoriesByType(type) {
        return this.memories.filter(memory => memory.type === type);
    }
    
    optimizeStorage() {
        if (this.memories.length > this.maxMemories) {
            // Remove oldest low-priority memories
            this.memories.sort((a, b) => {
                if (a.priority !== b.priority) {
                    return b.priority - a.priority; // Higher priority first
                }
                return b.timestamp - a.timestamp; // Newer first
            });
            
            const removed = this.memories.splice(this.maxMemories);
            console.log(`Memory: Optimized storage, removed ${removed.length} old memories`);
        }
        
        if (this.memories.length > this.compressionThreshold) {
            this.compressOldMemories();
        }
    }
    
    compressOldMemories() {
        const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
        let compressed = 0;
        
        this.memories.forEach(memory => {
            if (memory.timestamp < cutoffTime && !memory.compressed) {
                // Simulate compression by reducing data size
                if (memory.data && typeof memory.data === 'object') {
                    memory.data = { compressed: true, summary: 'Compressed memory data' };
                    memory.compressed = true;
                    compressed++;
                }
            }
        });
        
        if (compressed > 0) {
            console.log(`Memory: Compressed ${compressed} old memories`);
        }
    }
    
    generateId() {
        return 'mem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    exportMemories() {
        const exportData = {
            timestamp: Date.now(),
            version: '1.0',
            memories: this.memories.map(memory => ({
                id: memory.id,
                timestamp: memory.timestamp,
                type: memory.type,
                priority: memory.priority,
                compressed: memory.compressed || false
            }))
        };
        
        console.log('Memory: Export data prepared', exportData);
        return exportData;
    }
}

class QuantumSimulator {
    constructor() {
        this.quantumState = {
            entanglement: 0.5,
            coherence: 1.0,
            superposition: 0.8,
            fieldStrength: 0.7
        };
        this.isActive = true;
    }
    
    updateQuantumField(deltaTime) {
        if (!this.isActive) return;
        
        // Simulate quantum field fluctuations
        this.quantumState.entanglement += (Math.random() - 0.5) * 0.01;
        this.quantumState.coherence -= 0.001; // Natural decoherence
        this.quantumState.superposition += Math.sin(Date.now() * 0.001) * 0.01;
        
        // Keep values in valid ranges
        this.quantumState.entanglement = Math.max(0, Math.min(1, this.quantumState.entanglement));
        this.quantumState.coherence = Math.max(0.1, Math.min(1, this.quantumState.coherence));
        this.quantumState.superposition = Math.max(0, Math.min(1, this.quantumState.superposition));
        
        // Calculate field strength based on other parameters
        this.quantumState.fieldStrength = (
            this.quantumState.entanglement * 0.4 +
            this.quantumState.coherence * 0.3 +
            this.quantumState.superposition * 0.3
        );
    }
    
    getQuantumState() {
        return { ...this.quantumState };
    }
    
    performQuantumMeasurement() {
        // Simulate quantum measurement collapse
        const measurement = {
            timestamp: Date.now(),
            entanglement: this.quantumState.entanglement,
            coherence: this.quantumState.coherence,
            collapsed: Math.random() < 0.5
        };
        
        if (measurement.collapsed) {
            this.quantumState.superposition *= 0.5; // Partial collapse
        }
        
        console.log('Quantum: Measurement performed', measurement);
        return measurement;
    }
    
    toggle() {
        this.isActive = !this.isActive;
        console.log(`Quantum Simulator: ${this.isActive ? 'activated' : 'deactivated'}`);
    }
}

// Global instances
let securityManager = null;
let performanceMonitor = null;
let communicationManager = null;
let memoryManager = null;
let quantumSimulator = null;

// Initialize enhanced features
function initializeEnhancedFeatures() {
    securityManager = new SecurityManager();
    performanceMonitor = new PerformanceMonitor();
    communicationManager = new CommunicationManager();
    memoryManager = new MemoryManager();
    quantumSimulator = new QuantumSimulator();
    
    // Try to connect to command center
    communicationManager.connectToCommandCenter();
    
    console.log('Enhanced Features: All systems initialized');
}

// Enhanced PIN verification
function enhancedVerifyPin(pin) {
    if (!securityManager) {
        initializeEnhancedFeatures();
    }
    
    return securityManager.validatePin(pin);
}

// Performance monitoring update
function updatePerformance() {
    if (performanceMonitor) {
        performanceMonitor.update();
    }
}

// Quantum field update
function updateQuantumSimulation(deltaTime) {
    if (quantumSimulator) {
        quantumSimulator.updateQuantumField(deltaTime);
    }
}

// Memory storage interface
function storeEnhancedMemory(data) {
    if (memoryManager) {
        return memoryManager.storeMemory(data);
    }
    return null;
}

// Export functionality
function exportSystemData() {
    const systemData = {
        timestamp: Date.now(),
        performance: performanceMonitor ? {
            fps: performanceMonitor.fps,
            memory: performanceMonitor.memory,
            objects: performanceMonitor.objects
        } : null,
        quantum: quantumSimulator ? quantumSimulator.getQuantumState() : null,
        memories: memoryManager ? memoryManager.exportMemories() : null
    };
    
    console.log('System: Export data prepared', systemData);
    return systemData;
}

// Initialize when script loads
if (typeof window !== 'undefined') {
    window.addEventListener('load', initializeEnhancedFeatures);
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SecurityManager,
        PerformanceMonitor,
        CommunicationManager,
        MemoryManager,
        QuantumSimulator,
        enhancedVerifyPin,
        updatePerformance,
        updateQuantumSimulation,
        storeEnhancedMemory,
        exportSystemData
    };
}
