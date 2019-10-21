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
        this.timer = document.getElementById('timer')
        this.ticker = document.getElementById('flip-count');
        this.audioController = new AudioController();
    }
    
    startGame() {
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
        }, 500)
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
    }
    startCountdown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0)
                this.gameOver();
        }, 1000);
    }
    gameOver() {
        clearInterval(this.countdown);
        this.audioController.gameOver();
        document.getElementById('game-over').classList.add('visible');
    }
    victory() {
        clearInterval(this.countdown);
        this.audioController.victory();
        document.getElementById('you-won').classList.add('visible');
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
            
            if(this.cardToCheck) {
                this.checkForCardMatch(card);
            } else {
                this.cardToCheck = card;
            }
        }
    }
    checkForCardMatch(card) {
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else 
            this.cardMismatch(card, this.cardToCheck);

        this.cardToCheck = null;
    }
    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.match();
        if(this.matchedCards.length === this.cardsArray.length)
            this.victory();
    }
    cardMismatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }
     // Fisher-Yates Shuffle see README.md for reference details 
    shuffleCards(cardsArray) {
        for (let i = cardsArray.length - 1; i > 0; i--) {
            const randIndex = Math.floor(Math.random() * (i + 1));
            [cardsArray[i], cardsArray[randIndex]] = [cardsArray[randIndex], cardsArray[i]];
        }
        cardsArray = cardsArray.map((card, index) => {
            card.style.order = index;
        });
    }
    getCardType(card) {
        return card.getElementsByClassName('card-value')[0].src;
    }
    canFlipCard(card) {
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }
}

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    let overlays = Array.from(document.getElementsByClassName('start-prompt'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new MemoryMatch(60, cards);
    
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

