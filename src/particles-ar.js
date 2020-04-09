// Check if jQuery is loaded
if (typeof jQuery == "undefined") {
    throw "jQuery library is required";
}

// Particles animation
function getRndInteger(min, max) {
    var response = Math.floor(Math.random() * (max - min) ) + min;
    while (response == 0) {
        response = Math.floor(Math.random() * (max - min) ) + min;
    }
    return response;
}

function getRndNum(min, max) {
    var response = (Math.random() * (max - min)) + min;
    while (response == 0) {
        response = (Math.random() * (max - min)) + min;
    }
    return response;
}

class ParticlesContainer {
    // Constructor
    constructor(container) {
        this.container = $(container);
        // Set canvas dimensions
        this.canvasId = "particles-main-ar-"+this.container.attr("id");
        
        // Set canvas
        this.container.css({"padding": "0px"});
        var canvas = `<canvas id="${this.canvasId}"></canvas>`;
        this.container.html(canvas);

        // Particles configuration
        this.config = {
            particles: {
                radius: 3,
                color: "rgba(255, 255, 255, 0.9)",
                density: "default"
            },
            background: {
                color: "#343a40"
            },
            line: {
                distance: "default",
                connect: true,
                color: "rgba(166, 166, 166, 0.8)",
                width: 1,
            },
            motion: {
                velocity: {
                    max: 2,
                    min: -2,
                },
                integar: false
            },
            fps: 60
        }

        // Particles
        this.particles = [];

    }

    __init__() {
        this.height = this.container.innerHeight();
        this.width = this.container.innerWidth();
        // Set the heigh of the canvas
        this.canvas = $(`#${this.canvasId}`)[0];
        this.canvas.height = this.height;
        this.canvas.width = this.width;
        this.ctx = this.canvas.getContext("2d");

        // Edit config if it wasnt change
        if (this.config.particles.density == "default") {
            this.config.particles.density = Math.min(Math.floor(Math.max(this.height, this.width) / 10), 100);
        }

        if (this.config.line.distance == "default") {
            this.config.line.distance = (Math.min(this.height, this.width) / 5);
        }
    }
    
    // Initialize
    initialize() {
        this.__init__();

        // Push and create particles
        for (var x = 0; x < this.config.particles.density; x++) {
            this.particles.push(new Particles(this.container, this.config));
        }

        this.interval = setInterval(this.draw.bind(this), 1000/this.config.fps);

    }

    // Draw
    draw() {
        try {
            // Clear the background
            this.clearBackground();
            // Iterate through each particle
            for (var x = 0; x < this.particles.length; x++) {
                // Move the particle and draw the particle
                this.particles[x].move();
                this.particles[x].draw(this.ctx);
                // Draw a line with particles
                this.particles[x].drawLine(this.ctx, this.particles.slice(x));
                
            }
        } catch(err) {};
    }

    // Stop
    stop() {
        if (typeof this.interval != 'undefined') {
            clearInterval(this.interval);
            this.clearBackground();
        }
    }

    // Clear Background
    clearBackground() {
        this.ctx.fillStyle = this.config.background.color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
}


// Particles
class Particles {
    // Constructor
    constructor(container, config) {
        this.container = {
            container: container,
            width: container.innerWidth(),
            height: container.innerHeight(),
        }
        this.x = getRndInteger(0, this.container.width);
        this.y = getRndInteger(0, this.container.height);
        this.config = config;
        // Set the velocity of the particle
        // If the velocity settings is in integar
        if (this.config.motion.integar) {
            this.velocity = {
                x: getRndInteger(this.config.motion.velocity.min, this.config.motion.velocity.max),
                y: getRndInteger(this.config.motion.velocity.min, this.config.motion.velocity.max)
            }
        } else {
            this.velocity = {
                x: getRndNum(this.config.motion.velocity.min, this.config.motion.velocity.max),
                y: getRndNum(this.config.motion.velocity.min, this.config.motion.velocity.max)
            }
        }
        
        
    }

    // Draw the particle
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.config.particles.radius ,0,2*Math.PI);
        ctx.fillStyle = this.config.particles.color;
        ctx.fill();
        ctx.closePath();
    }

    // Move the particle
    move() {
        // If the particle is on the edge of x-axis
        if (this.x < 0 || this.x > this.container.width) {
            this.velocity.x *= -1;
        }
        // If the particle is on the edge of y-axis
        if (this.y < 0 || this.y > this.container.height) {
            this.velocity.y *= -1;
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    // Draw line with other particles
    drawLine(ctx, listOfParticles) {
        // If connect line is set to true
        if (this.config.line.connect == true) {
            // Iterate through each particles
            var otherX, otherY;
            for (var i = 0; i < listOfParticles.length; i++) {
                // Check if the other particle is within the set distance
                otherX = listOfParticles[i].x, otherY = listOfParticles[i].y;

                if (this.dist(this.x, this.y, otherX, otherY) <= this.config.line.distance) {
                    // Draw line
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(otherX, otherY);
                    ctx.strokeStyle = this.config.line.color;
                    ctx.lineWidth = this.config.line.width;
                    ctx.stroke();
                    ctx.closePath();

                }

            }  

        }  

    }

    // distance
    dist(x1, y1, x2, y2) {
        var a = Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2);
        return Math.pow(a, 0.5);
    }

}