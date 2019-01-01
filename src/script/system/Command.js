export default class Command {

  setTerminal(terminal) {
    this._terminal = terminal;
  }

  getHelp() {
    return "no help available";
  }

  getName() {
    return null;
  }

  validate(command) {
    return (command[0].toLowerCase() == this.getName().toLowerCase());
  }

  passCrack(time, done) {
    let el = this._terminal._view.printel();
    let loop = setInterval(() => {
      el.innerHTML = 'Password: ' + Math.round(Math.random()*1000000000).toString(16);
      time--;
      if(time <= 0) {
        clearInterval(loop);
        el.innerHTML = 'Password: ********';
        done();
      }
    }, 30);
  }

  typeText(cmd, done) {
    let loop = setInterval(() => {
      this.println(cmd.shift());
      if(cmd.length == 0) {
        clearInterval(loop);
        done();
      }
    }, 100);
  }

  exec(command) {
    let name = command.length >= 2 ? command[1] : "";
    let method = 'exec' + name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    if(name && this[method]) {
      this[method](command);
    } else {
      this.println(`Command not found! Run <strong>${command[0]} help</strong> for more info.`);
    }
  }

  print(msg) {
    this._terminal._view.print(msg);
  }

  println(msg) {
    this._terminal._view.println(msg);
  }

  disableInput() {
    this._terminal._view.disable();
  }

  enableInput() {
    this._terminal._view.enable();
  }

}
