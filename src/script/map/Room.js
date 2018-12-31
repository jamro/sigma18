import Position from './Position.js';

export default class Room {

  constructor(x, y) {
    this._position = new Position(x, y);
    this._doorMap = {
      n: null, e: null, s: null, w: null
    };
  }

  addDoor(door, direction) {
    this._doorMap[direction] = door;
  }

  getDoors() {
    return this._doorMap;
  }

  getPosition() {
    return this._position;
  }

}
