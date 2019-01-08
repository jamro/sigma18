

export default class Terminal {

  constructor(view, soundPlayer) {
    this._view$$ = view;
    this._soundPlayer$$ = soundPlayer;
    this._commandProcessorList$$ = [];
    view.onSubmit$$((cmd) => this.commandReceived$$(cmd));
  }

  getSoundPlayer$$() {
    return this._soundPlayer$$;
  }

  commandReceived$$(command) {
    this._view$$.print$$(`<div class="terminal-command">s{&gt;}s ${command}</div>`);
    //clean command up
    command = command.split(" ");
    command = command.map((cmd) => cmd.trim());
    command = command.filter((cmd) => cmd != '');
    for(let processor of this._commandProcessorList$$) {
      if(processor.validate$$(command)) {
        processor.exec$$(command);
        return;
      }
    }
    this.println$$(`Error: Command s{${command[0]}}s not found!`);
    this.getSoundPlayer$$().play$$('err');
  }

  pause$$(done) {
    let initState = this._view$$.isEnabled$$();
    this._view$$.enable$$();
    this._view$$.setKeyHandler$$(() => {
      this._view$$.setPromptText$$();
      this._view$$.setKeyHandler$$();
      this._view$$.clearInput$$();
      if(!initState) {
        this._view$$.disable$$();
      }
      done();
    });
    this._view$$.setPromptText$$("Press any to continue");
  }

  prompt$$(label, done) {
    let initState = this._view$$.isEnabled$$();
    this._view$$.enable$$();
    this._view$$.setKeyHandler$$((event, txt) => {
      if(event.keyCode != 13) {
        return;
      }
      this._view$$.setPromptText$$();
      this._view$$.setKeyHandler$$();
      this._view$$.clearInput$$();
      if(!initState) {
        this._view$$.disable$$();
      }
      done(txt);
    });
    this._view$$.setPromptText$$(label);
  }

  installCommand$$(commandProcessor) {
    commandProcessor.setTerminal$$(this);
    this._commandProcessorList$$.push(commandProcessor);
    this._commandProcessorList$$.sort((a, b) => {
      if(a.getName$$() == 'help') return -1;
      if(b.getName$$() == 'help') return 1;
      if(a.getName$$() > b.getName$$()) return 1;
      if(a.getName$$() < b.getName$$()) return -1;
      return 0;
    });
  }

  getCommandList$$() {
    return this._commandProcessorList$$;
  }

  getView$$() {
    return this._view$$;
  }

  println$$(txt) {
    this._view$$.print$$(txt + "<br/>\n");
  }

  printel$$() {
    let id = "ref-terminal-line-" + this._refId++;
    this._view$$.print$$(`<span id=\"${id}\"></span><br/>\n`);
    return document.getElementById(id);
  }

  printChat$$(msg, from) {
    from = from ? from : 'hacker';
    let side = (from == 'hacker') ? 'terminal-chat-left' : 'terminal-chat-right';
    this._view$$.print$$(`<div class="terminal-chat ${side}"><small>${from}</small><p>${msg}</p></div>`);
  }

  passCrack$$(time, label, done) {
    this.getSoundPlayer$$().play$$('beep');
    let el = this._view$$.printel$$();
    let loop = setInterval(() => {
      el.innerHTML = label + ': ' + Math.round(Math.random()*1000000000).toString(16);
      time--;
      if(time <= 0) {
        clearInterval(loop);
        el.innerHTML = label + ': ********';
        this.getSoundPlayer$$().stop$$('beep');
        done();
      }
    }, 30);
  }

  showProgress$$(done) {
    this.getSoundPlayer$$().play$$('beep');
    let el = this._view$$.printel$$();
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
        this.getSoundPlayer$$().stop$$('beep');
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
    - {c: 'pass', d: duration(def=100), l:label(def=Password) t: delay}
    - {c: 'load', t: delay}
    - {c: 'on', t: delay}
    - {c: 'off', t: delay}
    - {c: 'pause', t: delay}
    - text
  */
  sequence$$(...args) {
    let cmdList = args.length == 1 ? args[0] : args;
    let step = () => {
      if(cmdList.length == 0) {
        return;
      }
      let cmd = cmdList.shift();
      if(typeof(cmd) == 'string') {
        let txt = cmd;
        cmd = () => { this.println$$(txt); };
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
            cmd.c = () => { this.println$$(cmd.d); };
            break;
          case 'chat':
            cmd.c = () => { this.printChat$$(cmd.d, cmd.f); };
            break;
          case 'sound':
            cmd.c = () => { this.getSoundPlayer$$().play$$(cmd.d); };
            break;
          case 'pass':
            cmd.c = (done) => { this.passCrack$$(cmd.d, cmd.l || 'Password', done); };
            break;
          case 'load':
            cmd.c = (done) => { this.showProgress$$(done); };
            break;
          case 'on':
            cmd.c = () => { this._view$$.enable$$(); };
            break;
          case 'off':
            cmd.c = () => { this._view$$.disable$$(); };
            break;
          case 'pause':
            cmd.c = (done) => { this.pause$$(done); };
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
