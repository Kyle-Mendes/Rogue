import Dungeon from './Dungeon';
import Game from './Game';
import HUD from './HUD';
import Player from './Player';
import NPC from './NPC';
import Door from './Door';
import Room from './Room';

import * as CONST from './constants/Const';

export default class Rogue {
	constructor(game) {
		this.game = game;
	}

	init() {
		this.game.start()
		this.game.draw();
	}
}

export {Room, Door, Dungeon, Player, NPC, HUD, Game, CONST}

process.stdin.setRawMode(true);
process.stdin.resume();
