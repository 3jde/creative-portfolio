const nodes=[]; let invert=false, waves=[];
function setup(){createCanvas(windowWidth,windowHeight);for(let i=0;i<44;i++)nodes.push({x:random(width),y:random(height),vx:0,vy:0,r:random(14,42),h:random(170,330)});}
function windowResized(){resizeCanvas(windowWidth,windowHeight);}
function keyPressed(){if(key===' ')invert=!invert;}
function mousePressed(){waves.push({x:mouseX,y:mouseY,r:0,a:180});}
function draw(){
  background(9,10,15,52);
  noStroke();
  const target=createVector(mouseX||width/2,mouseY||height/2);
  for(const n of nodes){
    const p=createVector(n.x,n.y), d=p5.Vector.sub(target,p), dist=max(45,d.mag());
    d.setMag((invert?-1:1)*900/(dist*dist));
    n.vx=(n.vx+d.x)*.965; n.vy=(n.vy+d.y)*.965;
    n.x+=n.vx; n.y+=n.vy;
    if(n.x<-80)n.x=width+80;if(n.x>width+80)n.x=-80;if(n.y<-80)n.y=height+80;if(n.y>height+80)n.y=-80;
    colorMode(HSB,360,100,100,100);
    fill((n.h+frameCount*.25)%360,72,95,34); circle(n.x,n.y,n.r*2.8);
    fill((n.h+40)%360,35,100,80); circle(n.x,n.y,n.r*.8);
  }
  noFill(); strokeWeight(2);
  for(const w of waves){stroke(190,70,100,w.a);circle(w.x,w.y,w.r);w.r+=12;w.a*=.94;}
  waves=waves.filter(w=>w.a>2);
  colorMode(RGB,255); stroke(255,255,255,30); strokeWeight(1);
  for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){const a=nodes[i],b=nodes[j],d=dist(a.x,a.y,b.x,b.y);if(d<130)line(a.x,a.y,b.x,b.y);}
}
