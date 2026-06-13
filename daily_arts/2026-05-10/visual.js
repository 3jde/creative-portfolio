let t = 0;
function setup(){createCanvas(windowWidth,windowHeight,WEBGL);pixelDensity(min(2,devicePixelRatio||1));}
function windowResized(){resizeCanvas(windowWidth,windowHeight);}
function draw(){
  t += 0.01;
  background(5,7,19);
  const mx = map(mouseX,0,width,-0.7,0.7,true), my = map(mouseY,0,height,-0.7,0.7,true);
  rotateX(-0.45+my); rotateY(t*0.32+mx);
  blendMode(ADD);
  noFill();
  for(let layer=0; layer<9; layer++){
    const r = 70 + layer*34 + sin(t*2+layer)*10;
    stroke(60+layer*18,190,255,38+layer*8);
    strokeWeight(1.1);
    beginShape(POINTS);
    for(let i=0;i<420;i++){
      const a=i*.618+layer, b=i*.043+t*(.45+layer*.02);
      const pulse=sin(i*.09+t*4+layer)*18;
      vertex(cos(a)*r + cos(b*3)*pulse, sin(b*2)*r*.55, sin(a)*r + sin(b*4)*pulse);
    }
    endShape();
  }
  blendMode(BLEND);
  directionalLight(100,210,255,0.3,0.4,-1); ambientLight(20,40,70);
  for(let i=0;i<18;i++){
    push();
    const a=TWO_PI*i/18+t*.7, rr=180+sin(t*2+i)*34;
    translate(cos(a)*rr, sin(t+i)*55, sin(a)*rr);
    rotateX(t+i); rotateY(a);
    specularMaterial(80,220,255,125); shininess(80);
    cone(15+sin(i)*5,58,5,1);
    pop();
  }
}
