
let sliders = [];
let variables = [];
let v = {};

let img;

let mouseState = 0;

function setup() {
  createCanvas(400, 400);

  for(let i = 0; i < 8; i++){
    sliders.push(createSlider(8, 100, 1, 0));
    variables.push(0);
  }

  img = createGraphics(width, height);
  pvalues = [0, 0, 0, 0, 0, 0, 0, 0];
}

let pvalues = [];
let change = false;

function draw() {
  values = [];

  for(let i = 0; i < 8; i++){
    values.push(sliders[i].value());
    if(values[i] !== pvalues[i]){
      change = true;
      background(255);
      variables = [0, 0, 0, 0, 0, 0, 0, 0];
    }
  }

  state = int(values[7] / 16.67);

  switch(state){
    case 0:
      home();
      break;
    case 1:
      wave();
      break;
    case 2:
      tree();
      break;
    case 3:
      star();
      break;
    case 4:
      bounce();
      break;
    case 5:
      runner();
      break;
  }

  change = false;
  for(let i = 0; i < 8; i++){
    pvalues[i] = values[i];
  }

  if(mouseState == 1){
    mouseState++;
  }
}

function home(){
  background(220);
  let message = "Morning Mason! Welcome to Website! See You On Mat! \n \n \n \n the bottom right slider changes app \nthe rest do either nothing or change variables of the app";

  text(message, 20, 20);
}


function wave(){
  let v = {
      wavelength: values[0],
      precision: 400 / int(values[1]),
      frequency: values[2],
      framerate: values[3],
      strength: values[4]
  };

  let t = variables[0];
  
  if(frameCount % (65 - v.framerate) == 0){
      background(0);
      img.background(0);
      img.push();
      img.translate(width / 2, height / 2);
      for(let x = -width / 2; x < width / 2; x += v.precision){
          for(let y = -height / 2 - v.precision * v.strength; y < height / 2 + v.precision * v.strength; y += v.precision){
              let z = v.precision * int(sin(((x ** 2 + y ** 2) ** 0.5) * TAU / (101 - v.wavelength) + t) * v.strength / v.precision);

              img.fill(x % 255, y % 255, z / v.strength * 255);

              img.rect(x, y - z, v.precision, v.precision);
              img.rect(-x, y - z, v.precision, v.precision);
          }
      }
      img.pop();

      variables[0] += (TAU / 100) * v.frequency;

      image(img, 0, 0);
  }
}

function tree(){
  v = {
    len: values[0],
    percentMin: values[1],
    percentMax: values[2],
    minA: values[3],
    maxA: values[4],
    stop: values[5] / 10,
    leafS: values[6]
  };

  if(change){
    background("#12afde");
    push();
    translate(200, 350);
    branch(v.len);
    pop();
  }
}

function branch(l){
  l *= random(v.percentMin, v.percentMax) / 100;
  if(l < v.stop){
      leaf();
      return;
  }
  push();
  line(0, 0, 0, -l);
  translate(0, -l);
  push();
  rotate(random(v.minA, v.maxA) * PI / 180);
  branch(l);
  pop();
  push();
  rotate(-random(v.minA, v.maxA) * PI / 180);
  branch(l);
  pop();
  pop();
}

function leaf(){
  push();
  noStroke();
  yellow = [255, 255, 0];
  color = [random(0, 255), random(0, 255), 0];
  avg = [
      (yellow[0] + color[0]) / 2,
      (yellow[1] + color[1]) / 2,
      (yellow[2] + color[2]) / 2,
  ];

  fill(avg);
  rotate(random(0, TAU));
  ellipse(0, 0, v.leafS);
  pop();
}


function star(){
  background(255);
  n = int(values[0] / 3);
  translate(width / 2, height / 2);
  scale(min(width, height) / 4);
  strokeWeight(4 / min(width, height));
  
  let points = [];
  for(let i = 0; i < n; i++){
      points.push({
          x: cos(i * TAU / n + n * 1.5),
          y: sin(i * TAU / n + n * 1.5)
      });
  }

  for(let i = 0; i < points.length; i++){
      for(let j = 0; j < points.length; j++){
          line(
              points[i].x,
              points[i].y,
              points[j].x,
              points[j].y
          );
      }
  }

  for(let i = 0; i < points.length; i++){
      push();
      stroke(255);
      strokeWeight(4 / min(width, height) * 2);
      j = (i + 1) % points.length;
      line(
          points[i].x,
          points[i].y,
          points[j].x,
          points[j].y
      );
      pop();
  }
}

function bounce() {
  if (abs(variables[0]) > 220) {
    variables[0] = 0;
  }

  if (abs(variables[1]) > 220) {
    variables[1] = 0;
  }

  if ((variables[2] == 0)) {
    variables[2] = sin(values[0] / (100 / TAU));
  }

  if ((variables[3] == 0)) {
    variables[3] = cos(values[0] / (100 / TAU));
  }

  let previousX = variables[0];
  let previousY = variables[1];

  for (let i = 0; i < values[1]; i++) {
    variables[4] %= 256;

    let timeToXBoundary;
    if (variables[2] > 0) {
      timeToXBoundary = (200 - variables[0]) / variables[2];
    } else if (variables[2] < 0) {
      timeToXBoundary = (-200 - variables[0]) / variables[2];
    } else {
      timeToXBoundary = Infinity; // No horizontal movement
    }

    let timeToYBoundary;
    if (variables[3] > 0) {
      timeToYBoundary = (200 - variables[1]) / variables[3];
    } else if (variables[3] < 0) {
      timeToYBoundary = (-200 - variables[1]) / variables[3];
    } else {
      timeToYBoundary = Infinity; // No vertical movement
    }

    let timeToNextBounce = Math.min(Math.abs(timeToXBoundary), Math.abs(timeToYBoundary));

    // Calculate the next position
    let nextX = variables[0] + variables[2] * timeToNextBounce;
    let nextY = variables[1] + variables[3] * timeToNextBounce;

    push();
    strokeWeight(2);
    translate(200, 200);
    colorMode(HSB);
    stroke(variables[4], 255, 255); // Use stroke for lines
    noFill();
    line(previousX, previousY, nextX, nextY); // Draw a line segment
    pop();

    // Update current position
    variables[0] = nextX;
    variables[1] = nextY;
    previousX = nextX; // Store current position for the next line segment
    previousY = nextY;

    // Handle bounces
    if (Math.abs(timeToXBoundary) <= Math.abs(timeToYBoundary) && isFinite(timeToXBoundary)) {
      variables[2] *= -1;
      variables[4] += 1;
    } else if (isFinite(timeToYBoundary)) {
      variables[3] *= -1;
      variables[4] += 1;
    }
  }
}

function runner(){
  if(variables[2] === 0){
    variables = [
      0,
      0,
      [],
      [],
      [],
      [],
      [],
      []
    ];
  }

  variables[1] += 1;

  let x = 100;
  let y = variables[0];
  let t = variables[1]
  let asteroids = variables[2];

  if(mouseState > 0){
    if(mouseY > 200){
      y += 4;
    }

    if(mouseY < 200){
      y -= 4;
    }
  }

  if(abs(y) > 200){
    y *= -.99
  }

  if(random(0, 100) < sqrt(t / 1000)){
    asteroids.push({
      x: 400,
      y: int(random(0, 10)) * 50 - 250
    });
  }

  push();

  background(0);

  translate(0, 200);

  fill("#aeaeae");
  ellipse(x, y, 50, 40)

  for(let i = 0; i < asteroids.length; i++){
    ellipse(
      asteroids[i].x,
      asteroids[i].y,
      50
    );

    asteroids[i].x -= sqrt(t / 100);

    if(
      sqrt(
        (asteroids[i].x - x) ** 2 +
        (asteroids[i].y - y) ** 2
      ) < 40
    ){
      variables[2] = 0
      pop();
      return;
    }

    if(asteroids[i].x < -10){
      for(let j = i; j < asteroids.length - 1; j++){
        asteroids[j] = asteroids[j + 1];
      }

      asteroids.pop();
    }
  }

  pop();

  variables[0] = y;
}

function mousePressed(){
  mouseState++;
}

function mouseReleased(){
  mouseState = 0;
}
