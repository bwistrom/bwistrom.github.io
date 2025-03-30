// Lucky Clover Feature
class LuckyClover {
    constructor() {
        this.clover = document.querySelector('.lucky-clover');
        this.message = document.querySelector('.lucky-message');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.clover.addEventListener('click', () => this.showMessage());
    }

    showMessage() {
        this.message.classList.add('visible');
        
        // Hide message after 3 seconds
        setTimeout(() => {
            this.message.classList.remove('visible');
        }, 3000);
    }
}

// Initialize lucky clover feature
const luckyClover = new LuckyClover(); 