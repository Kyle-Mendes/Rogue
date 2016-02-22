import {COLOR} from './constants/Const';

export default class HUD {
	constructor(player) {
		this.player = player;
	}

	/**
	 * Draws the HUD by creating the template string and saving it to `this`
	 *
	 * @return {null}
	 */
	draw() {
		this.template = ['\n'];

		let health = '';

		for (let h = 1; h <= this.player.MAX_HEALTH; h++) {
			health += h <= this.player.health ? 'O' : COLOR.white + 'O';
		}

		// Set the hud color back to red.
		health+= COLOR.red;

		this.template.push(COLOR.red + `<3: [ ${health} ]`);

		this.template = this.template.join('');
	}
}
