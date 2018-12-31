export default class Room {

  constructor() {
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

}
