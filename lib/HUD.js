import {COLOR, LIFE} from './constants/Const';

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
		this.template = [COLOR.white +'\n┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n┃'];

		let health = '';

		for (let h = 1; h <= this.player.MAX_HEALTH; h++) {
			health += h <= this.player.health ? `${COLOR.red}${LIFE}` : `${COLOR.white}${LIFE}`;
		}

		// Set the hud color back to red.
		health+= COLOR.red;

		this.template.push('          ' + COLOR.red + `[ ${health} ]                  ` + COLOR.white + '    ┃');
		this.template.push('\n┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛')

		this.template = this.template.join('');
	}
}
