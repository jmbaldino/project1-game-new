class Player {
    constructor(obstacles) {
        this.spaceship = document.getElementById("spaceship");
        this.board = document.getElementById("board");
        this.x = 0;
        this.y = 0;
        this.speed = 3;
        this.direction = null;
        this.rotation = 0;
        this.gameOver = false;
        this.obstacles = obstacles;
        this.movementStarted = false;

        this.spaceship.style.position = "absolute";
        this.spaceship.style.left = `${this.x}px`;
        this.spaceship.style.top = `${this.y}px`;
        this.spaceship.style.transform = `rotate(${this.rotation}deg)`;

        this.initControls();
        this.move();
    }

    initControls() {
        window.addEventListener("keydown", (event) => {
            if (this.gameOver) return;

            if (!this.movementStarted) {
                this.movementStarted = true;
                this.obstacles.startSpawning();
            }

            switch (event.key) {
                case "ArrowLeft":
                    this.direction = "left";
                    this.rotation = -90;
                    break;
                case "ArrowRight":
                    this.direction = "right";
                    this.rotation = 90;
                    break;
                case "ArrowUp":
                    this.direction = "up";
                    this.rotation = 0;
                    break;
                case "ArrowDown":
                    this.direction = "down";
                    this.rotation = 180;
                    break;
            }

            this.spaceship.style.transform = `rotate(${this.rotation}deg)`;
        });
    }

    move() {
        if (this.gameOver) return;

        const maxX = this.board.clientWidth - this.spaceship.offsetWidth;
        const maxY = this.board.clientHeight - this.spaceship.offsetHeight;

        if (this.direction) {
            switch (this.direction) {
                case "left":
                    if (this.x <= 0) return this.triggerGameOver();
                    this.x -= this.speed;
                    break;
                case "right":
                    if (this.x >= maxX) return this.triggerGameOver();
                    this.x += this.speed;
                    break;
                case "up":
                    if (this.y <= 0) return this.triggerGameOver();
                    this.y -= this.speed;
                    break;
                case "down":
                    if (this.y >= maxY) return this.triggerGameOver();
                    this.y += this.speed;
                    break;
            }

            this.spaceship.style.left = `${this.x}px`;
            this.spaceship.style.top = `${this.y}px`;
        }

        requestAnimationFrame(() => this.move());
    }

    triggerGameOver() {
        this.gameOver = true;
        alert("Game Over!");
    }
}

window.onload = () => {
    const player = new Player();
};


class Obstacles {
    constructor() {
        this.board = document.getElementById("board");
        this.obstacleWidth = 50;
        this.obstacleHeight = 50;
        this.spawnInterval = 1000;
        this.intervalId = null;
    }

    startSpawning() {
        if (this.intervalId) return; // já está a correr

        this.intervalId = setInterval(() => this.spawnObstacle(), this.spawnInterval);
    }

    spawnObstacle() {
        const obstacle = document.createElement("div");
        obstacle.classList.add("obstacle");

        obstacle.style.position = "absolute";
        obstacle.style.width = `${this.obstacleWidth}px`;
        obstacle.style.height = `${this.obstacleHeight}px`;
        obstacle.style.backgroundColor = "red";

        const maxX = this.board.clientWidth - this.obstacleWidth;
        const maxY = this.board.clientHeight - this.obstacleHeight;

        const x = Math.floor(Math.random() * maxX);
        const y = Math.floor(Math.random() * maxY);

        obstacle.style.left = `${x}px`;
        obstacle.style.top = `${y}px`;

        this.board.appendChild(obstacle);
    }
}

window.onload = () => {
    const obstacles = new Obstacles();
    const player = new Player(obstacles);
};


