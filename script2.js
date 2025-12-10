class SimpleColorGuesser {
    constructor() {
        this.colors = [
            { name: 'Red', value: '#FF0000' },
            { name: 'Blue', value: '#0000FF' },
            { name: 'Green', value: '#00FF00' },
            { name: 'Yellow', value: '#FFFF00' },
            { name: 'Purple', value: '#800080' },
            { name: 'Orange', value: '#FFA500' },
            { name: 'Pink', value: '#FFC0CB' },
            { name: 'Brown', value: '#A52A2A' },
            { name: 'Black', value: '#000000' },
            { name: 'White', value: '#FFFFFF' },
            { name: 'Gray', value: '#808080' },
            { name: 'Cyan', value: '#00FFFF' }
        ];
        
        this.score = 0;
        this.currentColor = null;
        this.options = [];
        
        this.initializeGame();
        this.nextColor();
    }

    initializeGame() {
        this.colorBox = document.getElementById('color-box');
        this.optionsContainer = document.getElementById('options');
        this.scoreElement = document.getElementById('score');
        this.feedbackElement = document.getElementById('feedback');
        this.nextButton = document.getElementById('next-btn');
        
        this.nextButton.addEventListener('click', () => this.nextColor());
    }

    getRandomColors(count) {
        const shuffled = [...this.colors].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    nextColor() {
        // Get 4 random colors
        this.options = this.getRandomColors(4);
        this.currentColor = this.options[Math.floor(Math.random() * 4)];
        
        this.displayColor();
        this.displayOptions();
        this.clearFeedback();
        
        this.nextButton.disabled = true;
    }

    displayColor() {
        this.colorBox.style.backgroundColor = this.currentColor.value;
    }

    displayOptions() {
        this.optionsContainer.innerHTML = '';
        
        this.options.forEach(color => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = color.name;
            button.addEventListener('click', () => this.checkAnswer(color.name));
            this.optionsContainer.appendChild(button);
        });
    }

    checkAnswer(selectedName) {
        const isCorrect = selectedName === this.currentColor.name;
        
        // Disable all buttons
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = true;
        });

        // Show correct/wrong styling
        document.querySelectorAll('.option-btn').forEach(btn => {
            if (btn.textContent === this.currentColor.name) {
                btn.classList.add('correct');
            } else if (btn.textContent === selectedName && !isCorrect) {
                btn.classList.add('wrong');
            }
        });

        if (isCorrect) {
            this.score++;
            this.scoreElement.textContent = this.score;
            this.feedbackElement.textContent = '✅ Correct!';
            this.feedbackElement.className = 'feedback correct';
        } else {
            this.feedbackElement.textContent = `❌ Wrong! It was ${this.currentColor.name}`;
            this.feedbackElement.className = 'feedback wrong';
        }

        this.nextButton.disabled = false;
    }

    clearFeedback() {
        this.feedbackElement.textContent = '';
        this.feedbackElement.className = 'feedback';
    }
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SimpleColorGuesser();
});