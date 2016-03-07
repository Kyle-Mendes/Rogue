import {SPIKE, WALL} from './constants/Const';

require('./utils/Includes');

export default class Room {
	constructor(width = 20, height = 10, xPos = 0, yPos = 0, spikes = false) {
		this.width = width;
		this.height = height;
		this.xPos = xPos;
		this.yPos = yPos;
		this.foundation = {};
		this.spikes = spikes;

		this.buildRoom();
	}

	/**
	 * Builds the room by looping through the x and y coords and saving the
	 * coordinates that should be Walls into `this.foundation`.
	 *
	 * If spikes are present, we need to loop through all possible cells
	 * in the room.  But, if they're not, we can simplify our loops to make
	 * building the foundation much quicker.
	 *
	 * @param {bool} spikes A boolean to turn spikes on or off in this room
	 *
	 * @return {null}
	 */
	buildRoom() {
		this.foundation[this.xPos] = {};
		this.foundation[this.width + this.xPos] = {};

		if (! this.spikes){
			for (let y = 0; y <= this.height; y++) {
				this.foundation[this.xPos][y + this.yPos] = WALL;
				this.foundation[this.width + this.xPos][y + this.yPos] = WALL;
			}

			for (let x = 0; x <= this.width; x++) {
				if (! this.foundation[x + this.xPos]) {
					this.foundation[x + this.xPos] = {};
				}

				this.foundation[x + this.xPos][this.yPos] = WALL;
				this.foundation[x + this.xPos][this.yPos + this.height] = WALL;
			}
		} else {

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
					} else if (Math.ceil(Math.random() * (this.width * this.height) / 10) === 1) {
						cell = SPIKE;
					} else {
						cell = null;
					}

					if (cell) {
						this.foundation[x + this.xPos][y + this.yPos] = cell
					}

				}
			}
		}
	}

	/**
	 * Gets the x overlap between two rooms
	 *
	 * @param {Room} room2
	 * @return {array} An array of x values that overlap between this room and the provided room
	 */
	getOverlapX(room) {
		let room1X = Object.keys(this.foundation);
		let room2X = Object.keys(room.foundation);

		return room1X.filter(function(x) {
			return room2X.includes(x);
		});
	}

	/**
	 * Gets the y overlap between two rooms
	 *
	 * More complicated than getting X overlap because the Y
	 * values are stored as nested properties on for each X value.
	 * e.g. x = {0: {1: WALL, 4: WALL} }
	 *
	 * @param {Room} room2
	 * @return {array} An array of y values that overlap between this room and the provided room
	 */
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

		// Remove duplicate values by creating a Set
		room1Y = new Set(room1Y);
		room2Y = new Set(room2Y);

		// Sets don't have the array iteration functions, so we parse back to an array for looping
		return [...room1Y].filter(function(y) {
			return [...room2Y].includes(y);
		});
	}
}
