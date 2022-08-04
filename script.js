//I will use a grid, upon a canvas.
//function to set up the game
//function to control pacman
//


const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")
const scoreEl = document.querySelector("#scoreEl")

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
            context.beginPath()
            context.fillStyle = "blue"
            context.fillRect(this.position.x, this.position.y, this.width, this.height)
            context.closePath()
        }
    }

class Pellet {
    constructor({position}) {
        this.position = position
        this.radius = 2
    }

    draw() {
        context.beginPath()
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        context.fillStyle = "yellow"
        context.fill()
        context.closePath
    }
}

class PowerUp {
    constructor({position}) {
        this.position = position
        this.radius = 8
    }

    draw() {
        context.beginPath()
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        context.fillStyle = "yellow"
        context.fill()
        context.closePath
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

class Ghost {
    static speed = 2
    constructor ({position, velocity, color = "red"}) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.color = color
        this.prevCollisions = []
        this.speed = 2
        this.scared = false
    }

    draw() {
        context.beginPath()
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        context.fillStyle = this.scared ? 'white' : this.color
        context.fill()
        context.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

const pellets = []
const powerUps = []
const boundaries = []
const ghosts = [
    new Ghost({
        position: {
            x: Boundary.width * 3 + Boundary.width / 2,
            y: Boundary.height + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        }
    }),
    new Ghost({
        position: {
            x: Boundary.width * 10 + Boundary.width / 2,
            y: Boundary.height + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        },
        color: "pink"
    }),
    new Ghost({
        position: {
            x: Boundary.width * 7 + Boundary.width / 2,
            y: Boundary.height * 9 + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        },
        color: "cyan"
    })
]

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
let score = 0

const map = [
    ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"], 
    ["-", ".", ".", ".", ".", ".", "-", ".", ".", ".", ".", ".", ".", "-"], 
    ["-", ".", "-", "-", "-", ".", ".", ".", "-", ".", "-", "-", ".", "-"], 
    ["-", ".", ".", ".", ".", ".", "-", ".", ".", ".", ".", ".", ".", "-"],
    ["-", ".", "-", ".", "-", ".", "-", ".", "-", ".", "-", "-", ".", "-"],
    ["-", ".", ".", ".", ".", ".", ".", ".", "-", ".", "-", "-", ".", "-"],
    ["-", ".", "-", "-", ".", "-", "-", ".", ".", ".", "-", "-", ".", "-"],
    ["-", ".", "-", ".", ".", ".", ".", ".", "-", ".", ".", ".", ".", "-"],
    ["-", ".", "-", ".", "-", "-", "-", ".", "-", ".", "-", "-", ".", "-"],
    ["-", ".", "-", ".", "-", "-", "-", ".", ".", ".", ".", ".", ".", "-"],
    ["-", ".", ".", ".", "-", "-", "-", ".", "-", "-", ".", "-", ".", "-"],
    ["-", ".", "-", ".", ".", ".", ".", ".", ".", ".", ".", "-", ".", "-"], 
    ["-", ".", "-", ".", "-", ".", "-", ".", "-", "-", ".", "-", ".", "-"], 
    ["-", ".", ".", ".", ".", ".", "-", ".", "O", ".", ".", ".", ".", "-"], 
    ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"]]
    
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
            
            case ".":
                pellets.push(
                    new Pellet({
                        position: {
                            x: Boundary.width * j + Boundary.width / 2,
                            y: Boundary.height * i + Boundary.height / 2
                        }
                    })
                )
                console.log("here")
                break
            case "O":
                powerUps.push(
                    new PowerUp({
                        position: {
                            x: Boundary.width * j + Boundary.width / 2,
                            y: Boundary.height * i + Boundary.height / 2
                        }
                    })
                )
                console.log("here")
                break
        }
    })
})

function circleCollidesWithRect({circle, rectangle}){
const padding = Boundary.width / 2 - circle.radius - 1
{
    return (circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding && circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding && circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding && circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding)
}
}

let animationId

function animate(){
    animationId = requestAnimationFrame(animate)
    context.clearRect(0, 0, canvas.width, canvas.height)



    if (keys.w.pressed && lastKey === "w") {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
        if (circleCollidesWithRect({
            circle: {...player, velocity: {
                x: 0,
                y: -5
            }},
            rectangle: boundary
        })){
        player.velocity.y = -0
        break
    }
        else {
            player.velocity.y = -5
        }
}

    } else if (keys.a.pressed && lastKey === "a"){
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
        if (circleCollidesWithRect({
            circle: {...player, velocity: {
                x: -5,
                y: 0
            }},
            rectangle: boundary
        })){
        player.velocity.x = 0
        break
    }
        else {
            player.velocity.x = -5
        }
}
    } else if (keys.s.pressed && lastKey === "s"){
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
        if (circleCollidesWithRect({
            circle: {...player, velocity: {
                x: 0,
                y: 5
            }},
            rectangle: boundary
        })){
        player.velocity.y = 0
        break
    }
        else {
            player.velocity.y = 5
        }
}
    } else if (keys.d.pressed && lastKey === "d"){
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
        if (circleCollidesWithRect({
            circle: {...player, velocity: {
                x: 5,
                y: 0
            }},
            rectangle: boundary
        })){
        player.velocity.x = 0
        break
    }
        else {
            player.velocity.x = 5
        }
    }

}

for (let i = ghosts.length-1; 0 <= i; i--){
    const ghost = ghosts[i]
    if (Math.hypot(ghost.position.x - player.position.x, ghost.position.y - player.position.y) < ghost.radius + player.radius){
        if (ghost.scared){
            ghosts.splice(i, 1)
            score += 100
        } else {
            cancelAnimationFrame(animationId)
        }
    }
}

if (pellets.length === 0){
    cancelAnimationFrame(animationId)
}

for (let i = powerUps.length-1; 0 <= i; i--){
    const powerUp = powerUps[i]
    powerUp.draw()
    if (Math.hypot(powerUp.position.x - player.position.x, powerUp.position.y - player.position.y) < powerUp.radius + player.radius){
        powerUps.splice(i, 1)

        ghosts.forEach(ghost => {
            ghost.scared = true
            setTimeout(() => {
                ghost.scared = false
            }, 5000)
        })
    }
}

for (let i = pellets.length-1; 0 <= i; i--){
    const pellet = pellets[i]
    pellet.draw()
    if (Math.hypot(pellet.position.x - player.position.x, pellet.position.y - player.position.y) < pellet.radius + player.radius){
        pellets.splice(i, 1)
        score += 10
        scoreEl.innerHTML = score
    }
}
    


    boundaries.forEach((boundary) => {
        boundary.draw()

        
        if (circleCollidesWithRect({
            circle: player,
            rectangle: boundary
        })){
            player.velocity.x = 0
            player.velocity.y = 0
        }
    })
    player.update()

    ghosts.forEach(ghost => {
        ghost.update()
        const collisions = []
        boundaries.forEach(boundary => {
            if (!collisions.includes("right") && circleCollidesWithRect({
                circle: {...ghost, velocity: {
                    x: ghost.speed,
                    y: 0
                }},
                rectangle: boundary
            }))
        {
            collisions.push("right")
        }

            if (!collisions.includes("left") && circleCollidesWithRect({
                circle: {...ghost, velocity: {
                    x: -ghost.speed,
                    y: 0
                }},
                rectangle: boundary
            }))
        {
            collisions.push("left")
        }

            if (!collisions.includes("up") && circleCollidesWithRect({
                circle: {...ghost, velocity: {
                    x: 0,
                    y: -ghost.speed
                }},
                rectangle: boundary
            }))
        {
            collisions.push("up")
        }

            if (!collisions.includes("down") && circleCollidesWithRect({
                circle: {...ghost, velocity: {
                    x: 0,
                    y: ghost.speed
                }},
                rectangle: boundary
            }))
            {
            collisions.push("down")
            }

    })

    if (collisions.length > ghost.prevCollisions.length){
        ghost.prevCollisions = collisions
    }

    if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)){
        if (ghost.velocity.x > 0) {
            ghost.prevCollisions.push("right")
        }
        else if (ghost.velocity.x < 0) {
            ghost.prevCollisions.push("left")
        }
        else if (ghost.velocity.y < 0) {
            ghost.prevCollisions.push("up")
        }
        else if (ghost.velocity.x > 0) {
            ghost.prevCollisions.push("down")
        }
        const pathways = ghost.prevCollisions.filter((collision) => {
            return !collisions.includes(collision)
        })

        const direction = pathways[Math.floor(Math.random() * pathways.length)]

        switch (direction) {
            case "down":
                ghost.velocity.y = ghost.speed
                ghost.velocity.x = 0
                break
            case "up":
                ghost.velocity.y = -ghost.speed
                ghost.velocity.x = 0
                break
            case "right":
                ghost.velocity.y = 0
                ghost.velocity.x = ghost.speed
                break
            case "left":
                ghost.velocity.y = 0
                ghost.velocity.x = -ghost.speed
                break
        }

        ghost.prevCollisions = []
    }
    })
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
