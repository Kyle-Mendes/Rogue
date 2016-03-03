import {SPIKE, WALL} from './constants/Const';

var charm = require('charm')();
var keypress = require('keypress');

export default class Game {
	constructor(dungeon, player, HUD, debug) {
		this.dungeon = dungeon;
		this.player = player;
		this.HUD = HUD;
		this.debug = debug || false;
		this.display = []; // @TODO standardize name

		this.dungeon.draw();
		this.HUD.draw();
	}

	/**
	 * Initializes the game process.
	 *
	 * @return {null}
	 */
	start() {
		charm.pipe(process.stdout);
		this.draw();
	}

	/**
	 * Draws the entire game to the screen.
	 * Resets the contents of the screen, calculates the new screen, and redraws all components.
	 *
	 * @return {null}
	 */
	draw() {
		this.dungeon.draw();

		this.HUD.draw();

		if (this.debug) {
			this.HUD.template += `\nPOS: (${this.player.x}, ${this.player.y})  \nWIDTH: ${this.dungeon.width} HEIGHT: ${this.dungeon.height} `;
		}

		this.display = [].concat(this.dungeon.template, this.HUD.template);
		charm.reset();
		charm.write(this.display.join(''));

		let self = this;

		setTimeout(() => {
			self.draw();
		}, 100);
	}

	/**
	 * Moves the player up one unit by incrementing `this.player.y` by 1.
	 * If the unit above the player is blocked, the player is not moved.
	 *
	 * @return {null}
	 */
	moveUp() {
		let x = this.player.x;
		let y = this.player.y - 1;

		if (this.canMove(x, y)) {
			this.player.y -= 1;
			this.interactPlayerWithCell();
		} else {
			return;
		}
	}

	/**
	 * Moves the player down one unit by decrementing `this.player.y` by 1.
	 * If the unit below the player is blocked, the player is not moved.
	 *
	 * @return {null}
	 */
	moveDown() {
		let x = this.player.x;
		let y = this.player.y + 1;

		if (this.canMove(x, y)) {
			this.player.y += 1;
			this.interactPlayerWithCell();
		} else {
			return;
		}
	}

	/**
	 * Moves the player left one unit by decrementing `this.player.x` by 1.
	 * If the unit left of the player is blocked, the player is not moved.
	 *
	 * @return {null}
	 */
	moveLeft() {
		let x = this.player.x - 1;
		let y = this.player.y;

		if (this.canMove(x, y)) {
			this.player.x -= 1;
			this.interactPlayerWithCell();
		} else {
			return;
		}
	}

	/**
	 * Moves the player right one unit by incrementing `this.player.x` by 1.
	 * If the unit right of the player is blocked, the player is not moved.
	 *
	 * @return {null}
	 */
	moveRight() {
		let x = this.player.x + 1;
		let y = this.player.y;

		if (this.canMove(x, y)) {
			this.player.x += 1;
			this.interactPlayerWithCell();
		} else {
			return;
		}
	}

	canMove(x, y) {
		if (this.dungeon.foundation[x]) {
			let targetCell = this.dungeon.foundation[x][y];

			if (targetCell === WALL) {
				return false;

			} else if (typeof targetCell === 'object') {
				return targetCell.isOpen();

			} else if (x === 0 || y === 0) {
				return false;
			} else {
				return true;
			}
		} else {
			return true;
		}
	}

	//@TODO this should be abstracted to be more general
	//      Perhaps, there should be a general `move(direction)` function
	//      And this get called at the beginning.
	//      It should then return something more generic so the game developer can interact with it manually
	interactPlayerWithCell() {
		let cellValue;

		if (this.dungeon.foundation[this.player.x]) {
			cellValue = this.dungeon.foundation[this.player.x][this.player.y] || null;
		}

		if (cellValue === SPIKE) {
			this.player.health --;
		}
	}
}
