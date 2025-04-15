class Player {
    constructor() {
        this.spaceship = document.getElementById("spaceship");
        this.board = document.getElementById("board");
        this.x = 0;
        this.y = 0;
        this.speed = 3;
        this.direction = null;
        this.rotation = 0;

        this.spaceship.style.position = "absolute";
        this.spaceship.style.left = `${this.x}px`;
        this.spaceship.style.top = `${this.y}px`;
        this.spaceship.style.transform = `rotate(${this.rotation}deg)`;

        this.initControls();
        this.move();
    }

    initControls() {
        window.addEventListener("keydown", (event) => {
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
        const boardRect = this.board.getBoundingClientRect();
        const shipRect = this.spaceship.getBoundingClientRect();

        const maxX = this.board.clientWidth - this.spaceship.offsetWidth;
        const maxY = this.board.clientHeight - this.spaceship.offsetHeight;

        if (this.direction) {
            switch (this.direction) {
                case "left":
                    if (this.x > 0) this.x -= this.speed;
                    break;
                case "right":
                    if (this.x < maxX) this.x += this.speed;
                    break;
                case "up":
                    if (this.y > 0) this.y -= this.speed;
                    break;
                case "down":
                    if (this.y < maxY) this.y += this.speed;
                    break;
            }

            this.spaceship.style.left = `${this.x}px`;
            this.spaceship.style.top = `${this.y}px`;
        }

        requestAnimationFrame(() => this.move());
    }
}

window.onload = () => {
    const player = new Player();
};



