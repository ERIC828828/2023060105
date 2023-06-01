var offsetx;
var offsety;
var rifle;
var riflex;
var rifley;
var riflew;
var rifleh;
var rifled;
var rifler;
var riflein;
var bullets;
var enemys;
var press;
var score;
var timer;

function setup() {
  pixelDensity(displayDensity());
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB, 256);
  background(255);
  riflex = width / 2.0;
  rifley = height / 2.0;
  riflew = 11.0;
  rifleh = 40.0;
  riflein = false;
  rifle = new RifleBase();
  bullets = [];
  enemys = [];
  press = false;
  score = 0;
  timer = 120; // 2 minutes in seconds
  setInterval(updateTimer, 1000); // Update timer every second
}

function draw() {
  background(255);
  rifle.update();
  rifle.render();
  if (press == false) {
    rifle.mousein(color(120));
  }
  bullets.push(new BulletBase(random(min(width, height) / 8.0, min(width, height) / 4.0), rifler - PI / 2.0, false));
  for (var i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].render();
    bullets[i].border();
    var life_limit = 0.0;
    if (bullets[i].flag == true) {
      life_limit = 1.0;
      bullets[i].check01();
    } else {
      life_limit = 0.1;
      bullets[i].check02();
    }
    if (bullets[i].velocity.mag() < life_limit) {
      bullets.splice(i, 1);
    }
  }
  if (frameCount % 2 == 0) {
    enemys.push(new EnemyBase());
  }
  for (var i = enemys.length - 1; i >= 0; i--) {
    enemys[i].update();
    enemys[i].render();
    if (enemys[i].is_dead == true || enemys[i].is_crash == true) {
      if (enemys[i].is_dead == true) {
        score += 1;
        if (score >= 1000) {
          // Display "You Win" text
          textSize(48);
          fill(0, 255, 0);
          textAlign(CENTER, CENTER);
          text("You Win", width / 2, height / 2);
        }
      }
      enemys.splice(i, 1);
    }
  }

  // Display score
  textSize(24);
  fill(0);
  text("Score: " + score, 20, 40);

  // Display timer
  textSize(24);
  fill(0);
  text("Time: " + timer + "s", width - 140, 40);

  if (timer <= 0) {
    // Display "Game Over" text
    textSize(48);
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2);
  }
}

function updateTimer() {
  timer--;
}

function RifleBase() {
	this.update = function() {
		rifler = atan2(mouseY - rifley, mouseX - riflex) - PI / 2.0;
	}
	this.render = function() {
		rectMode(CENTER);
		push();
		fill(230);
		stroke(0);
		strokeWeight(4);
		translate(riflex, rifley);
		rect(0.0, -2.0, 60.0, 60.0);
		pop();
		push();
		stroke(0);
		strokeWeight(2);
		translate(riflex, rifley);
		rotate(rifler);
		rect(0.0, 0.0, riflew, rifleh);
		rect(0.0, -20.0, 5.0, 10.0);
		pop();
		if (press == true && riflein == true) {
			push();
			translate(riflex, rifley);
			line(0.0, 0.0, mouseX - riflex, mouseY - rifley);
			translate(mouseX - riflex, mouseY - rifley);
			rotate(rifler);
			line(-10.0, 0.0, 10.0, 0.0);
			pop();
			push();
			translate(riflex, rifley);
			rotate(rifler);
			stroke(0);
			strokeWeight(0.1);
			line(0.0, -25.0, 0.0, -2000.0);
			pop();
		}
	}
	this.mousein = function(col) {
		if (mouseX > riflex - 30.0 && mouseX < riflex + 30.0) {
			if (mouseY > rifley - 32.0 && mouseY < rifley + 28.0) {
				fill(col);
				riflein = true;
			} else {
				fill(200);
				riflein = false;
			}
		} else {
			fill(200);
			riflein = false;
		}
	}
}

function BulletBase(b_force, b_rad, b_flag) {
	var bodyr = b_force / 12.0;
	this.location = new p5.Vector(riflex, rifley);
	this.velocity = new p5.Vector(0.0, 0.0);
	this.acceleration = new p5.Vector(0.0, 0.0);
	this.init_force = new p5.Vector(cos(b_rad), sin(b_rad));
	this.init_force.mult(b_force);
	this.flag = b_flag;
	this.update = function() {
		this.init_force.mult(0.2);
		this.acceleration.add(this.init_force);
		this.velocity.add(this.acceleration);
		if (this.flag == true) {
			this.velocity.mult(0.98);
		} else {
			this.velocity.mult(0.92);
		}
		this.location.add(this.velocity);
		this.acceleration.mult(0.0);
	}
	this.render = function() {
		push();
		translate(this.location.x, this.location.y);
		rotate(b_rad + PI / 2.0);
		noStroke()
		rectMode(CENTER);
		if (this.flag == true) {
			fill(150, 0, 0);
			rect(0.0, -25.0, bodyr, bodyr);
			fill(225, 0, 0);
			rect(0.0, -25.0, bodyr / 1.16, bodyr / 1.16);
		} else {                             //this is the bullets
			fill(100);
			rect(0.0, -25.0, 10.0, 10.0);
			fill(100);
			rect(0.0, -25.0, 5.0, 5.0);
		}
		pop();
	}
	this.border = function() {
		if (this.location.x < 0.0) {
			this.location.x = 0.0;
			this.velocity.x *= -1.0;
		}
		if (this.location.y < 0.0) {
			this.location.y = 0.0;
			this.velocity.y *= -1.0;
		}
		if (this.location.x > width) {
			this.location.x = width;
			this.velocity.x *= -1.0;
		}
		if (this.location.y > height) {
			this.location.y = height;
			this.velocity.y *= -1.0;
		}
	}
	this.check01 = function() {
		for (var i = 0; i < enemys.length; i++) {
			var distance = dist(enemys[i].location.x, enemys[i].location.y, this.location.x, this.location.y);
			if (distance < bodyr) {
				enemys[i].is_hit = true;
				score += 1;
			}
		}
	}
	this.check02 = function() {
		for (var i = 0; i < enemys.length; i++) {
			if (this.location.x > enemys[i].location.x - enemys[i].bodyw / 2.0 && this.location.x < enemys[i].location.x + enemys[i].bodyw / 2.0) {
				if (this.location.y > enemys[i].location.y - enemys[i].bodyh / 2.0 && this.location.y < enemys[i].location.y + enemys[i].bodyh / 2.0) {
					enemys[i].is_hit = true;
				}
			}
		}
	}
}

function EnemyBase() {
	var debris = [];
	var loc_pattern = int(random(0, 4));
	this.is_dead = false;
	this.is_hit = false;
	this.is_debris = false;
	this.is_crash = false;
	this.count = 0;
	this.lifetime = width / 2.0;
	this.bodyw = 10.0;
	this.bodyh = 10.0;
	if (loc_pattern == 0) {
		this.location = new p5.Vector(-this.bodyw / 2.0, random(0.0, height));
		this.velocity = new p5.Vector(random(0.1, 1.0), random(-1.0, 1.0));
	}
	if (loc_pattern == 1) {
		this.location = new p5.Vector(width + this.bodyw / 2.0, random(0.0, height));
		this.velocity = new p5.Vector(random(-0.1, -1.0), random(-1.0, 1.0));
	}
	if (loc_pattern == 2) {
		this.location = new p5.Vector(random(0.0, width), -this.bodyh / 2.0);
		this.velocity = new p5.Vector(random(-1.0, 1.0), random(0.1, 1.0));
	}
	if (loc_pattern == 3) {
		this.location = new p5.Vector(random(0.0, width), height + this.bodyh / 2.0);
		this.velocity = new p5.Vector(random(-1.0, 1.0), random(-0.1, -1.0));
	}
	this.update = function() {
		this.location.add(this.velocity);
		if (this.count > this.lifetime) {
			this.is_dead = true;
		}
		this.count += 1;
		if (this.is_hit == true && this.is_debris == false) {
			this.is_debris = true;
			this.count = 0;
			for (var i = 0; i < 20; i++) {
				debris.push(new DebrisBase(this.location.x, this.location.y))
			}
		}
	}
	this.render = function() {
		push();
		noStroke();
		rectMode(CENTER);
		if (this.is_hit == true && this.is_debris == true) {
			if (this.count < 20) {
				translate(this.location.x, this.location.y);
				fill(100, 0, 0);                                       // this is the enemy color after hit
				rect(0.0, 0.0, this.bodyw + 10.0, this.bodyh + 10.0);
				fill(255, 0, 0);
				rect(0.0, 0.0, this.bodyw + 4.0, this.bodyh + 4.0);
			} else {
				for (var i = 0; i < debris.length; i++) {
					debris[i].update();
					debris[i].render();
					if (debris[i].velocity.mag() < 0.1) {
						this.is_crash = true;
					}
				}
			}
			this.count += 1;
		} else {
			translate(this.location.x, this.location.y);
			fill(1, 100, 0);                                     // this is enemy color before hit
			rect(0.0, 0.0, this.bodyw + 6.0, this.bodyh + 6.0);
			fill(10, 150, 0);
			rect(0.0, 0.0, this.bodyw, this.bodyh);
		}
		pop();
	}
}

function DebrisBase(dx, dy) {
	this.location = new p5.Vector(dx, dy);
	this.velocity = new p5.Vector(0.0, 0.0);
	this.acceleration = new p5.Vector(0.0, 0.0);
	this.direction = random(-PI, PI);
	this.init_force = new p5.Vector(cos(this.direction), sin(this.direction));
	this.init_force.mult(random(10.0, 40.0));
	this.update = function() {
		this.init_force.mult(0.2);
		this.acceleration.add(this.init_force);
		this.velocity.add(this.acceleration);
		this.velocity.mult(0.92);
		this.location.add(this.velocity);
		this.acceleration.mult(0.0);
	}
	this.render = function() {
		push();
		translate(this.location.x, this.location.y);
		noStroke()
		rectMode(CENTER);
		fill(255, 0, 0);
		rect(0.0, 0.0, 6.0, 6.0);
		fill(255, 0, 0);
		rect(0.0, 0.0, 4.0, 4.0);
		pop();
	}
}

function mousePressed() {
	press = true;
	rifle.mousein(color(255, 0, 0));
}

function mouseReleased() {
	if (press == true && riflein == true) {
		var force = dist(mouseX, mouseY, riflex, rifley);
		var f_rad = rifler - PI / 2.0;
		bullets.push(new BulletBase(force * 2.0, f_rad, true));
	}
	press = false;
	rifle.mousein(color(225));
}