//Sprite class, for static image assets
//FramesMax will apply for sprites that will animate.
class Sprite {
    constructor({position, imageSrc, scale = 1, framesMax = 1}){
        this.position = position
        this.width = 10
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        //For static sprites, to assure they will always be on the first frame
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
    }

    draw() {
        c.drawImage(
            this.image,
            //crop location and dimensions
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,

            //draw location and dimensions
            this.position.x,
            this.position.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        )
    }

    update() {
        this.draw()
        this.framesElapsed++
        if(this.framesElapsed % this.framesHold === 0) {
            if(this.framesCurrent < this.framesMax - 1){
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }
}

//Fighter class
class Fighter {
    constructor({position, velocity, color = 'red', offset}){
        this.position = position
        this.velocity = velocity
        this.width = 10
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset,
            width: 100,
            height: 50
        }
        this.color = color
        this.isAttacking = false
        this.health = 100;
    }

    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, 50, 150)

        //Draw attack box
        if(this.isAttacking) {
            c.fillStyle = 'green'
            c.fillRect(
                this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height
                )
        }
    }

    update() {
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if(this.position.y + this.height + this.velocity.y >= canvas.height -95) {
            this.velocity.y = 0
        } else {
            this.velocity.y += gravity
        }
    }

    attack(){
        this.isAttacking = true
        console.log('attack true')
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }
}