import Position from './Position.js';
import Room from './Room.js';
import Door from './Door.js';
import Virus from './Virus.js';
import Battle from './Battle.js';

export default class WorldMap {

  constructor(width, height) {
    this._squadPosition$$ = null;
    this._virus$$ = new Virus();
    this._battle$$ = null;
    this._doorList$$ = [];
    this._doorMap$$ = {};
    this._grid$$ = [];
    this._onChangeList$$ = [];
    for(let x = 0; x < width; x++) {
      this._grid$$[x] = [];
      for(let y = 0; y < height; y++) {
        this._grid$$[x][y] = new Room(x, y);
        this._grid$$[x][y].onChange$$(() => this._notifyChange$$());
      }
    }
  }

  getBattle$$() {
    return this._battle$$;
  }

  startBattle$$(room, door, onWin) {
    this._battle$$ = new Battle(room, door, this._virus$$, onWin);
    this._battle$$.start$$();
  }

  stopBattle$$() {
    if(this._battle$$) {
      this._battle$$.stop$$();
      this._battle$$ = null;
    }
  }

  getVirus$$() {
    return this._virus$$;
  }

  setSquadPosition$$(x, y) {
    this._squadPosition$$ = new Position(x, y);
    this._notifyChange$$();
  }

  getSquadPosition$$() {
    return this._squadPosition$$.clone$$();
  }

  hasRoom$$(x, y) {
    if(!this._grid$$[x] || !this._grid$$[x][y]) {
      return false;
    }
    return true;
  }

  getRoom$$(x, y) {
    if(!this._grid$$[x] || !this._grid$$[x][y]) {
      throw new Error('Room not found');
    }
    return this._grid$$[x][y];
  }

  addDoor$$(x1, y1, x2, y2) {
    let room1 = this.getRoom$$(x1, y1);
    let room2 = this.getRoom$$(x2, y2);
    let door = new Door();
    if(x2 - x1 == -1 && y2 == y1) { // move west
      room1.addDoor$$(door, 'w');
      room2.addDoor$$(door, 'e');
    } else if(x2 - x1 == +1 && y2 == y1) { // move east
      room1.addDoor$$(door, 'e');
      room2.addDoor$$(door, 'w');
    } else if(x2 == x1 && y2 - y1 == -1) { // move north
      room1.addDoor$$(door, 'n');
      room2.addDoor$$(door, 's');
    }  else if(x2 == x1 && y2 - y1 == +1) { // move south
      room1.addDoor$$(door, 's');
      room2.addDoor$$(door, 'n');
    }

    door.assignRooms$$(room1, room2);

    this._doorList$$.push(door);
    this._doorMap$$[door.getId$$()] = door;
    door.onChange$$(() => this._notifyChange$$());
    return door;
  }

  getDoorList$$() {
    return this._doorList$$;
  }

  getDoorById$$(id) {
    id = id.toUpperCase().replace("O", "0");
    return this._doorMap$$[id];
  }

  onChange$$(callback) {
    this._onChangeList$$.push(callback);
  }

  _notifyChange$$() {
    this._onChangeList$$.forEach((c) => c());
  }



}
