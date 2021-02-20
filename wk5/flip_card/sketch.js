const DOWN = 'down';
const UP = 'up';
let startingX = 100;
let startingY = 100;
const cards = []; // create new array "cards"
const gameState = {
  totalPairs: 6,
  flippedCards: [],
  numMatched: 0,
  attempts: 0,
  waiting: false
};
let cardfaceArray = [];
let cardBack;

function preload () {
  cardBack = loadImage('images/cardback.png');
  cardfaceArray = [
    loadImage('images/impatiens.jpg'),
    loadImage('images/jonquil.jpg'),
    loadImage('images/orchid2.jpg'),
    loadImage('images/orange.jpg'),
    loadImage('images/peony.jpg'),
    loadImage('images/peacerose.jpg')
  ];
}

function setup () {
  createCanvas(1300, 1500);
  //background(0);
  let selectedFaces = [];
  for (let z = 0; z < 5; z++) {
    const randomIdx = floor(random(cardfaceArray.length));
    const face = cardfaceArray[randomIdx];
    selectedFaces.push(face);
    selectedFaces.push(face);
    // remove the used cardface so it doesn't get selected again
    cardfaceArray.splice(randomIdx, 1);
  }

  selectedFaces = shuffleArray(selectedFaces);
  // create a loop for rows
  for (let rows = 0; rows < 3; rows++) {
    // create a loop for columns
    for (let cols = 0; cols < 4; cols++) {
      const faceImage = selectedFaces.pop();
      // create new instance of card
      cards.push(new Card(startingX, startingY, faceImage));
      startingX += 225;
    }
    startingY += 325; // starting a new row
    startingX = 100; // starting at left hand side
  }
}

// I think "k" in this next function refers to the "Loop of All Cards", but I'm not sure?

function mousePressed () {
  if (gameState.waiting) {
    return;
  }
  for (let k = 0; k < cards.length; k++) {
    //console.log('gameState', gameState);
    // first check flipped cards length, and then
    // we can trigger the flip
    if (gameState.flippedCards.length < 2 && cards[k].didHit(mouseX, mouseY)) {
      console.log('flipped', cards[k]);
      gameState.flippedCards.push(cards[k]);
      // start at mark 4:22
    }
  }
  if (gameState.flippedCards.length === 2) {
    gameState.attempts++;
    if (gameState.flippedCards[0].cardFaceImg === gameState.flippedCards[1].cardFaceImg) {
      // mark cards as matched so they don't flip back
      gameState.flippedCards[0].isMatch = true;
      gameState.flippedCards[1].isMatch = true;
      // empty flipped cards array
      gameState.flippedCards.length = 0;
      // increment the score
      gameState.numMatched++;
      loop();
    } else {
      gameState.waiting = true;
      const loopTimeout = window.setTimeout(() => {
        loop();
        window.clearTimeout(loopTimeout);
      }, 1000)
      

    }
  }
}

// added parameters to constructor
class Card {
  constructor (x, y, cardFaceImg) {
    this.x = x;
    this.y = y;
    this.width = 200;
    this.height = 300;
    this.face = DOWN;
    this.cardFaceImg = cardFaceImg;
    this.isMatch = false;
    this.show();
  }

  show () {
    if (this.face === UP || this.isMatch) {
      fill('gray');
      rect(this.x, this.y, this.width, this.height, 10);
      image(this.cardFaceImg, this.x, this.y, 200, 300);
    } else {
      fill('aqua');
      rect(this.x, this.y, this.width, this.height, 10);
      image(cardBack, this.x, this.y, 200, 300);
    }
  }

  didHit (mouseX, mouseY) {
    if (mouseX >= this.x && mouseX <= this.x + this.width && mouseY >= this.y && mouseY <= this.y + this.height) {
      this.flip();
      return true;
    } else {
      return false;
    }
  }

  flip () {
    if (this.face === DOWN) {
      this.face = UP;
    } else {
      this.face = DOWN;
    }
    this.show();
  }
}

function draw () {
  background(0);
  if (gameState.numMatched === gameState.totalPairs) {
    fill('yellow');
    textSize(66);
    text('you win!!!!', 400, 1200);
    noLoop();
  }
  for (let k = 0; k < cards.length; k++) {
    if(!cards[k].isMatch) {
      cards[k].face = DOWN;
    }
    cards[k].show();
  }
  noLoop();
  gameState.waiting = false;
  fill(255);
  textSize(36);
  text('attempts ' + gameState.attempts, 100, 1100);
  text('matches ' + gameState.numMatched, 100, 1150);
}

function shuffleArray (array) {
  let counter = array.length;
  while (counter > 0) {
    // Pick randow index
    const idx = Math.floor(Math.random() * counter);
    // decrement counter by 1 (decrement)
    counter--;
    // swap the last element with it
    const temp = array[counter];
    array[counter] = array[idx];
    array[idx] = temp;
  }
  return array;
}
