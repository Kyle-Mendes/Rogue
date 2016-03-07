import {DOOR_HORZ, DOOR_VERT} from './constants/Const';

export default class Door {
	constructor(open       = false,
				type       = 'empty',
				characters = {horz: DOOR_HORZ, vert: DOOR_VERT}) {

		// Set when adding to connection
		this.orientation;

		this.open = open;
		this.type = type;

		this.characters = characters;
	}

	addDoor(x, y, orientation) {
		this.orientation = orientation;
	}

	setOrientation(orientation) {
		this.orientation = orientation;
	}

	openDoor() {
		this.open = true;
	}

	isOpen() {
		return this.open;
	}

	draw() {
		if (! this.type || this.type === 'empty') {
			return ' ';
		}

		if (this.orientation === 'horz') {
			return this.open ? this.characters.horz : this.characters.vert;
		} else {
			return this.open ? this.characters.vert : this.characters.horz;
		}
	}
}
