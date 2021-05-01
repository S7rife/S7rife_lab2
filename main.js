let touch = false;
let mobile = false
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) mobile = true;

let canvas, ctx, width = window.innerWidth;
let height = 480;

let backX = 0, backY = 0, backX2 = backSize = 1890;
let pl_x = 30, pl_y = height / 2 - 70, score = 0, best_score = 0;
let shotKey = false, rightKey = false, leftKey = false, upKey = false, downKey = false;
let bulletsTotal = 10, bullets = [];
let enemyTotal = 10, enemies = [], en_w = 80, en_h = 80;
let weInSelect = false, weInStart = true, weInLose = false, wePlaying = false;
let godMode = false, gameFrequency = 0;
let bossInGame = false, bossGoal = 0;

function keyDown(e) {
    if (wePlaying && !touch && !mobile) {
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
}


function keyUp(e) {
    if (wePlaying && !touch && !mobile) {
        if (e.keyCode === 39 || e.keyCode === 68) rightKey = false;
        else if (e.keyCode === 37 || e.keyCode === 65) leftKey = false;
        if (e.keyCode === 38 || e.keyCode === 87) upKey = false;
        else if (e.keyCode === 40 || e.keyCode === 83) downKey = false;
        if (e.keyCode === 77 || e.keyCode === 88) shotKey = false;
    }
}


function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function drawBackground() {
    this.backMenu = new Image();
    this.backMenu.src = 'images/loopBackground.png';
    this.backBoss = new Image();
    this.backBoss.src = 'images/loopBackground2.jpg';
    this.backOrd = new Image();
    this.backOrd.src = 'images/loopBackground3.png';

    let source;
    if (weInLose || weInStart || weInSelect) source = this.backMenu;
    else if (bossInGame) source = this.backBoss;
    else if (wePlaying) source = this.backOrd;


    ctx.drawImage(source, backX, backY);
    ctx.drawImage(source, backX2, backY);
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
        this.gun = new Image();
        this.gun.src = 'images/gun_sprites.png';
        this.gunX = x + 20;
        this.gunY = y + 10;
        this.gunWidth = 170;
        this.gunHeight = 134;
        this.gCurFrame = 0;
        this.gFrameCount = 3;
        this.srcXg = 0;
        this.god = new Image();
        this.god.src = 'images/god_sprite.png';
        this.godWidth = 207;
        this.godHeight = 213;
        this.godCurFrame = 0;
        this.godFrameCount = 4;
        this.srcXgod = 0;
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
        if (gameFrequency % 6 === 0) {
            if (godMode) {
                this.godCurFrame = ++this.godCurFrame % this.godFrameCount;
                this.srcXgod = this.godCurFrame * this.godWidth;
            } else {
                this.curFrame = ++this.curFrame % this.frameCount;
                this.srcX = this.curFrame * this.width;

                this.gCurFrame = ++this.gCurFrame % this.gFrameCount;
                this.srcXg = this.gCurFrame * this.gunWidth;
            }
        }
        if (wePlaying) {
            if (godMode) {
                ctx.drawImage(this.god, this.srcXgod, 0, this.godWidth, this.godHeight, this.x - 270, this.y - 160, this.godWidth * 2.2, this.godHeight * 2.2);

            } else {
                ctx.drawImage(this.img, this.srcX, 0, this.width, this.height, this.x, this.y, this.width, this.height);
                ctx.drawImage(this.gun, this.srcXg, 0, this.gunWidth, this.gunHeight, this.gunX, this.gunY, this.gunWidth - 60, this.gunHeight - 45);
            }
        }
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
    }

    draw() {
        this.attackX = this.x + this.width / 2;
        this.attackY = this.y + this.height / 2;
        if (gameFrequency % 4 === 0) {
            this.curFrame = ++this.curFrame % this.frameCount;
            this.srcX = this.curFrame * this.width;
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
        this.def = new Image();
        this.def.src = 'images/enemy_sprites_default.png';
        this.img = new Image();
        this.img.src = 'images/enemy_sprites.png';
        this.curFrame = 0;
        this.frameCount = 6;
        this.srcX = 0;
    }

    draw() {
        let source;
        bossInGame ? source = this.img : source = this.def;
        ctx.drawImage(source, this.srcX, 0, this.width, this.height, this.x, this.y, this.width, this.height);

        if (gameFrequency % 6 === 0) {
            this.curFrame = ++this.curFrame % this.frameCount;
            this.srcX = this.curFrame * this.width;
        }
    }
}


class boss {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 499;
        this.height = 644;
        this.lives = 1000;
        this.boss = new Image();
        this.boss.src = 'images/boss_sprite.png';
        this.curFrame = 0;
        this.frameCount = 8;
        this.srcX = 0;
        this.imgLive = new Image();
        this.imgLive.src = 'images/boss_lives.png';

        this.portal = new Image();
        this.portal.src = 'images/portal.png';
        this.portal2 = new Image();
        this.portal2.src = 'images/portal2.png';
        this.pWidth = 455;
        this.pHeight = 455;
        this.pCurFrame = 0;
        this.pFrameCount = 9;
        this.pSrcX = 0;
    }

    draw() {
        ctx.drawImage(this.boss, this.srcX, 0, this.width, this.height, this.x, 0, this.width, this.height);

        if (gameFrequency % 10 === 0) {
            this.curFrame = ++this.curFrame % this.frameCount;
            this.srcX = this.curFrame * this.width;
        }
        let k = 0;
        if (Boss.lives !== 1000) k = 20 - ~~(Boss.lives / 50);
        ctx.drawImage(this.imgLive, 0, k * 96, 1200, 96, width / 2 - 240, 0, 400, 37);
        ctx.drawImage(this.portal2, this.pSrcX, 0, this.pWidth, this.pHeight, width - 500, height - this.pHeight * 0.3, this.pWidth * 0.3, this.pHeight * 0.3);
        ctx.drawImage(this.portal2, this.pSrcX, 0, this.pWidth, this.pHeight, width - 500, 0, this.pWidth * 0.3, this.pHeight * 0.3);
    }

    drawPortal() {
        if (gameFrequency % 10 === 0) {
            this.pCurFrame = ++this.pCurFrame % this.pFrameCount;
            this.pSrcX = this.pCurFrame * this.pWidth;
        }
        ctx.drawImage(this.portal, this.pSrcX, 0, this.pWidth, this.pHeight, width - 450, height / 2 - this.pHeight / 2 * 1.5, this.pWidth * 1.5, this.pHeight * 1.5);
    }
}

class obstacle {
    constructor(x, y, x2, y2) {
        this.botLeft = new Image();
        this.botLeft.src = 'images/botLeft.png';
        this.botRight = new Image();
        this.botRight.src = 'images/botRight.png';
        this.x = x;
        this.y = y;
        this.width = 70;
        this.height = 70;
        this.endX = x2;
        this.endY = y2;
        this.bWidth = 500;
        this.bHeight = 500;
        this.bCurFrame = 0;
        this.bFrameCount = 11;
        this.bSrcX = 0;
    }

    draw() {
        let source;
        if (gameFrequency % 1000 === 0) {
            this.endX = gamer.x
            this.endY = gamer.y
        }

        if (gameFrequency % 300 === 0) {
            this.endX = getRandom(0, width - 500);
            this.endY = getRandom(100, height - 100);
        }
        this.x < this.endX ? source = this.botRight : source = this.botLeft;

        ctx.drawImage(source, this.bSrcX, 0, this.bWidth, this.bHeight, this.x, this.y, this.width, this.height);
        if (gameFrequency % 20 === 0) {
            this.bCurFrame = ++this.bCurFrame % this.bFrameCount;
            this.bSrcX = this.bCurFrame * this.bWidth;
        }
        if (this.x !== this.endX || this.y !== this.endY) {
            let dx = this.endX - this.x;
            let dy = this.endY - this.y;
            let d = Math.sqrt(dx * dx + dy * dy);
            if (d <= 5) {
                this.x = this.endX;
                this.y = this.endY;
            } else {
                this.x += 0.6 * dx / d;
                this.y += 0.6 * dy / d;
            }
        }
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
                ctx.fillStyle = '#4b0d5d';
                ctx.fillText("Best score: ", this.center - 100, height / 2 - 50);
                ctx.fillText(best_score, this.center + 80, height / 2 - 50);

            } else if (weInSelect) {
                ctx.drawImage(this.selectMenu, 0, 0, this.menuWidth - 2, height, this.menuX, 0, this.menuWidth, this.menuHeight);

                ctx.fillStyle = '#4f0e5f';
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
            ctx.drawImage(this.elements, 0, (k * this.live_height) + 480, this.el_width, this.live_height, 0, 0, this.el_width - 20, this.live_height - 5);
            ctx.drawImage(this.elements, 0, 0, this.el_width, this.score_height, -35, 45, 110, 50);
            ctx.fillStyle = '#57cd0e';
            ctx.font = 'normal 50px VT323';
            ctx.fillText(score, 60, 85);
        }
    }
}


function Buttons(e) {
    let pos = getCursorPos(e);
    let x = pos.x, y = pos.y;
    if (wePlaying) return false;

    else if (weInStart && x > width / 2 - 120 && x < width / 2 + 120 && y > height / 2 + 15 && y < height / 2 + 95) {
        weInStart = false;
        resetGame();
        (mobile) ? wePlaying = true : weInSelect = true;

    } else if (weInSelect) {
        let y1 = 187, y2 = 380, x0 = menuAndElements.center - menuAndElements.menuWidth / 2;

        if (y > y1 && y < y2) {
            if (x > x0 + 100 && x < x0 + 300) {
                touch = true;
                weInSelect = false;
                wePlaying = true;

            } else if (x > x0 + 380 && x < x0 + 580) {
                touch = false;
                weInSelect = false;
                wePlaying = true;
            }
        }

    } else if (weInLose) {
        let center = menuAndElements.center;
        if (x > center - 141 && x < center + 141 && y > height / 2 + 60 && y < height / 2 + 110) {
            resetGame();
            weInLose = false;
            wePlaying = true;

        } else if (x > center - 80 && x < center + 80 && y > height / 2 + 133 && y < height / 2 + 185) {
            weInStart = true;
            weInLose = false;
        }
        score = 0;
    }
}


function mouseMoveHandler(e) {
    let pos = getCursorPos(e);
    let x = pos.x, y = pos.y;
    let w = gamer.width, h = gamer.height;

    if (wePlaying && touch) {
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
        if (bossInGame && bullets[i].attackX > width - 400 && bullets[i].attackX < width && Boss.x === width - 400) {
            bullets.splice(i, 1);
            if (Boss.lives <= 0) {
                resetGame();
                weInLose = true;
                wePlaying = false;

            } else {
                Boss.lives -= 10;
                score += 30;
            }
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
            enemies[i].x = width - 150;
            enemies[i].y = getRandom(100, height - 100);
        }
    }
}


function moveBoss() {
    if (Boss.x > width - 400) {
        Boss.x -= 2;
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
                    score += 25;
                    if (enemies.length < enemyTotal) enemies.push(new enemy(width - 150, getRandom(100, height - 100), en_w, en_h, 20));
                }
            }
        }
        if (removeBul === true) {
            bullets.splice(i, 1);
            removeBul = false;
        }
    }
}


function collisionDetection(x1, y1, w1, h1, x2, y2, w2, h2) {
    if (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2) return true;
}


function checkCollision() {
    for (let i = 0; i < enemies.length; i++) {
        if (collisionDetection(gamer.x, gamer.y, gamer.width, gamer.height, enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height)) {
            checkLives()
        }
    }
    if (collisionDetection(gamer.x, gamer.y, gamer.width, gamer.height, bot.x, bot.y, bot.width, bot.height)) {
        checkLives()
    }
    if (collisionDetection(gamer.x, gamer.y, gamer.width, gamer.height, bot2.x, bot2.y, bot2.width, bot2.height)) {
        checkLives()
    }
    if (bossInGame && gamer.x > width - 480 && !godMode) {
        gamer.lives = 0;
        checkLives();
    }
}


function autoShot() {
    let posY = gamer.y;
    let shot = 20;
    if (godMode) {
        shot = 5;
        posY = getRandom(gamer.y - 100, gamer.y + 100);
    }
    if (bullets.length <= bulletsTotal && gameFrequency % shot === 0) {
        bullets.push(new bullet(gamer.x, posY))
    }
}


function checkLives() {
    if (!godMode && gamer.lives > 25) {
        gamer.lives -= 25;
        godMode = true;

    } else if (!godMode && gamer.lives <= 25) {
        wePlaying = false;
        weInLose = true;
    }
}


function resetGame() {
    bossInGame = false;
    if (score > best_score) best_score = score;
    offGodMode();
    bossGoal = getRandom(500, 1000);
    enemies = [];
    enemyTotal = 10;
    for (let i = 0; i < enemyTotal; i++) {
        enemies.push(new enemy(width + getRandom(en_w, 1000), getRandom(0, height - en_h), en_w, en_h, 20));
    }
    bullets = [];
    Boss.lives = 1000;
    Boss.x = width - 200;
    gamer.lives = 100;
    bot.x = width - 485;
    bot.y = height - 100;
    bot2.x = width - 485;
    bot2.y = 100;
}


function offGodMode() {
    godMode = false;
}


let menuAndElements = new gameElements();
let gamer = new player(pl_x, pl_y);
let Boss = new boss(width - 200, 0);
let bot = new obstacle(width - 485, 35, width / 2, height - 100);
let bot2 = new obstacle(width - 485, height - 100, width / 2, 100);


let ongoingTouches = [];
let lastx = 0;
let lasty = 0;
let dx, dy;
let startTap = false;
let touches = [];
let moveTouch = false;


function copyTouch({identifier, pageX, pageY}) {
    return {identifier, pageX, pageY};
}

function handleStart(evt) {
    if (wePlaying) {
        startTap = true;
        evt.preventDefault();
        touches = evt.changedTouches;
        ongoingTouches.push(copyTouch(touches[0]));
        lastx = ongoingTouches[0].pageX;
        lasty = ongoingTouches[0].pageY;
    }
}

function handleMove(evt) {
    if (wePlaying) {
        startTap = false;
        evt.preventDefault();
        if (mobile) {
            let touches = evt.changedTouches;
            moveTouch = touches[0];
            if (moveTouch.pageX - dx > 20 || moveTouch.pageX - dx < -20) {
                console.log('danger');
            }
            dx = -lastx + moveTouch.pageX;
            dy = -lasty + moveTouch.pageY;
            touchMove(dx, dy);
            lastx = moveTouch.pageX;
            lasty = moveTouch.pageY;
        }
    }
}

function handleEnd(evt) {
    if (wePlaying){
        evt.preventDefault();
        let touches = evt.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            let idx = ongoingTouchIndexById(touches[i].identifier);
            if (idx >= 0) {
                ongoingTouches.splice(idx, 1);
            }
        }
    }
}

function handleCancel(evt) {
    if (wePlaying){
        evt.preventDefault();
        console.log("touchcancel.");
        let touches = evt.changedTouches;

        for (let i = 0; i < touches.length; i++) {
            let idx = ongoingTouchIndexById(touches[i].identifier);
            ongoingTouches.splice(idx, 1);
        }
    }
}

function ongoingTouchIndexById(idToFind) {
    for (let i = 0; i < ongoingTouches.length; i++) {
        let id = ongoingTouches[i].identifier;

        if (id === idToFind) {
            return i;
        }
    }
    return -1;
}

function touchMove(dx, dy) {

    if ((gamer.x + dx) < width - 64 && (gamer.x + dx) > 0) {
        gamer.x += dx;
        gamer.gunX += dx;
    }
    if ((gamer.y + dy) < height - 64 && (gamer.y + dy) > 0) {
        gamer.y += dy;
        gamer.gunY += dy;
    }
}


function gameLoop() {
    ctx.clearRect(0, 0, width, height);
    document.body.style.cursor = 'default';
    drawBackground();

    gamer.draw();
    Boss.drawPortal();
    menuAndElements.draw();
    if (wePlaying && gamer.lives > 0) {
        document.body.style.cursor = 'none';
        checkCollision();
        drawBullets();
        moveBullets();
        drawEnemies();
        moveEnemies();
        hitTest();
        if (bossInGame && Boss.lives > 0) {
            bot.draw();
            bot2.draw();
            moveBoss();
            Boss.draw();
        } else if (gamer.lives > 0 && score >= bossGoal) {
            enemyTotal = 5;
            bossInGame = true;
        }
        if (touch || godMode || mobile) autoShot();
        if (godMode) setTimeout(offGodMode, 3000);
    }
    gameFrequency < 10000 ? gameFrequency++ : gameFrequency = 0;
    setTimeout(gameLoop, 1000 / 60);
}


function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);
    document.addEventListener("click", Buttons, false);
    canvas.addEventListener("touchstart", handleStart, false);
    canvas.addEventListener("touchend", handleEnd, false);
    canvas.addEventListener("touchcancel", handleCancel, false);
    canvas.addEventListener("touchmove", handleMove, false);
    gameLoop()
}

window.onload = init;