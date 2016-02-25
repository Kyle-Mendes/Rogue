import * as Rogue from 'rogue';

var keypress = require('keypress');

var r1 = new Rogue.Room(20, 10, 0, 0);
var r2 = new Rogue.Room(20, 10, 25, 7);
var r3 = new Rogue.Room(10, 15, 5, 20);
var r4 = new Rogue.Room(30, 15, 20, 25);

var player = new Rogue.Player(5, 5);
var dungeon = new Rogue.Dungeon(player, [r1, r2, r3, r4]);
var hud = new Rogue.HUD(player); //@TODO this should probably just happen in game

dungeon.addConnection(r1, r2);
dungeon.addConnection(r1, r3);
dungeon.addConnection(r2, r4);
dungeon.addConnection(r3, r4, 0, 5); // offsetting the corridor by 5 cells down

var game = new Rogue.Game(dungeon, player, hud, true);

game.start();

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
	if (key && key.ctrl && key.name == 'c') {
		process.exit(1)
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
});

