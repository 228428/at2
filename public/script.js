// 3D Glitchy Fungal Roots with Sound & Interactive Chaos
// Uses recursion, iteration, arrays, boolean logic, classes, sound, and effective complexity

let roots = []; // array to hold root branches
let count = 0; // used to toggle color/sound
let osc = null; // sound oscillator, created after user interaction

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  background("#45FA89"); // bright green background
  stroke("#FA3F09"); // bright orange roots
  noFill();

  // Start with a single root from center
  roots.push(new Root(0, 0, 0));
}

function draw() {
  background("#45FA89");
  orbitControl(); // allows camera control with mouse

  // dynamic stroke weight adds visual movement
  strokeWeight(0.3 + noise(frameCount * 0.01) * 1.5);

  // grow each root
  for (let r of roots) {
    r.grow();
  }

  // randomly add new roots
  if (frameCount % 10 === 0 && roots.length < 2000) {
    let r = random(roots);
    roots.push(new Root(r.x, r.y, r.z));
  }

  // remove oldest roots if too many (avoids crash)
  if (roots.length > 5000) {
    roots.splice(0, 500);
  }

  // if oscillator has started, update frequency with chaos
  if (osc) {
    let freq = 100 + sin(frameCount * 0.01) * 50 + roots.length * 0.05;
    osc.freq(freq);
  }
}

// Root class for 3D recursive growth
class Root {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.angleXY = random(TWO_PI);
    this.angleZ = random(TWO_PI);
    this.speed = random(0.5, 1.5);
    this.lifespan = 0;
  }

  grow() {
    let nextX = this.x + cos(this.angleXY) * this.speed;
    let nextY = this.y + sin(this.angleXY) * this.speed;
    let nextZ = this.z + sin(this.angleZ) * this.speed;

    line(this.x, this.y, this.z, nextX, nextY, nextZ);

    this.x = nextX;
    this.y = nextY;
    this.z = nextZ;

    this.angleXY += random(-0.5, 0.5);
    this.angleZ += random(-0.5, 0.5);
    this.lifespan++;

    // occasionally create a new branch (recursive growth)
    if (random(1) < 0.005 && this.lifespan > 15) {
      roots.push(new Root(this.x, this.y, this.z));
    }
  }
}

// Mouse interaction: starts sound and toggles glitchy visuals
function mousePressed() {
  // Start oscillator on first click
  if (!osc) {
    osc = new p5.Oscillator("sine");
    osc.start();
    osc.amp(0.02); // soft start
    osc.freq(100);
  }

  count++;

  if (count % 2 === 0) {
    stroke(random(255), random(255), random(255)); // random color
    osc.amp(0.1); // louder sound
  } else {
    stroke("#FA3F09"); // default stroke
    osc.amp(0.02); // softer sound
  }
}

// resize canvas if window size changes
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
