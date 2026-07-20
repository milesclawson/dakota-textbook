// Dakota Name Builder — Chapter 1
// Students type their name and origin, then see a Dakota self-introduction sentence
// CANVAS_HEIGHT: 500
// Bloom Level: Apply — construct a formal Dakota self-introduction

let canvasWidth = 400;
let drawHeight = 320;
let controlHeight = 180;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let margin = 20;
let defaultTextSize = 16;

let nameInput, originInput, genderSelect, buildButton, clearButton;
let sentence = '';
let phonetic = '';
let built = false;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Name input
  nameInput = createInput('');
  nameInput.attribute('placeholder', 'Your first name');
  nameInput.size(180);
  nameInput.position(10, drawHeight + 10);

  // Origin input
  originInput = createInput('');
  originInput.attribute('placeholder', 'Your city or hometown');
  originInput.size(180);
  originInput.position(10, drawHeight + 45);

  // Gender select
  genderSelect = createSelect();
  genderSelect.option('Male speaker (Háu)', 'male');
  genderSelect.option('Female speaker (Haŋ)', 'female');
  genderSelect.position(10, drawHeight + 80);
  genderSelect.size(200);

  // Build button
  buildButton = createButton('Build Introduction →');
  buildButton.position(10, drawHeight + 115);
  buildButton.mousePressed(buildSentence);
  buildButton.style('background', '#8B1A1A');
  buildButton.style('color', 'white');
  buildButton.style('border', 'none');
  buildButton.style('padding', '6px 14px');
  buildButton.style('cursor', 'pointer');
  buildButton.style('border-radius', '4px');

  // Clear button
  clearButton = createButton('Clear');
  clearButton.position(185, drawHeight + 115);
  clearButton.mousePressed(clearSim);

  describe('Dakota Name Builder — type your name and origin to see a Dakota self-introduction sentence', LABEL);
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

  // Title
  fill('#8B1A1A');
  textAlign(CENTER, TOP);
  textSize(20);
  text('Dakota Self-Introduction Builder', canvasWidth / 2, margin);

  textSize(13);
  fill('#555');
  text('Fill in your name and origin below, then click Build.', canvasWidth / 2, margin + 28);

  if (!built) {
    // Show template
    textAlign(LEFT, TOP);
    textSize(15);
    fill('#333');
    let templateY = drawHeight * 0.28;
    text('Template:', margin, templateY);

    fill('#8B1A1A');
    textSize(18);
    text('[Name] emáčiyapi.', margin + 10, templateY + 24);
    text('[Origin] etáŋhaŋ waúŋ.', margin + 10, templateY + 52);

    fill('#666');
    textSize(13);
    text('"[Name] — that is what they call me."', margin + 10, templateY + 82);
    text('"I am from [Origin]."', margin + 10, templateY + 100);

    // Greeting preview based on gender
    let greeting = 'Háu.';
    fill('#4A90D9');
    textSize(15);
    text('Greeting: ' + greeting + ' (changes with gender)', margin, drawHeight * 0.72);

    fill('#aaa');
    textSize(12);
    textAlign(CENTER, BOTTOM);
    text('Enter your info below and click Build Introduction', canvasWidth / 2, drawHeight - 8);

  } else {
    // Show built introduction
    let lineY = drawHeight * 0.22;
    let greeting = genderSelect.value() === 'male' ? 'Háu.' : 'Haŋ.';
    let name = nameInput.value().trim() || 'Maria';
    let origin = originInput.value().trim() || 'Minneapolis';

    // Dakota sentence
    fill('#8B1A1A');
    textAlign(CENTER, TOP);
    textSize(20);
    text(greeting + ' ' + name + ' emáčiyapi.', canvasWidth / 2, lineY);
    textSize(20);
    text(origin + ' etáŋhaŋ waúŋ.', canvasWidth / 2, lineY + 34);
    text('Pidámayaye!', canvasWidth / 2, lineY + 68);

    // Divider
    stroke('#ddd');
    strokeWeight(1);
    line(margin, lineY + 100, canvasWidth - margin, lineY + 100);
    noStroke();

    // English translation
    fill('#555');
    textSize(13);
    textAlign(CENTER, TOP);
    text('"' + greeting + ' My name is ' + name + '.', canvasWidth / 2, lineY + 112);
    text('I am from ' + origin + '. Thank you!"', canvasWidth / 2, lineY + 130);

    // Breakdown
    fill('#888');
    textSize(12);
    text('emáčiyapi = "they call me" | etáŋhaŋ = "from" | waúŋ = "I am/exist"', canvasWidth / 2, lineY + 158);

    // Congratulations note
    fill('#2E8B57');
    textSize(13);
    text('You just introduced yourself in Dakota!', canvasWidth / 2, drawHeight - 18);
  }

  // Control labels
  noStroke();
  fill('#555');
  textAlign(LEFT, CENTER);
  textSize(12);
  text('Your name:', 10, drawHeight + 22);
  text('Your origin:', 10, drawHeight + 57);
  text('Gender speech:', 10, drawHeight + 92);

  // Reposition inputs on resize
  nameInput.position(100, drawHeight + 10);
  nameInput.size(canvasWidth - 115);
  originInput.position(100, drawHeight + 45);
  originInput.size(canvasWidth - 115);
  genderSelect.position(120, drawHeight + 80);
  genderSelect.size(canvasWidth - 135);
  buildButton.position(10, drawHeight + 118);
  clearButton.position(200, drawHeight + 118);
}

function buildSentence() {
  built = true;
}

function clearSim() {
  built = false;
  nameInput.value('');
  originInput.value('');
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
