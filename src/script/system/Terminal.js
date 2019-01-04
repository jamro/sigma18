

export default class Terminal {

  constructor(view) {
    this._view = view;
    this._commandProcessorList = [];
    view.onSubmit((cmd) => this.commandReceived(cmd));
  }

  commandReceived(command) {
    this._view.print(`<div class="terminal-command">s|&gt;|s ${command}</div>`);
    //clean command up
    command = command.split(" ");
    command = command.map((cmd) => cmd.trim());
    command = command.filter((cmd) => cmd != '');
    for(let processor of this._commandProcessorList) {
      if(processor.validate(command)) {
        processor.exec(command);
        return;
      }
    }
    this._view.println(`Error: Command s|${command[0]}|s not found!`);
    this._view.playSound('err');
  }

  installCommand(commandProcessor) {
    commandProcessor.setTerminal(this);
    this._commandProcessorList.push(commandProcessor);
    this._commandProcessorList.sort((a, b) => {
      if(a.getName() == 'help') return -1;
      if(b.getName() == 'help') return 1;
      if(a.getName() > b.getName()) return 1;
      if(a.getName() < b.getName()) return -1;
      return 0;
    });
  }

  getCommandList() {
    return this._commandProcessorList;
  }

  enableSound(state) {
    this._view.enableSound(state);
  }

  getView() {
    return this._view;
  }


  playOk() {
    this._view.playSound('ok');
  }

  playErr() {
    this._view.playSound('err');
  }

  playChat() {
    this._view.playSound('com');
  }

  startBeepLoop() {
    this._view.playSound('beep');
  }

  stopBeepLoop() {
    this._view.stopSound('beep');
  }

  println(txt) {
    this._view.print(txt + "<br/>\n");
  }

  printel() {
    let id = "ref-terminal-line-" + this._refId++;
    this._view.print(`<span id=\"${id}\"></span><br/>\n`);
    return document.getElementById(id);
  }

  printChat(msg, from) {
    from = from ? from : 'hacker';
    let side = (from == 'hacker') ? 'terminal-chat-left' : 'terminal-chat-right';
    this._view.print(`<div class="terminal-chat ${side}"><small>${from}</small><p>${msg}</p></div>`);
  }

  passCrack(time, done) {
    this.startBeepLoop();
    let el = this._view.printel();
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

  showProgress(done) {
    this.startBeepLoop();
    let el = this._view.printel();
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

  /*
  possible values of cmdList contnet:
    - function
    - {c: callback}
    - {c: callback, t: delay}
    - {c: 'ln', d: 'text', t: delay}
    - {c: 'chat', d: 'text', f: 'from', t: delay}
    - {c: 'sound', d: 'soundId', t: delay}
    - {c: 'pass', d: duration(def=100), t: delay}
    - {c: 'load', t: delay}
    - {c: 'on', t: delay}
    - {c: 'off', t: delay}
    - text
  */
  sequence(...args) {
    let cmdList = args.length == 1 ? args[0] : args;
    let step = () => {
      if(cmdList.length == 0) {
        return;
      }
      let cmd = cmdList.shift();
      if(typeof(cmd) == 'string') {
        let txt = cmd;
        cmd = () => { this.println(txt); };
      }
      if(typeof(cmd) == 'function') {
        cmd = {
          c: cmd,
          t: 100
        };
      }
      if(typeof(cmd.c) == 'string') {
        switch(cmd.c) {
          case 'ln':
            cmd.c = () => { this.println(cmd.d); };
            break;
          case 'chat':
            cmd.c = () => { this.printChat(cmd.d, cmd.f); };
            break;
          case 'sound':
            cmd.c = () => { this._view.playSound(cmd.d); };
            break;
          case 'pass':
            cmd.c = (done) => { this.passCrack(cmd.d, done); };
            break;
          case 'load':
            cmd.c = (done) => { this.showProgress(done); };
            break;
          case 'on':
            cmd.c = () => { this._view.enable(); };
            break;
          case 'off':
            cmd.c = () => { this._view.disable(); };
            break;
          default:
            throw new Error(`Unknown command ${cmd.c}`);
        }
      }
      if(!cmd.t) {
        cmd.t = 100;
      }
      setTimeout(() => {
        if(cmd.c.length == 0) {
          cmd.c();
          step();
        } else {
          cmd.c(step);
        }
      }, Math.max(1, cmd.t));
    };
    step();
  }
}
