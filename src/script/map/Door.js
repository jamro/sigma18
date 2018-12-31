import Position from './Position.js';

export default class Door {

  constructor() {
    this._position = null;
  }

  calculatePosition(room1, room2) {
    let pos1 = room1.getPosition();
    let pos2 = room2.getPosition();
    this._position = new Position((pos1.x + pos2.x)/2, (pos1.y + pos2.y)/2);
  }

  getPosition() {
    return this._position.clone();
  }


}
