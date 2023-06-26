

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0,0,canvas.width,canvas.height)

const gravity = 0.5



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

function rectangularCollision({
    rectangle1,
    rectangle2
}) {
 
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height)
}

function determineWinner({player, opponent, timerId}){
    clearTimeout(timerId)
    document.querySelector('#displayMatchResult').style.display = 'flex'
    if(player.health === opponent.health) {
        document.querySelector('#displayMatchResult').innerHTML = 'Tie'
    } else if(player.health > opponent.health) {
        document.querySelector('#displayMatchResult').innerHTML = 'Player 1 Wins!'
    } else if(opponent.health > player.health) {
        document.querySelector('#displayMatchResult').innerHTML = 'Player 2 Wins!'
    }  
}

//End game based on time
let timer = 60
let timerId
function decreaseTimer() {
    if(timer > 0){
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    } else {
        
        determineWinner({player, opponent, timerId})
    }
}

decreaseTimer()

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