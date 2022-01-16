var canvas, ctx;
var bodies = [];
var timeStep = 1e3;

const G = 6.67408e-11;

function clamp(num, min, max) {
	return Math.min(Math.max(num, min), max);
}

class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	multiply(multiplier) {
		return new Vector(this.x * multiplier, this.y * multiplier);
	}

	divide(divisor) {
		return new Vector(this.x / divisor, this.y / divisor);
	}

	add(vector) {
		return new Vector(this.x + vector.x, this.y + vector.y);
	}

	subtract(vector) {
		return new Vector(this.x - vector.x, this.y - vector.y);
	}

	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
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
	constructor(pinned, position, mass, velocity, color) {
		this.pinned = pinned;
		this.position = position;
		this.mass = mass;
		this.velocity = velocity;
		this.color = color;
	}

	draw(ctx, scale) {
		var x = canvas.width * 0.5 + this.position.x * scale;
		var y = canvas.height * 0.5 + this.position.y * scale;
		var density = 1;
		var volume = this.mass / density;
		var radius = Math.cbrt(0.75 * volume / Math.PI) * scale;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2);
		ctx.fillStyle = this.color.toHex();
		ctx.fill();
	}

	simulate(timeStep) {
		// Pinned bodies don't move
		if(this.pinned) {
			return;
		}

		var force = new Vector(0, 0);
		for(var i = 0; i < bodies.length; i++) {
			if(bodies[i] == this) {
				// Don't include self in gravity calculation
				continue;
			}
			var diff = bodies[i].position.subtract(this.position);
			var multiplier = G * this.mass * bodies[i].mass / Math.pow(diff.length(), 3);
			force = force.add(diff.multiply(multiplier));
		}
		var accel = force.divide(this.mass);
		this.velocity = this.velocity.add(accel.multiply(timeStep));
		this.position = this.position.add(this.velocity.multiply(timeStep));
	}
}

window.onload = function() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	resize();

	bodies.push(
		new Body(
			true,
			new Vector(0, 0),
			5.9722e24,
			new Vector(0, 0),
			new Color(0, 0, 255)
		)
	);

	bodies.push(
		new Body(
			false,
			new Vector(3.844e8, 0),
			7.34767309e22,
			new Vector(0, 1e3),
			new Color(128, 128, 128)
		)
	);

	// Start the animation
	requestAnimationFrame(animate);
}

window.onresize = function() {
	resize();
}

function resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function animate(time) {
	var scale = 5e-7;
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for(var i = 0; i < bodies.length; i++) {
		bodies[i].simulate(timeStep);
		bodies[i].draw(ctx, scale);
	}

	// Request another loop of animation
	requestAnimationFrame(animate);
}
