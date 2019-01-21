export default class Command {

  setSystem$$(system) {
    this._system$$ = system;
    this._terminal$$ = system.getTerminal$$();
    this._map$$ = system.getMap$$();
    this._sideScreen$$ = system.getSideScreen$$();
  }

  validate$$(command) {
    return (command[0].toLowerCase() == this.name$$.toLowerCase());
  }

  exec$$(command) {
    let name = command.length >= 2 ? command[1] : "";
    let method = 'exec' + name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    if(name && this[method]) {
      this[method](command);
    } else {
      this._terminal$$.println$$(`Command not found! Run s{${command[0]} help}s for more info.`);
      this._terminal$$.soundPlayer$$.play$$('err');
    }
  }

  disableInput$$() {
    this._terminal$$.view$$.disable$$();
  }

  enableInput$$() {
    this._terminal$$.view$$.enable$$();
  }

}
