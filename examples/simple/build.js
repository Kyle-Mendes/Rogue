'use strict';

var _rogue = require('rogue');

var Rogue = _interopRequireWildcard(_rogue);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var keypress = require('keypress');

var r1 = new Rogue.Room(20, 10, 0, 0);
var r2 = new Rogue.Room(20, 10, 25, 10);
var r3 = new Rogue.Room(10, 15, 5, 20);
var r4 = new Rogue.Room(30, 15, 20, 25);

var player = new Rogue.Player(5, 5);
var dungeon = new Rogue.Dungeon(player, [r1, r2, r3, r4]);
var hud = new Rogue.HUD(player); //@TODO this should probably just happen in game

var door = new Rogue.Door(false, 'locked');

// The dungeon viewport size can be overwritten.
dungeon.viewportWidth = 100;
dungeon.viewportHeight = 30;

dungeon.addConnection(r1, r2, null, 2, -2);
dungeon.addConnection(r1, r3, door, -10);
dungeon.addConnection(r2, r4);
dungeon.addConnection(r3, r4, null, 0, 5); // offsetting the corridor by 5 cells down

var game = new Rogue.Game(dungeon, player, hud, true);

game.start();

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
	if (key && key.ctrl && key.name == 'c') {
		process.exit(1);
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
