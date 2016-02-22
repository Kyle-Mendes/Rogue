import {WALL, PLAYER} from './constants/Const';

export default class Dungeon {
	constructor(player, rooms) {
		this.rooms = rooms;
		this.template = [];
		this.player = player;
	}

	/**
	 * Sets the dungeon's width property by caclulating the width of the rooms dispalyed.
	 */
	calculateDungeonWidth() {
		let longestRoom = this.rooms[0];

		this.rooms.forEach(function(room) {
			if (room.xPos + room.width > longestRoom.xPos + longestRoom.width) {
				longestRoom = room;
			}
		});

		this.width = longestRoom.width + longestRoom.xPos;
	}

	/**
	 * Sets the dungeon's height property by caclulating the height of the rooms dispalyed.
	 */
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

	/**
	 * Sets the dungeons walls and floors as a foundation object
	 * Where foundation[x][y] will be the value of that cell (if there is one)
	 *
	 * Only called once the first draw command is sent in order to instantiate
	 * the foundation with all connections and mutations made.
	 *
	 */
	buildDungeonFoundation() {
		let foundation = {};
		this.rooms.forEach((room) => {
			Object.assign(foundation, room.foundation);
		});

		this.foundation = foundation;
	}

	draw() {
		if (! this.height || ! this.width) {
			this.calculateDungeonWidth();
			this.calculateDungeonHeight();
		}

		if (! this.foundation) {
			this.buildDungeonFoundation()
		}

		this.template = [];
		let playerX,
			playerY;

		// Draw the player's position
		if (this.player) {
			playerX = this.player.x;
			playerY = this.player.y;
		}

		for (let y = 0; y <= this.height; y++) {
			for (let x = 0; x <= this.width; x++) {

				let cell = ' ';

				this.rooms.forEach(function(room) {
					if (x === playerX && y === playerY) {
						cell = PLAYER;
					} else if (room.foundation[x] && room.foundation[x][y] === WALL) {
						cell = WALL;
					}
				});

				cell += x === this.width ? '\n' : '';
				this.template.push(cell);
			}
		}


		return this.template.join('');
	}

}
