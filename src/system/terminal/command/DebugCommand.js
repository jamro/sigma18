import Command from '../Command.js';
import KeyCard from '../../../world/item/KeyCard.js';

import DoorCommand from './DoorCommand.js';
import DockCommand from './DockCommand.js';
import VirusCommand from './VirusCommand.js';
import CrewCommand from './CrewCommand.js';
import PowerCommand from './PowerCommand.js';
import ProjCommand from './ProjCommand.js';
import GunCommand from './GunCommand.js';
import SniffCommand from './SniffCommand.js';

export default class DebugCommand extends Command {

  constructor(builder) {
    super();
    this._squad = builder._squad$$;
    this._builder = builder;
    this.name$$ = DEBUG_MODE ? 'debug' : null;
    this.help$$ = 'For debuging only';
  }

  execGod() {
    this.execView([]);
    this.execOpen([]);
    this.execKeys([]);
    this.execApps([]);
    this.execPower([]);
  }

  execPower() {
    this._map$$.getServiceDirectory$$().totalPowerSuply$$ = 150;
    this._map$$.getServiceDirectory$$().getAllServices$$().forEach((s) => s.on$$());
  }

  execView(command) {
    let type = command.length >= 3 ? command[2] : 'all';

    for(let x=0; x < this._map$$._grid$$.length; x++) {
      for(let y=0; y < this._map$$._grid$$[x].length; y++) {
        if(type == 'light' && !this._map$$._grid$$[x][y].hasLight$$()) {
          continue;
        }
        this._map$$._grid$$[x][y]._isVisited$$ = (type != 'none');
      }
    }
    this._map$$._notifyChange$$("room");

  }

  execOpen() {
    for(let i=0; i < this._map$$._doorList$$.length; i++) {
      this._map$$._doorList$$[i]._isClosed$$ = false;
    }
    this._map$$._notifyChange$$("door");
  }

  execApps() {
    let apps = [
      new ProjCommand(),
      new PowerCommand(),
      new CrewCommand(),
      new VirusCommand(),
      new DoorCommand(),
      new DockCommand(),
      new GunCommand(),
      new SniffCommand()
    ];

    apps.forEach((c) => this._system$$.installCommand$$(c));
  }

  execKeys() {
    this._squad.addToInventory$$([
      new KeyCard('yellow'),
      new KeyCard('blue'),
      new KeyCard('red')
    ]);
  }

  execHint(command) {
    let level = command.length >= 3 ? Number(command[2]) : -1;
    level = isNaN(level) ? -1 : level;
    let validators = this._map$$.getWalthrough$$()._validators$$;
    if(level < 0) {
      console.log(validators);
      return;
    }

    for(let i=0; i < validators.length; i++) {
      validators[i].passed$$ = (i < level);
    }
    this._map$$.getWalthrough$$().updateLevel();
  }

  execGo(command) {
    let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    if(command.length < 4) {
      return this._terminal$$.println$$('Error: not enough arguments');
    }
    let x = letters.indexOf(command[2].toUpperCase());
    let y = Number(command[3])-1;
    if(isNaN(x) || isNaN(y) || x < 0 || y < 0 || x > 9 || x > 10) {
      return this._terminal$$.println$$('Error: invalid arguments');
    }

    this._map$$.setSquadPosition$$(x, y);
    this._map$$.getRoom$$(x, y).visit$$();
  }

  execHelp() {
    this._terminal$$.sequence$$(
      "Available commands are:",
      '',
      's{debug god}s',
      's{debug view [all|none|light]}s',
      's{debug apps}s',
      's{debug keys}s',
      's{debug open}s',
      's{debug power}s',
      's{debug hint [level]}s',
      's{debug go [X] [Y]}s',
      '',
      {c: 'sound', d: 'ok', t:0}
    );
  }
}
