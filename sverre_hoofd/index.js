let cards = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
let suits = ["♠", "♣", "♥", "♦"];
let suitNames = ['Spades', 'Clubs', 'Hearts', 'Diamonds']

let boardDiv = document.getElementById("board");
let boardHeight = boardDiv.offsetHeight;
let boardWidth = boardDiv.offsetWidth;

let cardTurned = '';
let textDiv = document.getElementById('do');
let opdrachten = [
  'Beurt volgorde draait om.',
  'Two for you',
  'Three for me',
  'Categorie',
  'Duim',
  'Drinking Buddy',
  'Truth',
  'Dare',
  'Push Ups',
  'Quiz Mastah',
  'Wijzen',
  'Would you rather',
  'Dansen',
]

function updateText() {
  textDiv.innerHTML = 
    `${cards[cardTurned.value]} ${suits[cardTurned.suit]}: `;
  textDiv.innerHTML += opdrachten[cardTurned.value];
}

class Card {
  constructor(row, col, rotation, suit, value) {
    this.row = row;
    this.col = col;
    this.rotation = rotation;
    this.suit = suit;
    this.value = value;
    this.cardName = `card${suitNames[this.suit]}${cards[this.value]}.png`;
    
    this.div = document.createElement("div");
    boardDiv.appendChild(this.div);
    this.div.className = "card";

    this.style();
    this.calcPos();

    this.flippable = true;
    this.flip();
    this.flippable = true;

    this.div.onclick = this.flipUpdate.bind(this)
  }

  calcPos() {
    this.div.style.width = `${boardWidth/17.5}px`;

    this.y = this.row * (this.div.offsetHeight + this.div.offsetHeight/10) - 5;
    this.x = this.col * (this.div.offsetWidth + this.div.offsetWidth/1.1) - 5;

    this.div.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`;
  }

  style() {
    this.div.style.width = `${boardWidth/17.5}px`;
    this.div.style.aspectRatio = '2/3';

    this.div.style.backgroundSize = `${this.div.offsetWidth}px ${this.div.offsetHeight}px`;

    this.flipped = true;
  }

  flip() {
    if (this.flippable) {
      if (this.flipped == true) {
        this.div.style.backgroundImage = "url(Cards/cardBack_blue5.png)";
        this.flipped = false;
      } else {
        this.div.style.backgroundImage = `url(Cards/${this.cardName})`;
        this.flipped = true;
      }
  
      this.flippable = false;
    };
  }

  flipUpdate() {
    this.flip()

    cardTurned = this;
    updateText();
  }
}


let deck = [];
function makeDeck() {
  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < cards.length; j++) {
      let card = new Card(0, 0, 0, i, j);
      deck.push(card);
    }
  }
}

let headPos = []
function makeHead() {
  headPos = [
    [0, 0, 45], // haar
    [0, 1, 45],
    [0, 2, 45],
    [0, 3, 45],
    [0, 4, 45],
    [0, 5, 45],
    [0, 6, 45],
    [1, 0, 90], // bovenkant
    [1, 1, 90],
    [1, 2, 90],
    [1, 3, 90],
    [1, 4, 90],
    [1, 5, 90],
    [1, 6, 90],
    [2, 0, 0], // linker/rechter kant
    [3, 0, 0],
    [4, 0, 0],
    [5, 0, 0],
    [6, 0, 0],
    [7, 0, 0],
    [2, 6, 0],
    [3, 6, 0],
    [4, 6, 0],
    [5, 6, 0],
    [6, 6, 0],
    [7, 6, 0],
    [8, 0, 90], // onderkant
    [8, 1, 90],
    [8, 2, 90],
    [8, 3, 90],
    [8, 4, 90],
    [8, 5, 90],
    [8, 6, 90],
    [3, 1.5, 90], // ogen
    [3, 4.5, 90],
    [2, 1, 75],
    [2, 2, -75],
    [2, 4, 75],
    [2, 5, -75],
    [4.15, 2.75,20], // neus
    [5, 3, 90],
    [3.2, 3.1, 20],
    [6, 1.5, -45], // mond
    [6.5, 2.5, 90],
    [6.5, 3.5, 90],
    [6, 4.5, 45],
    [9, 2, 0], // nek
    [9, 4, 0],
    [3.5, -0.75, 0], // oren
    [4.5, -0.75, 0],
    [3.5, 6.75, 0],
    [4.5, 6.75, 0]
  ]
}

makeDeck();
makeHead();

function randomNoRepeats(array) {
  let copy = array.slice(0);
  return function() {
    if (copy.length < 1) { copy = array.slice(0); }
    let index = Math.floor(Math.random() * copy.length);
    let item = copy[index];
    copy.splice(index, 1);
    return item;
  };
}

let i = 0
let randomOrder = randomNoRepeats(headPos)
for (const card of deck) {
  let pos = randomOrder();
  card.row = pos[0];
  card.col = pos[1]+1;
  card.rotation = pos[2];
  card.calcPos();
  i++;
}

window.onresize = function() {
  console.log('resized');
  boardHeight = boardDiv.offsetHeight;
  boardWidth = boardDiv.offsetWidth;
  for (const card of deck) {
    card.style();
    card.calcPos();
    card.flipped = false;
  };
};