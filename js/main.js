class Player {
    constructor() {
        this.spaceship = document.getElementById("spaceship");
        this.x = 0;
        this.y = 0;
        this.speed = 3;
        this.direction = null;

        this.spaceship.style.position = "absolute";
        this.spaceship.style.left = `${this.x}px`;
        this.spaceship.style.top = `${this.y}px`;

        this.initControls();
        this.move();
    }

    initControls() {
        window.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    this.direction = "left";
                    break;
                case "ArrowRight":
                    this.direction = "right";
                    break;
                case "ArrowUp":
                    this.direction = "up";
                    break;
                case "ArrowDown":
                    this.direction = "down";
                    break;
            }
        });
    }

    move() {
        if (this.direction) {
            switch (this.direction) {
                case "left":
                    this.x -= this.speed;
                    break;
                case "right":
                    this.x += this.speed;
                    break;
                case "up":
                    this.y -= this.speed;
                    break;
                case "down":
                    this.y += this.speed;
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

