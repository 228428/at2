let roots = []; // Array to hold all root objects
let count = 0; // Counter to toggle color/sound modes
let osc = null; // Oscillator for sound (initialized on first click)

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  background("#45FA89"); // Soft green background
  stroke("#FA3F09"); // Vivid orange roots
  noFill();

  roots.push(new Root(0, 0, 0)); // Start with one root from center
}

function draw() {
  background("#45FA89");
  orbitControl(); // Allow mouse rotation/zoom of 3D scene

  // Dynamic stroke thickness adds visual complexity
  strokeWeight(0.3 + noise(frameCount * 0.01) * 1.5);

  // Grow each root
  for (let r of roots) {
    r.grow();
  }

  // Occasionally add new root branches (recursive behavior)
  if (frameCount % 10 === 0 && roots.length < 2000) {
    let r = random(roots);
    roots.push(new Root(r.x, r.y, r.z));
  }

  // Limit root array to avoid browser crashing
  if (roots.length > 5000) {
    roots.splice(0, 500);
  }

  // Dynamically update sound frequency based on movement and size
  if (osc) {
    let freq = 100 + sin(frameCount * 0.01) * 50 + roots.length * 0.05;
    osc.freq(freq);
  }
}

// Root class for organic 3D movement and branching
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
    // Calculate next position
    let nextX = this.x + cos(this.angleXY) * this.speed;
    let nextY = this.y + sin(this.angleXY) * this.speed;
    let nextZ = this.z + sin(this.angleZ) * this.speed;

    // Draw line segment
    line(this.x, this.y, this.z, nextX, nextY, nextZ);

    // Update position
    this.x = nextX;
    this.y = nextY;
    this.z = nextZ;

    // Organic movement
    this.angleXY += random(-0.5, 0.5);
    this.angleZ += random(-0.5, 0.5);

    this.lifespan++;

    // Random branching (recursion)
    if (random(1) < 0.005 && this.lifespan > 15) {
      roots.push(new Root(this.x, this.y, this.z));
    }
  }
}

// User interaction: toggle colors and start sound
function mousePressed() {
  // Resume audio context (required for browser autoplay policy)
  getAudioContext().resume();

  // Start oscillator only once
  if (!osc) {
    osc = new p5.Oscillator("sine");
    osc.start();
    osc.amp(0.02); // Soft volume to start
    osc.freq(100);
  }

  // Toggle visual and audio intensity
  count++;
  if (count % 2 === 0) {
    stroke(random(255), random(255), random(255)); // Random color stroke
    osc.amp(0.1); // Louder sound
  } else {
    stroke("#FA3F09"); // Return to original orange stroke
    osc.amp(0.02); // Softer sound
  }
}

// Resize canvas when browser window changes
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
