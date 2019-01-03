import Position from './Position.js';

export default class Room {

  constructor(x, y) {
    this._position = new Position(x, y);
    this._isVisited = true;
    this._onChangeList = [];
    this._itemList = [];
    this._description = "";
    this._type = "room";
    this._enemy = 0;
    this._doorCount = 0;
    this._doorMap = {
      n: null, e: null, s: null, w: null
    };
  }

  setEnemy(v) {
    this._enemy = v;
  }

  getEnemy() {
    return this._enemy;
  }

  setType(t) {
    this._type = t;
  }

  getType() {
    if(this._doorCount == 0) {
      return 'empty';
    }
    return this._type;
  }

  addDoor(door, direction) {
    this._doorMap[direction] = door;
    this._doorCount++;
  }

  getDoors() {
    return this._doorMap;
  }

  getPosition() {
    return this._position;
  }

  visit() {
    this._isVisited = true;
    this._onChangeList.forEach((c) => c());
  }

  isVisited() {
    return this._isVisited;
  }

  onChange(callback) {
    this._onChangeList.push(callback);
  }

  addItem(item) {
    this._itemList.push(item);
  }

  flushItems() {
    let result = this._itemList;
    this._itemList = [];
    return result;
  }

  getDescription() {
    return this._description;
  }

  describe(txt) {
    this._description = txt;
  }

}
