// Typing Speed Test Application
class TypingSpeedTest {
    constructor() {
        this.testDuration = 60; // 1 minute in seconds
        this.timeLeft = this.testDuration;
        this.isTestActive = false;
        this.startTime = null;
        this.timer = null;
        this.currentText = '';
        this.originalText = '';
        this.wordsTyped = 0;
        this.charactersTyped = 0;
        this.errors = 0;
        
        // Sample texts for the typing test
        this.texts = [
            "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once. Pangrams are often used to display font samples and test keyboards.",
            "Programming is the art of telling another human being what one wants the computer to do. It requires logical thinking, problem-solving skills, and attention to detail.",
            "Success is not final, failure is not fatal: it is the courage to continue that counts. Every great achievement begins with the decision to try and the determination to persevere.",
            "Technology is best when it brings people together. Innovation distinguishes between a leader and a follower. The future belongs to those who believe in the beauty of their dreams.",
            "Learning is a treasure that will follow its owner everywhere. Knowledge is power, and education is the key to unlocking that power. Never stop learning, for life never stops teaching.",
            "Creativity is intelligence having fun. Imagination is more important than knowledge. The only way to do great work is to love what you do and believe in what you're creating.",
            "Time is the most valuable coin in your life. You and you alone will determine how that coin will be spent. Be careful that you do not let other people spend it for you.",
            "Happiness is not something ready-made. It comes from your own actions and choices. The purpose of our lives is to be happy and to help others find happiness as well."
        ];
        
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
        this.initializeNavigation();
    }
    
    initializeElements() {
        // Get DOM elements
        this.elements = {
            timer: document.getElementById('timer'),
            wpm: document.getElementById('wpm'),
            accuracy: document.getElementById('accuracy'),
            characters: document.getElementById('characters'),
            textDisplay: document.getElementById('textDisplay'),
            typingInput: document.getElementById('typingInput'),
            startBtn: document.getElementById('startBtn'),
            resetBtn: document.getElementById('resetBtn'),
            resultsSection: document.getElementById('resultsSection'),
            finalWpm: document.getElementById('finalWpm'),
            finalAccuracy: document.getElementById('finalAccuracy'),
            finalWords: document.getElementById('finalWords'),
            finalCharacters: document.getElementById('finalCharacters'),
            newTestBtn: document.getElementById('newTestBtn')
        };
    }
    
    bindEvents() {
        // Button event listeners
        this.elements.startBtn.addEventListener('click', () => this.startTest());
        this.elements.resetBtn.addEventListener('click', () => this.resetTest());
        this.elements.newTestBtn.addEventListener('click', () => this.newTest());
        
        // Typing input event listeners
        this.elements.typingInput.addEventListener('input', (e) => this.handleTyping(e));
        this.elements.typingInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Prevent form submission on Enter key
        this.elements.typingInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });
    }
    
    initializeNavigation() {
        // Mobile navigation toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                
                // Animate hamburger menu
                const bars = navToggle.querySelectorAll('.bar');
                bars.forEach((bar, index) => {
                    if (navMenu.classList.contains('active')) {
                        if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
                        if (index === 1) bar.style.opacity = '0';
                        if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                    } else {
                        bar.style.transform = 'none';
                        bar.style.opacity = '1';
                    }
                });
            });
        }
        
        // Smooth scrolling for navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Close mobile menu if open
                    if (navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        const bars = navToggle.querySelectorAll('.bar');
                        bars.forEach(bar => {
                            bar.style.transform = 'none';
                            bar.style.opacity = '1';
                        });
                    }
                    
                    // Smooth scroll to target
                    const headerOffset = 80; // Account for fixed navbar
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                const bars = navToggle.querySelectorAll('.bar');
                bars.forEach(bar => {
                    bar.style.transform = 'none';
                    bar.style.opacity = '1';
                });
            }
        });
        
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(15, 15, 35, 0.98)';
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            } else {
                navbar.style.background = 'rgba(15, 15, 35, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });
    }
    
    startTest() {
        if (this.isTestActive) return;
        
        this.isTestActive = true;
        this.startTime = Date.now();
        this.timeLeft = this.testDuration;
        this.wordsTyped = 0;
        this.charactersTyped = 0;
        this.errors = 0;
        
        // Select random text
        this.originalText = this.texts[Math.floor(Math.random() * this.texts.length)];
        this.currentText = this.originalText;
        
        // Update UI
        this.elements.textDisplay.textContent = this.originalText;
        this.elements.typingInput.value = '';
        this.elements.typingInput.disabled = false;
        this.elements.typingInput.focus();
        
        // Update buttons
        this.elements.startBtn.disabled = true;
        this.elements.resetBtn.disabled = false;
        
        // Hide results
        this.elements.resultsSection.style.display = 'none';
        
        // Start timer
        this.startTimer();
        
        // Add typing active class
        this.elements.typingInput.classList.add('typing-active');
        
        // Animate start
        this.animateElement(this.elements.textDisplay, 'fade-in');
    }
    
    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.endTest();
            }
        }, 1000);
    }
    
    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        this.elements.timer.textContent = timeString;
        
        // Add warning colors for low time
        this.elements.timer.classList.remove('timer-warning', 'timer-danger');
        if (this.timeLeft <= 10) {
            this.elements.timer.classList.add('timer-danger');
        } else if (this.timeLeft <= 20) {
            this.elements.timer.classList.add('timer-warning');
        }
    }
    
    handleTyping(e) {
        if (!this.isTestActive) return;
        
        const inputValue = e.target.value;
        this.charactersTyped = inputValue.length;
        
        // Calculate words typed (simple word count)
        this.wordsTyped = inputValue.trim().split(/\s+/).filter(word => word.length > 0).length;
        
        // Calculate accuracy
        this.calculateAccuracy(inputValue);
        
        // Calculate and update WPM
        this.updateWPM();
        
        // Update display
        this.updateDisplay();
        
        // Check if user has typed the entire text
        if (inputValue.length >= this.originalText.length) {
            this.endTest();
        }
    }
    
    handleKeyDown(e) {
        if (!this.isTestActive) return;
        
        // Prevent backspace if test hasn't started
        if (e.key === 'Backspace' && this.elements.typingInput.value.length === 0) {
            e.preventDefault();
        }
    }
    
    calculateAccuracy(inputValue) {
        let correctChars = 0;
        const maxLength = Math.min(inputValue.length, this.originalText.length);
        
        for (let i = 0; i < maxLength; i++) {
            if (inputValue[i] === this.originalText[i]) {
                correctChars++;
            }
        }
        
        this.errors = maxLength - correctChars;
    }
    
    updateWPM() {
        if (!this.startTime) return;
        
        const timeElapsed = (Date.now() - this.startTime) / 1000 / 60; // in minutes
        const wpm = timeElapsed > 0 ? Math.round(this.wordsTyped / timeElapsed) : 0;
        
        this.elements.wpm.textContent = wpm;
    }
    
    updateDisplay() {
        // Update character count
        this.elements.characters.textContent = this.charactersTyped;
        
        // Update accuracy
        const accuracy = this.charactersTyped > 0 ? 
            Math.round(((this.charactersTyped - this.errors) / this.charactersTyped) * 100) : 100;
        this.elements.accuracy.textContent = `${accuracy}%`;
    }
    
    endTest() {
        this.isTestActive = false;
        clearInterval(this.timer);
        
        // Disable input
        this.elements.typingInput.disabled = true;
        this.elements.typingInput.classList.remove('typing-active');
        
        // Calculate final results
        const finalWpm = this.elements.wpm.textContent;
        const finalAccuracy = this.elements.accuracy.textContent;
        const finalWords = this.wordsTyped;
        const finalCharacters = this.charactersTyped;
        
        // Update final results display
        this.elements.finalWpm.textContent = finalWpm;
        this.elements.finalAccuracy.textContent = finalAccuracy;
        this.elements.finalWords.textContent = finalWords;
        this.elements.finalCharacters.textContent = finalCharacters;
        
        // Show results
        this.elements.resultsSection.style.display = 'block';
        this.animateElement(this.elements.resultsSection, 'slide-up');
        
        // Update buttons
        this.elements.startBtn.disabled = false;
        this.elements.resetBtn.disabled = true;
        
        // Play completion sound or show celebration
        this.celebrateCompletion();
    }
    
    resetTest() {
        this.isTestActive = false;
        clearInterval(this.timer);
        
        // Reset variables
        this.timeLeft = this.testDuration;
        this.wordsTyped = 0;
        this.charactersTyped = 0;
        this.errors = 0;
        this.startTime = null;
        
        // Reset UI
        this.elements.textDisplay.textContent = 'Click "Start Test" to begin your typing challenge!';
        this.elements.typingInput.value = '';
        this.elements.typingInput.disabled = true;
        this.elements.typingInput.classList.remove('typing-active');
        
        // Reset buttons
        this.elements.startBtn.disabled = false;
        this.elements.resetBtn.disabled = true;
        
        // Hide results
        this.elements.resultsSection.style.display = 'none';
        
        // Reset display
        this.updateDisplay();
        this.elements.timer.textContent = '60s';
        this.elements.timer.classList.remove('timer-warning', 'timer-danger');
    }
    
    newTest() {
        this.resetTest();
        this.startTest();
    }
    
    updateDisplay() {
        this.elements.characters.textContent = this.charactersTyped;
        
        const accuracy = this.charactersTyped > 0 ? 
            Math.round(((this.charactersTyped - this.errors) / this.charactersTyped) * 100) : 100;
        this.elements.accuracy.textContent = `${accuracy}%`;
    }
    
    animateElement(element, className) {
        element.classList.add(className);
        setTimeout(() => {
            element.classList.remove(className);
        }, 1000);
    }
    
    celebrateCompletion() {
        // Add a subtle celebration effect
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        
        // Create some confetti particles
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    background: ${['#ff6a3e', '#ffba43', '#4ade80', '#f87171'][Math.floor(Math.random() * 4)]};
                    border-radius: 50%;
                    left: ${Math.random() * 100}%;
                    top: -10px;
                    animation: fall 3s linear forwards;
                `;
                
                confetti.appendChild(particle);
                
                // Remove particle after animation
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 3000);
            }, i * 100);
        }
        
        document.body.appendChild(confetti);
        
        // Add fall animation
        if (!document.querySelector('#confetti-styles')) {
            const style = document.createElement('style');
            style.id = 'confetti-styles';
            style.textContent = `
                @keyframes fall {
                    to {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remove confetti container after animation
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 4000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TypingSpeedTest();
});

// Add some additional utility functions
function addKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to start test
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            const startBtn = document.getElementById('startBtn');
            if (!startBtn.disabled) {
                startBtn.click();
            }
        }
        
        // Escape to reset test
        if (e.key === 'Escape') {
            const resetBtn = document.getElementById('resetBtn');
            if (!resetBtn.disabled) {
                resetBtn.click();
            }
        }
    });
}

// Initialize keyboard shortcuts
addKeyboardShortcuts();
