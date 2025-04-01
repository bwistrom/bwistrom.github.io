// Window Controls Module - Extends current functionality without modifying existing code
class WindowControls {
    constructor() {
        this.waitForWorkspace();
    }

    waitForWorkspace() {
        // Wait for the workspace to be available
        const checkWorkspace = () => {
            if (window.workspace) {
                this.initializeWindowButton();
            } else {
                setTimeout(checkWorkspace, 100);
            }
        };
        checkWorkspace();
    }

    initializeWindowButton() {
        const addWindowButton = document.querySelector('.add-window');
        if (!addWindowButton) return;

        // Add click event listener
        addWindowButton.addEventListener('click', () => this.addWindows());
    }

    addWindows() {
        if (!window.workspace || !window.workspace.scene) return;

        // Create first window
        const window1 = this.createWindow();
        window1.position.set(-2, 0, 0); // Position to the left
        window.workspace.scene.add(window1);

        // Create second window
        const window2 = this.createWindow();
        window2.position.set(2, 0, 0); // Position to the right
        window.workspace.scene.add(window2);

        // Add glow effect to both windows
        this.addWindowGlow(window1);
        this.addWindowGlow(window2);
    }

    createWindow() {
        // Create window frame
        const frameGeometry = new THREE.BoxGeometry(2, 3, 0.1);
        const frameMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ffc8,
            transparent: true,
            opacity: 0.8,
            shininess: 100
        });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);

        // Create window glass
        const glassGeometry = new THREE.PlaneGeometry(1.8, 2.8);
        const glassMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3,
            shininess: 200
        });
        const glass = new THREE.Mesh(glassGeometry, glassMaterial);
        glass.position.z = 0.05; // Slightly in front of frame

        // Add glass to frame
        frame.add(glass);

        // Add window details
        const detailsGeometry = new THREE.BoxGeometry(0.1, 2.8, 0.1);
        const detailsMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ffc8,
            transparent: true,
            opacity: 0.6
        });
        const details = new THREE.Mesh(detailsGeometry, detailsMaterial);
        details.position.x = 0.9; // Position to the right
        frame.add(details);

        // Add window sill
        const sillGeometry = new THREE.BoxGeometry(2.2, 0.2, 0.5);
        const sillMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ffc8,
            transparent: true,
            opacity: 0.7
        });
        const sill = new THREE.Mesh(sillGeometry, sillMaterial);
        sill.position.y = -1.5;
        sill.position.z = -0.2;
        frame.add(sill);

        return frame;
    }

    addWindowGlow(window) {
        // Create glow effect
        const glowGeometry = new THREE.BoxGeometry(2.2, 3.2, 0.2);
        const glowMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ffc8,
            transparent: true,
            opacity: 0.1,
            shininess: 50
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        window.add(glow);

        // Add pulsing animation
        const pulseAnimation = () => {
            const time = Date.now() * 0.001;
            glowMaterial.opacity = 0.1 + Math.sin(time * 2) * 0.05;
            requestAnimationFrame(pulseAnimation);
        };
        pulseAnimation();
    }
}

// Initialize window controls when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.windowControls = new WindowControls();
}); 