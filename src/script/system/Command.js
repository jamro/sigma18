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

  connect(serviceName, serviceIp, msg, done) {
    let log = [
      `Connecting to the gateway 10.43.23.4...`,
      `Connection established`,
      `Service Discovery in progress...`,
      `${serviceName} Service found: ${serviceIp}`,
      ``,
    ];
    log = log.concat(msg);
    this._terminal.sequence(log.concat(
      {c: done}
    ));
  }

  exec(command) {
    let name = command.length >= 2 ? command[1] : "";
    let method = 'exec' + name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    if(name && this[method]) {
      this[method](command);
    } else {
      this._terminal.println(`Command not found! Run s|${command[0]} help|sfor more info.`);
      this.playDoneSound(false);
    }
  }

  disableInput() {
    this._terminal.getView().disable();
  }

  enableInput() {
    this._terminal.getView().enable();
  }

  playDoneSound(success) {
    if(success) {
      this.getView().playSound('ok');
    } else {
      this.getView().playSound('err');
    }
  }

}
