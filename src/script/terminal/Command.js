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

  exec(command) {

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
