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

	start() {
		charm.pipe(process.stdout);
		this.draw();
	}

	draw() {
		charm.reset();
		this.HUD.draw();
		this.dungeon.draw();
		this.HUD.template += `\n WIDTH: ${this.dungeon.width} HEIGHT: ${this.dungeon.height} `;
		this.display = [].concat(this.dungeon.template, this.HUD.template);
		charm.reset();
		charm.write(this.display.join(''));
	}

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
