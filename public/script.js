let roots = [];
let count = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  background("#45FA89");
  stroke("#FA3F09");
  noFill();
  roots.push(new Root(0, 0, 0)); // Start at center (0,0,0) in 3D space
}

function draw() {
  background("#45FA89"); // Refresh background every frame
  orbitControl(); // Allow mouse to rotate and zoom the scene

  strokeWeight(1.5 + frameCount / 300);

  for (let r of roots) {
    r.grow();
  }

  if (frameCount % 10 === 0 && roots.length < 1000) {
    let r = random(roots);
    roots.push(new Root(r.x, r.y, r.z));
  }
}

class Root {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.angleXY = random(TWO_PI);
    this.angleZ = random(TWO_PI);
    this.speed = random(0.5, 2);
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
  if (count === 0) {
    stroke("#231a10");
    count = 1;
  } else {
    stroke("#b4ffc8");
    count = 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
