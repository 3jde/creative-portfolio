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

// DOM Elements
let nameInputUi, hudUi, winUi, recordAnimUi;
let playerNameInput, hudPlayer, hudLevel, hudTime, hudBest, winMsg, winStats;

// Sounds (Optional - gracefully degrades if not available)
let bgm, hitSound, winSound;

function preload() {
    // Attempt to load sounds (will ignore errors if files are missing on GitHub Pages)
    try {
        soundFormats('mp3', 'ogg');
        bgm = loadSound('assets/bgm.mp3');
        hitSound = loadSound('assets/hit.mp3');
        winSound = loadSound('assets/win.mp3');
    } catch(e) {
        console.log("No audio files found. Running silent mode.");
    }
}

function setup() {
    let canvas = createCanvas(800, 800, WEBGL);
    canvas.parent('game-container');
    maxRot = radians(20);
    
    // Smooth rendering
    pixelDensity(displayDensity());

    // Load local storage records
    let saved = localStorage.getItem('cyberMazeRecords');
    if (saved) {
        records = JSON.parse(saved);
    }

    // Bind DOM
    nameInputUi = select('#name-input-ui');
    hudUi = select('#hud');
    winUi = select('#win-ui');
    recordAnimUi = select('#record-anim');

    playerNameInput = select('#player-name');
    hudPlayer = select('#hud-player');
    hudLevel = select('#hud-level');
    hudTime = select('#hud-time');
    hudBest = select('#hud-best');
    winMsg = select('#win-msg');
    winStats = select('#win-stats');

    // Button Events
    select('#start-btn').mousePressed(startGame);
    select('#restart-btn').mousePressed(restartGame);
    select('#quit-btn').mousePressed(quitGame);

    // Enter Key Start
    playerNameInput.elt.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            startGame();
        }
    });

    if (bgm && bgm.isLoaded()) {
        bgm.loop();
    }
}

function startGame() {
    let val = playerNameInput.value().trim();
    if (val === "") val = "Guest";
    playerName = val;

    nameInputUi.addClass('hidden');
    hudUi.removeClass('hidden');

    hudPlayer.html(`Player: ${playerName}`);
    level = 1;
    initLevel();
}

function restartGame() {
    winUi.addClass('hidden');
    hudUi.removeClass('hidden');
    level = 1;
    initLevel();
}

function quitGame() {
    winUi.addClass('hidden');
    nameInputUi.removeClass('hidden');
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
    recordAnimUi.addClass('hidden');
    gameState = 0;
    
    hudLevel.html(`LEVEL: ${level}`);
    
    let best = getBestTime(playerName, level);
    if (best) hudBest.html(`BEST: ${best.toFixed(2)} s`);
    else hudBest.html("BEST: --");

    levelStartTime = millis();
}

function draw() {
    background(25, 30, 40);

    if (gameState === -1 || gameState === 2) {
        // Just draw a static dark background for menus
        return;
    }

    // Input to Rotation
    let targetRotZ = map(mouseX, 0, width, -maxRot, maxRot);
    let targetRotX = map(mouseY, 0, height, maxRot, -maxRot);
    
    // Clamp targets
    targetRotZ = constrain(targetRotZ, -maxRot, maxRot);
    targetRotX = constrain(targetRotX, -maxRot, maxRot);

    rotX = lerp(rotX, targetRotX, 0.1);
    rotZ = lerp(rotZ, targetRotZ, 0.1);

    if (gameState === 0) {
        let gravityX = sin(rotZ) * 0.8;
        let gravityY = -sin(rotX) * 0.8;
        ball.applyForce(gravityX, gravityY);
        ball.update(maze);

        currentLevelTime = (millis() - levelStartTime) / 1000.0;
        hudTime.html(`TIME: ${currentLevelTime.toFixed(2)} s`);

        let dx = ball.pos.x - maze.goalX;
        let dy = ball.pos.y - maze.goalY;
        if (sqrt(dx*dx + dy*dy) < cellSize/3) {
            checkRecord();
            gameState = 1;
            transitionTimer = 120;
            if (winSound && winSound.isLoaded()) winSound.play();
        }
    } else if (gameState === 1) {
        ball.radius *= 0.9;
        ball.pos.lerp(createVector(maze.goalX, maze.goalY), 0.2);
        transitionTimer--;
        
        if (newRecord) {
            recordAnimUi.removeClass('hidden');
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

    // Lights
    ambientLight(80, 80, 80);
    pointLight(255, 255, 255, 0, 0, 400);
    directionalLight(200, 200, 200, 0.5, 0.5, -1);
    specularMaterial(255, 255, 255);
    shininess(120);

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
    ellipse(0, 0, cellSize*0.7, cellSize*0.7);
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
        localStorage.setItem('cyberMazeRecords', JSON.stringify(records));
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
    hudUi.addClass('hidden');
    recordAnimUi.addClass('hidden');
    winUi.removeClass('hidden');
    
    winMsg.html(`Master ${playerName}, you cleared all levels!`);

    let t1 = getBestTime(playerName, 1) || 0;
    let t2 = getBestTime(playerName, 2) || 0;
    let t3 = getBestTime(playerName, 3) || 0;
    
    winStats.html(`Lvl 1: ${t1.toFixed(2)}s | Lvl 2: ${t2.toFixed(2)}s | Lvl 3: ${t3.toFixed(2)}s`);
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

        if (hitWall && impactSpeed > 0.8 && hitSound && hitSound.isLoaded()) {
            hitSound.play();
        }
    }

    display() {
        push();
        translate(this.pos.x, this.pos.y, this.radius);
        noStroke();
        fill(100, 110, 120);
        ambientMaterial(50, 50, 60);
        specularMaterial(255);
        shininess(120);
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
        while(generating) {
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
        fill(70, 130, 220);
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