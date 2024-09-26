// game.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Tăng kích thước canvas
canvas.width = 480; // Tăng từ 320 lên 480
canvas.height = 720; // Tăng từ 480 lên 720

let gameOver = false;
let score = 0;

// Tạo đối tượng hình ảnh cho chim
const birdImg = new Image();
birdImg.src = 'bird.png'; // Đường dẫn đến hình ảnh avatar bạn muốn sử dụng

const bird = {
    x: 50,
    y: 150,
    width: 60, // Điều chỉnh kích thước theo kích thước hình ảnh
    height: 60,
    gravity: 0.1,
    lift: -4,
    velocity: 0,
    draw() {
        ctx.drawImage(birdImg, this.x, this.y, this.width, this.height); // Vẽ hình ảnh thay vì hình chữ nhật
    },

    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;

        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.velocity = 0;
        }
        if (this.y < 0) {
            this.y = 0;
        }
    },
    flap() {
        this.velocity = this.lift;
    },
    reset() {
        this.x = 50;
        this.y = 150;
        this.velocity = 0;
    }
};

// Ống cản (pipes)
let pipes = [];
const pipeWidth = 50; // Tăng kích thước ống cản
const pipeGap = 250; // Giữ khoảng cách giữa các ống cản lớn hơn một chút
const pipeSpeed = 2;

function createPipe() {
    const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
    pipes.push({
        x: canvas.width,
        y: 0,
        height: pipeHeight,
        passed: false
    });
    pipes.push({
        x: canvas.width,
        y: pipeHeight + pipeGap,
        height: canvas.height - pipeHeight - pipeGap,
        passed: false
    });
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.fillStyle = '#0F0';
        ctx.fillRect(pipe.x, pipe.y, pipeWidth, pipe.height);
    });
}

function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;

        if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
            score++;
            pipe.passed = true;
        }
    });

    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
}

function checkCollision() {
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];

        if (
            bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            bird.y < pipe.y + pipe.height &&
            bird.y + bird.height > pipe.y
        ) {
            gameOver = true;
        }
    }
}

function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText("Score: " + score / 2, 10, 20);
}

function drawGameOver() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "#F00";
    ctx.fillText("Game Over!", canvas.width / 4, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText("Press Space to Restart", canvas.width / 6, canvas.height / 2 + 40);
}

function resetGame() {
    score = 0;
    bird.reset();
    pipes = [];
    gameOver = false;
}

document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        if (gameOver) {
            resetGame();
        } else {
            bird.flap();
        }
    }
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bird.draw();
    drawPipes();
    drawScore();

    if (gameOver) {
        drawGameOver();
    }
}

function update() {
    if (!gameOver) {
        bird.update();
        updatePipes();
        checkCollision();
    }
}

let frameCount = 0;

function gameLoop() {
    draw();
    update();

    if (frameCount % 120 === 0 && !gameOver) {
        createPipe();
    }

    frameCount++;
    requestAnimationFrame(gameLoop);
}

gameLoop();
