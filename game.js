//Select cvs
const cvs = document.getElementById("flappy");
const ctx = cvs.getContext("2d");

//Game vars and const
let frames = 0;
const DEGREE = Math.PI/180;

//Load sprite image
const sprite = new Image();
sprite.src = "image/sprite.png";

//Game state
const state = {
    current : 0,
    getReady : 0,
    game : 1,
    over : 2
}

//Controll the game
document.addEventListener("click", function() {
    switch (state.current) {
        case state.getReady:
            state.current = state.game;
            break;
        case state.game:
            bird.flap();
            break;                                  
        case state.over:
            state.current = state.getReady;
            break;
    }
})

//Background
const bg = {
    sX : 0,
    sY : 0,
    w : 275,
    h : 226,
    x : 0,
    y : cvs.height - 226,

    draw : function() {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    }
}

//Foreground
const fg = {
    sX : 276,
    sY : 0,
    w : 224,
    h : 112,
    x : 0,
    y : cvs.height - 112,
    dx : 2,

    draw : function() {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    },

    update : function() {
        if (state.current == state.game) {
            this.x = (this.x - this.dx)%(this.w/2);
        }
    }
}

//Bird
const bird = {
    animation : [
        {sX : 276, sY : 112},
        {sX : 276, sY : 139},
        {sX : 276, sY : 164},
        {sX : 276, sY : 139},
    ],
    x : 50,
    y : 150,
    w : 34,
    h : 26,

    frame : 0,

    speed : 0,
    gravity : 0.25,
    jump : 4.5,
    rotation : 0,

    draw : function() {
        let bird = this.animation[this.frame];

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, - this.w/2, - this.h/2, this.w, this.h);
        ctx.restore();
    },

    flap : function() {
        this.speed = - this.jump;
    },

    update : function() {
        //If the game state is get ready state, the bird must flap slowly
        this.period = state.current ==  state.getReady ? 10 : 5;
        //We increment the frame by 1, each period
        this.frame += frames%this.period == 0 ? 1 : 0;
        //Frame goes from 0 to 4, if 4 again to 0
        this.frame = this.frame%this.animation.length;

        if (state.current == state.getReady) {
            this.y = 150;
            this.rotation = 0 * DEGREE;
        }else {
            this.speed += this.gravity;
            this.y += this.speed;

            if (this.y + this.h/2 >= cvs.height - fg.h) {
                this.y = cvs.height - fg.h - this.h/2;
                if (state.current == state.game) {
                    state.current = state.over;
                }
            }
        if (this.speed >= this.jump) {
            this.rotation = 90 * DEGREE;
            this.frame = 1;
        }else {
            this.rotation = -25 * DEGREE
        }
        }
    }
}

//Get ready
const getReady = {
    sX : 0,
    sY : 228,
    w : 173,
    h : 152,
    x : cvs.width/2 - 173/2,
    y : cvs.height/2 - 152/2,

    draw : function() {
        if (state.current == state.getReady) {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
}

//Game over
const gameOver = {
    sX : 175,
    sY : 228,
    w : 225,
    h : 202,
    x : cvs.width/2 - 225/2,
    y : cvs.height/2 - 202/2,

    draw : function() {
        if (state.current == state.over) {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
}

//Draw
function draw() {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    bg.draw();
    fg.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();

}

//Update
function update() {
    bird.update();
    fg.update();
}

//Loop
function loop() {
    update();
    draw();
    frames++;

    requestAnimationFrame(loop);
}
loop();