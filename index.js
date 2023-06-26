

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0,0,canvas.width,canvas.height)

const gravity = 0.5


//Sprite creation
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
        x: 0,
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
    }
})

player.draw()

const opponent = new Fighter({
    position:{
        x: 400,
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
    color: 'blue'
})

opponent.draw()

console.log(player, opponent)

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
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
    }

    //Opponent movement
    if(keys.ArrowLeft.pressed && opponent.lastKey === 'ArrowLeft'){
        opponent.velocity.x = -5
    } else if (keys.ArrowRight.pressed && opponent.lastKey === 'ArrowRight') {
        opponent.velocity.x = 5
    }

    //Detect for collision (Player)
    if(rectangularCollision({
        rectangle1: player,
        rectangle2: opponent
    })
        && player.isAttacking){
        player.isAttacking = false
        opponent.health -= 20
        document.querySelector('#opponentHealth').style.width = opponent.health + '%'
        console.log('Player hits the opponent!')
    }

    //Detect for collision (Opponent)
    if(rectangularCollision({
        rectangle1: opponent,
        rectangle2: player
    })
        && opponent.isAttacking){
        opponent.isAttacking = false
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%'
        console.log('Opponent hits the player! ', player.health)
    }

    //End game based on health
    if(opponent.health <= 0 || player.health <= 0) {
        determineWinner({player, opponent, timerId})
    }
}

window.addEventListener('keydown', (event) => {
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
    
    console.log(event.key)
})

animate();