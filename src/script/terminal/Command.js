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
    return false;
  }

  exec(command) {

  }

  print(msg) {
    this._terminal._view.print(msg);
  }

  println(msg) {
    this._terminal._view.println(msg);
  }

}
