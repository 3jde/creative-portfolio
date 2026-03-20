// p5.js WebGL Cyber Maze Game
let level = 1;
let cols, rows;
let cellSize;
let maze;
let ball;

let rotX = 0, rotZ = 0;
let maxRot;

// -1: start screen, 0: playing, 1: transition, 2: win
let gameState = -1;
let transitionTimer = 0;

let levelStartTime = 0;
let currentLevelTime = 0;
let newRecord = false;

let records = {};
let playerName = "";

function setup() {
    let canvas = createCanvas(800, 800, WEBGL);
    canvas.parent('game-container');
    maxRot = radians(20);
    
    // Prevent retina display lag by forcing density to 1
    pixelDensity(1); 

    // Load local storage records safely
    try {
        let saved = localStorage.getItem('cyberMazeRecords');
        if (saved) {
            records = JSON.parse(saved);
        }
    } catch(e) {
        records = {};
    }

    // Button Events via standard JS
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('restart-btn').addEventListener('click', restartGame);
    document.getElementById('quit-btn').addEventListener('click', quitGame);

    // Enter Key Start
    let nameInput = document.getElementById('player-name');
    nameInput.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            startGame();
        }
    });
}

function startGame() {
    let val = document.getElementById('player-name').value.trim();
    if (val === "") val = "Guest";
    playerName = val;

    document.getElementById('name-input-ui').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');

    document.getElementById('hud-player').innerText = `Player: ${playerName}`;
    level = 1;
    initLevel();
}

function restartGame() {
    document.getElementById('win-ui').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');
    level = 1;
    initLevel();
}

function quitGame() {
    document.getElementById('win-ui').classList.add('hidden');
    document.getElementById('name-input-ui').classList.remove('hidden');
    gameState = -1;
}

function initLevel() {
    if (level === 1) { cols = 5; rows = 5; }
    else if (level === 2) { cols = 8; rows = 8; }
    else if (level === 3) { cols = 12; rows = 12; }
    else { 
        gameState = 2; 
        showWinScreen();
        return; 
    }

    cellSize = 400.0 / max(cols, rows);
    maze = new Maze(cols, rows, cellSize);
    maze.generate();

    ball = new Ball(cellSize/2, cellSize/2, cellSize * 0.35);
    newRecord = false;
    document.getElementById('record-anim').classList.add('hidden');
    gameState = 0;
    
    document.getElementById('hud-level').innerText = `LEVEL: ${level}`;
    
    let best = getBestTime(playerName, level);
    if (best) {
        document.getElementById('hud-best').innerText = `BEST: ${best.toFixed(2)} s`;
    } else {
        document.getElementById('hud-best').innerText = "BEST: --";
    }

    levelStartTime = millis();
}

function draw() {
    // Clear background every frame
    background(25, 30, 40);

    if (gameState === -1 || gameState === 2) {
        return;
    }

    // Fix mouse logic to prevent extreme tilting initially
    let mX = constrain(mouseX, 0, width);
    let mY = constrain(mouseY, 0, height);
    
    // If mouse is at 0,0 (initial state before move), set it to center to prevent instant tilt
    if (mouseX === 0 && mouseY === 0) {
        mX = width / 2;
        mY = height / 2;
    }

    let targetRotZ = map(mX, 0, width, -maxRot, maxRot);
    let targetRotX = map(mY, 0, height, maxRot, -maxRot);

    rotX = lerp(rotX, targetRotX, 0.1);
    rotZ = lerp(rotZ, targetRotZ, 0.1);

    if (gameState === 0) {
        let gravityX = sin(rotZ) * 0.8;
        let gravityY = -sin(rotX) * 0.8;
        ball.applyForce(gravityX, gravityY);
        ball.update(maze);

        currentLevelTime = (millis() - levelStartTime) / 1000.0;
        // Throttle DOM updates to prevent performance drop
        if (frameCount % 5 === 0) {
            document.getElementById('hud-time').innerText = `TIME: ${currentLevelTime.toFixed(2)} s`;
        }

        let dx = ball.pos.x - maze.goalX;
        let dy = ball.pos.y - maze.goalY;
        if (sqrt(dx*dx + dy*dy) < cellSize/3) {
            checkRecord();
            gameState = 1;
            transitionTimer = 120;
        }
    } else if (gameState === 1) {
        ball.radius *= 0.9;
        ball.pos.lerp(createVector(maze.goalX, maze.goalY), 0.2);
        transitionTimer--;
        
        if (newRecord) {
            document.getElementById('record-anim').classList.remove('hidden');
        }

        if (transitionTimer <= 0) {
            level++;
            initLevel();
        }
    }

    // 3D Rendering
    push();
    rotateX(rotX);
    rotateZ(rotZ);

    // Fix glowing ball: Use moderate lights
    ambientLight(150, 150, 150);
    directionalLight(220, 220, 220, 0.5, 0.5, -1);
    directionalLight(100, 100, 120, -0.5, -0.5, -0.5); // Fill light

    translate(-cols*cellSize/2, -rows*cellSize/2, 0);

    // Base plate
    noStroke();
    fill(40, 50, 60);
    push();
    translate(cols*cellSize/2, rows*cellSize/2, -10);
    box(cols*cellSize, rows*cellSize, 20);
    pop();

    // Maze walls
    maze.display();

    // Goal (Hole)
    push();
    translate(maze.goalX, maze.goalY, 0.5);
    fill(5);
    noStroke();
    circle(0, 0, cellSize*0.7);
    pop();

    // Metallic Ball
    ball.display();

    pop();
}

function checkRecord() {
    let lvlKey = "Level_" + level;
    if (!records[playerName]) {
        records[playerName] = {};
    }

    let pRec = records[playerName];
    if (!pRec[lvlKey] || currentLevelTime < pRec[lvlKey]) {
        pRec[lvlKey] = currentLevelTime;
        try {
            localStorage.setItem('cyberMazeRecords', JSON.stringify(records));
        } catch(e) {}
        newRecord = true;
    }
}

function getBestTime(name, lvl) {
    if (records[name] && records[name]["Level_" + lvl]) {
        return records[name]["Level_" + lvl];
    }
    return null;
}

function showWinScreen() {
    document.getElementById('hud').classList.add('hidden');
    document.getElementById('record-anim').classList.add('hidden');
    document.getElementById('win-ui').classList.remove('hidden');
    
    document.getElementById('win-msg').innerText = `Master ${playerName}, you cleared all levels!`;

    let t1 = getBestTime(playerName, 1) || 0;
    let t2 = getBestTime(playerName, 2) || 0;
    let t3 = getBestTime(playerName, 3) || 0;
    
    document.getElementById('win-stats').innerText = `Lvl 1: ${t1.toFixed(2)}s | Lvl 2: ${t2.toFixed(2)}s | Lvl 3: ${t3.toFixed(2)}s`;
}

// -----------------------------
// Classes
// -----------------------------
class Ball {
    constructor(x, y, r) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.radius = r;
    }

    applyForce(gx, gy) {
        this.vel.x += gx;
        this.vel.y += gy;
        this.vel.mult(0.97); // friction
    }

    update(m) {
        this.pos.x += this.vel.x;
        this.checkCollision(m, true);
        this.pos.y += this.vel.y;
        this.checkCollision(m, false);
    }

    checkCollision(m, isX) {
        let cx = constrain(floor(this.pos.x / m.w), 0, m.cols - 1);
        let cy = constrain(floor(this.pos.y / m.w), 0, m.rows - 1);
        
        // Safety check against NaN
        if(isNaN(cx) || isNaN(cy)) return;
        
        let cell = m.grid[cx][cy];
        let padding = m.wallT / 2;

        if (isX) {
            if (cell.walls[3] && this.pos.x - this.radius < cx * m.w + padding) {
                this.pos.x = cx * m.w + this.radius + padding;
                this.vel.x *= -0.5;
            }
            if (cell.walls[1] && this.pos.x + this.radius > (cx+1) * m.w - padding) {
                this.pos.x = (cx+1) * m.w - this.radius - padding;
                this.vel.x *= -0.5;
            }
        } else {
            if (cell.walls[0] && this.pos.y - this.radius < cy * m.w + padding) {
                this.pos.y = cy * m.w + this.radius + padding;
                this.vel.y *= -0.5;
            }
            if (cell.walls[2] && this.pos.y + this.radius > (cy+1) * m.w - padding) {
                this.pos.y = (cy+1) * m.w - this.radius - padding;
                this.vel.y *= -0.5;
            }
        }
    }

    display() {
        push();
        translate(this.pos.x, this.pos.y, this.radius);
        noStroke();
        
        // Solid metal look (fixed glowing issue)
        fill(150, 160, 170);
        specularMaterial(255, 255, 255);
        shininess(50); // Lower shininess to prevent laser-like glow
        
        sphereDetail(24);
        sphere(this.radius);
        pop();
    }
}

class Cell {
    constructor(i, j) {
        this.i = i;
        this.j = j;
        this.walls = [true, true, true, true]; // top, right, bottom, left
        this.visited = false;
    }
}

class Maze {
    constructor(c, r, width) {
        this.cols = c;
        this.rows = r;
        this.w = width;
        this.wallT = 10;
        this.wallH = 25;
        this.grid = [];
        
        for (let i = 0; i < this.cols; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.rows; j++) {
                this.grid[i][j] = new Cell(i, j);
            }
        }
        
        this.goalX = (this.cols-1) * this.w + this.w/2;
        this.goalY = (this.rows-1) * this.w + this.w/2;
    }

    generate() {
        let stack = [];
        let current = this.grid[0][0];
        current.visited = true;

        let generating = true;
        let failsafe = 0; // Prevent any possible infinite loops in generation
        while(generating && failsafe < 5000) {
            failsafe++;
            let next = this.getUnvisitedNeighbor(current);
            if (next) {
                next.visited = true;
                stack.push(current);
                this.removeWalls(current, next);
                current = next;
            } else if (stack.length > 0) {
                current = stack.pop();
            } else {
                generating = false;
            }
        }
    }

    getUnvisitedNeighbor(c) {
        let neighbors = [];
        let x = c.i;
        let y = c.j;
        
        if (y > 0 && !this.grid[x][y-1].visited) neighbors.push(this.grid[x][y-1]);
        if (x < this.cols-1 && !this.grid[x+1][y].visited) neighbors.push(this.grid[x+1][y]);
        if (y < this.rows-1 && !this.grid[x][y+1].visited) neighbors.push(this.grid[x][y+1]);
        if (x > 0 && !this.grid[x-1][y].visited) neighbors.push(this.grid[x-1][y]);

        if (neighbors.length > 0) {
            let r = floor(random(0, neighbors.length));
            return neighbors[r];
        }
        return null;
    }

    removeWalls(a, b) {
        let x = a.i - b.i;
        if (x === 1) { a.walls[3] = false; b.walls[1] = false; }
        else if (x === -1) { a.walls[1] = false; b.walls[3] = false; }
        
        let y = a.j - b.j;
        if (y === 1) { a.walls[0] = false; b.walls[2] = false; }
        else if (y === -1) { a.walls[2] = false; b.walls[0] = false; }
    }

    display() {
        fill(50, 110, 200);
        noStroke();

        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                let x = i * this.w;
                let y = j * this.w;
                let c = this.grid[i][j];

                if (c.walls[0] && j === 0) this.drawWall(x + this.w/2, y, this.w, this.wallT, this.wallH);
                if (c.walls[1]) this.drawWall(x + this.w, y + this.w/2, this.wallT, this.w + this.wallT, this.wallH);
                if (c.walls[2]) this.drawWall(x + this.w/2, y + this.w, this.w + this.wallT, this.wallT, this.wallH);
                if (c.walls[3] && i === 0) this.drawWall(x, y + this.w/2, this.wallT, this.w, this.wallH);
            }
        }
    }

    drawWall(cx, cy, sx, sy, sz) {
        push();
        translate(cx, cy, sz/2);
        box(sx, sy, sz);
        pop();
    }
}