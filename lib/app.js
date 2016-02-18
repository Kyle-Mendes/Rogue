var charm = require('charm')();
var keypress = require('keypress');

if (!Array.prototype.includes) {
	Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
		'use strict';
		var O = Object(this);
		var len = parseInt(O.length) || 0;
		if (len === 0) {
			return false;
		}
		var n = parseInt(arguments[1]) || 0;
		var k;
		if (n >= 0) {
			k = n;
		} else {
			k = len + n;
			if (k < 0) {k = 0;}
		}
		var currentElement;
		while (k < len) {
			currentElement = O[k];
			if (searchElement === currentElement ||
				(searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
					return true;
				}
				k++;
		}
		return false;
	};
}

const COLOR = {
	black   : "\u001b[30m",
	red     : "\u001b[31m",
	green   : "\u001b[32m",
	yellow  : "\u001b[33m",
	blue    : "\u001b[34m",
	magenta : "\u001b[35m",
	cyan    : "\u001b[36m",
	white   : "\u001b[37m",
}

const WALL   = COLOR.blue + "X";
const PLAYER = COLOR.red + "@";

class Room {
	constructor(width, height, xPos, yPos) {
		this.width = width;
		this.height = height;
		this.xPos = xPos;
		this.yPos = yPos;
		this.foundation = [];

		this.buildRoom();
	}

	buildRoom() {
		for (let y = 0; y <= this.height; y++) {
			for (let x = 0; x <= this.width; x++) {

				if (! this.foundation[x + this.xPos]) {
					this.foundation[x + this.xPos] = {};
				}

				let cell = '';

				if (x === 0 || x === this.width) {
					cell = WALL;
				} else  if (y === 0 || y === this.height) {
					cell = WALL;
				} else {
					cell = null;
				}

				if (cell) { this.foundation[x + this.xPos][y + this.yPos] = cell }
			}
		}
	}

	getOverlapX(room) {
		let room1X = Object.keys(this.foundation);
		let room2X = Object.keys(room.foundation);

		return room1X.filter(function(x) {
			return room2X.includes(x);
		});
	}

	getOverlapY(room2) {
		let room1  = this,
			room1X = Object.keys(room1.foundation),
			room2X = Object.keys(room2.foundation),
			room1Y = [],
			room2Y = [];

		room1X.forEach(function(x) {
			room1Y = room1Y.concat(Object.keys(room1.foundation[x]));
		});

		room2X.forEach(function(x) {
			room2Y = room2Y.concat(Object.keys(room2.foundation[x]));
		});

		// Remove duplicate values
		room1Y = new Set(room1Y);
		room2Y = new Set(room2Y);

		return [...room1Y].filter(function(y) {
			return [...room2Y].includes(y);
		});
	}
}

class Dungeon {
	constructor(player, rooms) {
		this.rooms = rooms;
		this.template = [];
		this.player = player;
	}

	calculateDungeonWidth() {
		let longestRoom = this.rooms[0];

		this.rooms.forEach(function(room) {
			if (room.xPos + room.width > longestRoom.xPos + longestRoom.width) {
				longestRoom = room;
			}
		});

		this.width = longestRoom.width + longestRoom.xPos;
	}

	calculateDungeonHeight() {
		let tallestRoom = this.rooms[0];

		this.rooms.forEach(function(room) {
			if (room.yPos + room.height > tallestRoom.yPos + tallestRoom.height) {
				tallestRoom = room;
			}
		});

		this.height = tallestRoom.height + tallestRoom.yPos;
	}

	addConnection(room1, room2) {
		// @TODO
		// IF room1 and room2 share a 3 Y coords, simple horizontal connection. {done}
		// IF room1 and room2 share a 3 X coords, simple vertical connection.   {done}
		// OTHERWISE complexConnection

		let xOverlap = room1.getOverlapX(room2);
		let yOverlap = room1.getOverlapY(room2);

		// If room1 and room2 share 3 Y coords, make a horizontal connection
		if (yOverlap.length > 2) {
			this.buildHorizontalConnection(room1, room2);

		// If room1 and room2 share 3 X coords, make a vertical connection
		} else if (xOverlap.length > 2) {
			this.buildVerticalConnection(room1, room2);

		// Otherwise, use a complex connection
		} else {

		}

		// this.buildHorizontalConnection(room1, room2);

	}

	buildHorizontalConnection(room1, room2) {
		let tallerRoom,
			shorterRoom,
			rightMostRoom,
			leftMostRoom;

		if (room1.height > room2.height) {
			tallerRoom = room1;
			shorterRoom = room2;
		} else {
			tallerRoom = room2;
			shorterRoom = room1;
		}

		if (room1.xPos > room2.xPos) {
			rightMostRoom = room1;
			leftMostRoom = room2;
		} else {
			rightMostRoom = room2;
			leftMostRoom = room1;
		}

		let startY = Math.ceil((shorterRoom.height + shorterRoom.yPos) - (shorterRoom.height / 2)) - 1;
		let endY = startY + 2;

		let startX = leftMostRoom.xPos + leftMostRoom.width;
		let endX = rightMostRoom.xPos;

		let foundation = {};
		// Create a new room to act as a corridor.
		for (let y = startY; y <= endY; y++) {
			for (let x = startX; x <= endX; x++) {
				if (! foundation[x]) {
					foundation[x] = {};
				}

				if (y === startY || y === endY) {
					foundation[x][y] = WALL;
				}
			}
		}

		// Make a whole in the room to for the door to the corridor
		leftMostRoom.foundation[startX][startY + 1] = ' ';
		rightMostRoom.foundation[endX][startY + 1] = ' ';

		let room = {
			foundation: foundation
		}

		this.rooms.push(room);
	}

	buildVerticalConnection(room1, room2) {
		let widerRoom,
			thinnerRoom,
			northMostRoom,
			southMostRoom;

		if (room1.width > room2.width) {
			widerRoom = room1;
			thinnerRoom = room2;
		} else {
			widerRoom = room2;
			thinnerRoom = room1;
		}

		if (room1.yPos < room2.yPos) {
			northMostRoom = room1;
			southMostRoom = room2;
		} else {
			northMostRoom = room2;
			southMostRoom = room1;
		}

		let startY = northMostRoom.height + northMostRoom.yPos;
		let endY = southMostRoom.yPos;

		let startX = Math.ceil((thinnerRoom.width + thinnerRoom.xPos) - (thinnerRoom.width / 2)) - 1;
		let endX = startX + 2;

		let foundation = {};
		// Create a new room to act as a corridor.
		for (let y = startY; y <= endY; y++) {
			for (let x = startX; x <= endX; x++) {
				if (! foundation[x]) {
					foundation[x] = {};
				}

				if (x === startX || x === endX) {
					foundation[x][y] = WALL;
				}
			}
		}

		// Make a whole in the room to for the door to the corridor
		northMostRoom.foundation[startX + 1][startY] = ' ';
		southMostRoom.foundation[startX + 1][endY] = ' ';

		let room = {
			foundation: foundation
		}

		this.rooms.push(room);
	}

	draw() {
		this.calculateDungeonWidth();
		this.calculateDungeonHeight();

		for (let y = 0; y <= this.height; y++) {
			for (let x = 0; x <= this.width; x++) {

				let cell = ' ';

				this.rooms.forEach(function(room) {
					if (room.foundation[x] && room.foundation[x][y] === WALL) {
						cell = WALL;
					}
				});

				cell += x === this.width ? '\n' : '';
				this.template.push(cell);
			}
		}

		if (this.player) {
			this.template[this.player.x + (this.width * this.player.y)] = PLAYER;
		}

		return this.template.join('');
	}

	moveUp() {
		let x = this.player.x;
		let y = this.player.y - 1;

		if (this.template[x + ((this.width * y) - 1)] === WALL) {
			return;
		}

		this.template[this.player.x + (this.width * this.player.y)] = ' ';

		this.player.y -= 1;
		this.player.x -= 1; // to account for newline character
		this.template[this.player.x + (this.width * this.player.y)] = PLAYER;
	}

	moveDown() {
		let x = this.player.x + 2; //@TODO: wtf why
		let y = this.player.y + 1;

		if (this.template[x + ((this.width * y) - 1)] === WALL) {
			return;
		}

		this.template[this.player.x + (this.width * this.player.y)] = ' ';

		this.player.y += 1;
		this.player.x += 1; // to account for newline character
		this.template[this.player.x + (this.width * this.player.y)] = PLAYER;
	}

	moveLeft() {
		if (this.template[this.player.x - 1 + (this.width * this.player.y)] === WALL) { return }

		this.template[this.player.x + (this.width * this.player.y)] = ' ';
		this.player.x -= 1;
		this.template[this.player.x + (this.width * this.player.y)] = PLAYER;
	}

	moveRight() {
		if (this.template[this.player.x + 1 + (this.width * this.player.y)] === WALL) { return }

		this.template[this.player.x + (this.width * this.player.y)] = ' ';
		this.player.x += 1;
		this.template[this.player.x + (this.width * this.player.y)] = PLAYER;
	}

}

class Player {
	constructor(xPos, yPos) {
		this.x = xPos;
		this.y = yPos;
	}
}

class HUD {
	constructor(player) {
		this.player = player;
	}

	draw() {
		this.template = ['\n'];
		this.template.push('<3: [ OOOOOOO ]');
	}
}

class Game {
	constructor(dungeon, HUD) {
		this.dungeon = dungeon;
		this.HUD = HUD;
		this.display = []; // @TODO standardize name

		this.dungeon.draw();
		this.HUD.draw();
	}

	draw() {
		this.display = [].concat(this.dungeon.template, this.HUD.template);
		charm.reset();
		charm.write(this.display.join(''));
	}
}

let room1 = new Room(20, 16, 5, 0);
let room2 = new Room(20, 5, 50, 0);
let room3 = new Room(5, 18, 80, 0);
let room4 = new Room(10, 8, 30, 10);
let room5 = new Room(100, 10, 0, 20);

let player = new Player(10, 3);

let dungeon = new Dungeon(player, [room1, room2, room3, room4, room5]);
let hud = new HUD(player);

dungeon.addConnection(room1, room5);
dungeon.addConnection(room1, room4);

let game = new Game(dungeon, hud);

charm.pipe(process.stdout);
keypress(process.stdin);

game.draw();

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
	// console.log('got "keypress"', key);
	if (key && key.ctrl && key.name == 'c') {
		process.stdin.pause();
	}

	if (key && key.name == 'up') {
		dungeon.moveUp();
	}

	if (key && key.name == 'down') {
		dungeon.moveDown();
	}

	if (key && key.name == 'left') {
		dungeon.moveLeft();
	}

	if (key && key.name == 'right') {
		dungeon.moveRight();
	}

	game.draw();
});

process.stdin.setRawMode(true);
process.stdin.resume();
