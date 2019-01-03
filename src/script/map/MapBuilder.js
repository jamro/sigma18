import DoorCommand from '../system/command/DoorCommand.js';
import DockCommand from '../system/command/DockCommand.js';
import Note from '../item/Note.js';
import Disk from '../item/Disk.js';
import WorldMap from './WorldMap.js';

export default class MapBuilder {

  constructor() {
    this._map = null;
    this._capsuleDoor = null;
  }

  build() {
    this._map = new WorldMap(10, 10);
    this._layoutRooms();
    this._layoutDoors();
    this._placeItems();
    this._deploySquad(3, 3);
  }

  getMap() {
    return this._map;
  }

  _layoutRooms() {
    this._describe(3, 3, 'It is a dock station. There is a rescue capsule behind southern door. We could use it to escape from the space station.');
    // @TODO: update location of rescue capsule
    // @TODO: update id of dock station
    this._describe(4, 3, 'We are at dock station DS002. It is a rescue capsule! We could use it to escape from here, but we need your help to launch it.');

    this._map.getRoom(3, 1).setEnemy(2);
    this._map.getRoom(4, 3).setType('capsule');
  }

  _layoutDoors() {
    this._capsuleDoor = this._map.addDoor(3, 3, 4, 3);

    this._map.addDoor(3, 3, 3, 4).close();
    this._map.addDoor(3, 3, 3, 2);
    this._map.addDoor(3, 2, 2, 2).close();
    this._map.addDoor(3, 2, 4, 2);
    this._map.addDoor(3, 2, 3, 1); // to enemies
  }

  _placeItems() {
    this._map.getRoom(4, 2).addItem(new Note('Rescue Capsule Auth: U317AB'));
    this._map.getRoom(3, 2).addItem(new Disk(new DoorCommand(this._map)));
    this._map.getRoom(2, 2).addItem(new Disk(new DockCommand(this._map, this._capsuleDoor)));
  }

  _deploySquad(x, y) {
    this._map.setSquadPosition(x, y);
    this._map.getRoom(x, y).visit();
  }

  _describe(x, y, txt) {
    this._map.getRoom(x, y).describe(txt);
  }

}
