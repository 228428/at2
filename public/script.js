let roots = [];
let count = 0;
let osc = null;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  background(20); // Dark background
  stroke(255); // Bright white lines
  noFill();
  roots.push(new Root(0, 0, 0)); // Start from center
  console.log("Sketch started. Click to activate sound.");
}

function draw() {
  background(20); // Refresh every frame
  orbitControl(); // Allow camera control

  strokeWeight(0.5 + noise(frameCount * 0.01) * 1.5);

  // Grow all current roots
  for (let r of roots) {
    r.grow();
  }

  // Add new recursive root occasionally
  if (frameCount % 10 === 0 && roots.length < 2000) {
    let r = random(roots);
    roots.push(new Root(r.x, r.y, r.z));
  }

  // Prevent crash if too many roots
  if (roots.length > 5000) {
    roots.splice(0, 500);
  }

  // Update oscillator if active
  if (osc) {
    let freq = 100 + sin(frameCount * 0.01) * 50 + roots.length * 0.05;
    osc.freq(freq);
  }
}

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

    if (random(1) < 0.005 && this.lifespan > 15) {
      roots.push(new Root(this.x, this.y, this.z));
    }
  }
}

function mousePressed() {
  console.log("Mouse clicked");
  getAudioContext().resume();

  // Create oscillator on first interaction
  if (!osc) {
    osc = new p5.Oscillator("sine");
    osc.start();
    osc.amp(0.02);
    osc.freq(100);
    console.log("Oscillator started");
  }

  count++;

  if (count % 2 === 0) {
    stroke(random(255), random(255), random(255)); // random color
    osc.amp(0.1);
  } else {
    stroke(255); // reset to white
    osc.amp(0.02);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
