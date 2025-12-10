class MemoryGame {
    constructor() {
        this.cards = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
        this.gameBoard = document.getElementById('game-board');
        this.movesCount = document.getElementById('moves-count');
        this.timerDisplay = document.getElementById('timer');
        this.resetBtn = document.getElementById('reset-btn');
        this.message = document.getElementById('message');
        
        this.moves = 0;
        this.time = 0;
        this.timer = null;
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.gameStarted = false;
        
        this.init();
    }

    init() {
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.createCards();
    }

    createCards() {
        const gameCards = [...this.cards, ...this.cards];
        this.shuffleArray(gameCards);
        
        this.gameBoard.innerHTML = '';
        gameCards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.emoji = emoji;
            card.dataset.index = index;
            card.innerHTML = `<span style="display: none;">${emoji}</span>`;
            card.addEventListener('click', () => this.flipCard(card));
            this.gameBoard.appendChild(card);
        });
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    flipCard(card) {
        if (card.classList.contains('matched') || 
            card.classList.contains('flipped') || 
            this.flippedCards.length === 2) {
            return;
        }

        if (!this.gameStarted) {
            this.startGame();
        }

        card.classList.add('flipped');
        card.querySelector('span').style.display = 'block';
        this.flippedCards.push(card);

        if (this.flippedCards.length === 2) {
            this.moves++;
            this.movesCount.textContent = this.moves;
            this.checkMatch();
        }
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const isMatch = card1.dataset.emoji === card2.dataset.emoji;

        if (isMatch) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            this.matchedPairs++;
            this.flippedCards = [];

            if (this.matchedPairs === this.cards.length) {
                this.endGame();
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                card1.querySelector('span').style.display = 'none';
                card2.querySelector('span').style.display = 'none';
                this.flippedCards = [];
            }, 1000);
        }
    }

    startGame() {
        this.gameStarted = true;
        this.timer = setInterval(() => {
            this.time++;
            this.timerDisplay.textContent = this.time;
        }, 1000);
    }

    endGame() {
        clearInterval(this.timer);
        this.message.textContent = `Congratulations! You won in ${this.moves} moves and ${this.time} seconds!`;
        this.message.className = 'message success';
    }

    resetGame() {
        clearInterval(this.timer);
        this.moves = 0;
        this.time = 0;
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.gameStarted = false;
        
        this.movesCount.textContent = '0';
        this.timerDisplay.textContent = '0';
        this.message.className = 'message';
        
        this.createCards();
    }
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});