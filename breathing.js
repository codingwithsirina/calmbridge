class BreathingTimer {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentPhase = 0;
        this.cycleCount = 0;
        this.totalSeconds = 0;
        this.interval = null;
        
        this.patterns = {
            '4-4-4-4': [4, 4, 4, 4], // Inhale, Hold, Exhale, Hold
            '4-7-8': [4, 7, 8, 0],   // Inhale, Hold, Exhale
            '5-5': [5, 0, 5, 0],     // Inhale, Exhale
            '3-3-6-3': [3, 3, 6, 3]  // Inhale, Hold, Exhale, Hold
        };
        
        this.phases = ['breathing-in', 'holding', 'breathing-out', 'holding'];
        this.instructions = ['Breathe IN', 'HOLD', 'Breathe OUT', 'HOLD'];
        
        this.initializeElements();
    }

    initializeElements() {
        this.breathingCircle = document.getElementById('breathing-circle');
        this.instructionElement = document.getElementById('instruction');
        this.timerElement = document.getElementById('timer');
        this.cycleCountElement = document.getElementById('cycle-count');
        this.totalTimeElement = document.getElementById('total-time');
        
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.patternSelect = document.getElementById('pattern-select');
        
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
    }

    getCurrentPattern() {
        const patternKey = this.patternSelect.value;
        return this.patterns[patternKey];
    }

    start() {
        if (this.isRunning && !this.isPaused) return;
        
        this.isRunning = true;
        this.isPaused = false;
        
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.patternSelect.disabled = true;
        
        if (this.isPaused) {
            this.isPaused = false;
        } else {
            this.currentPhase = 0;
            this.cycleCount = 0;
            this.totalSeconds = 0;
            this.updateCycleCount();
        }
        
        this.runBreathingCycle();
        this.startTotalTimer();
    }

    pause() {
        this.isPaused = true;
        this.isRunning = false;
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.startBtn.textContent = 'Resume';
        
        clearInterval(this.interval);
        this.breathingCircle.className = 'breathing-circle';
        this.instructionElement.textContent = 'Paused';
        this.timerElement.textContent = '–';
    }

    reset() {
        this.isRunning = false;
        this.isPaused = false;
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.patternSelect.disabled = false;
        this.startBtn.textContent = 'Start Breathing';
        
        clearInterval(this.interval);
        
        this.breathingCircle.className = 'breathing-circle';
        this.instructionElement.textContent = 'Breathe In';
        this.timerElement.textContent = '4';
        this.cycleCount = 0;
        this.totalSeconds = 0;
        
        this.updateCycleCount();
        this.updateTotalTime();
    }

    runBreathingCycle() {
        const pattern = this.getCurrentPattern();
        const phaseTime = pattern[this.currentPhase];
        
        if (phaseTime === 0) {
            this.nextPhase();
            return;
        }
        
        let timeLeft = phaseTime;
        
        // Update circle and instruction
        this.breathingCircle.className = `breathing-circle ${this.phases[this.currentPhase]}`;
        this.instructionElement.textContent = this.instructions[this.currentPhase];
        this.timerElement.textContent = timeLeft;
        
        const countdown = setInterval(() => {
            timeLeft--;
            this.timerElement.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(countdown);
                this.nextPhase();
            }
        }, 1000);
    }

    nextPhase() {
        this.currentPhase++;
        const pattern = this.getCurrentPattern();
        
        if (this.currentPhase >= pattern.length) {
            this.currentPhase = 0;
            this.cycleCount++;
            this.updateCycleCount();
        }
        
        if (this.isRunning && !this.isPaused) {
            this.runBreathingCycle();
        }
    }

    startTotalTimer() {
        this.interval = setInterval(() => {
            this.totalSeconds++;
            this.updateTotalTime();
        }, 1000);
    }

    updateCycleCount() {
        this.cycleCountElement.textContent = this.cycleCount;
    }

    updateTotalTime() {
        const minutes = Math.floor(this.totalSeconds / 60);
        const seconds = this.totalSeconds % 60;
        this.totalTimeElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Start the breathing timer when page loads
document.addEventListener('DOMContentLoaded', () => {
    new BreathingTimer();
});