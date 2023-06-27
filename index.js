

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0,0,canvas.width,canvas.height)

const gravity = 0.6


//-----------Sprite creation----------
const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 162
    },
    imageSrc: './assets/shop.png',
    scale: 2.5,
    framesMax: 6
})

const lamp = new Sprite({
    position: {
        x: 70,
        y: 340
    },
    imageSrc: './assets/lamp.png',
    scale: 2.5,
})

const player = new Fighter({
    position:{
        x: 200,
        y: 10
    },
    velocity: {
        x: 0,
        y: 10
    },
    offset: {
        x: 0,
        y: 0,
    },
    imageSrc: './assets/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './assets/samuraiMack/Idle.png',
            framesMax: 8,  
        },
        run: {
            imageSrc: './assets/samuraiMack/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './assets/samuraiMack/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './assets/samuraiMack/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './assets/samuraiMack/Attack1.png',
            framesMax: 6,
        },
        attack2: {
            imageSrc: './assets/samuraiMack/Attack2.png',
            framesMax: 6,
        },
        takeHit: {
            imageSrc: './assets/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4,
        },
        death: {
            imageSrc: './assets/samuraiMack/Death.png',
            framesMax: 6,
        },

    },
    attackBox: {
        offset: {
            x: 130,
            y: 50 
        },
        width: 100,
        height: 50
    }
})


const opponent = new Fighter({
    position:{
        x: 800,
        y: 100
    },
    velocity: {
        x: 0,
        y: 10
    },
    offset: {
        x: -50,
        y: 0,
    },
    imageSrc: './assets/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './assets/kenji/Idle.png',
            framesMax: 4,  
        },
        run: {
            imageSrc: './assets/kenji/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './assets/kenji/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './assets/kenji/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './assets/kenji/Attack1.png',
            framesMax: 4,
        },
        attack2: {
            imageSrc: './assets/kenji/Attack2.png',
            framesMax: 4,
        },
        takeHit: {
            imageSrc: './assets/kenji/Take Hit.png',
            framesMax: 3,
        },
        death: {
            imageSrc: './assets/kenji/Death.png',
            framesMax: 7,
        },

    },
    attackBox: {
        offset: {
            x: -170,
            y: 50 
        },
        width: 170,
        height: 50
    }
})

player.draw()
opponent.draw()

//---------------------

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width,canvas.height)
    background.update()
    shop.update()
    lamp.update()
    player.update()
    opponent.update()

    player.velocity.x = 0
    opponent.velocity.x = 0
    
    //Player movement
    if(keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    //Player jump & fall
    if(player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if(player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    //Opponent movement
    if(keys.ArrowLeft.pressed && opponent.lastKey === 'ArrowLeft'){
        opponent.velocity.x = -5
        opponent.switchSprite('run')
    } else if (keys.ArrowRight.pressed && opponent.lastKey === 'ArrowRight') {
        opponent.velocity.x = 5
        opponent.switchSprite('run')
    } else {
        opponent.switchSprite('idle')
    }

    //Opponent jump & fall
    if(opponent.velocity.y < 0) {
        opponent.switchSprite('jump')
    } else if(opponent.velocity.y > 0) {
        opponent.switchSprite('fall')
    }

    //Detect for collision (Player)
    if(rectangularCollision({
        rectangle1: player,
        rectangle2: opponent
    })
        && player.isAttacking
        && player.framesCurrent === 4){
        player.isAttacking = false
        document.querySelector('#opponentHealth').style.width = opponent.health + '%'
        opponent.takeHit();
    }

    //Player misses
    if(player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }

    //Detect for collision (Opponent)
    if(rectangularCollision({
        rectangle1: opponent,
        rectangle2: player
    })
        && opponent.isAttacking
        && opponent.framesCurrent === 2){
        opponent.isAttacking = false
        document.querySelector('#playerHealth').style.width = player.health + '%'
        player.takeHit()
    }

    //Opponent misses
    if(opponent.isAttacking && opponent.framesCurrent === 2) {
        opponent.isAttacking = false
    }

    //End game based on health
    if(opponent.health <= 0 || player.health <= 0) {
        determineWinner({player, opponent, timerId})
    }
}

window.addEventListener('keydown', (event) => {
    if(!player.dead){
        switch (event.key) {        
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break
            case 'w':
                player.velocity.y = -20
                keys.w.pressed = true
                player.lastKey = 'w'
                break
            case ' ':
                player.attack()
                break
        }
    }
    if(!opponent.dead) {
        switch (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                opponent.lastKey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                opponent.lastKey = 'ArrowLeft'
                break
            case 'ArrowUp':
                opponent.velocity.y = -20
                keys.ArrowUp.pressed = true
                opponent.lastKey = 'ArrowUp'
                break
            case 'ArrowDown':
                opponent.attack()
                break 
        }
    }
})

window.addEventListener('keyup', (event) => {
    //Player keys
    switch (event.key) {     
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }

    //Opponent keys
    switch (event.key) {     
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
    
})

animate();