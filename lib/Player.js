export default class Player {
	constructor(xPos = 0, yPos = 0, health) {
		this.x          = xPos;
		this.y          = yPos;
		this.health     = health || 10;
		this.MAX_HEALTH = health || 10;
	}
}
