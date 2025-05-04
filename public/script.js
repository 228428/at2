// Used to store all the root branches in this array
let roots = [];

// A simple counter to help us toggle stroke colors and sound intensity
let count = 0;

// My sound oscillator — will start it after a user click
let osc = null;

function setup() {
  // Set up a 3D canvas that fills the whole browser window
  createCanvas(windowWidth, windowHeight, WEBGL);
  background(20); // dark background so the roots stand out
  stroke(255); // white lines for roots
  noFill(); // don’t fill shapes

  // Start the first root growing from the center of the screen
  roots.push(new Root(0, 0, 0));

  // Just a log to remind us it's working
  console.log("Sketch loaded. Click to begin sound.");
}

function draw() {
  background(20); // refresh background every frame
  orbitControl(); // lets us rotate/zoom with the mouse

  // Change line thickness in a smooth, wavy way
  strokeWeight(0.3 + noise(frameCount * 0.01) * 1.5);

  // Tell each root to grow a little more
  for (let r of roots) {
    r.grow();
  }

  // Every few frames, make a new root from a random existing one
  if (frameCount % 10 === 0 && roots.length < 2000) {
    let r = random(roots);
    roots.push(new Root(r.x, r.y, r.z));
  }

  // If we go over 5000 roots, remove the oldest ones
  // (This helps prevent crashes or lag)
  if (roots.length > 5000) {
    roots.splice(0, 500);
  }

  // If sound is running, change the pitch based on root count and time
  if (osc) {
    let freq = 100 + sin(frameCount * 0.01) * 50 + roots.length * 0.05;
    osc.freq(freq);
  }
}
class Root {
  constructor(x, y, z) {
    // Starting point for the root
    this.x = x;
    this.y = y;
    this.z = z;

    // Random angles to move in
    this.angleXY = random(TWO_PI);
    this.angleZ = random(TWO_PI);

    // How fast it grows
    this.speed = random(0.5, 1.5);

    // How long this root has existed
    this.lifespan = 0;
  }

  grow() {
    // Calculate the next position based on direction and speed
    let nextX = this.x + cos(this.angleXY) * this.speed;
    let nextY = this.y + sin(this.angleXY) * this.speed;
    let nextZ = this.z + sin(this.angleZ) * this.speed;

    // Draw a line segment from the current to the next point
    line(this.x, this.y, this.z, nextX, nextY, nextZ);

    // Update position for the next frame
    this.x = nextX;
    this.y = nextY;
    this.z = nextZ;

    // Randomly adjust the angle — this makes the movement organic
    this.angleXY += random(-0.5, 0.5);
    this.angleZ += random(-0.5, 0.5);

    // Keep track of how long this root has been growing
    this.lifespan++;

    // Every so often, make a new root branch from here (recursive behavior)
    if (random(1) < 0.005 && this.lifespan > 15) {
      roots.push(new Root(this.x, this.y, this.z));
    }
  }
}

// When you click, this handles sound + visual changes
function mousePressed() {
  // Required for sound to work in modern browsers
  getAudioContext().resume();

  // If the oscillator hasn’t been created yet, create it now
  if (!osc) {
    osc = new p5.Oscillator("sine");
    osc.start(); // start sound
    osc.amp(0.02); // quiet to start
    osc.freq(100); // base frequency
    console.log("Oscillator started");
  }

  // Count clicks to toggle states
  count++;

  // Every other click, change stroke color and sound volume
  if (count % 2 === 0) {
    stroke(random(255), random(255), random(255)); // colorful lines
    osc.amp(0.1); // louder
  } else {
    stroke(255); // white lines
    osc.amp(0.02); // softer
  }
}

// If the browser window changes size, adjust the canvas
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
