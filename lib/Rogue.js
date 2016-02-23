import Dungeon from './Dungeon';
import Game from './Game';
import HUD from './HUD';
import Player from './Player';
import Room from './Room';

var keypress = require('keypress');

// let room1 = new Room(20, 16, 5, 0);
// let room2 = new Room(20, 5, 50, 0);
// let room3 = new Room(5, 18, 80, 0);
// let room4 = new Room(15, 8, 30, 10);
// let room5 = new Room(100, 10, 0, 20);

// let player = new Player(10, 10);

// let dungeon = new Dungeon(player, [room1, room2, room3, room4, room5]);
// let hud = new HUD(player);

// dungeon.addConnection(room1, room5);
// dungeon.addConnection(room1, room4, 0, -2);
// dungeon.addConnection(room1, room2);
// dungeon.addConnection(room2, room5, 2);
// dungeon.addConnection(room2, room3);
// dungeon.addConnection(room3, room5);
// dungeon.addConnection(room3, room5);

// let game = new Game(dungeon, player, hud, true);
// game.start();

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
