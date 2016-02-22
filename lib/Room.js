import {WALL} from './constants/Const';
require('./utils/Includes');

export default class Room {
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
