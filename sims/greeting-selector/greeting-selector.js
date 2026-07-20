// Dakota Greeting Selector — Chapter 1
// Students click a speaker character to see the correct gender greeting form
// CANVAS_HEIGHT: 460
// Bloom Level: Remember — recall the correct greeting for each gender

let canvasWidth = 400;
let drawHeight = 380;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let defaultTextSize = 16;
let margin = 20;

// State
let selected = null; // 'male', 'female', or null
let showAnswer = false;
let resetButton;

// Character positions (relative, updated on resize)
let maleX, femaleX, charY;
let charRadius = 60;

const GREETINGS = {
  male: {
    word: 'Háu',
    phonetic: 'haw',
    meaning: 'Hello (said by men)',
    color: '#4A90D9',
    label: 'Male Speaker',
    icon: '👨'
  },
  female: {
    word: 'Haŋ',
    phonetic: 'hah-ng',
    meaning: 'Hello (said by women)',
    color: '#D96B8A',
    label: 'Female Speaker',
    icon: '👩'
  }
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  resetButton = createButton('Reset');
  resetButton.position(10, drawHeight + 45);
  resetButton.mousePressed(resetSim);

  describe('Click a speaker to see the correct Dakota greeting form — Háu for men, Haŋ for women', LABEL);
}

function draw() {
  updateCanvasSize();

  // Drawing region
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control region
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  maleX = canvasWidth * 0.28;
  femaleX = canvasWidth * 0.72;
  charY = drawHeight * 0.42;

  // Title
  fill('#8B1A1A');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(22);
  text('Dakota Greetings', canvasWidth / 2, margin);

  textSize(14);
  fill('#555');
  text('Click a speaker to see how they say hello in Dakota', canvasWidth / 2, margin + 30);

  // Draw characters
  drawCharacter(maleX, charY, 'male');
  drawCharacter(femaleX, charY, 'female');

  // Show instruction arrow if nothing selected
  if (!selected) {
    fill('#C8860A');
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(13);
    text('← Click either speaker →', canvasWidth / 2, drawHeight * 0.82);
  }

  // Show answer panel
  if (selected) {
    let g = GREETINGS[selected];
    let panelX = canvasWidth * 0.15;
    let panelW = canvasWidth * 0.7;
    let panelY = drawHeight * 0.68;
    let panelH = 90;

    fill(g.color + '22');
    stroke(g.color);
    strokeWeight(2);
    rect(panelX, panelY, panelW, panelH, 10);

    noStroke();
    fill(g.color);
    textAlign(CENTER, TOP);
    textSize(36);
    text(g.word, canvasWidth / 2, panelY + 6);

    fill('#333');
    textSize(14);
    text('/' + g.phonetic + '/ — ' + g.meaning, canvasWidth / 2, panelY + 52);

    textSize(12);
    fill('#666');
    text(g.label + ' greeting', canvasWidth / 2, panelY + 72);
  }

  // Control label
  fill('#555');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(13);
  text('Tap a speaker above, or use Reset to try again.', 10, drawHeight + 15);
}

function drawCharacter(x, y, gender) {
  let g = GREETINGS[gender];
  let isSelected = selected === gender;
  let isHovered = dist(mouseX, mouseY, x, y) < charRadius;

  // Glow on hover/select
  if (isSelected) {
    fill(g.color + '55');
    noStroke();
    ellipse(x, y, charRadius * 2.6, charRadius * 2.6);
  } else if (isHovered) {
    fill('#00000011');
    noStroke();
    ellipse(x, y, charRadius * 2.4, charRadius * 2.4);
  }

  // Body circle
  fill(isSelected ? g.color : '#ddd');
  stroke(isSelected ? g.color : '#aaa');
  strokeWeight(2);
  ellipse(x, y, charRadius * 2, charRadius * 2);

  // Emoji
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(charRadius * 0.9);
  text(g.icon, x, y - 4);

  // Label below
  fill(isSelected ? g.color : '#555');
  noStroke();
  textSize(14);
  textAlign(CENTER, TOP);
  text(g.label, x, y + charRadius + 8);
}

function mousePressed() {
  if (dist(mouseX, mouseY, maleX, charY) < charRadius) {
    selected = 'male';
  } else if (dist(mouseX, mouseY, femaleX, charY) < charRadius) {
    selected = 'female';
  }
}

function resetSim() {
  selected = null;
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
