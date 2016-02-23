import * as Rogue from 'rogue';

var keypress = require('keypress');

var r = new Rogue.Room(20, 10, 0, 0);
var p = new Rogue.Player(5, 5);
var d = new Rogue.Dungeon(p, [r]);
var h = new Rogue.HUD(p); //@TODO this should probably just happen in game

var g = new Rogue.Game(d, p, h);

g.start();

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
	// console.log('got "keypress"', key);
	if (key && key.ctrl && key.name == 'c') {
		// process.stdin.pause();
		process.exit(1)
	}

	if (key && key.name == 'up') {
		g.moveUp();
	}

	if (key && key.name == 'down') {
		g.moveDown();
	}

	if (key && key.name == 'left') {
		g.moveLeft();
	}

	if (key && key.name == 'right') {
		g.moveRight();
	}
});

