// Quiet Machines: restrained generative composition; tap/click to reseed.
let seed=5082026,palette=['#101820','#f2aa4c','#6b7a8f','#d9cab3','#3b7a57'];
function setup(){createCanvas(windowWidth,windowHeight);noLoop();}
function draw(){randomSeed(seed);background('#f3efe6');noFill();for(let layer=0;layer<58;layer++){let x=random(width),y=random(height),r=random(24,180),c=color(random(palette));c.setAlpha(random(28,92));stroke(c);strokeWeight(random(.6,3));beginShape();for(let a=0;a<TAU+.1;a+=TAU/90){let wob=1+noise(cos(a)*1.8+layer,sin(a)*1.8+seed*.001)*.42;curveVertex(x+cos(a)*r*wob,y+sin(a)*r*wob);}endShape(CLOSE);}noStroke();fill('#101820');textSize(13);text('Quiet Machines / generative composition / click to reseed',18,height-22);}
function mousePressed(){seed++;draw();} function touchStarted(){seed++;draw();return false;} function windowResized(){resizeCanvas(windowWidth,windowHeight);draw();}
