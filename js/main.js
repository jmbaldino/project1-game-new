class Player {
    constructor(obstacles) {
        this.spaceship = document.getElementById("spaceship");
        this.board = document.getElementById("board");
        
        this.speed = 3;
        this.direction = null;
        this.rotation = 0;
        this.gameOver = false;
        this.obstacles = obstacles;
        this.movementStarted = false;
    
        this.spaceship.style.position = "absolute";
    
        this.x = (this.board.offsetWidth - this.spaceship.offsetWidth) / 2;
        this.y = (this.board.offsetHeight - this.spaceship.offsetHeight) / 2;
    
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
    
            if (event.key === "ArrowLeft") {
                this.direction = "left";
                this.rotation = -90;
            } else if (event.key === "ArrowRight") {
                this.direction = "right";
                this.rotation = 90;
            } else if (event.key === "ArrowUp") {
                this.direction = "up";
                this.rotation = 0;
            } else if (event.key === "ArrowDown") {
                this.direction = "down";
                this.rotation = 180;
            } else if (event.key === " ") {
                this.shoot();
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

    shoot() {
        const bullet = document.createElement("div");
        bullet.classList.add("bullet");
    
        const bulletSize = 8;
        const centerX = this.x + this.spaceship.offsetWidth / 2 - bulletSize / 2;
        const centerY = this.y + this.spaceship.offsetHeight / 2 - bulletSize / 2;
    
        bullet.style.position = "absolute";
        bullet.style.width = `${bulletSize}px`;
        bullet.style.height = `${bulletSize}px`;
        bullet.style.backgroundColor = "white";
        bullet.style.borderRadius = "50%";
        bullet.style.left = `${centerX}px`;
        bullet.style.top = `${centerY}px`;
    
        this.board.appendChild(bullet);
    
        const speed = 5;
        let vx = 0;
        let vy = 0;
    
        if (this.direction === "left") {
            vx = -speed;
        } else if (this.direction === "right") {
            vx = speed;
        } else if (this.direction === "up") {
            vy = -speed;
        } else if (this.direction === "down") {
            vy = speed;
        } else {
            vy = -speed; 
        }
    
        const moveBullet = () => {
            if (this.gameOver) {
                bullet.remove();
                return;
            }
        
            const currentX = parseFloat(bullet.style.left);
            const currentY = parseFloat(bullet.style.top);
        
            const newX = currentX + vx;
            const newY = currentY + vy;
        
            if (
                newX < 0 || newX > this.board.clientWidth ||
                newY < 0 || newY > this.board.clientHeight
            ) {
                bullet.remove();
                return;
            }
        
            bullet.style.left = `${newX}px`;
            bullet.style.top = `${newY}px`;
        
            const hit = this.obstacles.checkBulletCollision(bullet);
            if (!hit) {
                requestAnimationFrame(moveBullet);
            }
        };
    
        moveBullet();
    }
    

    triggerGameOver() {
        this.gameOver = true;
        this.obstacles.stopSpawning();
        location.href = "./gameover.html";
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
            "./images/obstacle-1.png",
            "./images/obstacle-2.png",
            "./images/obstacle-3.png",
            "./images/obstacle-4.png",
            "./images/obstacle-5.png"
        ]
    }

    startSpawning() {
        if (this.intervalId) return;
    
        this.intervalId = setInterval(() => this.spawnObstacle(), this.spawnInterval);
        this.increaseDifficulty();
    }
    

    spawnObstacle() {
        if (this.player && this.player.gameOver) {
            return;
        }
        
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
            const currentTop = parseFloat(obstacle.style.top);
            const newTop = currentTop + this.fallSpeed;
    
            obstacle.style.top = `${newTop}px`;
    
            if (newTop > this.board.clientHeight) {
                obstacle.remove();
                this.obstaclesArray = this.obstaclesArray.filter(obs => obs !== obstacle);
            }
        });
    }

    increaseDifficulty() {
        setInterval(() => {
            this.fallSpeed += 0.1;
            if (this.fallSpeed > 5) {
                this.fallSpeed = 5;
            }
    
            this.spawnInterval -= 100;
            if (this.spawnInterval < 300) {
                this.spawnInterval = 300; 
            }
    
            clearInterval(this.intervalId);
            this.intervalId = setInterval(() => this.spawnObstacle(), this.spawnInterval);
    
        }, 5000);
    }
    
    

    checkCollision(player) {
        const playerRect = player.spaceship.getBoundingClientRect();
    
        for (const obstacle of this.obstaclesArray) {
            const obstacleRect = obstacle.getBoundingClientRect();
    
            const padding = 3;
            const playerBox = {
                top: playerRect.top + padding,
                bottom: playerRect.bottom - padding,
                left: playerRect.left + padding,
                right: playerRect.right - padding
            };
    
            const obstacleBox = {
                top: obstacleRect.top + padding,
                bottom: obstacleRect.bottom - padding,
                left: obstacleRect.left + padding,
                right: obstacleRect.right - padding
            };
    
            const isColliding = !(
                playerBox.top > obstacleBox.bottom ||
                playerBox.bottom < obstacleBox.top ||
                playerBox.left > obstacleBox.right ||
                playerBox.right < obstacleBox.left
            );
    
            if (isColliding) {
                player.triggerGameOver();
                break;
            }
        }
    }
    
    checkBulletCollision(bullet) {
        const bulletRect = bullet.getBoundingClientRect();
    
        for (const obstacle of this.obstaclesArray) {
            const obstacleRect = obstacle.getBoundingClientRect();
    
            const isColliding = !(
                bulletRect.top > obstacleRect.bottom ||
                bulletRect.bottom < obstacleRect.top ||
                bulletRect.left > obstacleRect.right ||
                bulletRect.right < obstacleRect.left
            );
    
            if (isColliding) {
                obstacle.remove();
                bullet.remove();
    
                this.obstaclesArray = this.obstaclesArray.filter(o => o !== obstacle);
    
                return true;
            }
        }
    
        return false;
    }

    stopSpawning() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    gameLoop() {
        this.moveObstacles();
    
        if (!this.player.gameOver) {
            this.checkCollision(this.player);
            requestAnimationFrame(() => this.gameLoop());
        }
    }
}

window.onload = () => {
    const obstacles = new Obstacles();
    const player = new Player(obstacles);
    obstacles.player = player;
};








