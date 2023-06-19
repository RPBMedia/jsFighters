const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0,0,canvas.width,canvas.height)

const gravity = 0.5
class Sprite {
    constructor({position, velocity, color = 'red'}){
        this.position = position
        this.velocity = velocity
        this.width = 10
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: this.position,
            width: 100,
            height: 50
        }
        this.color = color
        this.isAttacking
    }

    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, 50, 150)

        //Draw attack box
        c.fillStyle = 'green'
        c.fillRect(
            this.attackBox.position.x,
            this.attackBox.position.y,
            this.attackBox.width,
            this.attackBox.height
            )
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if(this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        } else {
            this.velocity.y += gravity
        }
    }

    attack(){
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }
}


const player = new Sprite({
    position:{
        x: 0,
        y: 10
    },
    velocity: {
        x: 0,
        y: 10
    }
})

player.draw()

const opponent = new Sprite({
    position:{
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 10
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

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width,canvas.height)
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

    //Detect for collision
    if(player.attackBox.position.x + player.attackBox.width >= opponent.position.x
        && player.attackBox.position.x <= opponent.position.x + opponent.width
        && player.attackBox.position.y + player.attackBox.height >= opponent.position.y
        && player.attackBox.position.y <= opponent.position.y + opponent.height
        && player.isAttacking){
        console.log('collision')
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
    }
    console.log(event.key)
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