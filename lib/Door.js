import {DOOR_HORZ, DOOR_VERT} from './constants/Const';

export default class Door {
	constructor(x, y) {
		this.x;
		this.y;
		this.orientation;

		this.open;

		this.characters = characters || {horz: DOOR_HORZ, vert: DOOR_VERT};
		this.type = type || 'emtpy';
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
			return this.open ? this.characters.vert : this.characters.horz;
		} else {
			return this.open ? this.characters.horz : this.characters.vert;
		}
	}
}
