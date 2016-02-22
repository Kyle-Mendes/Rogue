import Dungeon from './Dungeon';
import Game from './Game';
import HUD from './HUD';
import Player from './Player';
import Room from './Room';

var keypress = require('keypress');

let room1 = new Room(20, 16, 5, 0);
let room2 = new Room(20, 5, 50, 0);
let room3 = new Room(5, 18, 80, 0);
let room4 = new Room(15, 8, 30, 10);
let room5 = new Room(100, 10, 0, 20);

let player = new Player(10, 10);

let dungeon = new Dungeon(player, [room1, room2, room3, room4, room5]);
let hud = new HUD(player);

dungeon.addConnection(room1, room5);
dungeon.addConnection(room1, room4, 0, -2);
dungeon.addConnection(room1, room2);
dungeon.addConnection(room2, room5, -2);
dungeon.addConnection(room2, room3);
dungeon.addConnection(room3, room5);
dungeon.addConnection(room3, room5);

let game = new Game(dungeon, player, hud);
game.start();


// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);


// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
	// console.log('got "keypress"', key);
	if (key && key.ctrl && key.name == 'c') {
		process.stdin.pause();
	}

	if (key && key.name == 'up') {
		game.moveUp();
	}

	if (key && key.name == 'down') {
		game.moveDown();
	}

	if (key && key.name == 'left') {
		game.moveLeft();
	}

	if (key && key.name == 'right') {
		game.moveRight();
	}

	game.draw();
});

process.stdin.setRawMode(true);
process.stdin.resume();
