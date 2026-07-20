// Dakota Color Stative Verbs — Chapter 2
// Click colored shapes to see Dakota stative verb form + explanation
// CANVAS_HEIGHT: 480
// Bloom Level: Understand — explain how stative verbs work as color descriptors in Dakota

let canvasWidth = 400;
let drawHeight = 360;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let margin = 20;

const COLORS = [
  { dk: 'šá',    en: 'it is red',          phonetic: 'shah',       fill: '#E03030', text: 'white', example: 'Šúŋka waŋ šá yá.' },
  { dk: 'tó',    en: 'it is blue/green',   phonetic: 'toh',        fill: '#2E86C1', text: 'white', example: 'Mní kiŋ tó yá.' },
  { dk: 'sápa',  en: 'it is black',        phonetic: 'SAH-pah',    fill: '#2C2C2C', text: 'white', example: 'Šúŋka waŋ sápa yá.' },
  { dk: 'sáŋ',   en: 'it is white/pale',   phonetic: 'sahn',       fill: '#E8E8E8', text: '#333',  example: 'Waŋ sáŋ yá.' },
  { dk: 'žiží',  en: 'it is yellow',       phonetic: 'ZHEE-zhee',  fill: '#F4C010', text: '#333',  example: 'Čhaŋtéčhila žiží yá.' },
  { dk: 'ğí',    en: 'it is brown',        phonetic: 'ghee',       fill: '#8B5E3C', text: 'white', example: 'Makóčhe kiŋ ğí yá.' },
];

let selected = null;
let showExample = false;
let exampleButton, resetButton;
let shapes = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(16);

  exampleButton = createButton('Show Example Sentence');
  exampleButton.position(10, drawHeight + 70);
  exampleButton.mousePressed(() => { if (selected !== null) showExample = !showExample; });

  resetButton = createButton('Reset');
  resetButton.position(190, drawHeight + 70);
  resetButton.mousePressed(() => { selected = null; showExample = false; });

  describe('Dakota Color Stative Verbs — click a colored shape to see the Dakota stative verb', LABEL);
}

function draw() {
  updateCanvasSize();
  buildShapes();

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
  textSize(18);
  text('Dakota Stative Verbs — Colors', canvasWidth / 2, margin);
  textSize(12);
  fill('#666');
  text('In Dakota, colors are verbs — not adjectives. Click a shape to see how.', canvasWidth / 2, margin + 26);

  // Draw shapes
  for (let i = 0; i < COLORS.length; i++) {
    let s = shapes[i];
    let c = COLORS[i];
    let isSelected = selected === i;
    let isHovered = dist(mouseX, mouseY, s.x, s.y) < s.r;

    // Glow ring on hover or select
    if (isSelected) {
      stroke('#C8860A');
      strokeWeight(4);
      noFill();
      ellipse(s.x, s.y, s.r * 2 + 12, s.r * 2 + 12);
    } else if (isHovered) {
      stroke('#aaa');
      strokeWeight(2);
      noFill();
      ellipse(s.x, s.y, s.r * 2 + 8, s.r * 2 + 8);
    }

    // Shape
    fill(c.fill);
    stroke(c.fill === '#E8E8E8' ? '#bbb' : c.fill);
    strokeWeight(1);
    ellipse(s.x, s.y, s.r * 2, s.r * 2);

    // Label inside
    noStroke();
    fill(c.text);
    textAlign(CENTER, CENTER);
    textSize(13);
    text(c.dk, s.x, s.y);
  }

  // Info panel
  if (selected !== null) {
    let c = COLORS[selected];
    let panelY = drawHeight * 0.72;

    fill('#FFF8F0');
    stroke('#C8860A');
    strokeWeight(1);
    rect(margin, panelY, canvasWidth - margin * 2, 60, 8);

    noStroke();
    fill('#8B1A1A');
    textAlign(CENTER, TOP);
    textSize(22);
    text(c.dk, canvasWidth / 2, panelY + 6);

    fill('#555');
    textSize(13);
    text('"' + c.en + '" — /' + c.phonetic + '/', canvasWidth / 2, panelY + 36);

    if (showExample) {
      fill('#2E8B57');
      textSize(13);
      text(c.example, canvasWidth / 2, panelY + 52);
    }
  } else {
    noStroke();
    fill('#aaa');
    textAlign(CENTER, CENTER);
    textSize(13);
    text('← Click any circle to see the Dakota stative verb →', canvasWidth / 2, drawHeight * 0.82);
  }

  // Control note
  noStroke();
  fill('#888');
  textAlign(LEFT, CENTER);
  textSize(12);
  text('Key insight: Dakota has no adjectives for color — colors are verbs!', 10, drawHeight + 20);
  text('Pattern: [noun] waŋ [color verb] yá — "A [noun] is-[color]"', 10, drawHeight + 40);

  exampleButton.position(10, drawHeight + 72);
  resetButton.position(canvasWidth - 80, drawHeight + 72);
}

function buildShapes() {
  shapes = [];
  let cols = 3;
  let rows = 2;
  let padX = canvasWidth / (cols + 1);
  let padY = (drawHeight * 0.62) / (rows + 1);
  let r = min(padX, padY) * 0.38;
  for (let i = 0; i < COLORS.length; i++) {
    let col = i % cols;
    let row = Math.floor(i / cols);
    shapes.push({ x: padX * (col + 1), y: drawHeight * 0.15 + padY * (row + 1), r });
  }
}

function mousePressed() {
  buildShapes();
  for (let i = 0; i < shapes.length; i++) {
    if (dist(mouseX, mouseY, shapes[i].x, shapes[i].y) < shapes[i].r) {
      selected = i;
      showExample = false;
      return;
    }
  }
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
