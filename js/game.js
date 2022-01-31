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
    GAME_WIDTH = canvas.width = window.innerWidth*0.6;
    GAME_HEIGHT = canvas.height = window.innerHeight*0.8;
    const freeCat = await loadImage("Assets/Caterpillars/Free.png");
    context.drawImage(freeCat, 0, 0);

    cat = new Caterpillar(freeCat,
         -200 , 400,
         466, 200,
         10, 0.5,
        );

    cat_old = new Caterpillar_old(freeCat,
         -200 , 200,
         466, 200,
         10, 0.5,
        );

    function update(){
        context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        context.fillStyle = "#41BA41";
        context.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        // update game state
        cat.update();
        cat_old.update();
        // draw game state
        cat.draw()
        cat_old.draw()
        // request new frame
        requestAnimationFrame(update);
    }
    update();
}

function drawImage(image, box1, box2){
    context.drawImage(image,
        box1.x, box1.y,
        box1.width, box1.height,
        box2.x, box2.y,
        box2.width, box2.height
        );
}

function fillRect(color, box){
    context.fillStyle = color;
    context.fillRect(box.x, box.y, box.width, box.height);
}


var gameFrame = 0;
var GAME_HEIGHT
var GAME_WIDTH
// runs the async main function 
main().then(()=>{console.log("main() finished")});



class Caterpillar{
    constructor(image, x, y, width, height, updateRate=20, scale=0.5){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.updateRate = updateRate;
        this.cnt = 0;
        this.image = image;
        this.frameX = 0;
        this.frameY = 0;
        this.frameCnt = 0;
        this.tick = 0;
        this.framePattern = [0,1,2,3,4,4,4,3,2,1,0,0]
        this.x1MovementPattern = [0.0, 0.1, 0.2, 0.25, 0.30, 0.30 , 0.30, 0.30, 0.30, 0.30, 0.30, 0.30]
        this.x2MovementPattern = [-0.05, 0.0, 0.0, 0.05, 0.05, 0.05, 0.05, 0.15, 0.20, 0.25, 0.30, 0.30]
        this.scale = scale
    }
    getSourceBox(){
        return {
            x: this.frameX,
            y: this.frameY,
            width: this.width,
            height: this.height
        }
    }

    getBox(){
        //console.log(this.x, this.y)
        const wRatio =  (1 + this.x2MovementPattern[this.tick] - this.x1MovementPattern[this.tick])
        const hRatio = 1 / Math.sqrt(wRatio);
        return {
            x: this.x + this.width * this.scale * this.x1MovementPattern[this.tick],
            y: this.y + this.scale * this.height * (1 - hRatio),
            width: this.scale * this.width * wRatio,
            height: this.scale * this.height * hRatio
        }
    }

    draw(){
        drawImage(this.image, this.getSourceBox(), this.getBox());
        //fillRect("#414141", this.getBox());
    }

    move(){
        if(this.tick < this.framePattern.length - 1){
            this.tick++;
        }
        else{
            this.x += this.width * this.scale * this.x1MovementPattern[this.tick];
            this.tick = 0;
        }
        this.frameY = this.height * this.framePattern[this.tick]

        if(this.x > GAME_WIDTH){
            this.x = -this.width*this.scale;
        }
    }
    update(){
        this.cnt++;
        if(this.cnt % this.updateRate == 0){
            this.move();
        }
        
    }
}





/*
Old implementation of caterpillar (without squeezing)
*/ 

class Caterpillar_old{
    constructor(image, x, y, width, height, updateRate=20, scale=0.5){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.updateRate = updateRate;
        this.cnt = 0;
        this.scale = scale
        this.image = image;
        this.frameX = 0;
        this.frameY = 0;
        this.frameCnt = 0;
        this.tick = 0;
        this.pattern = [0,1,2,3,4,4,4,3,2,1,0,0]
        this.speedPattern = [0,0.6,1.4,1.4, 0.6, 0, 0.6,1.4,1.4,0.6 , 0.0, 0.6]
    }
    draw(){
        context.drawImage(this.image,
        this.frameX, this.frameY,
        this.width, this.height,
        this.x, this.y,
             this.width*this.scale, this.height*this.scale);
    }
    move(){
        this.x += this.width * this.scale * 0.3 / 13    ;
        if(this.x > GAME_WIDTH){
            this.x = -this.width * this.scale;
        }
    }
    update(){
        this.cnt++;
        if(this.cnt % this.updateRate == 0){
            this.move();
            this.tick = (this.tick + 1) % this.pattern.length;
            this.frameCnt = this.pattern[this.tick]
            this.frameY = this.height * this.frameCnt;
        }
    }
}