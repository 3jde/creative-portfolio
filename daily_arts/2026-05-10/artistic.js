let seed=16;
function setup(){createCanvas(windowWidth,windowHeight);noLoop();}
function windowResized(){resizeCanvas(windowWidth,windowHeight);redraw();}
function mousePressed(){seed=floor(random(99999));redraw();}
function draw(){
  randomSeed(seed); noiseSeed(seed); background('#f6efe3');
  const palette=['#16213e','#0f766e','#d97706','#be123c','#6d28d9','#111827'];
  strokeCap(ROUND);
  for(let i=0;i<135;i++){
    const x=random(width), y=random(height), len=random(60,260), drift=random(-1.2,1.2);
    stroke(random(palette)+'cc'); strokeWeight(random(.8,3.8)); noFill();
    beginShape();
    for(let s=0;s<42;s++){
      const u=s/41, n=noise(x*.003+s*.05,y*.003+i);
      curveVertex(x + (n-.5)*90 + sin(u*PI)*drift*70, y - u*len + sin(u*TWO_PI+i)*12);
    }
    endShape();
  }
  noStroke();
  for(let i=0;i<38;i++){
    fill(random(palette)+'18');
    const r=random(70,220); ellipse(random(width),random(height),r,r*random(.18,.55));
  }
  fill(20,20,24,145); textSize(12); textAlign(RIGHT,BOTTOM);
  text('seed '+seed+' · quiet signal garden',width-18,height-16);
}
