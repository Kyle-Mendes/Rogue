export const COLOR = {
	black   : "\u001b[30m",
	red     : "\u001b[31m",
	green   : "\u001b[32m",
	yellow  : "\u001b[33m",
	blue    : "\u001b[34m",
	magenta : "\u001b[35m",
	cyan    : "\u001b[36m",
	white   : "\u001b[37m",
}

export const WALL      = COLOR.blue + "#";
export const PLAYER    = COLOR.red + "@";
export const SPIKE     = COLOR.yellow + "^";
export const LIFE      = "♥"

// Maybe ┅
export const DOOR_HORZ = COLOR.yellow + "━";

// Maybe ┇
export const DOOR_VERT = COLOR.yellow + "┃";
