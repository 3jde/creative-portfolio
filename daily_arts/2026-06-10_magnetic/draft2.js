let nodes=[], pulse=0;
function setup(){
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  reset();
}
function reset(){
  nodes=[];
  // Focus nodes starting near the center
  for(let i=0; i<200; i++){
    nodes.push({
      p: createVector(width/2 + random(-100, 100), height/2 + random(-100, 100)),
      v: p5.Vector.random2D(),
      h: random(300, 360) // Hot pinks, reds, oranges
    });
  }
}
function draw(){
  background(0, 0, 5, 25);
  pulse *= 0.95;
  let target = createVector(mouseX, mouseY);
  
  for(let i=0; i<nodes.length; i++){
    let n = nodes[i];
    let force = p5.Vector.sub(target, n.p);
    let d = max(force.mag(), 15);
    
    // Stronger gravity towards center if not pressed
    let centerForce = p5.Vector.sub(createVector(width/2, height/2), n.p);
    centerForce.mult(0.0005);
    
    force.setMag((mouseIsPressed ? 10 : -0.5) / d * 30 + pulse / d);
    n.v.add(force);
    n.v.add(centerForce);
    n.v.add(p5.Vector.random2D().mult(0.08));
    n.v.limit(5);
    n.p.add(n.v);
    
    n.p.x = constrain(n.p.x, 0, width);
    n.p.y = constrain(n.p.y, 0, height);
  }
  
  blendMode(ADD);
  for(let i=0; i<nodes.length; i++){
    for(let j=i+1; j<nodes.length; j++){
      let d = p5.Vector.dist(nodes[i].p, nodes[j].p);
      if(d < 110){
        let alpha = map(d, 0, 110, 50, 0);
        stroke((nodes[i].h + frameCount*0.5) % 360, 90, 100, alpha);
        strokeWeight(map(d, 0, 110, 2.5, 0));
        line(nodes[i].p.x, nodes[i].p.y, nodes[j].p.x, nodes[j].p.y);
      }
    }
  }
  
  noStroke();
  for(const n of nodes){
    fill((n.h + frameCount*0.5) % 360, 90, 100, 90);
    circle(n.p.x, n.p.y, 3 + sin(frameCount*0.1 + n.h)*3);
  }
  blendMode(BLEND);
}
function keyPressed(){ if(key===' ') pulse=1200; }
function doubleClicked(){ reset(); }
function windowResized(){ resizeCanvas(windowWidth, windowHeight); reset(); }
