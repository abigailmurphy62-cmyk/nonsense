let tick1;
let tick2;
let eminemImg; // image for points
let y;
let amplitudeControl, omegaControl, phiControl;
let amplitudeControlLabel, omegaControlLabel, phiControlLabel;
let ampMax;

function preload() {
  eminemImg = loadImage("eminem.png"); // <-- make sure this file exists in same folder
}

function setup() {
  let canvas = createCanvas(windowWidth, 0.9 * windowHeight);
  canvas.parent('sketch-holder');
  background(250);
  frameRate(30);
  textSize(18);
  let sliderWidth = min(300, width / 3);

  // y array
  y = new Array(200);
  ampMax = min(200, height / 4);

  // amplitude slider
  amplitudeControl = createSlider(0, ampMax, ampMax / 2, 0);
  amplitudeControl.position(30, height * 0.05);
  amplitudeControl.parent('sketch-holder');
  amplitudeControl.class("sim-slider");
  amplitudeControl.input(sliderChange);
  amplitudeControl.size(sliderWidth, 0);

  amplitudeControlLabel = createP("Amplitude");
  amplitudeControlLabel.position(30, amplitudeControl.y);
  amplitudeControlLabel.parent('sketch-holder');

  // omega slider
  omegaControl = createSlider(5, 30, 15, 0.1);
  omegaControl.position(30, amplitudeControl.y + 70);
  omegaControl.parent('sketch-holder');
  omegaControl.class("sim-slider");
  omegaControl.input(sliderChange);
  omegaControl.size(sliderWidth, 0);

  omegaControlLabel = createP();
  omegaControlLabel.position(30, omegaControl.y);
  omegaControlLabel.parent('sketch-holder');
  katex.render('\\omega', omegaControlLabel.elt);

  // phi slider
  phiControl = createSlider(-2 * PI, +2 * PI, 0, PI * 0.1);
  phiControl.position(30, omegaControl.y + 70);
  phiControl.parent('sketch-holder');
  phiControl.class("sim-slider");
  phiControl.input(sliderChange);
  phiControl.size(sliderWidth, 0);

  phiControlLabel = createP();
  phiControlLabel.position(30, phiControl.y);
  phiControlLabel.parent('sketch-holder');
  katex.render('\\phi =' + phiControl.value().toFixed(2), phiControlLabel.elt);

  // equation label
  let posEq = createP();
  posEq.style('font-size', '20px');
  posEq.position(width / 2, omegaControl.y + 40);
  katex.render('x(t) = C \\cos \\left(\\omega t + \\phi \\right) ', posEq.elt);

  tick1 = createP();
  tick1.style('font-size', '20px');
  katex.render('2 \\pi  ', tick1.elt);

  tick2 = createP();
  tick2.style('font-size', '20px');
  katex.render('4 \\pi  ', tick2.elt);

  let horizAxisLabel = createP();
  horizAxisLabel.style('font-size', '20px');
  horizAxisLabel.position(0.8 * width, 2 * height / 3 + 90);
  katex.render('\\omega t ', horizAxisLabel.elt);

  noLoop();
}

function draw() {
  background(255);
  stroke(0);

  // move to middle
  translate(80, 2 * height / 3);

  // axes
  line(0, 0, width * 0.9, 0);
  line(0, -ampMax * 1.1, 0, ampMax * 1.1);

  let widthScale = y.length / (width * 0.9);
  let amplitude = amplitudeControl.value();
  let omega = omegaControl.value();
  let phi = phiControl.value();

  // calculate points
  for (let x = 0; x < y.length; x++) {
    y[x] = amplitude * Math.cos(0.01 * x * omega + phi);
  }

  // draw images instead of points
  push();
  noStroke();
  for (let x = 0; x < y.length; x++) {
    let xscaled = map(x, 0, y.length, 0, width * 0.9);
    image(eminemImg, xscaled - 10, -y[x] - 10, 20, 20);
  }
  pop();

  // red curve line
  push();
  noFill();
  stroke('red');
  beginShape();
  for (let x = 0; x < y.length; x++) {
    let xscaled = map(x, 0, y.length, 0, width * 0.9);
    curveVertex(xscaled, -y[x]);
  }
  endShape();
  pop();

  showMaxAmplitude();
  showXTicks();
}

function showMaxAmplitude() {
  let amplitude = amplitudeControl.value();
  stroke(0);
  line(0, -amplitude, 10, -amplitude);
  line(0, amplitude, 10, amplitude);
  noStroke();
  text('C', -40, -abs(amplitude) + 5);
  text('-C ', -40, abs(amplitude) + 5);
}

function showXTicks() {
  let omega = omegaControl.value();
  let widthScale = y.length / (width * 0.9);
  stroke(0);
  translate(0, -80);
  line(TWO_PI / (0.01 * omega * widthScale), 70, TWO_PI / (0.01 * omega * widthScale), 80);
  line(2 * TWO_PI / (0.01 * omega * widthScale), 70, 2 * TWO_PI / (0.01 * omega * widthScale), 80);
  noStroke();
  tick1.position(TWO_PI / (0.01 * omega * widthScale) + 65, 2 * height / 3 + 90);
  tick2.position(2 * TWO_PI / (0.01 * omega * widthScale) + 65, 2 * height / 3 + 90);
}

function sliderChange() {
  katex.render('\\phi =' + phiControl.value().toFixed(2), phiControlLabel.elt);
  redraw();
}
