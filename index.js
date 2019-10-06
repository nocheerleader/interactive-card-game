class AudioController {
    constructor() {
        this.music = new Audio('assets/audio/cartoon_music.mp3');
        this.flipAudio = new Audio('assets/audio/card_flip.wav');
        this.matchAudio = new Audio('assets/audio/card_match.mp3');
        this.winnerAudio = new Audio('assets/audio/winner.wav');
        this.gameOverAudio = new Audio('assets/audio/game_over.wav');
        this.music.volume = 0.3;
        this.music.loop = true;
    }
    startMusic() {
        this.music.play();
    }
    stopMusic() {
        this.music.pause();
        this.music.currentTime = 0;
    }
    flip() {
        this.flipAudio.play();
    }
    match() {
        this.matchAudio.play();
    }
    victory() {
        this.stopMusic();
        this.winnerAudio.play();
    }
    gameOver() {
        this.stopMusic();
        this.gameOverAudio.play();
    }
}

class MemoryMatch {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('timer');
        this.ticker = document.getElementById('flip-count');
        this.audioController = new AudioController();
    }
    
    startGame() {
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.cardToCheck = null;
        this.matchedCards = [];
        this.busy = true;
        setTimeout(() => {
            this.audioController.startMusic();
            this.shuffleCards(this.cardsArray);
            this.countdown = this.startCountdown();
            this.busy = false;
        }, 500);
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
    }
    
    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }
        
    flipCard(card) {
        if(this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');
        }
    }
    
    // Fisher-Yates Shuffle see README.md for reference details 
    shuffleCards(cardsArray) { 
        for (let i = cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i + 1));
            cardsArray[randIndex].style.order = i;
            cardsArray[i].style.order = randIndex;
        }
    }
    
    canFlipCard(card) {
        return true;
        //return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
        }
    }


if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

function ready() {
    let overlays = Array.from(document.getElementsByClassName('start-prompt'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new MemoryMatch(100, cards);
    
    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        });
    });

    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });
}

