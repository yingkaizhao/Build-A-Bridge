let ctx;

// Load outside images
let imgsLoaded = 0;

let carImg = new Image();
carImg.src = "car.png";
carImg.onload = function() { imgsLoaded++; }

let backgroundImg = new Image();
backgroundImg.src = "background.jpg";
backgroundImg.onload = function() { imgsLoaded++; }

// Global properties
let game = {
	
	level: 1, // Current level
	score: 0, // Current score
	levelEarning: 1, // Points earned per level
	highScore: 0, // Highest score achieved by player
	countdown: 3, // Specifies after how many seconds will the game restart if game over
	clickingIsAllowed: true, // Determines if a mouse event is handled by event listener
	isDelayed: undefined, // Indicates a pre-restart delay has been set
	scrollSpeed: 4, // Moving speed of the screen
	
	// Array to store game instructions
	instructions: [
		"1. Left-click and hold to let it grow",
		"2. Release the button to let it fall",
		"3. Be careful not to make it too short or too long",
		"4. Hitting the red area will earn you bonus points",
		"5. Watch out, it will get more difficult",
		"6. Have fun..."
	]
	
};

// Car related properties
let car = {
	
	x: 0, // X coordinate of the car
	y: 400, // Y coordinate of the car
	speed: 3, // Moving speed of the car
	isArrived: false // Indicates if the car has reached desired position
	
};

// Deck related properties
let deck = {
	
	y: 0, // Y coordinate of the deck
	length: 0, // Length of the deck
	growSpeed: 5.5,  // Specifies the grow speed of the deck
	angle: 0, // Current angle of the deck
	rotateSpeed: 3, // Specifies the rotating speed of the deck
	isHorizontal: undefined, // Indicates if the deck has finished rotating
	isDrawn: false, // Indicates if the deck has been drawn
	movingToTheRt: true // Indicates if the deck is moving to the right, false if moving to the left
	
};

// Pier related properties
let pier = {
	
	speed: 2, // Moving speed of the pier
	x: 0, // X coordinate of the pier
	x2: (Math.random() * 2 + 1) * 100 + 80 // X coordinate of the second pier
	
}

// Setup canvas, event handlers and start animation
function setup() {
	
	let canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	
	// Main game control event handler
	addEventListener("mousedown", function(event) {
		
		let clickTimer = setInterval(function() {
			
			if (game.clickingIsAllowed && deck.length < 350) {
				
				// Set deck length
				deck.length += deck.growSpeed;
				
			}
			
		}, 10);
		
		addEventListener("mouseup", function(event) {
			
			deck.isHorizontal = false;
			
			game.clickingIsAllowed = false;
			
			// Stop the timer upon releasing the button
			clearInterval(clickTimer);
			
		});
		
	});
	
	// Start game if everything has been loaded
	if (imgsLoaded == 2) {
		
		animate();
		
	}
	
}

// Game loop
function animate() {
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
	
	// Update entities
	updatePier(pier.x);
	updatePier(pier.x2);
	updateDeck();
	updateCar();
	
	// Draw the score
	ctx.font = "26px Arial";
	ctx.fillStyle = "White";
	if (game.score != 0) {
		
		ctx.fillText("Score: " + game.score, 225, 125);
		
	}
	
	// Draw the high score
	ctx.font = "bold 16px Arial";
	ctx.fillStyle = "Yellow";
	ctx.fillText("High Score: " + game.highScore, 420, 35);
	
	// Draw the current level
	ctx.font = "bold 16px Arial";
	ctx.fillStyle = "Yellow";
	ctx.fillText("Level: " + game.level, 25, 35);
	
	// Display the game instructions
	if (deck.length == 0 && game.score == 0) {
		
		ctx.font = "20px Arial";
		ctx.fillStyle = "Black";
		ctx.fillText("Instructions:", 220, 160);
		
		for (let i = 0; i < game.instructions.length; i++) {
			
			ctx.fillText(game.instructions[i], 45, 210 + 30 * i);
			
		}
		
	}
	
	// Enter next level
	if (car.isArrived) {
		
		if (car.x > 0) {
			
			// Scrolling effect
			car.x -= game.scrollSpeed;
			pier.x -= game.scrollSpeed;
			pier.x2 -= game.scrollSpeed;
			
		} else {
			
			// Set next pier and reset first pier
			car.isArrived = false;
			pier.x = 0;
			pier.x2 = (Math.random() * 2 + 1) * 100 + 80;
			
			setTimeout(function () {
				
				game.clickingIsAllowed = true;
				
			}, 250);
			
		}
		
	}
	
	// Recursive call
	setTimeout(animate, 10);
	
}

// Update bridge deck position
function updateDeck() {
	
	// Rotation control
	if (deck.length != 0) {
		
		if (deck.isHorizontal == false) {
			
			if (deck.angle < 90) {
				
				deck.angle += deck.rotateSpeed;
				
			} else {
				
				deck.isHorizontal = true;
				deck.isDrawn = true;
				
			}
			
		}
		
	}
	
	// Draw a bridge deck
	ctx.save();
	
	ctx.fillStyle = "White";
	ctx.translate(100, 445);
	ctx.rotate(deck.angle * Math.PI / 180);
	ctx.fillRect(deck.y, 0, 5, -deck.length);
	
	ctx.restore();
	
}

// Update bridge pier position
function updatePier(x) {
	
	// Increase moving speed with leveling up
	if (game.level > 3) {
		
		pier.speed = 4;
		
	} else if (game.level > 5) {
		
		pier.speed = 8;
		
	} else if (game.level > 9) {
		
		pier.speed = 16;
		
	}
	
	// Set moving target
	if (!(game.level % 2) && game.clickingIsAllowed) {
		
		if (pier.x2 < canvas.width - 100 && deck.movingToTheRt) {
			
			pier.x2 += pier.speed;
			
		} else {
			
			deck.movingToTheRt = false;
			
		}
		
		if (!deck.movingToTheRt && pier.x2 > 100) {
			
			pier.x2 -= pier.speed;
			
		} else {
			
			deck.movingToTheRt = true;
			
		}
		
	}
	
	// Draw a bridge pier
	ctx.save();
	
	ctx.fillStyle = "Salmon";
	ctx.translate(x, 450);
	ctx.fillRect(0, 0, 100, 249);
	
	ctx.fillStyle = "Cyan";
	ctx.fillRect(0, -5, 100, 5);
	
	// Draw the center area
	if (x > 0) {
		
		ctx.fillStyle = "Red";
		ctx.fillRect(40, -5, 20, 5);
		
	}
	
	ctx.restore();
	
}

// Update car position and draw. Also check for game over.
function updateCar() {
	
	if (deck.isDrawn) {
		
		// Length is within limit
		if (deck.length >= pier.x2 - 100 && deck.length <= pier.x2) {
			
			// Perfect length
			if (deck.length >= pier.x2 - 60 && deck.length <= pier.x2 - 40) {
				
				ctx.font = "30px Arial";
				ctx.fillStyle = "Green";
				ctx.fillText("Perfect!", 222, 235);
				ctx.fillText("+2", 254, 275);
				
				// Double the score earned this level
				game.levelEarning = 2;
				
			}
			
			// The car has not yet reached the end of the bridge
			if (car.x < pier.x2) {
				
				// Move the car
				car.x += car.speed;
				
			// The car has reached the end
			} else {
				
				// Stop the car and prepare for next level
				car.isArrived = true;
				game.level++;
				game.score += game.levelEarning;
				deck.isDrawn = false;
				deck.angle = 0;
				deck.length = 0;
				
				if (game.highScore < game.score) {
					
					game.highScore += game.levelEarning;
					
				}
				
				// Reset level earning to 1
				game.levelEarning = 1;
				
			}
			
		} else {
			
			gameOver();
			
		}
		
	}
	
	// Draw a car
	ctx.save();
	
	ctx.translate(car.x, car.y);
	ctx.drawImage(carImg, 0, 0, 100, 50);
	
	ctx.restore();
	
}

// End the game and restart
function gameOver() {
	
	// The car has not yet reached the end of the bridge
	if (car.x < deck.length + 100) {
		
		// Move the car
		car.x += car.speed;
		
		game.isDelayed = false;
		
	// The car has reached the end of the bridge
	} else {
		
		// Falls off the bridge
		car.y += 15;
		deck.y += 15;
		
		// Display game over messages according to the length
		if (deck.length < pier.x2 - 100) {
			
			ctx.font = "34px Arial";
			ctx.fillStyle = "Red";
			ctx.fillText("Sorry, your bridge was too short!", 40, 200);
			
		} else {
			
			ctx.font = "34px Arial";
			ctx.fillStyle = "Red";
			ctx.fillText("Sorry, your bridge was too long!", 50, 200);
			
		}
		
		// Display restart messages and countdown time
		ctx.font = "18px Arial";
		ctx.fillStyle = "black";
		ctx.fillText("Restarting in " + game.countdown + " seconds...", 180, 250);
		
		// Countdown and reset
		if (!game.isDelayed) {
			
			countdown();
			game.isDelayed = true;
			
		}
		
	}
	
}

// Call reset function after game.countdown seconds
function countdown() {
	
	if (game.countdown == 0) {
			
			resetGame();
		
	} else {
		
		setTimeout(function () {
			
			countdown(--game.countdown);
		
		}, 1000);
		
	}
	
}

// Reset all variables and entities
function resetGame() {
	
	game.score = 0;
	game.countdown = 3;
	game.level = 1;
	car.x = 0;
	car.y = 400;
	deck.length = 0;
	deck.angle = 0;
	pier.x = 0;
	deck.isHorizontal = undefined;
	deck.isDrawn = false;
	car.isArrived = false;
	game.clickingIsAllowed = true;
	pier.x2 = (Math.random() * 2 + 1) * 100 + 80;
	pier.speed = 2;
	deck.y = 0;
	
}
