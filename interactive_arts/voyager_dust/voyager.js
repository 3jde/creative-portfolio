let stars = [];
const numStars = 60;
let voyagerRotation = 0;

const famousNames = ["EINSTEIN", "CURIE", "NEWTON", "HAWKING", "DA VINCI", "SHAKESPEARE", "MANDELA", "GANDHI", "TURING"];

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < numStars; i++) {
    stars.push(new Star());
  }
}

function draw() {
  background(0, 50);

  // 1. 绘制极简旅行者一号
  push();
  translate(width / 2, height / 2);
  rotate(voyagerRotation);
  drawVoyager();
  voyagerRotation += 0.001; // 极慢的旋转
  pop();

  // 2. 绘制穿越星尘
  for (let star of stars) {
    star.update();
    star.show();
  }
}

function drawVoyager() {
  stroke(255, 200);
  strokeWeight(2);
  noFill();
  
  // 天线圆盘
  arc(0, -30, 60, 20, PI, TWO_PI);
  line(-30, -30, 30, -30);
  
  // 机身主体
  rectMode(CENTER);
  rect(0, 0, 20, 40);
  
  // 天线杆
  line(0, -30, 0, -10);
  
  // 支架
  line(-10, 20, -25, 40);
  line(10, 20, 25, 40);
}

class Star {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(-width, width);
    this.y = random(-height, height);
    this.z = random(0, width);
    this.name = random(famousNames);
  }

  update() {
    this.z -= 2;
    if (this.z < 1) {
      this.reset();
    }
  }

  show() {
    let sx = map(this.x / this.z, 0, 1, 0, width);
    let sy = map(this.y / this.z, 0, 1, 0, height);
    let r = map(this.z, 0, width, 5, 1);
    
    fill(255);
    noStroke();
    ellipse(sx + width/2, sy + height/2, r);
    
    // 名字随距离变大而变淡
    fill(255, map(this.z, 0, width, 255, 50));
    textSize(r * 2);
    text(this.name, sx + width/2, sy + height/2 + 10);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}