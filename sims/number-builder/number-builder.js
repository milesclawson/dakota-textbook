// Dakota Number Builder — Chapter 2
// Sliders let students build Dakota numbers from 1–100 using wikčémna (ten) + units
// CANVAS_HEIGHT: 500
// Bloom Level: Apply — construct Dakota numbers above 10 using the wikčémna system

let canvasWidth = 400;
let drawHeight = 340;
let controlHeight = 160;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let margin = 20;
let sliderLeftMargin = 180;

let tensSlider, unitsSlider;

const UNITS = ['', 'waŋží', 'núŋpa', 'yámni', 'tópa', 'záptaŋ',
               'šákpe', 'šakówiŋ', 'šaglóğaŋ', 'napčíyuŋka', 'wikčémna'];
const TENS_NAMES = ['', 'wikčémna', 'wikčémna núŋpa', 'wikčémna yámni',
                    'wikčémna tópa', 'wikčémna záptaŋ',
                    'wikčémna šákpe', 'wikčémna šakówiŋ',
                    'wikčémna šaglóğaŋ', 'wikčémna napčíyuŋka', 'opáwiŋğe'];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(16);

  tensSlider = createSlider(0, 10, 1);
  tensSlider.position(sliderLeftMargin, drawHeight + 10);
  tensSlider.size(canvasWidth - sliderLeftMargin - margin);

  unitsSlider = createSlider(0, 9, 0);
  unitsSlider.position(sliderLeftMargin, drawHeight + 50);
  unitsSlider.size(canvasWidth - sliderLeftMargin - margin);

  describe('Dakota Number Builder — use sliders to build Dakota numbers from 1 to 100', LABEL);
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

  let tens = tensSlider.value();
  let units = unitsSlider.value();
  // If tens = 10, lock units to 0
  if (tens === 10) units = 0;
  let total = tens * 10 + units;

  // Title
  fill('#8B1A1A');
  textAlign(CENTER, TOP);
  textSize(20);
  text('Dakota Number Builder', canvasWidth / 2, margin);
  textSize(13);
  fill('#555');
  text('Use sliders to build any Dakota number from 1 to 100', canvasWidth / 2, margin + 28);

  // Big number display
  fill('#1a1a1a');
  textAlign(CENTER, CENTER);
  textSize(80);
  text(total === 0 ? '?' : total, canvasWidth / 2, drawHeight * 0.38);

  // Dakota word construction
  let dakotaWord = buildDakotaWord(tens, units, total);
  fill('#8B1A1A');
  textSize(total <= 10 ? 32 : 24);
  textAlign(CENTER, CENTER);
  text(dakotaWord, canvasWidth / 2, drawHeight * 0.66);

  // Formula breakdown
  if (total > 10 && total < 100) {
    fill('#888');
    textSize(13);
    textAlign(CENTER, CENTER);
    let tensWord = TENS_NAMES[tens];
    let unitsWord = units > 0 ? UNITS[units] : '';
    let formula = tensWord + (unitsWord ? ' ákeyaŋ ' + unitsWord : '');
    text('= ' + (tens > 1 ? TENS_NAMES[tens] : 'wikčémna') + (units > 0 ? ' ákeyaŋ ' + UNITS[units] : ''), canvasWidth / 2, drawHeight * 0.83);
    fill('#aaa');
    textSize(12);
    text('(wikčémna = ten | ákeyaŋ = plus/more)', canvasWidth / 2, drawHeight * 0.93);
  } else if (total === 100) {
    fill('#888');
    textSize(13);
    textAlign(CENTER, CENTER);
    text('opáwiŋğe = one hundred (a complete round number)', canvasWidth / 2, drawHeight * 0.83);
  } else if (total === 0) {
    fill('#aaa');
    textSize(14);
    textAlign(CENTER, CENTER);
    text('Move the sliders to build a number', canvasWidth / 2, drawHeight * 0.80);
  }

  // Slider labels
  noStroke();
  fill('#555');
  textAlign(LEFT, CENTER);
  textSize(13);
  text('Tens: ' + tens + '0 (' + (tens === 0 ? 'none' : TENS_NAMES[tens]) + ')',
       10, drawHeight + 22);
  text('Units: ' + units + ' (' + (units === 0 ? 'none' : UNITS[units]) + ')',
       10, drawHeight + 62);

  // Hint
  fill('#888');
  textSize(12);
  textAlign(LEFT, TOP);
  text('Tip: tens × 10 + units. "ákeyaŋ" means "and/plus" for numbers 11–99.', 10, drawHeight + 95);
  text('opáwiŋğe = 100 (set tens to 10, units locked to 0)', 10, drawHeight + 112);
  text('Note: language content pending community verification.', 10, drawHeight + 130);

  // Reposition sliders
  tensSlider.position(sliderLeftMargin, drawHeight + 10);
  tensSlider.size(canvasWidth - sliderLeftMargin - margin);
  unitsSlider.position(sliderLeftMargin, drawHeight + 50);
  unitsSlider.size(canvasWidth - sliderLeftMargin - margin);

  if (tens === 10) unitsSlider.value(0);
}

function buildDakotaWord(tens, units, total) {
  if (total === 0) return '—';
  if (total <= 10) return UNITS[total];
  if (total === 100) return 'opáwiŋğe';
  let result = TENS_NAMES[tens];
  if (units > 0) result += ' ákeyaŋ ' + UNITS[units];
  return result;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, canvasHeight);
  tensSlider.size(canvasWidth - sliderLeftMargin - margin);
  unitsSlider.size(canvasWidth - sliderLeftMargin - margin);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
