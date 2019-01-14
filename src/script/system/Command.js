export default class Command {

  setTerminal$$(terminal) {
    this._terminal$$ = terminal;
  }

  getHelp$$() {
    return "no help available";
  }

  getName$$() {
    return null;
  }

  validate$$(command) {
    return (command[0].toLowerCase() == this.getName$$().toLowerCase());
  }

  exec$$(command) {
    let name = command.length >= 2 ? command[1] : "";
    let method = 'exec' + name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    if(name && this[method]) {
      this[method](command);
    } else {
      this._terminal$$.println$$(`Command not found! Run s{${command[0]} help}s for more info.`);
      this._terminal$$.getSoundPlayer$$().play$$('err');
    }
  }

  disableInput$$() {
    this._terminal$$.getView$$().disable$$();
  }

  enableInput$$() {
    this._terminal$$.getView$$().enable$$();
  }

}
