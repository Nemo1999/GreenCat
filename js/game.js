console.log("game.js loaded");

// get canvas and 2d context
async function getCanvas(){
    return new Promise(function(resolve, reject){
        window.onload=function(){
            canvas = document.getElementById("canvas");
            context = canvas.getContext("2d");
            resolve([canvas, context]);
        }      
    });
}

// load image
async function loadImage(src){
    return new Promise(function(resolve, reject){
        var img = new Image();
        img.onload = function(){
            resolve(img);
        }
        img.src = src;
    });
}

// main function 
async function main(){
    var [canvas, context] = await getCanvas();
    GAME_WIDTH = canvas.width = 800;
    GAME_HEIGHT = canvas.height = 600;
    const freeCat = await loadImage("Assets/Caterpillars/Free.png");
    context.drawImage(freeCat, 0, 0);

    cat = new Caterpillar(freeCat,
         -200, 400,
         466, 200,
         5, 10,
        );

    function update(){
        context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        context.fillStyle = "#41BA41";
        context.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        // update game state
        gameFrame++;
        if (gameFrame % 10 == 0){
            cat.update();
            
        }
        cat.draw()
        // draw game state
        requestAnimationFrame(update);
    }
    update();
}


class Caterpillar{
    constructor(image, x, y, width, height, steps, speed){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.steps = steps;
        this.speed = speed;
        this.image = image;
        this.frameX = 0;
        this.frameY = 0;
        this.frameCnt = 0;
        this.tick = 0;
        this.pattern = [0,1,2,3,4,4,3,2,1,0]
    }
    draw(){
        context.drawImage(this.image,
        this.frameX, this.frameY,
        this.width, this.height,
        this.x, this.y,
             this.width, this.height);
    }
    move(){
        this.x += this.speed;
        if(this.x > GAME_WIDTH){
            this.x = -this.width;
        }
    }
    update(){
        this.move();
        this.tick = (this.tick + 1) % this.pattern.length;
        this.frameCnt = this.pattern[this.tick]
        this.frameY = this.height * this.frameCnt;
    }
}


var gameFrame = 0;
var GAME_HEIGHT
var GAME_WIDTH
// runs the async main function 
main().then(()=>{console.log("main() finished")});