export default class HUD {
	constructor(player) {
		this.player = player;
	}

	draw() {
		this.template = ['\n'];
		this.template.push(`<3: [ OOOOOOO ]                   POS: (${this.player.x}, ${this.player.y})`);
	}
}
