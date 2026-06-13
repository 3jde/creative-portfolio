
let nodes=[];function setup(){createCanvas(innerWidth,innerHeight);for(let i=0;i<70;i++)nodes.push({x:random(width),y:random(height),vx:0,vy:0,r:random(5,18),c:color(random(80,260),random(90,230),255,170)});}
function draw(){background(8,10,18,70);for(let n of nodes){let dx=mouseX-n.x,dy=mouseY-n.y,d=max(25,sqrt(dx*dx+dy*dy));let force=(mouseIsPressed?9:3)/d; n.vx+=dx*force*.02; n.vy+=dy*force*.02; n.vx*=.92;n.vy*=.92;n.x+=n.vx;n.y+=n.vy;if(n.x<0||n.x>width)n.vx*=-1;if(n.y<0||n.y>height)n.vy*=-1;n.x=constrain(n.x,0,width);n.y=constrain(n.y,0,height)}
strokeWeight(1);for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){let a=nodes[i],b=nodes[j],d=dist(a.x,a.y,b.x,b.y);if(d<135){stroke(120,210,255,map(d,0,135,100,0));line(a.x,a.y,b.x,b.y)}}
noStroke();for(let n of nodes){fill(n.c);circle(n.x,n.y,n.r*2);fill(255,80);circle(n.x-n.r*.25,n.y-n.r*.25,n.r*.55)}}
function keyPressed(){if(key==='r'||key==='R')setup()}function windowResized(){resizeCanvas(innerWidth,innerHeight)}
