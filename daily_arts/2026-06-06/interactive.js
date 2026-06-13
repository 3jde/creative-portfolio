// Sketch B — Novel Interaction: Vitruvian Man as a kinetic joint instrument.
let joints, bones, grabbed=-1, mode=0, lastTap=0;
function setup(){ createCanvas(windowWidth, windowHeight); pixelDensity(min(2, displayDensity())); resetBody(); }
function windowResized(){ resizeCanvas(windowWidth, windowHeight); resetBody(); }
function resetBody(){ const cx=width/2, cy=height/2, s=min(width,height)*.24; joints=[
 {n:'head',x:cx,y:cy-s*1.25,vx:0,vy:0},{n:'chest',x:cx,y:cy-s*.55,vx:0,vy:0},{n:'pelvis',x:cx,y:cy+s*.22,vx:0,vy:0},
 {n:'lh',x:cx-s*1.22,y:cy-s*.55,vx:0,vy:0},{n:'rh',x:cx+s*1.22,y:cy-s*.55,vx:0,vy:0},{n:'lf',x:cx-s*.72,y:cy+s*1.28,vx:0,vy:0},{n:'rf',x:cx+s*.72,y:cy+s*1.28,vx:0,vy:0},
 {n:'lwide',x:cx-s*1.55,y:cy-s*.16,vx:0,vy:0},{n:'rwide',x:cx+s*1.55,y:cy-s*.16,vx:0,vy:0},{n:'lsplit',x:cx-s*1.18,y:cy+s*1.22,vx:0,vy:0},{n:'rsplit',x:cx+s*1.18,y:cy+s*1.22,vx:0,vy:0}];
 bones=[[0,1],[1,2],[1,3],[1,4],[2,5],[2,6],[1,7],[1,8],[2,9],[2,10]]; }
function draw(){ background(22,15,10,70); const cx=width/2, cy=height/2, s=min(width,height)*.33;
 drawPaper(cx,cy,s); physics(cx,cy,s); drawBody(cx,cy,s); drawGlyphs(cx,cy,s); }
function drawPaper(cx,cy,s){ noFill(); strokeWeight(1.3); stroke(212,178,112,145); rectMode(CENTER); rect(cx,cy,s*1.65,s*1.65); circle(cx,cy,s*1.82); stroke(212,178,112,45); for(let i=-4;i<=4;i++){ line(cx-s*.82,cy+i*s*.18,cx+s*.82,cy+i*s*.18); line(cx+i*s*.18,cy-s*.82,cx+i*s*.18,cy+s*.82); } }
function physics(cx,cy,s){ const targetR=s*.91; for(let i=0;i<joints.length;i++){ let j=joints[i]; if(i===grabbed){ j.x=mouseX; j.y=mouseY; j.vx=j.vy=0; continue; } let dx=j.x-cx, dy=j.y-cy; if(mode===0){ let d=max(1,sqrt(dx*dx+dy*dy)); j.vx+=(cx+dx/d*targetR-j.x)*.004; j.vy+=(cy+dy/d*targetR-j.y)*.004; } else { let tx=constrain(j.x,cx-s*.82,cx+s*.82), ty=constrain(j.y,cy-s*.82,cy+s*.82); j.vx+=(tx-j.x)*.012; j.vy+=(ty-j.y)*.012; } j.vx+=sin(frameCount*.025+i)*.018; j.vy+=cos(frameCount*.021+i*2)*.018; j.vx*=.94; j.vy*=.94; j.x+=j.vx; j.y+=j.vy; } }
function drawBody(cx,cy,s){ strokeCap(ROUND); for(let b of bones){ let a=joints[b[0]], c=joints[b[1]]; stroke(64,31,18,180); strokeWeight(9); line(a.x,a.y,c.x,c.y); stroke(236,203,135,230); strokeWeight(3); line(a.x,a.y,c.x,c.y); }
 noStroke(); for(let i=0;i<joints.length;i++){ let j=joints[i]; fill(i===grabbed?color(255,227,120):color(185,89,46)); circle(j.x,j.y, i<3?17:13); fill(255,235,176,180); circle(j.x-2,j.y-2,4); } }
function drawGlyphs(cx,cy,s){ noFill(); stroke(113,78,42,90); strokeWeight(1); for(let i=0;i<joints.length;i++){ let j=joints[i]; line(cx,cy,j.x,j.y); arc(j.x,j.y,28+i%3*9,28+i%3*9,frameCount*.01+i,frameCount*.01+i+PI*.75); } fill(230,196,124,160); noStroke(); textAlign(CENTER); textSize(12); text(mode===0?'circle gravity':'square gravity',cx,cy+s*1.08); }
function nearest(){ let best=-1, bd=32; for(let i=0;i<joints.length;i++){ let d=dist(mouseX,mouseY,joints[i].x,joints[i].y); if(d<bd){bd=d; best=i;} } return best; }
function mousePressed(){ if(millis()-lastTap<320) resetBody(); lastTap=millis(); grabbed=nearest(); mode=1-mode; return false; }
function mouseReleased(){ grabbed=-1; return false; }
function touchStarted(){ mousePressed(); return false; } function touchEnded(){ mouseReleased(); return false; }
