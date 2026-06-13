
let pts=[];function setup(){createCanvas(innerWidth,innerHeight,WEBGL);pixelDensity(1);for(let i=0;i<1200;i++)pts.push({a:random(TAU),r:random(40,420),z:random(-360,360),s:random(1,4),h:random(180,310)});}
function draw(){background(3,4,10);rotateX(sin(frameCount*.004)*.45);rotateY(frameCount*.002+(mouseX-width/2)*.0005);blendMode(ADD);noStroke();for(const p of pts){let pulse=sin(frameCount*.025+p.r*.02+p.z*.01);let mx=map(mouseX,0,width,-1,1), my=map(mouseY,0,height,-1,1);let x=cos(p.a+frameCount*.003+pulse*.08)*p.r + mx*p.z*.45;let y=sin(p.a*1.7+frameCount*.002)*p.r*.55 + my*p.z*.3;let z=p.z+sin(frameCount*.01+p.a)*90;fill(p.h,180,255,70);push();translate(x,y,z);sphere(p.s+pulse*1.5,6,4);pop();}
blendMode(BLEND);}
function windowResized(){resizeCanvas(innerWidth,innerHeight)}
