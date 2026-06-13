// Signal Bloom: WebGL particle mandala inspired by generative/spatial UI trends.
let pts=[];
function setup(){createCanvas(windowWidth,windowHeight,WEBGL);pixelDensity(min(2,devicePixelRatio));colorMode(HSB,360,100,100,100);for(let i=0;i<1400;i++){pts.push({a:random(TAU),r:random(40,min(width,height)*.48),z:random(-260,260),s:random(.4,2.2)});} }
function draw(){background(235,55,5);rotateY(frameCount*.002);rotateX(sin(frameCount*.006)*.45);blendMode(ADD);noStroke();for(const p of pts){let t=frameCount*.012*p.s;let rr=p.r+sin(t+p.a*8)*38;let x=cos(p.a+t*.05)*rr,y=sin(p.a*3+t*.08)*rr*.55,z=p.z+sin(t+p.r)*90;push();translate(x,y,z);fill((190+rr*.25+frameCount*.35)%360,85,95,42);sphere(1.8+p.s*1.2,6,4);pop();}blendMode(BLEND);}
function windowResized(){resizeCanvas(windowWidth,windowHeight);}
