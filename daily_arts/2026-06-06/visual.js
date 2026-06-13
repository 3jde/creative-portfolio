// Sketch A — Visual Impact: Hokusai's Great Wave reinterpreted as animated woodcut strata.
let ribs = [], foamBursts = [];
function setup(){ createCanvas(windowWidth, windowHeight, WEBGL); pixelDensity(min(2, displayDensity())); noStroke();
  for(let i=0;i<52;i++) ribs.push({phase:random(TAU), z:map(i,0,51,-360,260), hue:random(.85,1.12)});
}
function windowResized(){ resizeCanvas(windowWidth, windowHeight); }
function pointer(){ return createVector((mouseX-width/2)/width, (mouseY-height/2)/height); }
function draw(){
  background(5,14,34); const p=pointer(); const t=millis()*0.001;
  ambientLight(24,35,70); directionalLight(255,226,150, -0.35, .5, -1); pointLight(80,150,255, p.x*900, p.y*620, 420);
  rotateX(-0.42+p.y*.55); rotateY(p.x*.82+sin(t*.21)*.12); translate(0,40,-40);
  // moon-disc / Fuji triangle compressed into a navigational beacon, not a literal copy
  push(); translate(170,-185,-260); emissiveMaterial(244,203,104); torus(46,3,48,8); pop();
  push(); translate(80,78,-235); rotateX(PI/2); ambientMaterial(34,54,86); cone(88,135,4,1); pop();
  for(let i=0;i<ribs.length;i++) drawRib(ribs[i], i, t, p);
  for(let i=foamBursts.length-1;i>=0;i--){ let b=foamBursts[i]; b.life-=.018; b.a+=.025; if(b.life<=0) foamBursts.splice(i,1); else drawFoam(b,t); }
}
function drawRib(r,i,t,p){
  const yBase=map(i,0,ribs.length-1,170,-105); const crest=sin(t*1.3+r.phase)*38 + p.y*70;
  push(); translate(-80, yBase+crest*.25, r.z); rotateZ(-0.18+sin(t+r.phase)*.05+p.x*.26);
  beginShape(TRIANGLE_STRIP);
  for(let k=0;k<70;k++){
    let u=map(k,0,69,-width*.56,width*.56); let curl=pow(max(0,(u+width*.12)/(width*.62)),2.2)*210;
    let wave=sin(k*.34+t*1.7+r.phase)*18 + sin(k*.11-t*.7)*32;
    let y=wave - curl*.36 + crest; let z=sin(k*.2+r.phase)*22;
    fill(lerpColor(color(12,58,105), color(236,239,218), constrain((curl+wave+150)/390,0,1)));
    vertex(u,y-6,z); vertex(u,y+6+curl*.025,z+12);
  }
  endShape();
  if(i%5===0){ ambientMaterial(245,241,214); for(let j=0;j<5;j++){ push(); let u=sin(t*.8+j+r.phase)*width*.34+80; translate(u, -48+sin(j+t)*30, 18+j*5); sphere(3+(i%3),8,4); pop(); } }
  pop();
}
function drawFoam(b,t){ push(); translate(b.x,b.y,b.z); rotateY(t+b.a); ambientMaterial(255,245,210,210*b.life); for(let i=0;i<18;i++){ push(); rotateZ(i*TAU/18+b.a); translate(18+54*(1-b.life), sin(i)*12, cos(i*2)*18); sphere(2+4*b.life,8,4); pop(); } pop(); }
function mousePressed(){ foamBursts.push({x:(mouseX-width/2)*.9,y:(mouseY-height/2)*.75,z:random(-180,140),life:1,a:0}); return false; }
function touchStarted(){ mousePressed(); return false; }
