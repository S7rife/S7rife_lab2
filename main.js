let canvas, ctx, width = window.innerWidth, height = 480;
let background, backX = 0, backY = 0, backX2 = backSize = 1890;


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

function gameLoop() {
    ctx.clearRect(0, 0, width, height);
    drawBackground();
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