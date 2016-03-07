import {COLOR, LIFE} from './constants/Const';

export default class HUD {
	constructor(dungeon, player) {
		this.dungeon = dungeon;
		this.player = player;
	}

	/**
	 * Draws the HUD by creating the template string and saving it to `this`
	 *
	 * @return {null}
	 */
	draw() {
		let health = '';

		for (let h = 1; h <= this.player.MAX_HEALTH; h++) {
			health += h <= this.player.health ? `${COLOR.red}${LIFE}` : `${COLOR.white}${LIFE}`;
		}

		// Set the hud color back to red.
		health+= COLOR.red;
		let name = this.dungeon.name ? 'ZONE: ' + this.dungeon.name : '';

		this.template = `\t\t${COLOR.red}[ ${health} ] \n\t\t ${COLOR.magenta}${name}${COLOR.white}`;

	}
}
