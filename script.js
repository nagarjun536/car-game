// Canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 500;
canvas.height = 600;

// Game variables
let gameRunning = true;
let score = 0;
let level = 1;
let gameSpeed = 3;

// Player car object
const playerCar = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 80,
    width: 40,
    height: 60,
    speed: 5,
    color: '#3498db'
};

// Enemy cars array
let enemyCars = [];
let enemySpawnCounter = 0;
const enemySpawnRate = 80;

// Keyboard input
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    // Restart game on space bar
    if (e.key === ' ' && !gameRunning) {
        resetGame();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Enemy car object factory
function createEnemyCar() {
    return {
        x: Math.random() * (canvas.width - 40),
        y: -60,
        width: 40,
        height: 60,
        speed: gameSpeed + (level * 0.5),
        color: '#e74c3c'
    };
}

// Update player position
function updatePlayer() {
    if (keys['ArrowLeft'] && playerCar.x > 0) {
        playerCar.x -= playerCar.speed;
    }
    if (keys['ArrowRight'] && playerCar.x < canvas.width - playerCar.width) {
        playerCar.x += playerCar.speed;
    }
    if (keys['ArrowUp'] && playerCar.y > 0) {
        playerCar.y -= playerCar.speed;
    }
    if (keys['ArrowDown'] && playerCar.y < canvas.height - playerCar.height) {
        playerCar.y += playerCar.speed;
    }
}

// Spawn enemy cars
function spawnEnemyCars() {
    enemySpawnCounter++;
    if (enemySpawnCounter > enemySpawnRate) {
        enemyCars.push(createEnemyCar());
        enemySpawnCounter = 0;
    }
}

// Update enemy cars
function updateEnemyCars() {
    for (let i = enemyCars.length - 1; i >= 0; i--) {
        enemyCars[i].y += enemyCars[i].speed;
        
        // Remove cars that went off screen
        if (enemyCars[i].y > canvas.height) {
            enemyCars.splice(i, 1);
            score += 10;
            
            // Increase level every 5 cars avoided
            if (score % 50 === 0 && score !== 0) {
                level++;
                gameSpeed += 0.5;
            }
        }
    }
}

// Collision detection
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Check collisions with enemy cars
function checkCollisions() {
    for (let i = 0; i < enemyCars.length; i++) {
        if (checkCollision(playerCar, enemyCars[i])) {
            gameRunning = false;
            showGameOver();
        }
    }
}

// Draw car
function drawCar(car) {
    ctx.fillStyle = car.color;
    ctx.fillRect(car.x, car.y, car.width, car.height);
    
    // Draw windows
    ctx.fillStyle = '#ecf0f1';
    ctx.fillRect(car.x + 5, car.y + 10, car.width - 10, 15);
    ctx.fillRect(car.x + 5, car.y + 35, car.width - 10, 15);
}

// Draw lane markings
function drawRoad() {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.setLineDash([20, 20]);
    
    // Center line
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    
    ctx.setLineDash([]);
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.fillStyle = 'rgba(135, 206, 235, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw road markings
    drawRoad();
    
    // Draw player car
    drawCar(playerCar);
    
    // Draw enemy cars
    for (let i = 0; i < enemyCars.length; i++) {
        drawCar(enemyCars[i]);
    }
}

// Update UI
function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
}

// Show game over screen
function showGameOver() {
    const gameOverScreen = document.getElementById('gameOverScreen');
    const finalScore = document.getElementById('finalScore');
    finalScore.textContent = score;
    gameOverScreen.classList.remove('hidden');
}

// Hide game over screen
function hideGameOver() {
    const gameOverScreen = document.getElementById('gameOverScreen');
    gameOverScreen.classList.add('hidden');
}

// Reset game
function resetGame() {
    gameRunning = true;
    score = 0;
    level = 1;
    gameSpeed = 3;
    enemyCars = [];
    enemySpawnCounter = 0;
    playerCar.x = canvas.width / 2 - 20;
    playerCar.y = canvas.height - 80;
    hideGameOver();
    gameLoop();
}

// Main game loop
function gameLoop() {
    if (!gameRunning) return;
    
    // Update
    updatePlayer();
    spawnEnemyCars();
    updateEnemyCars();
    checkCollisions();
    updateUI();
    
    // Draw
    draw();
    
    // Continue loop
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
