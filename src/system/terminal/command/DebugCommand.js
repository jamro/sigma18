import Command from '../Command.js';

export default class DebugCommand extends Command {

  constructor(builder) {
    super();
    this._map = builder.getMap$$();
    this._builder = builder;
    this.name$$ = DEBUG_MODE ? 'debug' : null;
    this.help$$ = 'For debuging only';
  }

  execView(command) {
    let type = command.length >= 3 ? command[2] : 'all';

    for(let x=0; x < this._map._grid$$.length; x++) {
      for(let y=0; y < this._map._grid$$[x].length; y++) {
        if(type == 'light' && !this._map._grid$$[x][y].hasLight$$()) {
          continue;
        }
        this._map._grid$$[x][y]._isVisited$$ = (type != 'none');
      }
    }
    this._map._notifyChange$$("room");

  }

  execOpen() {
    for(let i=0; i < this._map._doorList$$.length; i++) {
      this._map._doorList$$[i]._isClosed$$ = false;
    }
    this._map._notifyChange$$("door");
  }

  execApps() {
    let apps = [
      this._builder.projCommand$$,
      this._builder.powerCommand$$,
      this._builder.crewCommand$$,
      this._builder.virusCommand$$,
      this._builder.doorCommand$$,
      this._builder.dockCommand$$
    ];

    apps.forEach((c) => this._terminal$$.installCommand$$(c));
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

    this._map.setSquadPosition$$(x, y);
    this._map.getRoom$$(x, y).visit$$();
  }

  execHelp() {
    this._terminal$$.sequence$$(
      "Available commands are:",
      '',
      's{debug view [all|none|light]}s',
      's{debug apps}s',
      's{debug open}s',
      's{debug go [X] [Y]}s',
      '',
      {c: 'sound', d: 'ok', t:0}
    );
  }
}
