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
    this.startBeepLoop();
    let el = this._terminal.getView().printel();
    let loop = setInterval(() => {
      el.innerHTML = 'Password: ' + Math.round(Math.random()*1000000000).toString(16);
      time--;
      if(time <= 0) {
        clearInterval(loop);
        el.innerHTML = 'Password: ********';
        this.stopBeepLoop();
        done();
      }
    }, 30);
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
    this.typeText(log, done);
  }

  showProgress(done) {
    this.startBeepLoop();
    let el = this._terminal.getView().printel();
    let p = 0;
    let loop = setInterval(() => {
      let fillCount = Math.round((p/100)*40);
      let fill = Array(fillCount).join('=');
      let empty = Array(40 - fillCount).join('&nbsp;');

      el.innerHTML = `[${fill}${empty}]  ` + p + '%';
      p+=2;
      if(p >= 100) {
        clearInterval(loop);
        el.innerHTML = '[======================================] 100%';
        this.stopBeepLoop();
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
      this.println(`Command not found! Run s|${command[0]} help|sfor more info.`);
      this.playDoneSound(false);
    }
  }

  print(msg) {
    this._terminal.getView().print(msg);
  }

  println(msg) {
    this._terminal.getView().println(msg);
  }

  printChat(msg, from) {
    this._terminal.getView().printChat(msg, from);
  }

  disableInput() {
    this._terminal.getView().disable();
  }

  enableInput() {
    this._terminal.getView().enable();
  }

  playDoneSound(success) {
    if(success) {
      this._terminal.playOk();
    } else {
      this._terminal.playErr();
    }
  }

  playChatSound() {
    this._terminal.playChat();
  }

  startBeepLoop() {
    this._terminal.startBeepLoop();
  }

  stopBeepLoop() {
    this._terminal.stopBeepLoop();
  }

}
