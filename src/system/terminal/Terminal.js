
export default class Terminal {

  constructor(view) {
    this._serviceDirectory$$ = null;
    this.view$$ = view;
    this.soundPlayer$$ = null;
    view.onSubmit$$((cmd) => this.commandReceived$$(cmd));
    this._loopRef$$ = null;
    this._system$$ = null;

    document.addEventListener("keydown", (e) => {
      if(!this.view$$.isEnabled$$() && !e.ctrlKey) {
        this.soundPlayer$$.play$$('err');
      }
    });
  }

  log$$(serviceName, msg) {
    this._serviceDirectory$$.getService$$(serviceName).log$$(msg);
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
        if(!service.isRunning$$) {
          return handleErr(`Service s{${service.name$$}}s is down.<br />\nTry turn it on by s{power up ${service.name$$}}s`);
        }

        let queue = [
          `Service ${service.name$$} found at ${service.ip$$}`,
          {c:'ln',d:'', t:300}
        ];
        queue = queue.concat(msg);
        queue.push({c: () => done()});
        this.sequence$$(queue);
      }, t: 300}
    );
  }

  commandReceived$$(command) {
    this.view$$.print$$(`<div class="terminal-command">s{&gt;}s ${command}</div>`);
    command = command.split(" ");
    command = command.map((cmd) => cmd.trim());
    command = command.filter((cmd) => cmd != '');
    if(!this._system$$.processCommand$$(command)) {
      this.println$$(`Error: Command s{${command[0]}}s not found!`);
      this.println$$(`Run s{help}s to list all available commands`);
      this.soundPlayer$$.play$$('err');
    }
  }

  setSystem(system) {
    this._system$$ = system;
    this._serviceDirectory$$ = system.getMap$$().getServiceDirectory$$();
    this.soundPlayer$$ = system.getSoundPlayer$$();
  }

  showPopup$$(value) {
    this.view$$.showPopup$$(value);
    this.soundPlayer$$.play$$('ok');
  }

  pause$$(done) {
    let initState = this.view$$.isEnabled$$();
    this.view$$.enable$$();
    this.view$$.setKeyHandler$$((event) => {
      event.stopImmediatePropagation();
      event.preventDefault();
      this.view$$.clearInput$$();
      if(event.keyCode != 13 && !event.ctrlKey) {
        this.soundPlayer$$.play$$('err');
        return;
      }
      this.view$$.setKeyHandler$$();
      if(!initState) {
        this.view$$.disable$$();
      }
      done();
    });
    this.view$$.setPromptText$$("Press ENTER to continue");
  }

  prompt$$(label, done) {
    let initState = this.view$$.isEnabled$$();
    this.view$$.enable$$();
    this.view$$.setKeyHandler$$((event, txt) => {
      if(event.keyCode != 13 && !event.ctrlKey) {
        return;
      }
      event.stopImmediatePropagation();
      event.preventDefault();
      this.view$$.clearInput$$();
      if(!initState) {
        this.view$$.disable$$();
      } else {
        this.view$$.setPromptText$$();
      }

      this.view$$.setKeyHandler$$();
      done(txt);
    });
    this.view$$.setPromptText$$(label);
  }

  println$$(txt, service) {
    this.view$$.print$$(txt + "<br/>\n");
    if(service) {
      this.log$$(service, txt);
    }
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

      this.view$$.clearInput$$();
      this.view$$.disable$$();
      this.view$$.setKeyHandler$$();
    };

    let isDisabled = !this.view$$.isEnabled$$();

    if(isDisabled && done) {
      this.view$$.enable$$();
      this.view$$.setPromptText$$("Press any key to skip...");
      this.view$$.setKeyHandler$$((event) => {
        event.stopImmediatePropagation();
        event.preventDefault();
        this.view$$.setEventBuffer$$(event);

        this.soundPlayer$$.shutUp$$();
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
      this.soundPlayer$$.speak$$(msg, from != 'hacker', () => {
        done();
      });
  }

  _printSingleChatSilent$$(from, msg) {
      let side = (from == 'hacker') ? 'terminal-chat-left' : 'terminal-chat-right';
      this.view$$.print$$(`<div class="terminal-chat ${side}"><small>${from}</small><p>${msg}</p></div>`);
  }

  passCrack$$(time, label, done) {
    this.soundPlayer$$.play$$('beep');
    let el = this.view$$.printel$$();
    let id = el.id;
    let loop = setInterval(() => {
      el = document.getElementById(id);
      el.innerHTML = label + ': ' + Math.round(Math.random()*1000000000).toString(16);
      time--;
      if(time <= 0) {
        clearInterval(loop);
        el.innerHTML = label + ': ********';
        this.soundPlayer$$.stop$$('beep');
        done();
      }
    }, 30);
    this._loopRef$$ = el;
  }


  showProgress$$(value, el) {
    value = value || 0;
    value = Math.max(0, Math.min(100, value));
    value = Math.round(value);
    el = el || this.view$$.printel$$();
    el = document.getElementById(el.id);
    let fillCount = Math.round((value/100)*40);
    let fill = '='.repeat(fillCount);
    let empty = '&nbsp;'.repeat(40 - fillCount);
    el.innerHTML = `[${fill}${empty}]  ` + value + '%';
    return el;
  }

  showProgressAnim$$(done) {
    this.soundPlayer$$.play$$('beep');
    let el = this.showProgress$$();
    let id = el.id;
    let p = 0;
    let loop = setInterval(() => {
      el = document.getElementById(id);
      this.showProgress$$(p, el);
      p+=2;
      if(p >= 100) {
        this.showProgress$$(100, el);
        clearInterval(loop);
        this.soundPlayer$$.stop$$('beep');
        done();
      }
    }, 30);
    this._loopRef$$ = el;
  }

  uploadSoftware$$(disks, done) {
    disks = disks || [];
    let appNames = disks.map((d) => d.command$$.name$$);
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
        disks.forEach((d) => this._system$$.installCommand$$(d.command$$));
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
    - {c: 'ln', d: 'text', t: delay, s:logService}
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
            cmd.c = () => { this.println$$(cmd.d, cmd.s); };
            break;
          case 'chat':
            if(Array.isArray(cmd.d)) {
              cmd.c = (done) => { this.printChat$$(cmd.d, done); };
            } else {
              cmd.c = (done) => { this.printChat$$([[cmd.f,cmd.d]], done); };
            }
            break;
          case 'sound':
            cmd.c = () => { this.soundPlayer$$.play$$(cmd.d); };
            break;
          case 'pass':
            cmd.c = (done) => { this.passCrack$$(cmd.d, cmd.l || 'Password', done); };
            break;
          case 'load':
            cmd.c = (done) => { this.showProgressAnim$$(done); };
            break;
          case 'on':
            cmd.c = () => { this.view$$.enable$$(); };
            break;
          case 'off':
            cmd.c = () => { this.view$$.disable$$(); };
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
