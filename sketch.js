let bodies = [];
let G = 1; // Initial Gravitational constant
let gSlider;
let numSlider;
let massSliders = [];

function setup() {
  createCanvas(800, 800);

  // Create sliders for G and number of bodies
  gSlider = createSlider(0, 10, 1, 0.1);
  gSlider.position(10, 10);

  numSlider = createSlider(1, 20, 2, 1);
  numSlider.position(10, 40);

  // Initialize bodies based on initial slider value
  initializeBodies(numSlider.value());
}

function draw() {
  background(0);

  // Update the value of G from the slider
  G = gSlider.value();

  // Update the number of bodies if the slider changes
  if (bodies.length !== numSlider.value()) {
    initializeBodies(numSlider.value());
  }

  // Update bodies and show them
  for (let i = 0; i < bodies.length; i++) {
    bodies[i].mass = massSliders[i].value(); // Update mass from individual slider
    bodies[i].update();
    bodies[i].show();
  }

  // Display the current value of G and number of bodies
  fill(255);
  noStroke();
  textSize(16);
  text("G: " + nf(G, 1, 2), gSlider.x * 2 + gSlider.width, 25);
  text(
    "Number of bodies: " + numSlider.value(),
    numSlider.x * 2 + numSlider.width,
    55
  );
}

function initializeBodies(num) {
  bodies = [];
  let centerX = width / 2;
  let centerY = height / 2;
  let baseRadius = 200; // Base radius for the ring
  let radiusVariation = 20; // Variation in the radius

  // Remove old sliders
  for (let slider of massSliders) {
    slider.remove();
  }
  massSliders = [];

  for (let i = 0; i < num; i++) {
    let angle = (TWO_PI * i) / num;
    let randomRadius = baseRadius + random(-radiusVariation, radiusVariation);
    let x = centerX + randomRadius * cos(angle);
    let y = centerY + randomRadius * sin(angle);

    let pos = createVector(x, y);
    let vel = createVector(0, 0); // Zero initial velocity
    let acc = p5.Vector.random2D().mult(random(0.1, 0.3)); // Random initial acceleration
    let mass = random(10, 30);

    bodies.push(new Body(pos, vel, acc, mass));

    // Create individual mass sliders
    let slider = createSlider(10, 100, mass, 1);
    slider.position(10, 70 + i * 30);
    massSliders.push(slider);
  }
}

class Body {
  constructor(pos, vel, acc, mass) {
    this.pos = pos;
    this.vel = vel;
    this.acc = acc;
    this.mass = mass;
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  }

  calculateAttraction(other) {
    let force = p5.Vector.sub(other.pos, this.pos);
    let distance = force.mag();
    let strength = (G * this.mass * other.mass) / (distance * distance);
    force.setMag(strength);
    return force;
  }

  update() {
    for (let other of bodies) {
      if (other != this) {
        let force = this.calculateAttraction(other);
        this.applyForce(force);
      }
    }
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0); // Reset acceleration each frame
  }

  show() {
    stroke(255);
    strokeWeight(2);
    fill(255, 100);
    ellipse(this.pos.x, this.pos.y, sqrt(this.mass) * 3); // Radius is sqrt(mass)
  }
}
