let myCanvas;
let eminemImg;
let y;
let amplitudeControl, omegaControl, phiControl, sizeControl;
let ampMax;
let t = 0;

let capturer;
let recording = false;

function preload() {
  eminemImg = loadImage("eminem.png"); // make sure this is in the same folder
}

function setup() {
  myCanvas = createCanvas(windowWidth, 0.9 * windowHeight);
  frameRate(30);

  let sliderWidth = min(300, width / 3);

  y = new Array(200);
  ampMax = min(200, height / 4);

  // Amplitude slider
  amplitudeControl = createSlider(0, ampMax, ampMax / 2, 0);
  amplitudeControl.position(30, 30);
  amplitudeControl.size(sliderWidth, 0);
  amplitudeControl.input(sliderChange);

  // Frequency slider
  omegaControl = createSlider(5, 30, 15, 0.1);
  omegaControl.position(30, 100);
  omegaControl.size(sliderWidth, 0);
  omegaControl.input(sliderChange);

  // Phase slider
  phiControl = createSlider(-2 * PI, 2 * PI, 0, PI * 0.1);
  phiControl.position(30, 170);
  phiControl.size(sliderWidth, 0);
  phiControl.input(sliderChange);

  // Dot size slider
  sizeControl = createSlider(10, 80, 20, 1);
  sizeControl.position(30, 240);
  sizeControl.size(sliderWidth, 0);
  sizeControl.input(sliderChange);

  noStroke();

  // Initialize CCapture for GIF
  capturer = new CCapture({
    format: 'gif',
    framerate: 30,
    verbose: true
  });
}

function draw() {
  background(255);
  stroke(0);

  translate(80, 2 * height / 3);
  line(0, 0, width * 0.9, 0);
  line(0, -ampMax * 1.1, 0, ampMax * 1.1);

  let amplitude = amplitudeControl.value();
  let omega = omegaControl.value();
  let phi = phiControl.value();
  let dotSize = sizeControl.value();

  for (let x = 0; x < y.length; x++) {
    y[x] = amplitude * Math.cos(0.01 * x * omega + phi + t);
  }

  push();
  noStroke();
  for (let x = 0; x < y.length; x++) {
    let xscaled = map(x, 0, y.length, 0, width * 0.9);
    image(eminemImg, xscaled - dotSize / 2, -y[x] - dotSize / 2, dotSize, dotSize);
  }
  pop();

  t += 0.05;

  // Capture frame if recording
  if (recording) {
    capturer.capture(myCanvas.elt);
  }
}

// Slider change
function sliderChange() {
  redraw();
}

// Press R to start/stop GIF recording
function keyPressed() {
  if (key === 'r' || key === 'R') {
    if (!recording) {
      recording = true;
      capturer.start();
      console.log("Recording started...");
    } else {
      recording = false;
      capturer.stop();
      capturer.save();
      console.log("Recording stopped and GIF saved!");
    }
  }
}
