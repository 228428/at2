// Sketch inspired by organic roots, moiré, fractal and glitch techniques
// Using recursion, randomness, and effective complexity
// Developed in p5.js

let roots = [];
let count = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("#231a10"); // Dark soil color
  stroke("#b4ffc8"); // Light green roots
  noFill();
  roots.push(new Root(width / 2, height)); // Start with one root at the bottom center
}

function draw() {
  // Dynamic stroke weight to add 3D-like depth
  strokeWeight(frameCount / 150);

  for (let r of roots) {
    r.grow();
  }

  // Occasionally add new roots, inspired by fungal networks
  if (frameCount % 15 === 0 && roots.length < 1200) {
    let r = random(roots);
    roots.push(new Root(r.x, r.y));
  }
}

// Root class: grows recursively and organically
class Root {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = random(TWO_PI);
    this.speed = random(0.5, 2);
    this.lifespan = 0; // Track how long the root has been growing
  }

  grow() {
    let nextX = this.x + cos(this.angle) * this.speed;
    let nextY = this.y + sin(this.angle) * this.speed;

    line(this.x, this.y, nextX, nextY);

    this.x = nextX;
    this.y = nextY;

    // Slight random walk for organic feel
    this.angle += random(-0.5, 0.5);

    this.lifespan++;

    // Recursively split into new branches
    if (random(1) < 0.005 && this.lifespan > 20) {
      roots.push(new Root(this.x, this.y));
    }
  }
}

// Switch background and stroke color on mouse click (glitch-like effect)
function mousePressed() {
  if (count === 0) {
    background(180, 255, 200); // Light background
    stroke("#231a10"); // Dark roots
    count = 1;
  } else {
    background("#231a10"); // Dark background
    stroke("#b4ffc8"); // Light roots
    count = 0;
  }
}

// Optional: Handle window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
