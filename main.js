let touchControl = false;
let canvas, ctx, width = window.innerWidth, height = 480;
let background, backX = 0, backY = 0, backX2 = backSize = 1890;
let pl_x = 30, pl_y = height / 2 - 70, score = 0, best_score = 0;
let shotKey = false, rightKey = false, leftKey = false, upKey = false, downKey = false;
let bulletsTotal = 10, bullets = [];
let enemyTotal = 10, enemies = [], en_w = 80, en_h = 80;
let weInSelect = false, weInStart = true, weInLose = false, wePlaying = false;

function keyDown(e) {
    if (e.keyCode === 39 || e.keyCode === 68) rightKey = true;
    else if (e.keyCode === 37 || e.keyCode === 65) leftKey = true;
    if (e.keyCode === 38 || e.keyCode === 87) upKey = true;
    else if (e.keyCode === 40 || e.keyCode === 83) downKey = true;
    if (e.keyCode === 77 || e.keyCode === 88) { // M / X
        shotKey = true;
        if (bullets.length <= bulletsTotal) {
            bullets.push(new bullet(gamer.x, gamer.y))
        }
    }
}


function keyUp(e) {
    if (e.keyCode === 39 || e.keyCode === 68) rightKey = false;
    else if (e.keyCode === 37 || e.keyCode === 65) leftKey = false;
    if (e.keyCode === 38 || e.keyCode === 87) upKey = false;
    else if (e.keyCode === 40 || e.keyCode === 83) downKey = false;
    if (e.keyCode === 77 || e.keyCode === 88) shotKey = false;
}


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

        if (rightKey && this.x + this.width < width) {
            this.x += 5;
            this.gunX += 5;
        } else if (leftKey && this.x > 0) {
            this.x -= 5;
            this.gunX -= 5;
        }
        if (upKey && this.y > 0) {
            this.y -= 5;
            this.gunY -= 5;
        } else if (downKey && this.y + this.height < height) {
            this.y += 5;
            this.gunY += 5;
        }

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

class bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 256;
        this.height = 102;
        this.attackX = x + 256 - (256 / 5);
        this.attackY = y + (102 / 2);
        this.bul = new Image();
        this.bul.src = 'images/bullet_sprites.png';
        this.curFrame = 0;
        this.frameCount = 10;
        this.srcX = 0;
        this.fps = 0;
    }

    draw() {
        ++this.fps;
        this.attackX = this.x + this.width / 2;
        this.attackY = this.y + this.height / 2;
        if (this.fps === 4) {
            this.curFrame = ++this.curFrame % this.frameCount;
            this.srcX = this.curFrame * this.width;
            this.fps = 0;
        }
        ctx.drawImage(this.bul, this.srcX, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}

class enemy {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.lives = 20;
        this.img = new Image();
        this.img.src = 'images/enemy_sprites.png';
        this.curFrame = 0;
        this.frameCount = 6;
        this.srcX = 0;
        this.fps = 0;
    }

    draw() {
        ctx.drawImage(this.img, this.srcX, 0, this.width, this.height, this.x, this.y, this.width, this.height);

        if (this.fps === 6) {
            this.curFrame = ++this.curFrame % this.frameCount;
            this.srcX = this.curFrame * this.width;
            this.fps = 0;
        }
        ++this.fps;
    }
}

class gameElements {
    constructor() {
        this.center = width / 2;
        this.menuX = width / 2 - 341;
        this.menuWidth = 682;
        this.menuHeight = 480;
        this.startMenu = new Image();
        this.startMenu.src = 'images/startMenu.png';
        this.selectMenu = new Image();
        this.selectMenu.src = 'images/selectMenu.png';
        this.loseMenu = new Image();
        this.loseMenu.src = 'images/loseMenu.png';
        this.elements = new Image();
        this.elements.src = 'images/elements.png';
        this.el_width = 197;
        this.live_height = 54;
        this.score_height = 95;
        this.newGameB = new Image();
        this.newGameB.src = 'images/newGame.png';
    }

    draw() {
        ctx.font = 'normal 40px VT323';

        if (!wePlaying) {
            if (weInStart) {
                ctx.drawImage(this.startMenu, 0, 0, this.menuWidth - 2, height, this.menuX, 0, this.menuWidth, this.menuHeight);
                ctx.drawImage(this.elements, 0, 415, this.el_width, 60, this.center - this.el_width / 2 - 50, height / 2, this.el_width + 100, 110);
                ctx.fillStyle = '#5f0d72';
                ctx.fillText("Best score: ", this.center - 100, height / 2 - 50);
                ctx.fillText(best_score, this.center + 80, height / 2 - 50);

            } else if (weInSelect) {
                ctx.drawImage(this.selectMenu, 0, 0, this.menuWidth - 2, height, this.menuX, 0, this.menuWidth, this.menuHeight);

                ctx.fillStyle = '#570c69';
                ctx.fillText("shooting: auto", this.menuX, height / 2 - 100);
                ctx.fillText("movement: mouse/touchpad/touchscreen", this.menuX, height / 2 - 70);

                ctx.fillText("↓↑→←\\dsaw :tnemevom", this.center - 20, height - 65);
                ctx.fillText("x\\m :gnitoohs", this.center + 132, height - 35);


            } else if (weInLose) {
                ctx.drawImage(this.loseMenu, 0, 0, this.menuWidth - 2, height, this.menuX, 0, this.menuWidth, this.menuHeight);
                ctx.drawImage(this.elements, 0, 95, this.el_width, 75, this.center - this.el_width / 2, height / 2 + 125, this.el_width, 75);
                ctx.drawImage(this.newGameB, 0, 0, 300, 70, this.center - 150, height / 2 + 50, 300, 70);
                ctx.fillStyle = '#ff00f9';
                ctx.fillText("Best score: ", this.center - 100, height / 2 - 10);
                ctx.fillText(best_score, this.center + 80, height / 2 - 10);
                ctx.fillStyle = '#00c3e5';
                ctx.fillText("Your score: ", this.center - 100, height / 2 + 30);
                ctx.fillText(score, this.center + 80, height / 2 + 30);
            }

        } else {
            let k = 0;
            if (gamer.lives !== 100) k = 4 - ~~(gamer.lives / 25);
            ctx.drawImage(this.elements, 0, (k * this.live_height) + 480, this.el_width, this.live_height, 0, 0, this.el_width - 80, this.live_height - 15);
            ctx.drawImage(this.elements, 0, 0, this.el_width, this.score_height, 90, 0, 100, 40);
            ctx.font = 'normal 40px VT323';
            ctx.fillText(score, 185, 30);
        }
    }
}

function Buttons(e) {
    let pos = getCursorPos(e);
    let x = pos.x, y = pos.y;

    if (wePlaying) return false;

    else if (weInStart && x > width / 2 - 120 && x < width / 2 + 120 && y > height / 2 + 15 && y < height / 2 + 95) {
        weInStart = false;
        enemies = [];
        for (let i = 0; i < enemyTotal; i++) {
            enemies.push(new enemy(width + getRandom(en_w, 1000), getRandom(0, height - en_h), en_w, en_h, 20));
        }
        touchControl ? wePlaying = true : weInSelect = true;

    } else if (weInSelect) {
        let y1 = 187, y2 = 380, x0 = menuAndElements.center - menuAndElements.menuWidth / 2;

        if (y > y1 && y < y2) {
            if (x > x0 + 100 && x < x0 + 300) {
                touchControl = true;
                weInSelect = false;
                wePlaying = true;

            } else if (x > x0 + 380 && x < x0 + 580) {
                touchControl = false;
                weInSelect = false;
                wePlaying = true;
            }
        }

    } else if (weInLose) {
        let center = menuAndElements.center;
        if (x > center - 141 && x < center + 141 && y > height / 2 + 60 && y < height / 2 + 110) {
            wePlaying = true;
            weInLose = false;
            enemies = [];
            for (let i = 0; i < enemyTotal; i++) {
                enemies.push(new enemy(width + getRandom(en_w, 1000), getRandom(0, height - en_h), en_w, en_h, 20));
            }

        } else if (x > center - 80 && x < center + 80 && y > height / 2 + 133 && y < height / 2 + 185) {
            weInStart = true;
            weInLose = false;
        }

        gamer.lives = 100;
        if (score > best_score) best_score = score;
        score = 0;
    }
}

function mouseMoveHandler(e) {
    let pos = getCursorPos(e);
    let x = pos.x, y = pos.y;
    let w = gamer.width, h = gamer.height;

    if (wePlaying) {
        if (touchControl) {

            if (x < width - w / 2 && x > w / 2) {
                gamer.x = x - gamer.width / 2;
                gamer.gunX = gamer.x + 20;
            }
            if (y < height - h / 2 && y > h / 2) {
                gamer.y = y - gamer.height / 2;
                gamer.gunY = gamer.y + 10;
            }
        }
    }
}


function getCursorPos(e) {
    let x, y, pos;

    if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
    } else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    pos = {x: x, y: y};
    return pos;
}

function drawBullets() {
    if (bullets.length) {
        for (let i = 0; i < bullets.length; i++) {
            bullets[i].draw();
        }
    }
}


function moveBullets() {
    for (let i = 0; i < bullets.length; i++) {
        if (bullets[i].x < width + 100) {
            bullets[i].x += 8;
        } else if (bullets[i].x > width + 100) {
            bullets.splice(i, 1);
        }
    }
}

function drawEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].draw();
    }
}


function moveEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].x >= -en_w) {
            enemies[i].x -= 2;
        } else if (enemies[i].x < -en_w) {
            enemies[i].x = width + en_w;
            enemies[i].y = getRandom(0, height - en_h);
        }
    }
}

function hitTest() {
    let removeBul = false;
    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            if (bullets[i].attackX >= enemies[j].x && bullets[i].attackX <= (enemies[j].x + enemies[j].width) &&
                bullets[i].attackY >= enemies[j].y && bullets[i].attackY <= (enemies[j].y + enemies[j].height)) {
                enemies[j].lives -= 10;
                removeBul = true;
                if (enemies[j].lives <= 0) {
                    enemies.splice(j, 1);
                    score += 10;
                    enemies.push(new enemy(width + en_w, getRandom(0, height - en_h), en_w, en_h, 20));
                }
            }
        }
        if (removeBul === true) {
            bullets.splice(i, 1);
            removeBul = false;
        }
    }
}

let menuAndElements = new gameElements();
let gamer = new player(pl_x, pl_y);
for (let i = 0; i < enemyTotal; i++) {
    enemies.push(new enemy(width + getRandom(en_w, 1000), getRandom(0, height - en_h), en_w, en_h, 20));
}

function gameLoop() {
    ctx.clearRect(0, 0, width, height);
    drawBackground();
    gamer.draw();
    menuAndElements.draw();
    drawBullets();
    moveBullets();
    drawEnemies();
    moveEnemies();
    hitTest();
    setTimeout(gameLoop, 1000 / 60);
}

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    background = new Image();
    background.src = 'images/loopBackground.png';
    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);
    document.addEventListener("click", Buttons, false);
    gameLoop()
}

window.onload = init;