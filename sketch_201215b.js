var population = 200;
var personSize = 15;
var recoveryTime = 300;
var deathChance = 7; // Out of 100%
var socialDistance = 0; // Out of 100%

var _bounds = 700;
var _people = [];
var _collisions = true;

var _normalCount = 0;
var _sickCount = 0;
var _recoveryCount = 0;
var _deathCount = 0;
var _socialDistanceCount = 0;

var _normalColor;
var _sickColor;
var _recoveryColor;
var _deadColor;

const NORMAL = 0;
const SICK = 1;
const RECOVER = 2;
const DEAD = 3;

function setup() {
  createCanvas(_bounds, _bounds + 100);
  
  textStyle(BOLD);
  
  _normalColor = color(80, 200, 80);
  _sickColor = color(100, 70, 0);
  _recoveryColor = color(203, 138, 192);
  _deadColor = color(200, 70, 70);
  
  _noDistButton = createButton("aucune distanciation sociale ");
  _noDistButton.position(0, _bounds - 25);
  _noDistButton.mousePressed(onNoDistTriggered);
  
  _lowDistButton = createButton("Distanciation sociale faible");
  _lowDistButton.position(130, _bounds - 25);
  _lowDistButton.mousePressed(onLowDistTriggered);
  
  _highDistButton = createButton("Distanciation sociale Forte");
  _highDistButton.position(270, _bounds - 25);
  _highDistButton.mousePressed(onHighDistTriggered);
  
  _collisionsButton = createButton("Eliminer les collisions");
  _collisionsButton.position(410, _bounds - 25);
  _collisionsButton.mousePressed(onCollisionsTriggered);
  
  resetSim();
}

function draw() {
  noStroke();
  fill(255);
  rect(0, 0, _bounds, _bounds);
  
  for (let i = 0; i < _people.length; i++) {
    _people[i].move();
    _people[i].display();
  }
  
  displayStats();
  
  if (_sickCount == 0) {
    displayEnd();
  } else {
    displayGraph();
  }
}

function resetSim() {
  frameCount = 0;
  _people = [];
  _normalCount = population;
  _sickCount = 0;
  _recoveryCount = 0;
  _deathCount = 0;
  _socialDistanceCount = 0;
  
  noStroke();
  fill(100);
  rect(0, _bounds, _bounds, _bounds - 100);
  
  for (let i = 0; i < population; i++) {
    let person = new Person(random(_bounds), random(_bounds));
    _people.push(person);
    
    if (i / population * 100 < socialDistance) {
      person.practiceSocialDistance();
    }
  }
  
  // Patient zero doesn't practice social distancing.
  for (let i = 0; i < _people.length; i++) {
    if (!_people[i].socialDistance) {
      _people[i].setState(SICK);
      break;
    }
  }
}

function displayStats() {
  noStroke();
  textAlign(LEFT);
  textSize(20);
  
  fill(255, 200);
  rect(0, 0, 200, 130);
  
  fill(0);
  text("Total: " + _people.length, 10, 20);
  text("Social distance: " + _socialDistanceCount + " (" + percentage(_socialDistanceCount, _people.length) + "%)", 10, 40);
  
  fill(_normalColor);
  text("Healthy: " + _normalCount + " (" + percentage(_normalCount, _people.length) + "%)", 10, 60);
  
  fill(_sickColor);
  text("Sick: " + _sickCount + " (" + percentage(_sickCount, _people.length) + "%)", 10, 80);
  
  fill(_recoveryColor);
  text("Recovered: " + _recoveryCount + " (" + percentage(_recoveryCount, _people.length) + "%)", 10, 100);
  
  fill(_deadColor);
  text("Passed: " + _deathCount + " (" + percentage(_deathCount, _people.length) + "%)", 10, 120);
}

function displayGraph() {
  let sickHeight = map(_sickCount, 0, _people.length, height - 100, height) - _bounds;
  let normalHeight = map(_normalCount, 0, _people.length, height - 100, height) - _bounds;
  let recoveryHeight = map(_recoveryCount, 0, _people.length, height - 100, height) - _bounds;
  let deadHeight = map(_deathCount, 0, _people.length, height - 100, height) - _bounds;
  
  let brighter = 60;
  let speed = frameCount * 0.25;
  let y = height;
  
  strokeWeight(1);
  
  stroke(_deadColor);
  line(speed, y, speed, y - deadHeight);
  
  stroke(red(_deadColor) + brighter, green(_deadColor) + brighter, blue(_deadColor) + brighter);
  point(speed - 1, y - deadHeight);
  y -= deadHeight;
  
  stroke(_sickColor);
  line(speed, y, speed, y - sickHeight);
  
  stroke(red(_sickColor) + brighter, green(_sickColor) + brighter, blue(_sickColor) + brighter);
  point(speed - 1, y - sickHeight);
  y -= sickHeight;
  
  stroke(_normalColor);
  line(speed, y, speed, y - normalHeight);
  y -= normalHeight;
  
  stroke(_recoveryColor);
  line(speed, y, speed, y - recoveryHeight);
  
  stroke(red(_recoveryColor) + brighter, green(_recoveryColor) + brighter, blue(_recoveryColor) + brighter);
  point(speed - 1, y);
}

function displayEnd() {
  noStroke();
  fill(200, 70, 70);
  textAlign(CENTER);
  textSize(70);
  text("RESULTS", width / 2, height / 2);
}

function percentage(value, maxValue) {
  return (value / maxValue * 100.0).toFixed(1);
}

function onNoDistTriggered() {
  socialDistance = 0;
  resetSim();
}

function onLowDistTriggered() {
  socialDistance = 30;
  resetSim();
}

function onHighDistTriggered() {
  socialDistance = 85;
  resetSim();
}

function onCollisionsTriggered() {
  _collisions = !_collisions;
  
  if (_collisions) {
    _collisionsButton.html("Disable collisions");
  } else {
    _collisionsButton.html("Enable collisions");
  }
  
  resetSim();
}
