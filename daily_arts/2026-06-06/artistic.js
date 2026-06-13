// Sketch C — Artistic Quality: Van Gogh's Irises transformed into a living wet-pigment garden.
let flowers=[], grains=[];
function setup(){ createCanvas(windowWidth, windowHeight); pixelDensity(min(2, displayDensity())); colorMode(HSB,360,100,100,100); initGarden(); }
function windowResized(){ resizeCanvas(windowWidth, windowHeight); initGarden(); }
function initGarden(){ flowers=[]; grains=[]; randomSeed(60606); for(let i=0;i<42;i++) flowers.push(makeIris(random(width), random(height*.42,height*.92), random(.55,1.35))); for(let i=0;i<900;i++) grains.push({x:random(width),y:random(height),a:random(4,16)}); }
function makeIris(x,y,k){ return {x,y,k,phase:random(TAU),h:random([238,252,268,285]),lean:random(-.4,.4),open:random(.45,1)}; }
function draw(){ background(105,27,13); drawWash(); let wind=map(mouseX||width/2,0,width,-1,1); flowers.sort((a,b)=>a.y-b.y); for(const f of flowers) drawIris(f,wind); drawRainMemory(wind); }
function drawWash(){ noStroke(); for(let y=0;y<height;y+=9){ let h=lerp(88,126,y/height)+sin(frameCount*.006+y*.02)*5; fill(h,34,18+20*y/height,36); rect(0,y,width,10); } for(const g of grains){ fill(54,35,random(55,83),g.a); circle(g.x,g.y,random(.4,1.8)); } }
function drawIris(f,wind){ const sway=sin(frameCount*.025+f.phase)*9* f.k + wind*18*f.k; push(); translate(f.x+sway, f.y); rotate(f.lean+wind*.12); stroke(112,44,42,70); strokeWeight(2.4*f.k); noFill(); bezier(0,0, -10*f.k,-45*f.k, 11*f.k,-88*f.k, sway*.18,-130*f.k); translate(sway*.18,-132*f.k); noStroke();
  for(let i=0;i<6;i++){ let ang=i*TAU/6+sin(frameCount*.012+f.phase)*.08; let len=(34+8*sin(i+f.phase))*f.k*f.open; push(); rotate(ang); fill(f.h+random(-2,2),58,72,76); ellipse(len*.36,0,len,15*f.k); fill(f.h+18,44,94,26); ellipse(len*.28,0,len*.65,5*f.k); pop(); }
  fill(44,78,92,88); circle(0,0,8*f.k); fill(64,68,96,70); ellipse(-5*f.k,-2*f.k,14*f.k,5*f.k); pop(); }
function drawRainMemory(wind){ strokeWeight(1); for(let i=0;i<130;i++){ let x=(i*37+frameCount*(.25+wind*.4))%width; let y=(i*83+sin(frameCount*.01+i)*26)%height; stroke(210,18,86,13); line(x,y,x+wind*18,y+random(6,18)); } }
function plant(){ flowers.push(makeIris(mouseX, mouseY, random(.7,1.2))); if(flowers.length>68) flowers.shift(); }
function mousePressed(){ plant(); return false; }
function touchStarted(){ plant(); return false; }
