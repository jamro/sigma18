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
    this._layoutEnemies();
    this._layoutDoors();
    this._placeItems();
    this._deploySquad(4, 8);
  }

  getMap() {
    return this._map;
  }

  _layoutEnemies() {
    this._map.getRoom(2, 0).setEnemy(2);
  }

  _layoutRooms() {
    this._describe(4, 8, 'Sierra @TODO: write description of that room');
    this._describe(3, 8, 'Dock @TODO: write description of that room');
    this._describe(3, 9, 'Rescue capsule @TODO: write description of that room', 'capsule');
    this._describe(2, 8, 'empty @TODO: write description of that room');
    this._describe(3, 7, 'corridor @TODO: write description of that room', 'corridor');
    this._describe(3, 6, 'corridor @TODO: write description of that room', 'corridor');
    this._describe(3, 5, 'corridor @TODO: write description of that room', 'corridor');
    this._describe(3, 4, 'corridor @TODO: write description of that room', 'corridor');
    this._describe(3, 3, 'lobby @TODO: write description of that room');
    this._describe(4, 6, 'warehouse @TODO: write description of that room');
    this._describe(4, 7, 'warehouse @TODO: write description of that room');
    this._describe(5, 7, 'warehouse @TODO: write description of that room');
    this._describe(5, 6, 'kitchen @TODO: write description of that room');
    this._describe(4, 5, 'canteen @TODO: write description of that room');
    this._describe(5, 5, 'canteen @TODO: write description of that room');
    this._describe(6, 7, 'corridor @TODO: write description of that roomription of that room', 'corridor');
    this._describe(6, 6, 'corridor @TODO: write description of that room', 'corridor');
    this._describe(6, 5, 'corridor @TODO: write description of that room', 'corridor');
    this._describe(6, 4, 'corridor @TODO: write description of that room', 'corridor');
    this._describe(6, 3, 'security check @TODO: write description of that room');
    this._describe(4, 3, 'corridor @TODO: write description of that room', 'corridor');
    this._describe(5, 3, 'corridor @TODO: write description of that room', 'corridor');
    this._describe(7, 3, 'lab @TODO: write description of that room');
    this._describe(7, 2, 'warehouse @TODO: write description of that room');
    this._describe(7, 4, 'server room @TODO: write description of that room');
    this._describe(2, 5, 'corridor @TODO: write description of that room', 'corridor');
    this._describe(1, 5, 'corridor @TODO: write description of that room', 'corridor');
    this._describe(2, 6, 'CrewQuarter @TODO: write description of that room');
    this._describe(1, 6, 'CrewQuarter @TODO: write description of that room');
    this._describe(0, 5, 'Captain Quarter @TODO: write description of that room');
    this._describe(2, 3, 'corridor @TODO: write description of that room', 'corridor');
    this._describe(1, 3, 'office @TODO: write description of that room');
    this._describe(2, 2, 'office @TODO: write description of that room');
    this._describe(3, 2, 'corridor @TODO: write description of that room', 'corridor');
    this._describe(3, 1, 'corridor @TODO: write description of that room', 'corridor');
    this._describe(3, 0, 'oxygen gen @TODO: write description of that room');
    this._describe(2, 0, 'power gen @TODO: write description of that room');
    this._describe(4, 0, 'comp core @TODO: write description of that room');
  }

  _layoutDoors() {
    this._capsuleDoor = this._map.addDoor(3, 8, 3, 9).close(); // dock -> rescue
    this._map.addDoor(4, 8, 3, 8); // sierra -> dock
    this._map.addDoor(2, 8, 3, 8).close(); // empty -> dock
    this._map.addDoor(3, 8, 3, 7); // dock -> corridor
    this._map.addDoor(3, 7, 3, 6); // corridor -> corridor
    this._map.addDoor(3, 6, 3, 5).close(); // corridor -> corridor
    this._map.addDoor(3, 5, 3, 4); // corridor -> corridor
    this._map.addDoor(3, 4, 3, 3); // corridor -> lobby
    this._map.addDoor(3, 6, 4, 6).close(); // corridor -> warehouse
    this._map.addDoor(4, 6, 4, 7).close(); // warehouse -> warehouse
    this._map.addDoor(4, 7, 5, 7).close(); // warehouse -> warehouse
    this._map.addDoor(4, 6, 5, 6).close(); // warehouse -> kitchen
    this._map.addDoor(3, 5, 4, 5); // corridor -> canteen
    this._map.addDoor(4, 5, 5, 5); // canteen -> canteen
    this._map.addDoor(5, 5, 5, 6).close(); // canteen -> kitchen
    this._map.addDoor(5, 7, 6, 7).close(); // warehouse -> corridor
    this._map.addDoor(6, 7, 6, 6); // corridor -> corridor
    this._map.addDoor(6, 6, 6, 5); // corridor -> corridor
    this._map.addDoor(6, 5, 6, 4); // corridor -> corridor
    this._map.addDoor(6, 4, 6, 3).close(); // corridor -> security check
    this._map.addDoor(5, 3, 6, 3).close(); // corridor -> security check
    this._map.addDoor(4, 3, 5, 3); // corridor -> corridor
    this._map.addDoor(3, 3, 4, 3); // lobby -> corridor
    this._map.addDoor(6, 3, 7, 3).close(); // security -> lab
    this._map.addDoor(7, 3, 7, 2).close(); // lab -> warehouse
    this._map.addDoor(7, 3, 7, 4).close(); // lab -> server room
    this._map.addDoor(2, 5, 3, 5); // corridor -> corridor
    this._map.addDoor(1, 5, 2, 5); // corridor -> corridor
    this._map.addDoor(3, 6, 2, 6); // corridor -> crew quarter
    this._map.addDoor(2, 5, 2, 6).close(); // corridor -> crew quarter
    this._map.addDoor(1, 5, 1, 6).close(); // corridor -> crew quarter
    this._map.addDoor(1, 5, 0, 5).close(); // corridor -> captain quarter
    this._map.addDoor(3, 3, 2, 3); // lobby -> corridor
    this._map.addDoor(2, 3, 1, 3).close(); // corridor -> office
    this._map.addDoor(2, 3, 2, 2).close(); // corridor -> office
    this._map.addDoor(3, 3, 3, 2); // lobby -> corridor
    this._map.addDoor(3, 2, 3, 1); // corridor -> corridor
    this._map.addDoor(3, 1, 3, 0).close(); // corridor -> oxy gen
    this._map.addDoor(3, 0, 4, 0).close(); // oxy gen -> comp core
    this._map.addDoor(3, 0, 2, 0).close(); // oxy gen -> power gen

  }

  _placeItems() {
    this._map.getRoom(3, 8).addItem(new Note('Rescue Capsule Auth: U317AB'));
    this._map.getRoom(3, 8).addItem(new Disk(new DoorCommand(this._map)));
    this._map.getRoom(3, 8).addItem(new Disk(new DockCommand(this._map, this._capsuleDoor)));
  }

  _deploySquad(x, y) {
    this._map.setSquadPosition(x, y);
    this._map.getRoom(x, y).visit();
  }

  _describe(x, y, txt, type) {
    let room = this._map.getRoom(x, y);
    room.describe(txt);
    if(type) {
      room.setType(type);
    }
  }

}
