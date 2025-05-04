let roots = [];
let count = 0;
let osc = null;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  background(20);
  stroke(255);
  noFill();
  roots.push(new Root(0, 0, 0));
  console.log("Sketch loaded. Click to begin sound.");
}

function draw() {
  background(20);
  orbitControl();

  strokeWeight(0.3 + noise(frameCount * 0.01) * 1.5);

  for (let r of roots) {
    r.grow();
  }

  if (frameCount % 10 === 0 && roots.length < 2000) {
    let r = random(roots);
    roots.push(new Root(r.x, r.y, r.z));
  }

  if (roots.length > 5000) {
    roots.splice(0, 500);
  }

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
  getAudioContext().resume();

  if (!osc) {
    osc = new p5.Oscillator("sine");
    osc.start();
    osc.amp(0.02);
    osc.freq(100);
    console.log("Oscillator started");
  }

  count++;

  if (count % 2 === 0) {
    stroke(random(255), random(255), random(255));
    osc.amp(0.1);
  } else {
    stroke(255);
    osc.amp(0.02);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
