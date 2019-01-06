import DoorCommand from '../system/command/DoorCommand.js';
import DockCommand from '../system/command/DockCommand.js';
import VirusCommand from '../system/command/VirusCommand.js';
import CrewCommand from '../system/command/CrewCommand.js';
import StaticItem from '../item/StaticItem.js';
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
    this._map.getRoom(3, 7).setEnemy(4);
    this._map.getRoom(3, 6).setEnemy(3);
  }

  _layoutRooms() {
    this._describe(4, 8, "It's our spaceship - s{Sierra 23}s. It was totally wrecked during approaching the station. What's worse, the dock station was damaged too. We have stuck here.");
    this._describe(3, 8, 'We are at s{docks}s. There is a rescue capsule behind the southern door. We could use it to escape from here.');
    this._describe(3, 9, "We are at s{dock station DS002}s. It is a rescue capsule! We could use it to escape from here, but we need your help to launch it. Special software may be required.");
    this._describe(2, 8, 's{Empty dock station}s. There was probably a rescue capsule before but it has departed a long time ago.');
    this._describe(3, 7, 'A long s{corridor}s that joins docks with the rest of the station.', 'corridor');
    this._describe(3, 6, 'A s{corridor}s. There is a plate on the eastern door: Warehouse', 'corridor');
    this._describe(3, 5, 'A s{corridor}s. There is a canteen behind the eastern door. The western corridor leads to quarters of the crew. We see a lobby at the north.', 'corridor');
    this._describe(3, 4, 'It is a s{corridor}s that leads to main Lobby. It seems to be totally empty.', 'corridor');
    this._describe(3, 3, 'The main s{lobby}s is absolutely empty. There are bullet holes in the front of the reception desk. The logo in the back is damaged. A mix of documents and waste is on the floor. Seems like a regular battle took place here.');
    this._describe(4, 6, 'The s{warehouse}s seems to have several rooms. This one contains mostly food supplies and cleaning stuff. More interesting items are probably behind southern doors.');
    this._describe(4, 7, 'This room of the s{warehouse}s is full of spare parts, electronic modules and some repair tools. There is a huge mess here. Shelves are on the floor and nothing seems to be in the right place. There are some doors at the end of the room.');
    this._describe(5, 7, 'We are in the s{armoury}s. Somebody has broken in here and stole all weapons. Shelves are empty. A few cartridges lie on the floor.');
    this._describe(5, 6, 'They have a decent s{kitchen}s here. Of course, there is nobody here.  There is a doorplate with Warehouse label on western doors.');
    this._describe(4, 5, 'We are at s{the canteen}s. Plates are left on tables like someone did not manage to take them. A few chairs lie overturned on the floor.');
    this._describe(5, 5, 'We are inside of s{the canteen}s. There is nobody here and the mess shows that everybody left it in hurry.');
    this._describe(6, 7, 'It is a back s{corridor}s that leads to the main warehouse.', 'corridor');
    this._describe(6, 6, 'We are in a long, empty s{corridor}s. There are bloodstains on the walls.', 'corridor');
    this._describe(6, 5, 'That is a back s{corridor}s, there are some pieces of furniture laying on the floor what makes crossing difficult. A few bullet holes in the wall are signs of a battle that took place here.', 'corridor');
    this._describe(6, 4, 'We are in a long s{corridor}s that leads to the laboratory section.', 'corridor');
    this._describe(6, 3, 'The room was a s{security checkpoint}s. It has signs of a heavy fight - bullet holes, blood stains, the furniture are broken into pieces. There is a destroyed battle droid (model SIG-18) in the corner.');
    this._describe(4, 3, "It's a s{corridor}s that leads to the lobby. We see parts of droid's body lying down on the floor and signs of explosions.", 'corridor');
    this._describe(5, 3, 'The s{corridor}s joins the laboratory section with the lobby. There are several bullet shells on the floor.', 'corridor');
    this._describe(7, 3, 'We are inside the s{laboratory}s. It seems that researches on improving SIG-18 droids took place over here. They have schemas of that model on the walls and lots of spare parts. There is no production machines, just computers. I bet they were working on improving software of its artificial intelligence.');
    this._describe(7, 2, "It's a dedicated s{warehouse}s for the lab. They keep spare parts of SIG-18 and some backup computers here.");
    this._describe(7, 4, 'We have entered the s{server room}s of the lab. Lots of servers are here. Everything is up and running. They are separate to core systems of the space station so they must run services dedicated for researches of the lab.');
    this._describe(2, 5, 'It is a s{corridor}s to quarters of the crew.', 'corridor');
    this._describe(1, 5, "We are walking down a s{corridor}s. There is a door plate on the west: Captain's Quarter.", 'corridor');
    this._describe(2, 6, "That's a s{room of crew members{s. It has 8 beds. There are many signs of a fight: the blood on walls and bullet holes everywhere. The cabinets are smashed on the floor.");
    this._describe(1, 6, "It is a s{room of crew members{s. It has 6 beds. The room is very clean comparing to other locations. Seems like it wasn't used recently.");
    this._describe(0, 5, "We are inside the s{captain's quarter}s. It is demolished but there are no signs of a fight. It seems that someone was searching for something here.");
    this._describe(2, 3, 'A s{corridor}s is leading do office and administration section of the space station. There is a destroyed battle droid (model SIG-18) on the floor.', 'corridor');
    this._describe(1, 3, "We are in the s{office}s part of the station. We see a heap of papers and electronics in the centre of the room. It's partially burned. Seems like someone was trying to destroy all records. There are bullet holes on the walls.");
    this._describe(2, 2, 'This is an s{office}s after a huge battle: blood, bullet holes, shells and cartridges on the floor, burned equipment. In the corner, we see a destroyed battle droid SIG-18.');
    this._describe(3, 2, "It's the north s{corridor}s. Some documents from the lobby are spread all over the floor.", 'corridor');
    this._describe(3, 1, 'We are in a s{corridor}s. In the end, there is an entrance to the internal services area.', 'corridor');
    this._describe(3, 0, 'There is an s{oxygen generator}s in the room. It recycles oxygen from  CO2. Someone was trying to break in here but unsuccessfully. The door is slightly damaged.');
    this._describe(2, 0, 'We are in the s{power generator room}s. It supplies the whole station. It is very noisy here. Everything seems to be up and running.');
    this._describe(4, 0, 'It is the s{computing core}s of the station. Servers here host core services of the station. Everything seems to be up and running.');

    this._map.getRoom(3,9).setType('capsule');
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

    this._map.getRoom(3, 8).addItem(new Note('Rescue Capsule Auth Code: U317AB'));
    this._map.getRoom(3, 8).addItem(new StaticItem(`Active SIG-18 communication module (${this._map.getVirus().getUnitZero()})`));
    this._map.getRoom(3, 8).addItem(new Disk(new DoorCommand(this._map)));
    this._map.getRoom(3, 8).addItem(new Disk(new DockCommand(this._map, this._capsuleDoor)));
    this._map.getRoom(3, 8).addItem(new Disk(new VirusCommand(this._map.getVirus())));
    this._map.getRoom(3, 8).addItem(new Disk(new CrewCommand()));

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
