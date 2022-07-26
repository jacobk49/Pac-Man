//I will use a grid, upon a canvas.
//function to set up the game
//function to control pacman
//


const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

let i
let j

canvas.width = window.innerWidth
canvas.height = window.innerHeight

class Boundary {
    static width = 40
    static height = 40
    constructor({position}) {
        this.position = position
        this.width = 40
        this.height = 40
        }

        draw() {
            context.fillStyle = "blue"
            context.fillRect(this.position.x, this.position.y, this.width, this.height)
        }
    }

class Player {
    constructor ({position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
    }

    draw() {
        context.beginPath()
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        context.fillStyle = "yellow"
        context.fill()
        context.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

const boundaries = []
const player = new Player({
    position: {
        x: Boundary.width + Boundary.width / 2,
        y: Boundary.height + Boundary.height / 2
    },
    velocity: {
        x: 0,
        y: 0
    }
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

let lastKey = ""

const map = [
    ["-", "-", "-", "-", "-", "-"], 
    ["-", " ", " ", " ", " ", "-"], 
    ["-", " ", "-", "-", " ", "-"], 
    ["-", " ", " ", " ", " ", "-"], 
    ["-", "-", "-", "-", "-", "-"]]
    
map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol) {
            case "-":
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        }
                }))
                break
        }
    })
})

function animate(){
    requestAnimationFrame(animate)
    context.clearRect(0, 0, canvas.width, canvas.height)
    boundaries.forEach((boundary) => {
        boundary.draw()
    })
    player.update()
    player.velocity.x = 0
    player.velocity.y = 0

    if (keys.w.pressed && lastKey === "w") {
        player.velocity.y = -5
    } else if (keys.a.pressed && lastKey === "a"){
        player.velocity.x = -5
    } else if (keys.s.pressed && lastKey === "s"){
        player.velocity.y = 5
    } else if (keys.d.pressed && lastKey === "d"){
        player.velocity.x = 5
    }
}
animate()

player.draw()

window.addEventListener("keydown", ({key}) => {
    switch (key) {
        case "w":
            keys.w.pressed = true
            lastKey = "w"
            break
        case "a":
            keys.a.pressed = true
            lastKey = "a"
            break
        case "s":
            keys.s.pressed = true
            lastKey = "s"
            break
        case "d":
            keys.d.pressed = true
            lastKey = "d"
            break
    }
})

window.addEventListener("keyup", ({key}) => {
    switch (key) {
        case "w":
            keys.w.pressed = false
            break
        case "a":
            keys.a.pressed = false
            break
        case "s":
            keys.s.pressed = false
            break
        case "d":
            keys.d.pressed = false
            break
    }
})