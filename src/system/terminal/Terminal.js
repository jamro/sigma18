

export default class Terminal {

  constructor(serviceDirectory, view, soundPlayer) {
    this._serviceDirectory$$ = serviceDirectory;
    this._view$$ = view;
    this._soundPlayer$$ = soundPlayer;
    this._commandProcessorList$$ = [];
    view.onSubmit$$((cmd) => this.commandReceived$$(cmd));

    document.addEventListener("keydown", (e) => {
      if(!this.getView$$().isEnabled$$() && !e.ctrlKey) {
        this._soundPlayer$$.play$$('err');
      }
    });
  }

  getSoundPlayer$$() {
    return this._soundPlayer$$;
  }

  connect$$(serviceName, msg, done) {
    let handleErr = (err) => {
      this.sequence$$(
        "",
        "Error: " + err,
        {c:'sound', d:'err'},
        {c:'on'}
      );
    };
    this.sequence$$(
      `Connecting to the gateway 10.43.23.4...`,
      `Connection established`,
      `Service Discovery in progress...`,
      {c: () => {
        let service = this._serviceDirectory$$.getService$$(serviceName);
        if(!service) {
          return handleErr('Cannot find service ' + serviceName);
        }
        if(!service.isRunning$$()) {
          return handleErr(`Service s{${service.getName$$()}}s is down.<br />\nTry turn it on by s{power up ${service.getName$$()}}s`);
        }

        let queue = [
          `Service ${service.getName$$()} found at ${service.getIp$$()}`,
          {c:'ln',d:'', t:300}
        ];
        queue = queue.concat(msg);
        queue.push({c: () => done()});
        this.sequence$$(queue);
      }, t: 300}
    );
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
    this.println$$(`Run s{help}s to list all available commands`);
    this.getSoundPlayer$$().play$$('err');
  }

  pause$$(done) {
    let initState = this._view$$.isEnabled$$();
    this._view$$.enable$$();
    this._view$$.setKeyHandler$$((event) => {
      event.stopImmediatePropagation();
      event.preventDefault();
      this._view$$.clearInput$$();
      if(event.keyCode != 13 && !event.ctrlKey) {
        this._soundPlayer$$.play$$('err');
        return;
      }
      this._view$$.setKeyHandler$$();
      if(!initState) {
        this._view$$.disable$$();
      }
      done();
    });
    this._view$$.setPromptText$$("Press ENTER to continue");
  }

  prompt$$(label, done) {
    let initState = this._view$$.isEnabled$$();
    this._view$$.enable$$();
    this._view$$.setKeyHandler$$((event, txt) => {
      if(event.keyCode != 13 && !event.ctrlKey) {
        return;
      }
      event.stopImmediatePropagation();
      event.preventDefault();
      this._view$$.clearInput$$();
      if(!initState) {
        this._view$$.disable$$();
      } else {
        this._view$$.setPromptText$$();
      }

      this._view$$.setKeyHandler$$();
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

  hasCommand$$(name) {
    return this._commandProcessorList$$.filter((c) => c.getName$$() == name).length > 0;
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

  printChat$$(msgQueue, done) {
    let msgPointer = 0;
    let finished = false;

    let printNext = (queueCompleted) => {
      if(finished) return;
      let from = msgQueue[msgPointer][0];
      let msg = msgQueue[msgPointer][1];
      msgPointer++;
      this._printSingleChat$$(from, msg, () => {
        if(msgPointer < msgQueue.length) {
          printNext(queueCompleted);
        } else {
          queueCompleted();
        }
      });
    };
    let cleanUp = () => {
      if(finished) return;
      while(msgPointer < msgQueue.length) {
        let from = msgQueue[msgPointer][0];
        let msg = msgQueue[msgPointer][1];
        this._printSingleChatSilent$$(from, msg);
        msgPointer++;
      }

      this._view$$.clearInput$$();
      this._view$$.disable$$();
      this._view$$.setKeyHandler$$();
    };

    let isDisabled = !this._view$$.isEnabled$$();

    if(isDisabled && done) {
      this._view$$.enable$$();
      this._view$$.setPromptText$$("Press any key to skip...");
      this._view$$.setKeyHandler$$((event) => {
        event.stopImmediatePropagation();
        event.preventDefault();
        this._view$$.setEventBuffer$$(event);

        this._soundPlayer$$.shutUp$$();
        cleanUp();
        if(finished) return;
        finished = true;
        done();
      });
    }

    printNext(() => {
      if(isDisabled && done) {
        cleanUp();
      }
      if(finished) return;
      finished = true;
      if(done) {
        done();
      }
    });
  }

  _printSingleChat$$(from, msg, done) {
      this._printSingleChatSilent$$(from, msg);
      this._soundPlayer$$.speak$$(msg, from != 'hacker', () => {
        done();
      });
  }

  _printSingleChatSilent$$(from, msg) {
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

  uploadSoftware$$(disks, done) {
    disks = disks || [];
    let appNames = disks.map((d) => d.getCommand$$().getName$$());
    this.sequence$$(
      {c: 'sound', d: 'ok', t: 100},
      "",
      `Transferring disk data: s{${appNames.join(', ')}}s app.`,
      {c: 'load'},
      'App downloaded',
      '',
      {c: 'ln', d: `Installing s{${appNames.join(', ')}}s app.`, t: 500},
      {c: 'load'},
      {c: () => {
        disks.forEach((d) => this.installCommand$$(d.getCommand$$()));
      }},
      'Done.',
      '',
      {c: () => {
        appNames.forEach((a) => this.println$$(`Run s{${a}  help}s for more info.`));
      }},
      'Run s{help}s to list all available commands',
      {c: 'sound', d: 'ok'},
      {c: done}
    );
  }

  /*
  possible values of cmdList contnet:
    - function
    - {c: callback}
    - {c: callback, t: delay}
    - {c: 'ln', d: 'text', t: delay}
    - {c: 'chat', d: [['from','text'], ...], t: delay}
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
            if(Array.isArray(cmd.d)) {
              cmd.c = (done) => { this.printChat$$(cmd.d, done); };
            } else {
              cmd.c = (done) => { this.printChat$$([[cmd.f,cmd.d]], done); };
            }
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
