import Position from './Position.js';
import Room from './Room.js';
import Door from './Door.js';

export default class Map {

  constructor(width, height) {
    this._squadPosition = null;
    this._doorList = [];
    this._grid = [];
    for(let x = 0; x < width; x++) {
      this._grid[x] = [];
      for(let y = 0; y < height; y++) {
        this._grid[x][y] = new Room(x, y);
      }
    }
  }

  setSquadPosition(x, y) {
    this._squadPosition = new Position(x, y);
  }

  getSquadPosition() {
    return this._squadPosition.clone();
  }

  getRoom(x, y) {
    if(!this._grid[x] || !this._grid[x][y]) {
      throw new Error('Room not found');
    }
    return this._grid[x][y];
  }

  addDoor(x1, y1, x2, y2) {
    let room1 = this.getRoom(x1, y1);
    let room2 = this.getRoom(x2, y2);
    let door = new Door();
    if(x2 - x1 == -1 && y2 == y1) { // move west
      room1.addDoor(door, 'w');
      room2.addDoor(door, 'e');
    } else if(x2 - x1 == +1 && y2 == y1) { // move east
      room1.addDoor(door, 'e');
      room2.addDoor(door, 'w');
    } else if(x2 == x1 && y2 - y1 == -1) { // move north
      room1.addDoor(door, 'n');
      room2.addDoor(door, 's');
    }  else if(x2 == x1 && y2 - y1 == +1) { // move south
      room1.addDoor(door, 's');
      room2.addDoor(door, 'n');
    }

    door.calculatePosition(room1, room2);

    this._doorList.push(door);
    return door;
  }

  getDoorList() {
    return this._doorList;
  }

}
