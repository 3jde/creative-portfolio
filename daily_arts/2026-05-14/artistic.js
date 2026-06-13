
let seed=42;function setup(){createCanvas(innerWidth,innerHeight);noStroke()}function draw(){randomSeed(seed);background('#f2eee6');let t=frameCount*.01;for(let i=0;i<42;i++){let x=random(width),y=random(height),w=random(40,220),h=random(12,180);let hue=['#151515','#e85d3f','#2f6df6','#efc64a','#7bbf7a'][i%5];fill(hue+hex(floor(65+55*sin(t+i)),2));rect(x+sin(t+i)*18,y+cos(t*.7+i)*12,w,h,18);}
fill(8,10,14,210);textSize(min(width,height)*.075);textStyle(BOLD);text('ambient\ninterfaces',32,70);fill(8,10,14,120);textSize(14);text('restraint + motion + touch clarity',34,height-34)}
function mousePressed(){seed=floor(random(99999))}function windowResized(){resizeCanvas(innerWidth,innerHeight)}
