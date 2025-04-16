class Player {
    constructor(obstacles) {
        this.spaceship = document.getElementById("spaceship");
        this.board = document.getElementById("board");
        this.x = 0;
        this.y = 0;
        this.speed = 2;
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
                this.obstacles.gameLoop();
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
            if (this.direction === "left") {
                if (this.x <= 0) return this.triggerGameOver();
                this.x -= this.speed;
            } else if (this.direction === "right") {
                if (this.x >= maxX) return this.triggerGameOver();
                this.x += this.speed;
            } else if (this.direction === "up") {
                if (this.y <= 0) return this.triggerGameOver();
                this.y -= this.speed;
            } else if (this.direction === "down") {
                if (this.y >= maxY) return this.triggerGameOver();
                this.y += this.speed;
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

class Obstacles {
    constructor() {
        this.board = document.getElementById("board");
        this.spawnInterval = 1500;
        this.intervalId = null;
        this.obstaclesArray = [];
        this.fallSpeed = 0.7 

        this.obstacleImages = [
            "/project1-game-new/images/obstacle-1.png",
            "/project1-game-new/images/obstacle-2.png",
            "/project1-game-new/images/obstacle-3.png",
            "/project1-game-new/images/obstacle-4.png",
            "/project1-game-new/images/obstacle-5.png"
        ];
        
    }

    startSpawning() {
        if (this.intervalId) return;

        this.intervalId = setInterval(() => this.spawnObstacle(), this.spawnInterval);
    }

    spawnObstacle() {
        const obstacle = document.createElement("img");
        obstacle.classList.add("obstacle");
    
        const randomIndex = Math.floor(Math.random() * this.obstacleImages.length);
        obstacle.src = this.obstacleImages[randomIndex];
    
        obstacle.style.position = "absolute";
    
        const maxX = this.board.clientWidth - 50;
        const x = Math.floor(Math.random() * maxX);
    
        obstacle.style.left = `${x}px`;
        obstacle.style.top = `0px`; 
    
        this.board.appendChild(obstacle);
    
        this.obstaclesArray.push(obstacle);
    }

    moveObstacles() {
        this.obstaclesArray.forEach(obstacle => {
            const currentTop = parseFloat(obstacle.style.top); // agora lê decimais corretamente
            const newTop = currentTop + this.fallSpeed; // pode ser 0.3, 0.5, etc.
    
            obstacle.style.top = `${newTop}px`;
    
            if (newTop > this.board.clientHeight) {
                obstacle.remove();
                this.obstaclesArray = this.obstaclesArray.filter(obs => obs !== obstacle);
            }
        });
    }

    gameLoop() {
        this.moveObstacles(); 
        requestAnimationFrame(() => this.gameLoop()); 
    }
}

window.onload = () => {
    const obstacles = new Obstacles();
    const player = new Player(obstacles);
};








