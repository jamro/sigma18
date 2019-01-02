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
    let el = this._terminal._view.printel();
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
    let el = this._terminal._view.printel();
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
      this.println(`Command not found! Run <strong>${command[0]} help</strong> for more info.`);
      this.playDoneSound(false);
    }
  }

  print(msg) {
    this._terminal._view.print(msg);
  }

  println(msg) {
    this._terminal._view.println(msg);
  }

  printChat(msg, from) {
    from = from ? from : 'hacker';
    let side = (from == 'hacker') ? 'terminal-chat-left' : 'terminal-chat-right';
    this.print(`<div class="terminal-chat ${side}"><small>${from}</small><p>${msg}</p></div>`);
  }

  disableInput() {
    this._terminal._view.disable();
  }

  enableInput() {
    this._terminal._view.enable();
  }

  playDoneSound(success) {
    if(success) {
      this._terminal._view.playOk();
    } else {
      this._terminal._view.playErr();
    }
  }

  playChatSound() {
    this._terminal._view.playCom();
  }

  startBeepLoop() {
    this._terminal._view.startBeepLoop();
  }

  stopBeepLoop() {
    this._terminal._view.stopBeepLoop();
  }

}
