let stairs=[];
function setup(){createCanvas(windowWidth,windowHeight,WEBGL);pixelDensity(1);for(let i=0;i<38;i++)stairs.push({a:random(TWO_PI),r:random(90,620),y:random(-500,500),w:random(90,240),turn:random([-1,1])});}
function draw(){background(20,17,13);perspective(PI/3,width/height,5,3000);let mx=(mouseX/width-.5),my=(mouseY/height-.5);rotateX(-.22+my*.24);rotateY(frameCount*.0015+mx*.42);ambientLight(45,38,29);pointLight(230,190,125,0,-350,300);stroke(171,145,103,165);strokeWeight(1);noFill();
  push();rotateX(HALF_PI);for(let r=120;r<900;r+=85){beginShape();for(let a=0;a<TWO_PI+.1;a+=.12)vertex(cos(a)*r,sin(a)*r,noise(a*2,r)*40);endShape();}pop();
  for(let s of stairs){push();rotateY(s.a+sin(frameCount*.004+s.r)*.08);translate(s.r,s.y,0);rotateZ(s.turn*.16);for(let j=0;j<10;j++){push();translate(j*s.w/10,-j*9,0);box(s.w/10,7,70);pop();}stroke(205,175,122,120);line(0,0,-45,s.w,-90,-45);line(0,0,45,s.w,-90,45);pop();}
  let speed=mouseIsPressed?2.2:.55;for(let i=0;i<130;i++){let a=i*2.399+frameCount*.001*speed,r=70+(i%31)*23,y=((i*71-frameCount*speed)%1100)-550;push();rotateY(a);translate(r,y,0);noStroke();fill(216,179,112,90);sphere(1.7+(i%4),5,4);pop();}}
function windowResized(){resizeCanvas(windowWidth,windowHeight);}
