// Enhanced Lucky Clover Feature
class LuckyClover {
    constructor() {
        this.clover = document.querySelector('.lucky-clover');
        this.message = document.querySelector('.lucky-message');
        this.luckyMessages = [
            "That will be 4 dollars please.",
            "Good luck! 🍀",
            "Fortune smiles upon you! ✨",
            "Lucky day ahead! 🌟",
            "Magic is in the air! ✨",
            "Wish granted! 🎉",
            "Lucky charm activated! 💫",
            "Good fortune awaits! 🌈",
            "Lucky streak continues! 🔥",
            "Fortune favors the bold! ⚡"
        ];
        this.currentMessageIndex = 0;
        this.isAnimating = false;
        this.particles = [];
        this.lastClickTime = 0;
        this.clickCooldown = 1000; // 1 second cooldown between clicks
        
        // Create audio context for sound effects
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        this.setupEventListeners();
        this.createParticleSystem();
        this.initializeSoundEffects();
    }

    setupEventListeners() {
        this.clover.addEventListener('click', (e) => this.handleClick(e));
        this.clover.addEventListener('mouseover', () => this.handleHover());
        this.clover.addEventListener('mouseout', () => this.handleMouseOut());
    }

    handleClick(e) {
        const currentTime = Date.now();
        if (currentTime - this.lastClickTime < this.clickCooldown) return;
        
        this.lastClickTime = currentTime;
        this.showMessage();
        this.createClickEffect(e);
        this.playSoundEffect();
        this.rotateClover();
    }

    handleHover() {
        if (!this.isAnimating) {
            this.clover.style.transform = 'scale(1.2)';
            this.createHoverEffect();
        }
    }

    handleMouseOut() {
        this.clover.style.transform = 'scale(1)';
    }

    showMessage() {
        // Cycle through messages
        this.currentMessageIndex = (this.currentMessageIndex + 1) % this.luckyMessages.length;
        this.message.textContent = this.luckyMessages[this.currentMessageIndex];
        
        // Add message animation
        this.message.style.transform = 'translate(-50%, -50%) scale(0.8)';
        this.message.classList.add('visible');
        
        // Animate message appearance
        requestAnimationFrame(() => {
            this.message.style.transform = 'translate(-50%, -50%) scale(1)';
        });

        // Hide message after delay
        setTimeout(() => {
            this.message.style.transform = 'translate(-50%, -50%) scale(0.8)';
            setTimeout(() => {
                this.message.classList.remove('visible');
            }, 300);
        }, 3000);
    }

    createClickEffect(e) {
        const rect = this.clover.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'lucky-ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        this.clover.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => ripple.remove(), 1000);
    }

    createHoverEffect() {
        const glow = document.createElement('div');
        glow.className = 'lucky-glow';
        this.clover.appendChild(glow);
        
        setTimeout(() => glow.remove(), 500);
    }

    rotateClover() {
        this.isAnimating = true;
        this.clover.style.transform = 'rotate(360deg)';
        
        setTimeout(() => {
            this.clover.style.transform = 'rotate(0deg)';
            this.isAnimating = false;
        }, 500);
    }

    createParticleSystem() {
        const canvas = document.createElement('canvas');
        canvas.className = 'lucky-particles';
        document.body.appendChild(canvas);
        this.particleCanvas = canvas;
        this.particleCtx = canvas.getContext('2d');
        
        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.particleCanvas.width = window.innerWidth;
        this.particleCanvas.height = window.innerHeight;
    }

    createParticles(x, y) {
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 1,
                color: `hsl(${Math.random() * 60 + 120}, 100%, 50%)`
            });
        }
        this.animateParticles();
    }

    animateParticles() {
        this.particleCtx.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);
        
        this.particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.02;
            
            if (particle.life <= 0) {
                this.particles.splice(index, 1);
            } else {
                this.particleCtx.beginPath();
                this.particleCtx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
                this.particleCtx.fillStyle = particle.color;
                this.particleCtx.globalAlpha = particle.life;
                this.particleCtx.fill();
            }
        });
        
        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animateParticles());
        }
    }

    initializeSoundEffects() {
        // Create oscillator for sound effect
        this.oscillator = this.audioContext.createOscillator();
        this.gainNode = this.audioContext.createGain();
        
        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);
        
        this.oscillator.type = 'sine';
        this.oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
        this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    }

    playSoundEffect() {
        const now = this.audioContext.currentTime;
        
        // Play ascending sound
        this.oscillator.frequency.setValueAtTime(440, now);
        this.oscillator.frequency.linearRampToValueAtTime(880, now + 0.1);
        
        // Fade in and out
        this.gainNode.gain.setValueAtTime(0, now);
        this.gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
        this.gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
    }

    // Add styles dynamically
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .lucky-clover {
                position: fixed;
                top: 20px;
                left: 20px;
                z-index: 2;
                cursor: pointer;
                font-size: 24px;
                color: #00ffc8;
                text-shadow: 0 0 10px rgba(0, 255, 200, 0.5);
                transition: transform 0.3s ease;
                transform-origin: center;
            }

            .lucky-clover:hover {
                transform: scale(1.2);
            }

            .lucky-message {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.8);
                padding: 20px;
                border-radius: 10px;
                border: 1px solid #00ffc8;
                color: #00ffc8;
                font-size: 18px;
                z-index: 1000;
                opacity: 0;
                transition: all 0.3s ease;
                pointer-events: none;
                text-shadow: 0 0 5px rgba(0, 255, 200, 0.5);
            }

            .lucky-message.visible {
                opacity: 1;
            }

            .lucky-ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(0, 255, 200, 0.4);
                transform: scale(0);
                animation: ripple 1s linear;
                pointer-events: none;
            }

            .lucky-glow {
                position: absolute;
                top: -10px;
                left: -10px;
                right: -10px;
                bottom: -10px;
                background: radial-gradient(circle, rgba(0, 255, 200, 0.2) 0%, transparent 70%);
                border-radius: 50%;
                animation: glow 0.5s ease-out;
                pointer-events: none;
            }

            .lucky-particles {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
            }

            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }

            @keyframes glow {
                from {
                    transform: scale(0.5);
                    opacity: 0;
                }
                to {
                    transform: scale(1);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize lucky clover feature
const luckyClover = new LuckyClover();
luckyClover.addStyles(); 