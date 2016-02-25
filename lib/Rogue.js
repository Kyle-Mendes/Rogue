import Dungeon from './Dungeon';
import Game from './Game';
import HUD from './HUD';
import Player from './Player';
import NPC from './NPC';
import Door from './Door';
import Room from './Room';

export default class Rogue {
	constructor(game) {
		this.game = game;
	}

	init() {
		this.game.start()
		this.game.draw();
	}
}

export {Room, Dungeon, Player, HUD, Game}

process.stdin.setRawMode(true);
process.stdin.resume();
