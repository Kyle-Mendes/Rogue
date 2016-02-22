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
		this.template.push(`<3: [ OOOOOOO ]                   POS: (${this.player.x}, ${this.player.y})`);
	}
}
