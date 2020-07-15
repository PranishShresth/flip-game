window.onload = () => {
  //init the game

  //class Storage

  const hud = document.querySelector(".hud");
  const btns = document.querySelectorAll(".button");
  const container = document.querySelector(".game-container");

  btns.forEach((btn) => {
    btn.addEventListener("click", function () {
      hud.style.display = "none";
      var mode = this.getAttribute("data-mode");
      if (mode === "LOW") {
        init(LOW);
      } else {
        init(HARD);
        container.style.gridTemplateColumns = "repeat(6, 1fr)";
      }
    });
  });
};

class Storage {
  constructor(score) {
    this.storage = window.localStorage;
    this.currentScore = score;
    this.score = this.storage.getItem("score") || 0;
    this.timer = this.storage.getItem("timer") || 0;
    this.moves = this.storage.getItem("moves") || 0;
  }

  saveScore() {
    this.storage.setItem("score", this.currentScore.score);
    this.storage.setItem("moves", this.currentScore.moves);
    this.storage.setItem("timer", this.currentScore.timer);
  }
}
//ScoreManager class to keep track of score
class ScoreManager {
  constructor() {
    this.score = 0;
    this.timer = 0;
    this.moves = 0;
  }
  updateScore() {
    this.score = 100 + this.score + this.moves;
  }

  startTimer() {
    setInterval(() => {
      this.timer++;
    }, 1000);
  }

  updateMoves() {
    this.moves++;
  }
  resetGame() {
    this.score = 0;
    this.moves = 0;
    this.timer = 0;
  }
}
function init(difficulty) {
  //create a grid
  const container = document.querySelector(".game-container");
  var scoreManager = new ScoreManager();
  var storage = new Storage(scoreManager);

  //current game
  var score = document.querySelector(".score");
  var timer = document.querySelector(".timer");
  var moves = document.querySelector(".moves");

  //high score
  var highScore = document.querySelector(".high-score");
  var highTimer = document.querySelector(".timer-score");
  var leastMoves = document.querySelector(".least-moves");

  highScore.textContent = storage.score;
  highTimer.textContent = storage.timer;
  leastMoves.textContent = storage.moves;

  var mode = difficulty;
  var card1, card2;
  var matched = [];
  var cardflipped = false;
  var matchedCards = 0;
  var shuffledarray = randomArrayShuffle(mode);

  var cards = "";

  for (var i = 0; i < 2; i++) {
    for (var j in shuffledarray) {
      cards += ` <div class="card" >
      <div class="card-inner" data-type='${shuffledarray[j].type}'>
        <div class="front-card"></div>
        <div class="back-card">
          <img src='${shuffledarray[j].image}' alt= '${shuffledarray[j].type}' />
        </div>
      </div>
    </div>`;
    }
  }
  container.innerHTML = cards;
  //initialize the timer
  scoreManager.startTimer();

  //poll every 1 second
  var interval = function updateMetrics() {
    score.textContent = scoreManager.score;
    moves.textContent = scoreManager.moves;
    timer.textContent = scoreManager.timer;
  };

  setInterval(interval, 1000);

  function gameWon() {
    if (matchedCards === mode.length) {
      clearInterval(interval);
      scoreManager.resetGame();
    }
  }
  //check if card is already flipped and matched

  function canFlip(card) {
    if (!matched.includes(card)) {
      return true;
    }
    return false;
  }

  //get card data
  function getCardType(card) {
    return card.getAttribute("data-type");
  }

  //check card if they are matching

  function matchCards(card1, card2) {
    if (getCardType(card1) == getCardType(card2)) {
      scoreManager.updateScore();
      scoreManager.updateMoves();
      matchedCards++;
      matched.push(card1, card2);
    } else {
      scoreManager.updateMoves();

      setTimeout(() => {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
      }, 800);
    }
  }

  function flipCard() {
    if (this === card1) return;
    if (canFlip(this)) {
      this.classList.add("flipped");
      if (!cardflipped) {
        cardflipped = true;
        card1 = this;
        return;
      }
      card2 = this;
      cardflipped = false;
      matchCards(card1, card2);
      if (matchedCards === mode.length) {
        storage.saveScore();
        gameWon();
      }
    }
  }
  function toggleFlip() {
    const cards = document.querySelectorAll(".card-inner");
    cards.forEach((card) => {
      card.addEventListener("click", flipCard);
    });
  }

  toggleFlip();
}

//shuffling algorith
function randomArrayShuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
