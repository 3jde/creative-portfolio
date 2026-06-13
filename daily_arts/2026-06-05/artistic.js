let seed=9,stars=[];
function setup(){createCanvas(windowWidth,windowHeight);reset();}
function reset(){randomSeed(seed++);stars=[];for(let i=0;i<180;i++)stars.push({a:random(TWO_PI),r:pow(random(),.55)*min(width,height)*.52,z:random(1,4)});}
function draw(){background('#09101d');translate(width/2,height*.52);blendMode(ADD);noStroke();for(let s of stars){let pulse=.55+.45*sin(frameCount*.015+s.a*8);fill(70+s.z*24,105+s.z*20,150+s.z*18,100*pulse);circle(cos(s.a)*s.r,sin(s.a)*s.r,s.z*pulse);}
  let open=map(constrain(mouseX,0,width),0,width,.18,1.15),R=min(width,height)*.34;noFill();for(let i=0;i<9;i++){stroke(219,147+i*7,55,48);strokeWeight(1);arc(0,0,R*2-i*18,R*2-i*18,-PI*.83+sin(frameCount*.004+i)*.08,PI*.25);}
  blendMode(BLEND);stroke('#f0b950');strokeWeight(4);line(0,-R*.93,-sin(open)*R,cos(open)*R*.72);line(0,-R*.93,sin(open)*R,cos(open)*R*.72);strokeWeight(11);point(0,-R*.93);strokeWeight(2);circle(0,-R*.93,28);fill(235,155,60,45);noStroke();circle(0,0,R*.8+sin(frameCount*.01)*12);}
function mousePressed(){reset();}function touchStarted(){reset();return false;}function windowResized(){resizeCanvas(windowWidth,windowHeight);reset();}
