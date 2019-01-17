import Position from '../common/Position.js';
import Room from './Room.js';
import Door from './Door.js';
import Virus from '../Virus.js';
import Battle from '../Battle.js';
import Walkthrough from '../Walkthrough.js';

export default class WorldMap {

  constructor(services, width, height) {
    this._walkthrough$$ = new Walkthrough();
    this._services$$ = services;
    this._squadPosition$$ = null;
    this._virus$$ = new Virus();
    this._battle$$ = null;
    this._doorList$$ = [];
    this._doorMap$$ = {};
    this._grid$$ = [];
    this._onChangeList$$ = [];

    this._virus$$.onActivated$$(() => {
      this._walkthrough$$.handleEvent$$('com-virus-activate');
    });

    this._services$$.getService$$('lights-east').onStatusChange$$((state) => {
      this._walkthrough$$.handleEvent$$('com-lights-east-' + (state ? 'on' : 'off'));
    });

    this._services$$.getService$$('pump-station').onStatusChange$$((state) => {
      this._walkthrough$$.handleEvent$$('com-pump-station-' + (state ? 'on' : 'off'));
    });

    let lightServiceWest = this._services$$.getService$$('lights-west');
    let lightServiceEast = this._services$$.getService$$('lights-east');

    for(let x = 0; x < width; x++) {
      this._grid$$[x] = [];
      for(let y = 0; y < height; y++) {
        let lightService = ((x >= 4 && y != 8 && y != 0) || (x >= 5 && (y == 8 || y == 0))) ? lightServiceEast : lightServiceWest;
        let room = new Room(lightService, x, y);
        /* jshint ignore:start */
        lightService.onStatusChange$$((isRunning) => {
          if(!isRunning || room != this._grid$$[this._squadPosition$$.x][this._squadPosition$$.y]) return;
          room.visit$$();
          this._notifyChange$$("light");
        });
        /* jshint ignore:end */

        this._grid$$[x][y] = room;
        this._grid$$[x][y].onChange$$(() => this._notifyChange$$("room"));
      }
    }
  }

  getWalthrough$$() {
    return this._walkthrough$$;
  }

  getBattle$$() {
    return this._battle$$;
  }

  startBattle$$(room, door, onWin) {
    this._walkthrough$$.handleEvent$$('battle-start');
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
    this._notifyChange$$("squad");
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
    this._doorMap$$[door.id$$] = door;
    door.onChange$$(() => this._notifyChange$$("door"));
    door.onChange$$(() => {
      let event = 'door-';
      event += door.isClosed$$() ? 'close' : 'open';
      event += "-" + door.getLabel$$();
      this._walkthrough$$.handleEvent$$(event);
    });
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

  _notifyChange$$(type) {
    this._onChangeList$$.forEach((c) => c(type));
  }

}
