var canvas, ctx;
var bodies = [];

function clamp(num, min, max) {
	return Math.min(Math.max(num, min), max);
}

class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Color {
	constructor(r, g, b) {
		this.r = clamp(r, 0, 255);
		this.g = clamp(g, 0, 255);
		this.b = clamp(b, 0, 255);
	}

	toHex() {
		return "#" + this.r.toString(16).padStart(2, "0") + this.g.toString(16).padStart(2, "0") + this.b.toString(16).padStart(2, "0");
	}
}

class Body {
	constructor(position, mass, color) {
		this.position = position;
		this.mass = mass;
		this.color = color;
	}

	draw(ctx) {
		var x = this.position.x;
		var y = this.position.y;
		var radius = 10;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2);
		ctx.fillStyle = this.color.toHex();
		ctx.fill();
	}

	simulate() {
		// TO DO
		for(var i = 0; i < bodies.length; i++) {
			if(bodies[i] == this) {
				// Don't include self in mass calculation
				continue;
			}
		}
	}
}

window.onload = function() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	bodies.push(
		new Body(
			new Vector(30, 30),
			1,
			new Color(255, 0, 0)
		)
	);

	bodies.push(
		new Body(
			new Vector(470, 470),
			1,
			new Color(0, 0, 255)
		)
	);

	// Start the animation
	requestAnimationFrame(animate);
}

function animate(timestamp) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for(var i = 0; i < bodies.length; i++) {
		bodies[i].simulate();
		bodies[i].draw(ctx);
	}

	// Request another loop of animation
	requestAnimationFrame(animate);
}
