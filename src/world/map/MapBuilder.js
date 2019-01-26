import DoorCommand from '../../system/terminal/command/DoorCommand.js';
import DockCommand from '../../system/terminal/command/DockCommand.js';
import VirusCommand from '../../system/terminal/command/VirusCommand.js';
import CrewCommand from '../../system/terminal/command/CrewCommand.js';
import PowerCommand from '../../system/terminal/command/PowerCommand.js';
import ProjCommand from '../../system/terminal/command/ProjCommand.js';
import GunCommand from '../../system/terminal/command/GunCommand.js';
import SniffCommand from '../../system/terminal/command/SniffCommand.js';
import StaticItem from '../item/StaticItem.js';
import KeyCard from '../item/KeyCard.js';
import Gun from './Gun.js';
import Note from '../item/Note.js';
import Disk from '../item/Disk.js';
import WorldMap from './WorldMap.js';
import Squad from '../Squad.js';

import System from '../../system/System.js';

export default class MapBuilder {

  build$$(document) {
    this._map$$ = new WorldMap(10, 10);
    this._system$$ = new System(document, this._map$$);
    this._squad$$ = new Squad(this._system$$);
    this._map$$.deploySquad$$(this._squad$$);
    this._squad$$.setMap$$(this._map$$);
    this._layoutRooms$$();
    this._layoutEnemies$$();
    this._layoutDoors$$();
    this._deploySquad$$(4, 8);
    this._placeItems$$();
  }

  getMap$$() {
    return this._map$$;
  }

  getSystem$$() {
    return this._system$$;
  }

  _placeItems$$() {
    this.projCommand$$ = new ProjCommand();
    this.powerCommand$$ = new PowerCommand();
    this.crewCommand$$ = new CrewCommand();
    this.virusCommand$$ = new VirusCommand();
    this.doorCommand$$ = new DoorCommand();
    this.dockCommand$$ = new DockCommand();
    this.gunCommand$$ = new GunCommand();
    this.sniffCommand$$ = new SniffCommand();

    let config = (x, y, i) => {
      this._map$$.getRoom$$(x, y).addItem$$(i);
    };

    config(3, 3, new Disk(this.projCommand$$));
    config(4, 0, new Disk(this.powerCommand$$));
    config(2, 3, new StaticItem(`SIG-18 communication module (host: ${this._map$$.getVirus$$().unitZero$$})`));
    config(7, 2, new Note('Rescue Capsule Auth Code: U317AB'));
    config(7, 2, new KeyCard('blue'));
    config(8, 3, new Disk(this.sniffCommand$$));
    config(1, 3, new Disk(this.crewCommand$$));
    config(7, 4, new Disk(this.gunCommand$$));
    config(0, 5, new Disk(this.virusCommand$$));
    config(1, 6, new KeyCard('red'));
    config(2, 6, new Disk(this.doorCommand$$));
    config(5, 6, new KeyCard('yellow'));
    config(4, 7, new Disk(this.dockCommand$$));
  }

  _layoutEnemies$$() {
    let config = (x, y, e) => {
      this._map$$.getRoom$$(x, y).enemy$$ = e;
    };
    config(7, 3, 6);
    config(6, 6, 4);
    config(5, 6, 2);
    config(1, 6, 4);
    config(2, 8, 5);
    config(3, 1, 4);
    config(2, 2, 4);

    this._map$$.getRoom$$(6, 3).setTrap$$(87, 7, 3);
    this._map$$.getRoom$$(6, 3).gun$$ = new Gun();
  }

  _layoutRooms$$() {
    let _describe$$ = (x, y, txt, type) => {
      let room = this._map$$.getRoom$$(x, y);
      room.describe$$(txt);
      if(type) {
        room.setType$$(type);
      }
    };
    _describe$$(4, 8, "We are at our spaceship - s{Sierra 23}s. It was totally wrecked during approaching the station. What's worse, the dock station was damaged too. We have stuck here.");
    _describe$$(3, 8, 'We are at s{docks}s. There is a rescue capsule behind the southern door. We could use it to escape from here.');
    _describe$$(3, 9, "We are at s{dock station DS002}s. It is a rescue capsule! We could use it to escape from here, but we need your help to launch it. Special software may be required.");
    _describe$$(2, 8, 's{Empty dock station}s. There was probably a rescue capsule before but it has departed a long time ago.');
    _describe$$(3, 7, 'A long s{corridor}s that joins docks with the rest of the station.', 'corridor');
    _describe$$(3, 6, 'A s{corridor}s. There is a plate on the eastern door labelled Warehouse', 'corridor');
    _describe$$(3, 5, 'A s{corridor}s. There is a canteen behind the eastern door. The western corridor leads to quarters of the crew. We see a lobby at the north.', 'corridor');
    _describe$$(3, 4, 'It is a s{corridor}s that leads to the main Lobby. It seems to be totally empty.', 'corridor');
    _describe$$(3, 3, 'The main s{lobby}s is absolutely empty. There are bullet holes in the front of the reception desk. The logo in the back is damaged. A mix of documents and waste is on the floor. Seems like a regular battle took place here.');
    _describe$$(4, 6, 'The s{warehouse}s seems to have several rooms. This one contains mostly food supplies and cleaning stuff. More interesting items are probably behind southern doors.');
    _describe$$(4, 7, 'This room of the s{warehouse}s is full of spare parts, electronic modules and some repair tools. There is a huge mess here. Shelves are on the floor and nothing seems to be in the right place. There are some doors at the end of the room.');
    _describe$$(5, 7, 'We are in the s{armoury}s. Somebody has broken in here and stole all weapons. Shelves are empty. A few cartridges lie on the floor.');
    _describe$$(5, 6, 'They have a decent s{kitchen}s here. Of course, there is nobody here.  There is a doorplate with Warehouse label on western doors.');
    _describe$$(4, 5, 'We are at s{the canteen}s. Plates are left on tables like someone did not manage to take them. A few chairs lie overturned on the floor.');
    _describe$$(5, 5, 'We are inside of s{the canteen}s. There is nobody here and the mess shows that everybody left it in hurry.');
    _describe$$(6, 7, 'It is a back s{corridor}s that leads to the main warehouse.', 'corridor');
    _describe$$(6, 6, 'We are in a long, empty s{corridor}s. There are bloodstains on the walls.', 'corridor');
    _describe$$(6, 5, 'That is a back s{corridor}s, there are some pieces of furniture laying on the floor what makes crossing difficult. A few bullet holes in the wall are signs of a battle that took place here.', 'corridor');
    _describe$$(6, 4, 'We are in a long s{corridor}s that leads to the laboratory section.', 'corridor');
    _describe$$(6, 3, 'The room was a s{security checkpoint}s. It has signs of a heavy fight - bullet holes, blood stains, the furniture are broken into pieces. The room is equipped with a sentry gun BER-84 but it seems to be off-line.');
    _describe$$(4, 3, "It's a s{corridor}s that leads to the lobby. We see parts of droid's body lying down on the floor and signs of explosions.", 'corridor');
    _describe$$(5, 3, 'The s{corridor}s joins the laboratory section with the lobby. There are several bullet shells on the floor.', 'corridor');
    _describe$$(7, 3, 'We are inside the s{laboratory}s. It seems that researches on improving SIG-18 droids took place over here. They have schemas of that model on the walls and lots of spare parts. There is no production machines, just computers. I bet they were working on improving software of its artificial intelligence.');
    _describe$$(8, 3, 'We are in the laboratory\'s s{meeting room}s. There is a huge table in the middle with some software architecture diagrams. It seems that engineers have left it in a hurry.');
    _describe$$(7, 2, "It's a dedicated s{warehouse}s for the lab. They keep spare parts of SIG-18 and some backup computers here.");
    _describe$$(7, 4, 'We have entered the s{server room}s of the lab. Lots of servers are here. Everything is up and running. They are separate to core systems of the space station so they must run services dedicated for researches of the lab.');
    _describe$$(2, 5, 'It is a s{corridor}s to quarters of the crew.', 'corridor');
    _describe$$(1, 5, "We are walking down a s{corridor}s. There is a door plate on the west with label: Commander's Quarter.", 'corridor');
    _describe$$(2, 6, "That's a s{room of crew members}s. It has 10 beds. There are many signs of a fight: the blood on walls and bullet holes everywhere. The cabinets are smashed on the floor.");
    _describe$$(1, 6, "It is a s{room of crew members}s. It has 16 beds. The room is very clean comparing to other locations. Seems like it wasn't used recently.");
    _describe$$(0, 5, "We are inside the s{commander's quarter}s. It is demolished but there are no signs of a fight. It seems that someone was searching for something here.");
    _describe$$(2, 3, 'A s{corridor}s is leading to office and administration section of the space station. There is a destroyed battle droid (model SIG-18) on the floor.', 'corridor');
    _describe$$(1, 3, "We are in the s{office}s part of the station. We see a heap of papers and electronics in the centre of the room. It's partially burned. Seems like someone was trying to destroy all records. There are bullet holes in the walls.");
    _describe$$(2, 2, 'This is an s{office}s after a huge battle: blood, bullet holes, shells and cartridges on the floor, burned equipment. In the corner, we see a destroyed battle droid SIG-18.');
    _describe$$(3, 2, "It's the north s{corridor}s. Some documents from the lobby are spread all over the floor.", 'corridor');
    _describe$$(3, 1, 'We are in a s{corridor}s. In the end, there is an entrance to the internal services area.', 'corridor');
    _describe$$(3, 0, 'There is the central s{oxygen generator}s in the room. It recycles oxygen from  CO2. Someone was trying to break in here but unsuccessfully. The door is slightly damaged.');
    _describe$$(2, 0, 'We are in the s{power generator room}s. It supplies the whole station. It is very noisy here. Two of three power generators seems to be up and running. One is down.');
    _describe$$(4, 0, 'It is the s{computing core}s of the station. Servers here host core services of the station. Everything seems to be up and running.');

    this._map$$.getRoom$$(3,9).setType$$('capsule');
  }

  _layoutDoors$$() {
    let addDoor$$ = (x1, y1, x2, y2, close, label, key) => {
      let door = this._map$$.addDoor$$(x1, y1, x2, y2);
      if(close) {
        door.close$$();
      }
      if(label) {
        door.label$$ = label;
      }
      if(key) {
        door.requireKey$$(key);
      }
      return door;
    };
    addDoor$$(3, 8, 3, 9, true, 'capsule'); // dock -> rescue
    addDoor$$(4, 8, 3, 8); // sierra -> dock
    addDoor$$(2, 8, 3, 8, true); // empty -> dock
    addDoor$$(3, 8, 3, 7); // dock -> corridor
    addDoor$$(3, 7, 3, 6); // corridor -> corridor
    addDoor$$(3, 6, 3, 5, true).damage$$(); // corridor -> corridor
    addDoor$$(3, 5, 3, 4); // corridor -> corridor
    addDoor$$(3, 4, 3, 3); // corridor -> lobby
    addDoor$$(3, 6, 4, 6, true, 'blue', 'blue'); // corridor -> warehouse
    addDoor$$(4, 6, 4, 7, true, 'blue', 'blue'); // warehouse -> warehouse
    addDoor$$(4, 7, 5, 7, true, 'blue', 'blue'); // warehouse -> warehouse
    addDoor$$(4, 6, 5, 6, true, 'blue', 'blue'); // warehouse -> kitchen
    addDoor$$(3, 5, 4, 5); // corridor -> canteen
    addDoor$$(4, 5, 5, 5); // canteen -> canteen
    addDoor$$(5, 5, 5, 6, true); // canteen -> kitchen
    addDoor$$(5, 7, 6, 7, true, 'blue', 'blue'); // warehouse -> corridor
    addDoor$$(6, 7, 6, 6); // corridor -> corridor
    addDoor$$(6, 6, 6, 5); // corridor -> corridor
    addDoor$$(6, 5, 6, 4); // corridor -> corridor
    addDoor$$(6, 4, 6, 3, true); // corridor -> security check
    addDoor$$(5, 3, 6, 3, true); // corridor -> security check
    addDoor$$(4, 3, 5, 3); // corridor -> corridor
    addDoor$$(3, 3, 4, 3, true); // lobby -> corridor
    addDoor$$(6, 3, 7, 3, true, 'yellow', 'yellow'); // security -> lab
    addDoor$$(7, 3, 7, 2, true); // lab -> warehouse
    addDoor$$(7, 3, 8, 3, true); // lab -> conference room
    addDoor$$(7, 3, 7, 4, true, 'lab-server').lock$$('wirving', 'First name of an engineer who has red hair', /duncan/i); // lab -> server room
    addDoor$$(2, 5, 3, 5); // corridor -> corridor
    addDoor$$(1, 5, 2, 5); // corridor -> corridor
    addDoor$$(3, 6, 2, 6); // corridor -> crew quarter
    addDoor$$(2, 5, 2, 6, true); // corridor -> crew quarter
    addDoor$$(1, 5, 1, 6, true); // corridor -> crew quarter
    addDoor$$(1, 5, 0, 5, true, 'commander').lock$$('swoodley', 'What year have you joined Sigma-18 crew?', /2070/); // corridor -> captain quarter
    addDoor$$(3, 3, 2, 3, true); // lobby -> corridor
    addDoor$$(2, 3, 1, 3, true); // corridor -> office
    addDoor$$(2, 3, 2, 2, true); // corridor -> office
    addDoor$$(3, 3, 3, 2); // lobby -> corridor
    addDoor$$(3, 2, 3, 1); // corridor -> corridor
    addDoor$$(3, 1, 3, 0, true, 'red', 'red'); // corridor -> oxy gen
    addDoor$$(3, 0, 4, 0, true, 'core-comp').lock$$('ngallegos', 'What version of SIG-18 artificial intelligence module was most successful?', /19[^0-9]38[^0-9]2/i); // oxy gen -> comp core
    addDoor$$(3, 0, 2, 0, true); // oxy gen -> power gen
    addDoor$$(6, 6, 5, 6, true); // back corridor -> kitchen

    addDoor$$(1, 6, 1, 7, true, 'black', 'black'); // back door of crew room

  }

  _deploySquad$$(x, y) {
    this._map$$.setSquadPosition$$(x, y);
    this._map$$.getRoom$$(x, y).visit$$();
  }

}
