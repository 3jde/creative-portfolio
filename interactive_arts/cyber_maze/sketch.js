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

// Native HTML5 Audio objects (no p5.sound required)
let hitSound, winSound;

function setup() {
    let canvas = createCanvas(800, 800, WEBGL);
    canvas.parent('game-container');
    maxRot = radians(20);
    
    pixelDensity(1); 

    try {
        let saved = localStorage.getItem('cyberMazeRecords');
        if (saved) records = JSON.parse(saved);
    } catch(e) {
        records = {};
    }

    // Initialize game effect audio safely.
    try {
        hitSound = new Audio('assets/hit.wav');
        winSound = new Audio('assets/win.wav');
    } catch(e) {}

    // Button Events
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('restart-btn').addEventListener('click', restartGame);
    document.getElementById('quit-btn').addEventListener('click', quitGame);

    let nameInput = document.getElementById('player-name');
    nameInput.addEventListener("keyup", function(event) {
        if (event.key === "Enter") startGame();
    });

    rotX = 0;
    rotZ = 0;
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

    cellSize = 400.0 / Math.max(cols, rows);
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
    rotX = 0;
    rotZ = 0;
}

function draw() {
    // Clear background every frame
    background(25, 30, 40);

    if (gameState === -1 || gameState === 2) {
        return;
    }

    // --- CRITICAL FIX: Prevent NaN mouse coordinates ---
    let targetRotZ = 0;
    let targetRotX = 0;
    
    // Only apply rotation if mouse is valid and actively over the canvas
    if (typeof mouseX === 'number' && !isNaN(mouseX) && typeof mouseY === 'number' && !isNaN(mouseY)) {
        if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
            targetRotZ = map(mouseX, 0, width, -maxRot, maxRot);
            targetRotX = map(mouseY, 0, height, maxRot, -maxRot);
        }
    }

    // Safety fallback for rotations
    if (isNaN(rotX)) rotX = 0;
    if (isNaN(rotZ)) rotZ = 0;

    rotX = lerp(rotX, targetRotX, 0.1);
    rotZ = lerp(rotZ, targetRotZ, 0.1);

    if (gameState === 0) {
        let gravityX = sin(rotZ) * 0.8;
        let gravityY = -sin(rotX) * 0.8;
        ball.applyForce(gravityX, gravityY);
        ball.update(maze);

        currentLevelTime = (millis() - levelStartTime) / 1000.0;
        // Throttle DOM updates
        if (frameCount % 5 === 0) {
            document.getElementById('hud-time').innerText = `TIME: ${currentLevelTime.toFixed(2)} s`;
        }

        let dx = ball.pos.x - maze.goalX;
        let dy = ball.pos.y - maze.goalY;
        if (sqrt(dx*dx + dy*dy) < cellSize/3) {
            checkRecord();
            gameState = 1;
            transitionTimer = 120;
            if (winSound) {
                winSound.currentTime = 0;
                winSound.play().catch(e => {});
            }
        }
    } else if (gameState === 1) {
        ball.radius *= 0.9;
        let targetVec = createVector(maze.goalX, maze.goalY);
        ball.pos.lerp(targetVec, 0.2);
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

    // --- CRITICAL FIX: Lighting (Prevent glowing blown-out highlights) ---
    ambientLight(80, 90, 100); 
    directionalLight(180, 180, 180, 0.5, 0.5, -1);

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

// Google Sheets API URL for cloud leaderboard
const GOOGLE_SHEETS_API_URL = "https://script.google.com/macros/s/AKfycbzMPDSB7bL9633H6fXBVhd3icFxYz67oLyYdvaJ2Py-YPGYt9FtaHbelKZ1wRDGCgXeNA/exec";

function uploadScoreToCloud(playerName, scoreTime) {
    if (!playerName || playerName === "Guest") return;
    
    // Create form data
    let formData = new FormData();
    formData.append('player', playerName);
    formData.append('score', scoreTime.toFixed(2));
    
    // Send to Google Sheets without waiting for response (fire and forget)
    fetch(GOOGLE_SHEETS_API_URL, {
        method: 'POST',
        body: formData,
        // Prevent CORS errors, we don't need to read the response
    }).then(() => {
        console.log("Score uploaded to cloud!");
    }).catch(err => {
        console.log("Cloud upload failed:", err);
    });
}

function showWinScreen() {
    document.getElementById('hud').classList.add('hidden');
    document.getElementById('record-anim').classList.add('hidden');
    document.getElementById('win-ui').classList.remove('hidden');
    
    document.getElementById('win-msg').innerText = `Master ${playerName}, you cleared all levels!`;

    let t1 = getBestTime(playerName, 1) || 0;
    let t2 = getBestTime(playerName, 2) || 0;
    let t3 = getBestTime(playerName, 3) || 0;
    
    let totalScore = t1 + t2 + t3;
    document.getElementById('win-stats').innerText = `Lvl 1: ${t1.toFixed(2)}s | Lvl 2: ${t2.toFixed(2)}s | Lvl 3: ${t3.toFixed(2)}s\nTOTAL: ${totalScore.toFixed(2)}s`;

    // Upload total score to Google Sheets
    if (totalScore > 0) {
        uploadScoreToCloud(playerName, totalScore);
    }
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
        if (!isNaN(gx) && !isNaN(gy)) {
            this.vel.x += gx;
            this.vel.y += gy;
            this.vel.mult(0.97); // friction
        }
    }

    update(m) {
        // Fallback emergency reset if something injects NaN
        if (isNaN(this.pos.x) || isNaN(this.pos.y)) {
            this.pos.x = m.w / 2;
            this.pos.y = m.w / 2;
            this.vel.x = 0;
            this.vel.y = 0;
        }

        this.pos.x += this.vel.x;
        this.checkCollision(m, true);
        this.pos.y += this.vel.y;
        this.checkCollision(m, false);
    }

    checkCollision(m, isX) {
        let cx = constrain(floor(this.pos.x / m.w), 0, m.cols - 1);
        let cy = constrain(floor(this.pos.y / m.w), 0, m.rows - 1);
        
        if(isNaN(cx) || isNaN(cy)) return;
        
        let cell = m.grid[cx][cy];
        let padding = m.wallT / 2;
        let hitWall = false;
        let impactSpeed = 0;

        if (isX) {
            if (cell.walls[3] && this.pos.x - this.radius < cx * m.w + padding) {
                this.pos.x = cx * m.w + this.radius + padding;
                impactSpeed = abs(this.vel.x);
                this.vel.x *= -0.5;
                hitWall = true;
            }
            if (cell.walls[1] && this.pos.x + this.radius > (cx+1) * m.w - padding) {
                this.pos.x = (cx+1) * m.w - this.radius - padding;
                impactSpeed = abs(this.vel.x);
                this.vel.x *= -0.5;
                hitWall = true;
            }
        } else {
            if (cell.walls[0] && this.pos.y - this.radius < cy * m.w + padding) {
                this.pos.y = cy * m.w + this.radius + padding;
                impactSpeed = abs(this.vel.y);
                this.vel.y *= -0.5;
                hitWall = true;
            }
            if (cell.walls[2] && this.pos.y + this.radius > (cy+1) * m.w - padding) {
                this.pos.y = (cy+1) * m.w - this.radius - padding;
                impactSpeed = abs(this.vel.y);
                this.vel.y *= -0.5;
                hitWall = true;
            }
        }

        if (hitWall && impactSpeed > 0.8 && hitSound) {
            hitSound.currentTime = 0;
            hitSound.play().catch(e => {});
        }
    }

    display() {
        push();
        translate(this.pos.x, this.pos.y, this.radius);
        noStroke();
        
        // Solid metal look, no blowing out highlights
        fill(150, 160, 170);
        specularMaterial(255, 255, 255);
        shininess(30); 
        
        // In p5.js, sphereDetail() does not exist like it does in Java Processing.
        // Detail is passed directly to the sphere() function.
        sphere(this.radius, 24, 24);
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
    constructor(c, r, cellW) {
        this.cols = c;
        this.rows = r;
        this.w = cellW;
        // Keep walls thick, but dynamic to prevent getting stuck in Level 3
        this.wallT = Math.max(4, this.w * 0.15); 
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
        let failsafe = 0; 
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
