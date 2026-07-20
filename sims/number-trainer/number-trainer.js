// Dakota Number Trainer — Chapter 2
// Click the English number to see and match the Dakota word
// CANVAS_HEIGHT: 520
// Bloom Level: Remember — recall Dakota numbers 1–10

let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let margin = 20;
let defaultTextSize = 16;

const NUMBERS = [
  { n: 1, dk: 'waŋží',     phonetic: 'wahn-ZHEE' },
  { n: 2, dk: 'núŋpa',     phonetic: 'NOON-pah' },
  { n: 3, dk: 'yámni',     phonetic: 'YAHM-nee' },
  { n: 4, dk: 'tópa',      phonetic: 'TOH-pah' },
  { n: 5, dk: 'záptaŋ',    phonetic: 'ZAHP-tahn' },
  { n: 6, dk: 'šákpe',     phonetic: 'SHAHK-peh' },
  { n: 7, dk: 'šakówiŋ',   phonetic: 'shah-KOH-wing' },
  { n: 8, dk: 'šaglóğaŋ',  phonetic: 'shah-GLOH-ghahn' },
  { n: 9, dk: 'napčíyuŋka', phonetic: 'nahp-CHEE-yoonk-ah' },
  { n: 10, dk: 'wikčémna',  phonetic: 'wik-CHEHM-nah' },
];

let current = null;
let revealed = false;
let score = 0;
let attempted = 0;
let buttons = [];
let nextButton, resetButton;
let feedback = '';
let feedbackColor = '#333';
let feedbackTimer = 0;

// Quiz mode: show Dakota, pick English
let quizMode = false; // false = show English, reveal Dakota; true = show Dakota, pick English
let quizChoices = [];
let quizCorrect = null;
let quizAnswered = false;
let modeButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  nextButton = createButton('Next Number →');
  nextButton.position(10, drawHeight + 70);
  nextButton.mousePressed(nextNumber);

  resetButton = createButton('Reset Score');
  resetButton.position(150, drawHeight + 70);
  resetButton.mousePressed(resetSim);

  modeButton = createButton('Switch to Quiz Mode');
  modeButton.position(10, drawHeight + 100);
  modeButton.mousePressed(toggleMode);

  pickRandom();
  describe('Dakota Number Trainer — learn Dakota numbers 1 through 10', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  // Title
  fill('#8B1A1A');
  textAlign(CENTER, TOP);
  textSize(20);
  text('Dakota Number Trainer', canvasWidth / 2, margin);

  textSize(13);
  fill('#555');
  text('Score: ' + score + ' / ' + attempted, canvasWidth / 2, margin + 28);

  if (!current) return;

  if (!quizMode) {
    // Show English number → reveal Dakota
    fill('#333');
    textAlign(CENTER, CENTER);
    textSize(72);
    text(current.n, canvasWidth / 2, drawHeight * 0.35);

    textSize(16);
    fill('#666');
    text('(click to reveal Dakota)', canvasWidth / 2, drawHeight * 0.58);

    if (revealed) {
      fill('#8B1A1A');
      textSize(38);
      text(current.dk, canvasWidth / 2, drawHeight * 0.72);
      fill('#888');
      textSize(14);
      text('/' + current.phonetic + '/', canvasWidth / 2, drawHeight * 0.84);
    }
  } else {
    // Quiz: show Dakota → pick the correct number
    fill('#8B1A1A');
    textAlign(CENTER, CENTER);
    textSize(38);
    text(current.dk, canvasWidth / 2, drawHeight * 0.28);
    fill('#888');
    textSize(14);
    text('/' + current.phonetic + '/', canvasWidth / 2, drawHeight * 0.4);

    textSize(15);
    fill('#555');
    text('Which number is this?', canvasWidth / 2, drawHeight * 0.5);

    // Draw choice buttons
    let bw = 60, bh = 44, cols = 5;
    let startX = (canvasWidth - cols * (bw + 10)) / 2 + bw / 2;
    for (let i = 0; i < quizChoices.length; i++) {
      let col = i % cols;
      let row = Math.floor(i / cols);
      let bx = startX + col * (bw + 10);
      let by = drawHeight * 0.6 + row * (bh + 10);
      let choice = quizChoices[i];
      let isCorrect = choice === quizCorrect;
      let isClicked = quizAnswered && choice === quizCorrect;

      if (quizAnswered) {
        fill(isCorrect ? '#2E8B57' : '#ddd');
        stroke(isCorrect ? '#1A5C38' : '#ccc');
      } else {
        fill(isHoveringChoice(bx, by, bw, bh) ? '#f0f0f0' : 'white');
        stroke('#ccc');
      }
      strokeWeight(1);
      rect(bx - bw / 2, by - bh / 2, bw, bh, 6);
      noStroke();
      fill(isClicked ? 'white' : '#333');
      textAlign(CENTER, CENTER);
      textSize(20);
      text(choice, bx, by);
    }
  }

  // Feedback
  if (feedbackTimer > 0) {
    feedbackTimer--;
    fill(feedbackColor);
    textAlign(CENTER, BOTTOM);
    textSize(15);
    text(feedback, canvasWidth / 2, drawHeight - 10);
  }

  // Reposition buttons
  nextButton.position(10, drawHeight + 70);
  resetButton.position(canvasWidth / 2 - 50, drawHeight + 70);
  modeButton.position(10, drawHeight + 100);
  modeButton.html(quizMode ? 'Switch to Reveal Mode' : 'Switch to Quiz Mode');
}

function isHoveringChoice(bx, by, bw, bh) {
  return mouseX > bx - bw / 2 && mouseX < bx + bw / 2 &&
         mouseY > by - bh / 2 && mouseY < by + bh / 2;
}

function mousePressed() {
  if (!current) return;
  if (!quizMode && !revealed) {
    // Reveal mode: click anywhere in draw area
    if (mouseY < drawHeight) {
      revealed = true;
      score++;
      attempted++;
    }
    return;
  }
  if (quizMode && !quizAnswered) {
    let bw = 60, bh = 44, cols = 5;
    let startX = (canvasWidth - cols * (bw + 10)) / 2 + bw / 2;
    for (let i = 0; i < quizChoices.length; i++) {
      let col = i % cols;
      let row = Math.floor(i / cols);
      let bx = startX + col * (bw + 10);
      let by = drawHeight * 0.6 + row * (bh + 10);
      if (dist(mouseX, mouseY, bx, by) < 35) {
        quizAnswered = true;
        attempted++;
        if (quizChoices[i] === quizCorrect) {
          score++;
          feedback = '✓ Correct! ' + quizCorrect + ' = ' + current.dk;
          feedbackColor = '#2E8B57';
        } else {
          feedback = '✗ The answer was ' + quizCorrect;
          feedbackColor = '#A32D2D';
        }
        feedbackTimer = 120;
        break;
      }
    }
  }
}

function nextNumber() {
  pickRandom();
}

function resetSim() {
  score = 0;
  attempted = 0;
  pickRandom();
}

function toggleMode() {
  quizMode = !quizMode;
  pickRandom();
}

function pickRandom() {
  current = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
  revealed = false;
  quizAnswered = false;
  feedback = '';
  feedbackTimer = 0;
  quizCorrect = current.n;
  // Build 5 choices including the correct one
  let pool = NUMBERS.map(x => x.n).filter(x => x !== current.n);
  let shuffled = pool.sort(() => Math.random() - 0.5).slice(0, 4);
  quizChoices = [current.n, ...shuffled].sort((a, b) => a - b);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, canvasHeight);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
