import Position from './Position.js';

class Door {

  constructor() {
    this._id = 'd-' + Math.floor(Math.random()*16).toString(16) + Door._nextId.toString(16) + Math.floor(Math.random()*16).toString(16);
    this._id = this._id.toUpperCase();
    Door._nextId++;
    this._position = null;
    this._rotation = null;
    this._isClosed = false;
  }

  calculatePosition(room1, room2) {
    let pos1 = room1.getPosition();
    let pos2 = room2.getPosition();
    this._position = new Position((pos1.x + pos2.x)/2, (pos1.y + pos2.y)/2);

    let dx = Math.abs(pos1.x - pos2.x);
    let dy = Math.abs(pos1.y - pos2.y);
    this._rotation = (dx > dy) ? 90 : 0;
  }

  getPosition() {
    return this._position.clone();
  }

  getRotation() {
    return this._rotation;
  }

  close() {
    this._isClosed = true;
  }

  open() {
    this._isClosed = false;
  }

  isClosed() {
    return this._isClosed;
  }

  getId() {
    return this._id;
  }

}

Door._nextId = 26;

export default Door;
