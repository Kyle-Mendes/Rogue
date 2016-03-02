import {WALL, PLAYER} from './constants/Const';

export default class Dungeon {
	constructor(player, rooms) {
		this.rooms = rooms;
		this.template = [];
		this.player = player;

		this.viewportWidth = 120;
		this.viewportHeight = 30;
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

	addConnection(room1, room2, offsetX, offsetY) {
		// @TODO
		// IF room1 and room2 share a 3 Y coords, simple horizontal connection. {done}
		// IF room1 and room2 share a 3 X coords, simple vertical connection.   {done}
		// OTHERWISE complexConnection

		let xOverlap = room1.getOverlapX(room2);
		let yOverlap = room1.getOverlapY(room2);

		// If room1 and room2 share 3 Y coords, make a horizontal connection
		if (yOverlap.length > 2) {
			this.buildHorizontalConnection(yOverlap, room1, room2, offsetY);

		// If room1 and room2 share 3 X coords, make a vertical connection
		} else if (xOverlap.length > 2) {
			console.log(xOverlap)
			this.buildVerticalConnection(xOverlap, room1, room2, offsetX);

		// Otherwise, use a complex connection
		} else {
			this.buildComplexConnection(room1, room2, offsetX, offsetY);
		}
	}

	buildHorizontalConnection(overlap, room1, room2, offsetY) {
		let tallerRoom,
			shorterRoom,
			rightMostRoom,
			leftMostRoom,
			offset = offsetY || 0;

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

		let startY = parseInt(overlap[Math.floor(overlap.length / 2)]) + offset;
		let endY = startY + 2;

		let startX = leftMostRoom.xPos + leftMostRoom.width;
		let endX = rightMostRoom.xPos;

		// Casting to int from strings that the overlap returns
		startX = parseInt(startX);
		endX   = parseInt(endX);
		startY = parseInt(startY);
		endY   = parseInt(endY);

		let overlapping = false,
			loop = 0;

		// Sometimes we get startY that results in an impassible cooridor
		// This loop will fix that issue by finding the correct placement
		// @TODO this needs an exit if no connection is found
		while (! overlapping) {
			if (loop > overlap.length) {
				throw "No connection could be made.  Check your offset, or if you believe this to be a bug, report @ github."
			}

			if (overlap.length === 3) {
				startY = +overlap[0];
				endY = +overlap[2];
				overlapping = true;

			} else if (! overlap.includes(`${startY}`)) {
				startY = startY + 1;
				endY = endY + 1;

				loop++;

			} else if (! overlap.includes(`${endY}`)) {
				startY = startY - 1;
				endY = endY - 1;

				loop++;

			} else {
				overlapping = true;
			}
		}

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

	buildVerticalConnection(overlap, room1, room2, offsetX) {
		let widerRoom,
			thinnerRoom,
			northMostRoom,
			southMostRoom,
			offset = offsetX || 0;

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

		let startX = parseInt(overlap[Math.floor(overlap.length / 2)]) + offset;
		let endX = startX + 2;

		// Casting to int from strings that the overlap returns
		startX = parseInt(startX);
		endX   = parseInt(endX);
		startY = parseInt(startY);
		endY   = parseInt(endY);

		let overlapping = false,
			loop = 0;

		// Sometimes we get startX that results in an impassible cooridor
		// This loop will fix that issue by finding the correct placement
		while (! overlapping) {
			if (loop > overlap.length) {
				throw "No connection could be made.  Check your offset, or report this @ github."
			}

			if (overlap.length === 3) {
				startX = +overlap[0];
				endX = +overlap[2];
				overlapping = true;

			} else if (! overlap.includes(`${startX}`)) {
				startX = startX + 1;
				endX = endX + 1;

				loop++;

			} else if (! overlap.includes(`${endX}`)) {
				startX = startX - 1;
				endX = endX - 1;

				loop++;

			} else {
				overlapping = true;
			}
		}

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

	buildComplexConnection(room1, room2, offsetX, offsetY) {
		let northMostRoom,
			southMostRoom,
			startX,
			xDirection;

		offsetX = offsetX || 0,
		offsetY = offsetY || 0;

		if (room1.yPos < room2.yPos) {
			northMostRoom = room1;
			southMostRoom = room2;
		} else {
			northMostRoom = room2;
			southMostRoom = room1;
		}

		if ( (northMostRoom.xPos + northMostRoom.width) - southMostRoom.xPos <= -2 ) {
			// the south room is to the right
			startX = southMostRoom.xPos;
			xDirection = 'left';

		} else {
			// the south room is to the left
			startX = southMostRoom.xPos + southMostRoom.width;
			xDirection = 'right';
		}

		let intersection = this.findIntersect(northMostRoom, southMostRoom, startX, xDirection),
			connection   = false,
			foundation   = {},
			startY       = northMostRoom.height + northMostRoom.yPos;

		// make sure there's an object for the vertical corridor
		foundation[intersection.x] = {};
		foundation[intersection.x + 1] = {};
		foundation[intersection.x - 1] = {};

		// Create the vertical corridor
		for (let y = startY; y <= intersection.y; y++) {
			foundation[intersection.x - 1][y] = WALL;
			foundation[intersection.x + 1][y] = WALL;
		}

		// Create the horizontal corridor
		if (xDirection === 'right') {
			for (let x = startX; x < intersection.x; x++) {
				if (! foundation[x]) { foundation[x] = {} }

				foundation[x][intersection.y - 1] = WALL;
				foundation[x][intersection.y + 1] = WALL;
			}

			// Finishing up the corridor
			foundation[intersection.x][intersection.y + 1] = WALL;
			foundation[intersection.x + 1][intersection.y + 1] = WALL;
			delete foundation[intersection.x - 1][intersection.y];

		} else {
			for (let x = startX; x > intersection.x; x--) {
				if (! foundation[x]) { foundation[x] = {} }

				foundation[x][intersection.y - 1] = WALL;
				foundation[x][intersection.y + 1] = WALL;
			}

			// Finishing up the corridor
			foundation[intersection.x][intersection.y + 1] = WALL;
			foundation[intersection.x - 1][intersection.y + 1] = WALL;
			delete foundation[intersection.x + 1][intersection.y];
		}

		// Creating a hole in the rooms to walk through.
		southMostRoom.foundation[startX][intersection.y] = ' ';
		northMostRoom.foundation[intersection.x][startY] = ' ';

		let room = {
			foundation: foundation
		}

		this.rooms.push(room);
	}

	/**
	 * Finds the single point that two corridors will meet for a complex connection
	 *
	 * @return {obj} the point that the two corridors meet
	 */
	findIntersect(northMostRoom, southMostRoom) {
		let x = Math.floor(northMostRoom.width / 2) + northMostRoom.xPos;
		let y = Math.floor(southMostRoom.height / 2) + southMostRoom.yPos;

		return { x: x, y: y };
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

			for (let x in room.foundation) {
				if (! foundation[x]) { foundation[x] = {} }

				for(let y in room.foundation[x]) {
					foundation[x][y] = room.foundation[x][y]
				}
			}
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

		this.template = '';
		let player = this.player,
			originX,
			originY,
			limitX,
			limitY;

		if (this.width > this.viewportWidth || this.height > this.viewportHeight) {
			originX = this.player.x - Math.ceil(this.viewportWidth / 2);
			originY = this.player.y - Math.ceil(this.viewportHeight / 2);

			limitX = originX + this.viewportWidth;
			limitY = originY + this.viewportHeight;

		} else {
			originX = 0;
			originY = 0;

			limitX = this.width;
			limitY = this.height;
		}

		for (let y = originY; y <= limitY; y++) {
			for (let x = originX; x <= limitX; x++) {

				let cell      = ' ',
					lineBreak = this.width > this.viewportWidth ? this.viewportWidth : this.width;

				this.rooms.forEach(function(room) {
					if (x === player.x && y === player.y) {
						cell = PLAYER;
					} else if (room.foundation[x] && room.foundation[x][y]) {
						cell = room.foundation[x][y];
					}
				});

				cell += x === limitX ? '\n' : '';
				this.template = this.template.concat(cell);
			}
		}
	}

}
