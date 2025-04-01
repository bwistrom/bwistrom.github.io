// Button Controls Module - Extends current functionality without modifying existing code
class ButtonControls {
    constructor() {
        this.autorotateActive = false;
        this.autorotateSpeed = 0.005;
        this.waitForWorkspace();
    }

    waitForWorkspace() {
        // Wait for the workspace to be available
        const checkWorkspace = () => {
            if (window.workspace) {
                this.initializeButtons();
            } else {
                setTimeout(checkWorkspace, 100);
            }
        };
        checkWorkspace();
    }

    initializeButtons() {
        // Find the existing controls container
        const controlsContainer = document.querySelector('.controls');
        if (!controlsContainer) return;

        // Add autorotate button to existing controls
        const autorotateButton = this.createAutorotateButton();
        controlsContainer.appendChild(autorotateButton);

        // Apply modern styling to existing buttons
        this.modernizeExistingButtons();
    }

    createAutorotateButton() {
        const button = document.createElement('button');
        button.className = 'modern-button autorotate-button';
        button.innerHTML = '<span class="button-icon">🔄</span>Autorotate';
        
        // Add tooltip
        const tooltip = document.createElement('span');
        tooltip.className = 'modern-button-tooltip';
        tooltip.textContent = 'Toggle automatic rotation';
        button.appendChild(tooltip);

        button.addEventListener('click', () => this.toggleAutorotate(button));
        return button;
    }

    modernizeExistingButtons() {
        // Modernize only the buttons in the controls container
        const controlsContainer = document.querySelector('.controls');
        if (!controlsContainer) return;

        const buttons = controlsContainer.querySelectorAll('button');
        buttons.forEach(button => {
            if (!button.classList.contains('modern-button')) {
                button.classList.add('modern-button');
                
                // Add tooltips to existing buttons
                const tooltip = document.createElement('span');
                tooltip.className = 'modern-button-tooltip';
                tooltip.textContent = this.getTooltipText(button);
                button.appendChild(tooltip);
            }
        });
    }

    getTooltipText(button) {
        const buttonText = button.textContent.toLowerCase();
        
        if (buttonText.includes('reset')) return 'Reset camera position';
        if (buttonText.includes('autorotate')) return 'Toggle automatic rotation';
        if (buttonText.includes('zoom')) return 'Adjust zoom level';
        if (buttonText.includes('pan')) return 'Pan view';
        
        return 'Click to activate';
    }

    toggleAutorotate(button) {
        this.autorotateActive = !this.autorotateActive;
        button.classList.toggle('active');
        
        if (this.autorotateActive) {
            this.startAutorotate();
        } else {
            this.stopAutorotate();
        }
    }

    startAutorotate() {
        if (window.workspace && window.workspace.controls) {
            window.workspace.controls.autoRotate = true;
            window.workspace.controls.autoRotateSpeed = this.autorotateSpeed;
        }
    }

    stopAutorotate() {
        if (window.workspace && window.workspace.controls) {
            window.workspace.controls.autoRotate = false;
        }
    }
}

// Initialize button controls when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.buttonControls = new ButtonControls();
}); 