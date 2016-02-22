import {WALL} from './constants/Const';

var charm = require('charm')();

export default class Game {
	constructor(dungeon, player, HUD) {
		this.dungeon = dungeon;
		this.player = player;
		this.HUD = HUD;
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
		this.HUD.draw();
		this.dungeon.draw();

		let value = '_';

		if (this.dungeon.foundation[this.player.x]) {
			value = this.dungeon.foundation[this.player.x][this.player.y] || '_';
		}

		this.HUD.template += `\nPOS: (${this.player.x}, ${this.player.y})  \nWIDTH: ${this.dungeon.width} HEIGHT: ${this.dungeon.height} `;


		this.display = [].concat(this.dungeon.template, this.HUD.template);
		charm.reset();
		charm.write(this.display.join(''));
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

		if (this.dungeon.foundation[x] &&
			this.dungeon.foundation[x][y] === WALL
			|| y === 0) {

			return
		}

		this.player.y -= 1;
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

		if (this.dungeon.foundation[x] &&
			this.dungeon.foundation[x][y] === WALL
			|| y === 0) {

			return;
		}

		this.player.y += 1;

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

		if (this.dungeon.foundation[x] &&
			this.dungeon.foundation[x][y] === WALL
			|| y === 0) {

			return;
		}

		this.player.x -= 1;
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

		if (this.dungeon.foundation[x] &&
			this.dungeon.foundation[x][y] === WALL
			|| y === 0) {

			return;
		}

		this.player.x += 1;
	}
}
