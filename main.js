let canvas, ctx, width = window.innerWidth, height = 480;
let background, backX = 0, backY = 0, backX2 = backSize = 1890;
let pl_x = 30, pl_y = height / 2 - 70, score = 0, best_score = 0;


function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function drawBackground() {
    ctx.drawImage(background, backX, backY);
    ctx.drawImage(background, backX2, backY);
    if (backX < -backSize) {
        backX = backSize - 5;
    }
    if (backX2 < -backSize) {
        backX2 = backSize - 5;
    }
    backX -= 2;
    backX2 -= 2;
}

class player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 118;
        this.lives = 100;
        this.img = new Image();
        this.img.src = 'images/player_sprites.png';
        this.curFrame = 0;
        this.frameCount = 7;
        this.srcX = 0;
        this.fps = 0;
        this.gun = new Image();
        this.gun.src = 'images/gun_sprites.png';
        this.gunX = x + 20;
        this.gunY = y + 10;
        this.gunWidth = 170;
        this.gunHeight = 134;
        this.gCurFrame = 0;
        this.gFrameCount = 3;
        this.srcXg = 0;
    }

    draw() {

        ++this.fps;
        if (this.fps === 6) {
            this.curFrame = ++this.curFrame % this.frameCount;
            this.srcX = this.curFrame * this.width;

            this.gCurFrame = ++this.gCurFrame % this.gFrameCount;
            this.srcXg = this.gCurFrame * this.gunWidth;
            this.fps = 0;
        }

        ctx.drawImage(this.img, this.srcX, 0, this.width, this.height, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.gun, this.srcXg, 0, this.gunWidth, this.gunHeight, this.gunX, this.gunY, this.gunWidth - 60, this.gunHeight - 45);
    }
}

let gamer = new player(pl_x, pl_y);

function gameLoop() {
    ctx.clearRect(0, 0, width, height);
    drawBackground();
    gamer.draw();
    setTimeout(gameLoop, 1000 / 60);
}

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    background = new Image();
    background.src = 'images/loopBackground.png';
    gameLoop()
}

window.onload = init;