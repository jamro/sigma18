import Command from '../Command.js';

export default class DebugCommand extends Command {

  constructor(map) {
    super();
    this._map = map;
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

  execHelp() {
    this._terminal$$.sequence$$(
      "Available commands are:",
      '',
      's{debug view all}s',
      's{debug view none}s',
      's{debug view light}s',
      's{debug open}s',
      '',
      {c: 'sound', d: 'ok', t:0}
    );
  }
}
