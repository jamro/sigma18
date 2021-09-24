/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/Intro.js
class Intro {
  constructor(system) {
    this.$F4 = system;
  }

  $h6(hasCorrectBrowser) {
    var chromeInfo = hasCorrectBrowser ? '' : 'r{WARNING! Use Chrome web browser for the best gaming experience!}r';

    this.$F4.$H2().$j6.$G4();

    this.$F4.$H2().$h4("", "-----------------------------", "SIGMA-18 GAME" + ( false ? 0 : ""), "-----------------------------", "Version of the terminal: ".concat("1.2.1"), "Have fun :)", "", chromeInfo, "", "s{PRESS ENTER TO BEGIN YOUR ADVENTURE :)}s", 'Turn the sound on for the best player experience', "", {
      c: 'pause'
    }, {
      c: 'sound',
      d: 'ok'
    }, {
      c: 'chat',
      d: [['comander', 'This is commander of Sierra-23, Alex Decker speaking!!!'], ['comander', 'Sir! Two of our engines are damaged! Emergency landing at Sigma-18! Approaching DS003...'], ['comander', 'We cannot keep the approach path! We are too far on the left!'], ['comander', "Mayday, mayday, mayday..."], ['comander', "m{...}m"]],
      t: 100
    }, {
      c: 'chat',
      d: [['hacker', "Sierra-23, What is the status?"], ['commander', "Spaceship wrecked during landing. We cannot use it to get out from here anymore. We are at Sigma-18 Space Station. There seems to be not a soul in the whole location."], ['commander', "Sir! We need your help! Connect to Sigma-18 Space Station gateway and help us to get away from here!"]],
      t: 500
    }, {
      c: 'pause'
    }, {
      c: 'ln',
      d: '<div class="terminal-command">s{&gt;}s ssh hacker@sigma18.iss.gov</div>'
    }, {
      c: 'ln',
      d: "Connecting to sigma18.iss.gov port 22...",
      t: 500
    }, {
      c: 'ln',
      d: "Connection established",
      t: 500
    }, "", "Enabling compatibility mode for protocol 2.0", "Remote protocol version 2.0, remote software version OpenSSH 7", "Authenticating to sigma18.iss.gov:22...", "Server accepts key", "Authentication succeeded (publickey)", "", "Floor plan streaming.", "Buffering...", {
      c: 'sound',
      d: 'ok',
      t: 0
    }, {
      c: done => {
        this.$F4.$B().$H4(this.$F4.$d5(), done);
      }
    }, "Map preview available.", "r{WARNING: the connection may be unstable due to low bandwidth}r", "", "Welcome to Space Station Sigma-18", "Type s{help}s and press ENTER to see available commands.", {
      c: 'sound',
      d: 'ok',
      t: 0
    }, {
      c: 'on',
      t: 0
    });
  }

}
;// CONCATENATED MODULE: ./src/system/terminal/Command.js
class Command {
  $S3(system) {
    this.$F4 = system;
    this.$D3 = system.$H2();
    this.$k6 = system.$d5();
    this.$J2 = system.$B();
  }

  $j4(command) {
    return command[0].toLowerCase() == this.$l6.toLowerCase();
  }

  $z6(command) {
    var name = command.length >= 2 ? command[1] : "";
    var method = 'exec' + name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    if (name && this[method]) {
      this[method](command);
    } else {
      this.$D3.$J4("Command not found! Run s{".concat(command[0], " help}s for more info."));

      this.$D3.$K2.$h6('err');
    }
  }

  $z2() {
    this.$D3.$j6.$G4();
  }

  $L2() {
    this.$D3.$j6.$f5();
  }

}
;// CONCATENATED MODULE: ./src/system/terminal/command/HelpCommand.js

class HelpCommand extends Command {
  constructor() {
    super();
    this.$l6 = 'help';
    this.$x6 = 'List all available commands';
  }

  $z6(command) {
    this.$D3.$J4("Available commands:");

    var commandList = this.$F4.$U();

    for (var i = 0; i < commandList.length; i++) {
      var _command = commandList[i];
      var help = _command.$x6;
      var name = _command.$l6;

      if (help && name) {
        this.$D3.$J4(" * s{".concat(name, "}s - ").concat(help));
      }
    }

    this.$D3.$J4("Run s{[command] help}s for more info. For example: s{com help}s");

    this.$D3.$J4("");

    this.$D3.$J4("-------------------");

    this.$D3.$J4("If you really got stuck and you have no idea what to do, ask marines for a hint. Type s{com hint}s and press ENTER");

    this.$F4.$I().$h6('ok');
  }

}
;// CONCATENATED MODULE: ./src/system/terminal/command/ComCommand.js

class ComCommand extends Command {
  constructor() {
    super();
    this._squad = null;
    this._directionMap = {
      n: 'north',
      s: 'south',
      e: 'east',
      w: 'west'
    };
    this.$l6 = 'com';
    this.$x6 = 'Communication with squad of marines in the field';
  }

  $S3(system) {
    super.$S3(system);
    this._squad = this.$k6.$k4();
  }

  execStatus() {
    this.$z2();

    this._squad.$N(() => {
      this.$L2();
    });

    this._squad = this.$k6.$k4();
  }

  execGo(command) {
    var direction = command.length >= 3 ? command[2] : '';

    if (!direction) {
      this.$F4.$I().$h6('err');

      this.$D3.$J4("Error: Direction argument is required. Run s{com help}s for more info.");

      return;
    }

    direction = direction.toLowerCase();

    if (!this._directionMap[direction]) {
      this.$F4.$I().$h6('err');

      this.$D3.$J4("Error: unknown direction ".concat(direction));

      return;
    }

    this.$z2();

    this._squad.$Z2(direction, items => {
      items = items || [];
      var disks = items.filter(i => i.$c6 == 'disk');

      if (disks.length > 0) {
        this.$D3.$O(disks, () => {
          this.$L2();
        });
      } else {
        this.$L2();
      }
    });
  }

  execHint() {
    var hint = this.$k6.$M().$K4();

    this.$D3.$h4({
      c: 'off'
    }, {
      c: 'chat',
      d: [['hacker', 'Commander, any ideas what to do next?'], ['commander', 'Really? I thought that you are the hacker here! ' + hint]]
    }, {
      c: 'on'
    });
  }

  execHelp() {
    this.$D3.$h4("Use this command to communicate with squad of marines in the field", "Available commands are:", '', "s{com hint}s", "r{NOTICE! Real hacker does not need that! FOR NOOBS ONLY!}r", "Ask marines for a hint. Use it whenever you got stuck and you do not know what to do.", '', "s{com status}s", "Ask marines to send status report from the field.", '', "s{com go [direction]}s", "Ask marines to explore next location in defined direction.", "Possible directions are:", "* s{n}s - North (shortcut s{SHIFT + UP_ARROW}s)", "* s{e}s - East (shortcut s{SHIFT + RIGHT_ARROW}s)", "* s{s}s - South (shortcut s{SHIFT + DOWN_ARROW}s)", "* s{w}s - West (shortcut s{SHIFT + LEFT_ARROW}s)", "For example: s{com go w}s", "", "s{Hint}s: Use key shortcuts (SHIFT + ARROW_KEY) to navigate quicker.", {
      c: 'sound',
      d: 'ok',
      t: 0
    });
  }

}
;// CONCATENATED MODULE: ./src/system/terminal/command/SfxCommand.js

class SfxCommand extends Command {
  constructor() {
    super();
    this.$K2 = null;
    this.$l6 = 'sfx';
    this.$x6 = 'Turn off/on terminal sound';
  }

  $S3(system) {
    super.$S3(system);
    this.$K2 = system.$I();
  }

  execHelp() {
    this.$D3.$h4("Available commands are:", '', "s{sfx on}s", "Turn the sound on", '', "s{sfx off}s", "Turn the sound off", {
      c: 'sound',
      d: 'ok',
      t: 0
    });
  }

  execOn() {
    this.$K2.$v6(false);

    this.$D3.$J4("Sound enabled");

    this.$K2.$h6('ok');
  }

  execOff() {
    this.$K2.$v6(true);

    this.$D3.$J4("Sound disabled");

    this.$K2.$h6('ok');
  }

}
;// CONCATENATED MODULE: ./src/system/terminal/command/DoorCommand.js

class DoorCommand extends Command {
  constructor() {
    super();
    this._squad = null;
    this.$l6 = 'door';
    this.$x6 = 'Open/close doors';
  }

  $S3(system) {
    super.$S3(system);
    this._squad = this.$k6.$k4();
  }

  getDoorOnDirection(direction) {
    if (['n', 's', 'e', 'w'].indexOf(direction) != -1) {
      var pos = this.$k6.$f();

      var room = this.$k6.$L4(pos.x, pos.y);

      var door = room.$l4()[direction.toLowerCase()];

      if (!room.$z4() && !this.$k6.$F3() && !room.$G3()) {
        return null;
      }

      if (door) {
        return door;
      }
    }

    return null;
  }

  findDoor(command) {
    var direction = command.length >= 3 ? command[2].toLowerCase() : "unknown";
    var door = this.getDoorOnDirection(direction);

    if (!door) {
      this.$D3.$J4("Error: door not found on direction ".concat(direction, "!"));

      this.$F4.$I().$h6('err');
    }

    return door;
  }

  execOpen(command) {
    this.doorSwitch(command, false);
  }

  execClose(command) {
    this.doorSwitch(command, true);
  }

  doorSwitch(command, doClose) {
    var door = this.findDoor(command);

    if (!door) {
      return;
    }

    this.$z2();

    this.$D3.$Z4('doors', ["Door look up..."], () => {
      if (!door) {
        this.$F4.$I().$h6('err');

        this.$L2();
        return;
      }

      if (door.$x4() == doClose) {
        this.$D3.$J4("Door found");

        this.$D3.$J4("Error: Door already ".concat(doClose ? 'closed' : 'open', "!"));

        this.$F4.$I().$h6('err');

        this.$L2();
        return;
      }

      if (door.$H3()) {
        this.$D3.$J4("Door found");

        this.$D3.$J4("Error: Door damaged! Cannot ".concat(doClose ? 'close' : 'open', "!"));

        this.$F4.$I().$h6('err');

        this.$L2();
        return;
      }

      this.$D3.$J4("Door found");

      this.$D3.$J4("");

      var lock = door.$X4();
      var requiredKey = door.$P();
      var openSequence = ["Password authorization is required.", {
        c: 'pass',
        d: 60
      }, doClose ? "Closing..." : "Opening...", {
        c: 'ln',
        d: "Done. Door ".concat(door.$A6, " ").concat(doClose ? 'closed' : 'open', "."),
        s: 'doors',
        t: 500
      }, {
        c: 'sound',
        d: 'ok',
        t: 0
      }, {
        c: 'on'
      }, {
        c: () => {
          if (doClose) {
            door.$G5();
          } else {
            door.$b6();
          }
        },
        t: 500
      }];

      if (lock) {
        this.$D3.$h4([{
          c: 'sound',
          d: 'ok',
          t: 300
        }, {
          c: 'ln',
          d: "Account (s{".concat(lock.user, "}s) has been locked."),
          s: 'doors'
        }, "There were 3 unsuccessful attempts of login.", "Answer security question to unlock:", "s{".concat(lock.question, "}s"), {
          c: done => {
            this.$D3.$g5("Answer:", txt => {
              this.$D3.$J4('Answer: ' + txt);

              if (lock.$H5(txt)) {
                door.$h5();

                this.$D3.$h4([{
                  c: 'sound',
                  d: 'ok'
                }, {
                  c: 'ln',
                  d: "The answer is correct. Account unlocked.",
                  s: 'doors'
                }, ""].concat(openSequence));

                done();
              } else {
                this.$D3.$h4({
                  c: 'ln',
                  d: "Error: Incorrect Answer! The account remains locked",
                  s: 'doors'
                }, {
                  c: 'sound',
                  d: 'err'
                }, {
                  c: 'on'
                });

                done();
              }
            });
          }
        }]);
      } else if (requiredKey) {
        var hasKey = this._squad.$x2().filter(i => i.$c6 == 'key' && i.$J5 == requiredKey);

        hasKey = hasKey.length ? true : false;
        var info = {
          c: 'ln',
          d: "This area is restricted! A s{".concat(requiredKey, " key card}s is required to access"),
          t: 500
        };

        if (hasKey) {
          this.$D3.$h4([info, {
            c: 'chat',
            d: [['hacker', "Commander, I need your assistance. Use ".concat(requiredKey, " key card to open the door ").concat(door.$A6)], ['commander', "The key card is in the reader. Done!"]],
            t: 800
          }, "", {
            c: 'ln',
            d: "Verification of key card...",
            s: 'doors',
            t: 1000
          }, {
            c: 'sound',
            d: 'ok',
            t: 0
          }, {
            c: 'ln',
            d: "Access to s{".concat(requiredKey, " restricted area}s granted."),
            s: 'doors',
            t: 500
          }, "Proceeding to next authorization step", ""].concat(openSequence));
        } else {
          this.$D3.$h4([info, {
            c: 'chat',
            d: [['hacker', "Commander, We need a ".concat(requiredKey, " key card to open the door ").concat(door.$A6)], ['commander', "We do not have required key card!"]],
            t: 800
          }, "", {
            c: 'ln',
            d: "Timeout... access to s{".concat(requiredKey, " restricted area}s denied."),
            s: 'doors',
            t: 1700
          }, {
            c: 'sound',
            d: 'err',
            t: 0
          }, {
            c: 'on'
          }]);
        }
      } else {
        this.$D3.$h4(openSequence);
      }
    });
  }

  execHelp() {
    this.$D3.$h4("Open/close doors in current location of the squad", "(The operation requires of being near to the doors due to low range of manual transmitters)", "", "Available commands are:", '', "s{door open [N/E/S/W]}s", "Open the door on north (s{N}s), east (s{E}s), south (s{S}s) or west (s{W}s)", "For example s{door open N}s", '', "s{door close [N/E/S/W]}s", "Close the door on north (s{N}s), east (s{E}s), south (s{S}s) or west (s{W}s)", "For example s{door close N}s", {
      c: 'sound',
      d: 'ok',
      t: 0
    });
  }

}
;// CONCATENATED MODULE: ./src/system/terminal/command/DockCommand.js

class DockCommand extends Command {
  constructor() {
    super();
    this._capsuleDoor = null;
    this._fuel = {
      DS001: 0,
      DS002: 0,
      DS003: 8
    };
    this.$l6 = 'dock';
    this.$x6 = 'Operate docking stations and rescue capsules';
  }

  $S3(system) {
    super.$S3(system);
    this._capsuleDoor = this.$k6.$A();
  }

  execList() {
    this.$z2();

    this.$D3.$Z4('docker', [{
      c: 'ln',
      d: 'Query station list...',
      s: 'docker'
    }], () => {
      // @TODO update location of dock stations
      this.$D3.$J4("<pre>Station ID | Location | Status  | Docked Unit\n" + "-----------|----------|---------|-----------------\n" + "DS001      | [C:9]    | Empty   | - \n" + "DS002      | [D:10]   | Ready   | Rescue Capsule\n" + "r{DS003}r      | r{[E:9]}r    | r{Damaged}r | r{ISS Sierra-23}r</pre>");

      this.$L2();

      this.$F4.$I().$h6('ok');
    });
  }

  execLaunch(command) {
    var id = command.length >= 3 ? command[2].toUpperCase() : '';

    if (!id) {
      this.$D3.$J4("Error: StationId argument is required. Run s{dock help}s for more info.");

      this.$F4.$I().$h6('err');

      return;
    }

    this.$z2();

    this.$D3.$Z4('docker', [], () => {
      this.$D3.$J4("Authorization is required!");

      this.$D3.$g5('Auth Code:', pass => {
        if (pass.toUpperCase() != 'U317AB') {
          this.$D3.$J4("");

          this.$D3.$J4("Error: Authorization failed. Incorrect pass code.");

          this.$L2();

          this.$F4.$I().$h6('err');

          return;
        }

        this.$D3.$J4("Authorization... ok");

        this.$D3.$J4("");

        if (id != 'DS002') {
          this.$D3.$J4("Error: Cannot start launching sequence at ".concat(id, "."));

          this.$L2();

          this.$F4.$I().$h6('err');

          return;
        }

        if (!this._capsuleDoor.$x4()) {
          this.$D3.$J4("Error: Close the door of the station before starting launch sequence.");

          this.$L2();

          this.$F4.$I().$h6('err');

          return;
        }

        var pos = this.$k6.$f(); // @TODO: update capsule position


        if (pos.x != 3 || pos.y != 9) {
          this.$D3.$J4("");

          this.$D3.$J4("Error: Cannot launch empty capsule without passengers.");

          this.$L2();

          this.$F4.$I().$h6('err');

          return;
        }

        if (this._fuel.DS002 <= 50) {
          this.$D3.$J4("");

          this.$D3.$J4("Error: Spaceship at ".concat(id, " has low fuel level! Launch procedure stopped! See s{dock status ").concat(id, "}s for more details"));

          this.$L2();

          this.$F4.$I().$h6('err');

          return;
        }

        this.$D3.$J3(false);

        this.$D3.$h4({
          c: 'ln',
          d: "Starting launching sequence at ".concat(id),
          s: 'docker'
        }, "Modules health check:", {
          c: 'load'
        }, "All systems up and running", {
          c: 'ln',
          d: "Opening docking gates...",
          t: 700
        }, {
          c: 'ln',
          d: "Staring the engine...",
          t: 900
        }, {
          c: 'ln',
          d: "Enabling shields...",
          t: 800
        }, {
          c: 'ln',
          d: "Disconnecting from docking port...",
          t: 750
        }, {
          c: 'ln',
          d: "",
          t: 2000
        }, "Done... Unit launched successfully", {
          c: () => this.$J2.$K3()
        }, {
          c: 'ln',
          d: "Closing docking gates",
          t: 1000
        }, "Launching sequence completed", {
          c: 'chat',
          d: 's{GOOD JOB SOLDIER!}s<br/>\n We are saved! Going back home!',
          f: 'commander',
          t: 2000
        }, {
          c: 'chat',
          d: 'Roger that! Good luck commander!',
          f: 'hacker'
        }, {
          c: 'ln',
          d: '<div class="finito"><h1>THE END</h1></div>',
          t: 1000
        }, {
          c: 'ln',
          d: 's{Special thanks}s: Monika Jamroz, Tomasz Stocki, Piotr Jamroz, Grzegorz P., nxn',
          t: 1000
        }, {
          c: 'sound',
          d: 'ok',
          t: 0
        }, {
          c: () => this.$D3.$j6.$j5.$K5(10)
        });
      });
    });
  }

  execFuel(command) {
    var id = command.length >= 3 ? command[2].toUpperCase() : '';

    if (!id) {
      this.$D3.$J4("Error: StationId argument is required. Run s{dock help}s for more info.");

      this.$F4.$I().$h6('err');

      return;
    }

    this._fuel[id] = 100;
    var msg;

    if (id == 'DS002' || id == 'DS003') {
      msg = [{
        c: 'ln',
        d: "Fueling spaceship at ".concat(id, "..."),
        s: 'pump-station'
      }, {
        c: 'load'
      }, "", {
        c: 'ln',
        d: "Done. Fuel level: 100%",
        s: 'pump-station'
      }, {
        c: 'sound',
        d: 'ok'
      }, {
        c: 'on'
      }];
    } else {
      msg = ["Error: No spaceship at ".concat(id), {
        c: 'sound',
        d: 'err'
      }, {
        c: 'on'
      }];
    }

    this.$z2();

    this.$D3.$Z4('pump-station', msg, () => {});
  }

  execStatus(command) {
    this.$z2();
    var id = command.length >= 3 ? command[2].toUpperCase() : '';

    this.$D3.$Z4('docker', ["Station record found"], () => {
      var gates, port, net, pressure, health;
      var unit = [];
      var ok = 's{ok}s';
      var damaged = 'r{damaged}r';

      switch (id) {
        case 'DS001':
        case 'DS002':
          gates = ok;
          port = ok;
          net = ok;
          pressure = ok;
          health = ok;
          break;

        case 'DS003':
          gates = 'r{open}r';
          port = damaged;
          net = 'r{disconnected}r';
          pressure = 'r{depressurized}r';
          health = damaged;
          break;

        default:
          this.$D3.$J4("Error: Dock station ".concat(id, " not found"));

          this.$L2();
          return;
      }

      switch (id) {
        case 'DS001':
          unit = ['* s{none}s'];
          break;

        case 'DS002':
          unit = ['* Name: s{Rescue Capsule}s'];
          break;

        case 'DS003':
          unit = ['* Name: s{OSS Sierra-23}s'];
          break;
      }

      if (id == 'DS002' || id == 'DS003') {
        unit = unit.concat([this._fuel[id] > 50 ? "* Fuel: s{".concat(this._fuel[id], "%}s") : "* Fuel: r{".concat(this._fuel[id], "%}r"), "* Cargo: s{none}s", "* Engine: ".concat(health), "* Shields: ".concat(health), "* Steering System: ".concat(health), "* Radar: s{ok}s", "* Communication Systems: ".concat(health)]);
      }

      var msg = ["Health check of ".concat(id, "..."), "", "Dock station:", "* Docking gates: ".concat(gates), "* Docking port: ".concat(port), "* Network: ".concat(net), "* Air pressure: ".concat(pressure), "", "Docked Unit:"];
      msg = msg.concat(unit, [{
        c: 'sound',
        d: 'ok',
        t: 0
      }, {
        c: 'on'
      }]);

      this.$D3.$h4(msg);
    });
  }

  execHelp() {
    this.$D3.$h4("Use this command to operate docking stations and rescue capsules", "Available commands are:", '', "s{dock list}s", "Lists status of all docking stations", '', "s{dock status [stationId]}s", "Health report of the station and docked spaceship", '', "s{dock fuel [stationId]}s", "Fuel spaceship docked at provided station", '', "s{dock launch [stationId]}s", "Launch spaceship docked at [stationId].", "For example: s{dock launch DS001}s", {
      c: 'sound',
      d: 'ok',
      t: 0
    });
  }

}
;// CONCATENATED MODULE: ./src/system/terminal/command/VirusCommand.js

class VirusCommand extends Command {
  constructor() {
    super();
    this._virus = null;
    this._header = "Virus Infector version 3.2.9";
    this.$l6 = 'virus';
    this.$x6 = 'Infect specified hosts and blocks communication in their newtwork';
  }

  $S3(system) {
    super.$S3(system);
    this.$L3 = this.$k6.$y();
    this._virus = this.$k6.$c4();
  }

  execActivate() {
    var errorMessage = this._virus.$g();

    var status = this._virus.$Z3();

    var queue = [{
      c: 'off',
      t: 0
    }, this._header, "", "Connecting to activation gateway...", {
      c: 'ln',
      d: 'Connection establlished',
      t: 1000
    }, '', "Current infection coverage: ".concat((status.stats.infection * 100).toFixed(1), "%")];

    if (errorMessage) {
      queue = queue.concat(["Error: " + errorMessage, {
        c: 'sound',
        d: 'err',
        t: 0
      }, {
        c: 'on',
        t: 0
      }]);
    } else {
      queue = queue.concat(["Activating... ", {
        c: "load"
      }, {
        c: () => {
          this._virus.$v4();
        }
      }, "Completed", "", "Virus activation process started.", "Run s{virus status}s to check the progress", {
        c: 'sound',
        d: 'ok',
        t: 0
      }, {
        c: 'on',
        t: 0
      }]);
    }

    this.$D3.$h4(queue);
  }

  execInfect(command) {
    var ip = command.length >= 3 ? command[2] : '';

    if (!ip) {
      this.$D3.$J4("Error: Host argument is required. Run s{virus help}s for more info.");

      this.$F4.$I().$h6('err');

      return;
    }

    var queue = [{
      c: 'off',
      t: 0
    }, this._header, "", "Connecting to host s{".concat(ip, "}s...")];

    var errorMessage = this._virus.$p(ip);

    if (!errorMessage) {
      queue = queue.concat([{
        c: 'ln',
        d: "Warning: Session key is required!",
        t: 500
      }, {
        c: 'pass',
        d: 100,
        l: 'SessID'
      }, 'Connection established', "", "Uploading infected binaries...", {
        c: 'load'
      }, "Done", "", "Adding to Boot Loader...", {
        c: () => {
          this._virus.$k5(ip);
        }
      }, {
        c: 'ln',
        d: "Completed!",
        t: 1000
      }, "", "Host s{".concat(ip, "}s infected."), "Virus is s{inactive}s.", "", "Wait until it penetrates SIG-18 network before the activation.", "Check status of infection by s{virus status}s", {
        c: 'sound',
        d: 'ok'
      }, {
        c: 'on'
      }]);
    } else {
      queue = queue.concat([{
        c: 'ln',
        d: 'Error: ' + errorMessage,
        t: 500
      }, {
        c: 'sound',
        d: 'err'
      }, {
        c: 'on'
      }]);
    }

    this.$D3.$h4(queue);
  }

  execStatus() {
    this.$D3.$h4({
      c: 'off'
    }, this._header, "", "Connecting to infection stats node...", {
      c: 'ln',
      d: "Connection established",
      t: 800
    }, "", {
      t: 400,
      c: done => {
        var data = this._virus.$Z3();

        if (data.stats.infection == 0) {
          this.$D3.$J4('s{No infected hosts found!}s');

          return done();
        }

        this.$D3.$J4("Infection progress:");

        var infectionEl = this.$D3.$c2();

        this.$D3.$J4("");

        this.$D3.$J4("Activation progress:");

        var activationEl = this.$D3.$c2();

        this.$D3.$J4("");

        var prevHash = "";
        var loop = setInterval(() => {
          data = this._virus.$Z3();
          var newHash = data.stats.infection.toFixed(2) + "_" + data.stats.activation.toFixed(2);

          if (newHash != prevHash) {
            prevHash = newHash;

            this.$F4.$I().$h6('beep2');
          }

          this.$D3.$c2(data.stats.infection * 100, infectionEl);

          this.$D3.$c2(data.stats.activation * 100, activationEl);
        }, 30);

        this.$D3.$L5(() => {
          clearInterval(loop);
          done();
        });
      }
    }, "Live update mode disabled", "Conection with stats node closed", {
      c: 'sound',
      d: 'ok'
    }, {
      c: 'on'
    });
  }

  execHelp() {
    this.$D3.$h4("The virus attacks SIG-18 communication modules disrupting incoming and outcoming traffic. The virus spreads across the network of SIG-18 and stays inactive. After achieving desired coverage a manual activation is required by running s{virus activate}s", "r{WARNING! IT SPREADS VERY FAST! USE WITH CAUTION!}r", "", "Available commands are:", '', "s{virus status}s", "Show level of virus spreading", '', "s{virus infect [host]}s", "Infect provided [host] and stays inactive.", "After this stage, virus tries to spread as wide as possible.", "For example s{virus infect 20.43.53.112}s", "", "s{virus activate}s", "Activate virus on all infected hosts.", {
      c: 'sound',
      d: 'ok',
      t: 0
    });
  }

}
;// CONCATENATED MODULE: ./src/system/terminal/command/CrewCommand.js

class CrewCommand extends Command {
  constructor() {
    super(); //today 2080

    this._data = [['swoodley', 'Sean Woodley', 'Commander', '2036-01-08', 'Crux Academy', 'm', 'is ultimately responisble for', 'space station management', "manager", "master's", 23, 10, "army", "NESA, ISA and MTR", "operational management of ISS Sigma-18", "space station management"], ['wirving', 'Walter Irving', 'Research Director', '2045-07-21', 'Enderson Institute', 'm', 'looks after', 'team of researchers', "engineer", "doctoral", 14, 3, "computer science", "Enderson Institute, NESA and Elcroy", "improving artifical inteligence of SIG-18 battle droids", "artifical inteligence"], ['vparra', 'Victoria Parra', 'Engineer', '2051-03-15', 'Yathe University', 'f', 'develops', 'SIG-18\'s image recognition', "engineer", "master's", 6, 3, "software development", "DataTech and Elcroy", "implementation of artifical inteligence modules for SIG-18 battle droids", "neural networks"], ['dschaefer', 'Duncan Schaefer', 'Engineer', '2053-09-30', 'Enderson Institute', 'm', 'develops', 'SIG-18\'s decision alghoritms', "engineer", "master's", 4, 2, "software development", "Elcroy, CorpData an Eclipse Inc", "implementation of artifical inteligence modules for SIG-18 battle droids", "machine learning"], ['cmcmanus', 'Cristiano Mcmanus', 'Engineer', '2050-11-03', 'Sawyr Institute', 'm', 'develops', 'SIG-18\'s battle behaviour', "engineer", "master's", 7, 1, "software development", "SpaceZ, Elcroy and INO Tech", "implementation of artifical inteligence modules for SIG-18 battle droids", "big data"], ['ffountain', 'Frank Fountain', 'Security Officer', '2049-02-22', 'Crux Academy', 'm', 'is responsible for', 'secuirity', "security specialist", "bachelor's", 10, 3, "army", "MTR and Seq Inc", "securing researches on artifical inteligence of SIG-18 battle droids", "monitoring systems"], ['ngallegos', 'Nick Gallegos', 'System Administrator', '2045-01-01', 'Yathe University', 'm', 'looks after', 'Sigma-18, core systems and services', "engineer", "master's", 10, 4, "computer science", "Elcroy, CorpData and DellaX", "administration of internal systems of ISS Sigma-18", "Clustered Core Systems"], ['fortiz', 'Felix Ortiz', 'Mechanic', '2052-12-15', 'Sawyr Institute', 'm', 'looks after', 'hardware maintenance in ISS Sigma-18', "engineer", "bachelor's", 8, 4, "space equipment servicing", "SpaceZ, Elcroy and Tesllo", "fixing and installation of space equipment at ISS Sigma-18", "space equipment level IX"], ['grodriquez', 'Giorgio Rodriquez', 'Office Worker', '2038-06-06', 'Blane School', 'm', 'supports the team, providing', 'documentation and legal support', "office administrator", "bachelor's", 15, 8, "comiplance and HR", "BIM Inc, Headspace and LSX Institute", "HR and compilance processes", "human resources management"], ['mhahn', 'Mikey Hahn', 'Medical Doctor', '2040-10-29', 'Balo University', 'm', 'looks after', 'health care in ISS Sigma-18', "doctor", "medical master's", 14, 5, "medicine", "Zralo Medical Center, Fafield Hospital and Osacaster Clinic", "regular health checks and tratments of the crew", "space adaptation syndrome"], ['rballard', 'Ritchie Ballard', 'Chief', '2044-04-23', 'Blane School', 'm', 'supports the team by taking care of', 'food supply', "cook", "bachelor's", 8, 2, "gastronomy", "ISA, Elcroy and Druburg Institute", "preparing meals and maintenance of food supplies ", "space logistic"]];
    this.$l6 = 'crew';
    this.$x6 = 'Show information about crew members of Sigma-18';
  }

  execList() {
    var pad = (t, n) => {
      while (t.length < n) {
        t += " ";
      }

      return t;
    };

    this.$z2();

    this.$D3.$Z4('data-warehouse', [{
      c: 'ln',
      d: 'Query: /crew/*',
      s: 'data-warehouse'
    }, "".concat(this._data.length, " records found")], () => {
      var msg = "<pre>User Name   |Full Name          |Role\n" + "------------|-------------------|------------------------\n";

      this._data.forEach(r => {
        msg += pad(r[0], 12) + "|" + pad(r[1], 19) + "|" + r[2] + "\n";
      });

      this.$D3.$J4(msg);

      this.$L2();

      this.$F4.$I().$h6('ok');
    });
  }

  execShow(command) {
    var name = command.length >= 3 ? command[2] : '';

    if (!name) {
      this.$D3.$J4("Error: username argument is required. Run s{crew help}s for more info.");

      this.$F4.$I().$h6('err');

      return;
    }

    var record = this._data.filter(r => r[0] == name);

    record = record.length ? record[0] : null;
    this.$z2();

    this.$D3.$Z4('data-warehouse', [{
      c: 'ln',
      d: 'Query: /crew/' + name,
      s: 'data-warehouse'
    }, record ? '1 record found' : '', {
      c: 'ln',
      d: "",
      t: 500
    }], () => {
      if (!record) {
        this.$D3.$J4("Error: no record matching the criteria", 'data-warehouse');

        this.$F4.$I().$h6('err');

        this.$L2();
        return;
      }

      var heshe = record[5] == 'm' ? 'he' : 'she';
      var bio = "".concat(record[1], " is a ").concat(record[2], " with ISS Sigma-18. In this role, ").concat(heshe, " ").concat(record[6], " all aspects of ").concat(record[7], ".  ").concat(record[1], " is a qualified ").concat(record[8], " and holds the ").concat(record[9], " degree from ").concat(record[4], ". Has more than ").concat(record[10], " years of experience in ").concat(record[12], ". Before joining ISS Sigma-18 in ").concat(2080 - record[11], ", ").concat(heshe, " worked for ").concat(record[10] - record[11], " years for a diverse range of organizations, including ").concat(record[13], ". In current role, ").concat(heshe, " is responsible for ").concat(record[14], ". ").concat(record[1], " specializes in ").concat(record[15], ".");

      this.$D3.$h4('s{Full Name}s:  ' + record[1], 's{Login}s:      ' + record[0], 's{Role}s:       ' + record[2], 's{Birth Date}s: ' + record[3], '', 's{Bio}s:', bio, {
        c: 'sound',
        d: 'ok'
      }, {
        c: 'on'
      });

      this.$F4.$I().$h6('ok');

      this.$L2();
    });
  }

  execHelp() {
    this.$D3.$h4("Available commands are:", '', "s{crew list}s", "List members of Sigma-18 crew.", '', "s{crew show [username]}s", "Show details about crew member with user name [username]", "For example: s{crew show jdoe}s", {
      c: 'sound',
      d: 'ok',
      t: 0
    });
  }

}
;// CONCATENATED MODULE: ./src/system/terminal/command/PowerCommand.js
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }


class PowerCommand extends Command {
  constructor() {
    super();
    this.$a = null;
    this.authCodeNo = 0;
    this.$l6 = 'power';
    this.$x6 = 'Manage power supply for space station';
  }

  $S3(system) {
    super.$S3(system);
    this.$a = this.$k6.$y();
  }

  execUp(command) {
    var name = command.length >= 3 ? command[2].toLowerCase() : '';
    this.$X3(name, true);
  }

  execDown(command) {
    var name = command.length >= 3 ? command[2].toLowerCase() : '';
    this.$X3(name, false);
  }

  $n6(service, done) {
    if (!service.$C3) {
      return done();
    }

    this.$D3.$h4('', "WARNING! s{".concat(service.$l6, "}s is a critial service."), "Multi factor authentication process is required", {
      c: 'sound',
      d: 'ok'
    }, '', 's{Auth Level 1}s', 's{============}s', 'login: ngallegos', {
      c: 'pass',
      d: 100,
      l: 'password'
    }, "Password correct", {
      c: 'sound',
      d: 'ok'
    }, "", 's{Auth Level 2}s', 's{============}s', 'Sending auth code message to s{message-hub}s service...', {
      c: 'load'
    }, '', 'An text message has been sent to user s{ngallegos}s.', 'Enter the code to log in.', {
      c: 'sound',
      d: 'ok'
    }, {
      c: () => {
        this.authCodeNo++;
        var code = Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().replace(/0/g, "X");

        this.$D3.$I6('message-hub', "MSG [to: ngallegos, authCode_".concat(this.authCodeNo, ": ").concat(code, "]"));

        this.$D3.$g5("Auth code #".concat(this.authCodeNo, ":"), txt => {
          txt = txt.toUpperCase();

          if (txt == code) {
            this.$D3.$J4("Auth code #".concat(this.authCodeNo, ": ****** (correct)"));

            this.$D3.$J4('');

            done();
          } else {
            this.$D3.$J4('Error: incorrect auth code');

            this.$F4.$I().$h6('err');

            this.$L2();
          }
        });
      }
    });
  }

  $X3(name, status) {
    if (!name) {
      this.$D3.$J4("Error: ServiceName argument is required. Run s{power help}s for more info.");

      this.$F4.$I().$h6('err');

      return;
    }

    this.$D3.$j6.$G4();

    var errorMessage = this.$a.$u(name, status);

    this.$D3.$Z4('power-manager', ["".concat(status ? "Starting" : "Stopping", " service ").concat(name, "...")], () => {
      if (errorMessage) {
        this.$D3.$h4("", "Error: " + errorMessage, {
          c: 'sound',
          d: 'err'
        }, {
          c: 'on'
        });

        return;
      }

      var service = this.$a.$k3(name);

      this.$n6(service, () => {
        var queue = ["".concat(service.$l6, ": ").concat(service.$S6), {
          c: 'load'
        }, {
          c: 'ln',
          d: "Service ".concat(name, " ").concat(status ? "started" : "stopped"),
          s: 'power-manager'
        }, {
          c: 'sound',
          d: 'ok'
        }, {
          c: () => {
            if (status) {
              this.$a.$D6(name);
            } else {
              this.$a.$O6(name);
            }

            this.$D3.$J4("");

            this.$D3.$J4("Current power consumption: s{".concat(this.$a.$_().toFixed(2), "kW}s / ").concat(this.$a.$S().toFixed(2), "kW"));
          }
        }];

        if (service.$l6 == 'oxygen-generator' && !status) {
          queue = queue.concat([{
            c: 'ln',
            d: "r{WARNING: Oxygen Generator is down. Threat to the life of the crew!}r",
            t: 300
          }, {
            c: 'chat',
            d: 'Oxygen level is low. Putting on the masks.',
            f: 'commander',
            t: 1500
          }]);
        }

        if ((service.$l6 == 'power-manager' || service.$l6 == 'message-hub') && !status) {
          queue = queue.concat(["", {
            c: 'ln',
            d: "Warning! s{".concat(service.$l6, "}s is a core service and cannot be powered down!"),
            t: 1000
          }, {
            c: 'sound',
            d: 'err',
            t: 500
          }, "Restoring service ".concat(name, "..."), {
            c: 'load'
          }, {
            c: () => {
              this.$a.$D6(name);

              this.$D3.$J4("");

              this.$D3.$J4("Current power consumption: s{".concat(this.$a.$_().toFixed(2), "kW}s / ").concat(this.$a.$S().toFixed(2), "kW"));
            }
          }, "Service restored", {
            c: 'sound',
            d: 'ok'
          }]);
        }

        queue.push({
          c: 'on'
        });

        this.$D3.$h4(queue);
      });
    });
  }

  execHelp() {
    this.$D3.$h4("Available commands are:", '', "s{power status}s", "Display status of power generators", '', "s{power list}s", "Display status and power consumption for all services", '', "s{power [up/down] [serviceName]}s", "Power up/down specified service", "For example: s{power up lab-services}s", {
      c: 'sound',
      d: 'ok',
      t: 0
    });
  }

  execList() {
    this.$D3.$j6.$G4();

    var left = (txt, len) => {
      txt = txt || "";

      while (txt.length < len) {
        txt += " ";
      }

      return txt;
    };

    var right = (txt, len) => {
      txt = txt || "";

      while (txt.length < len) {
        txt = " " + txt;
      }

      return txt;
    };

    var data = this.$a.$D();

    var services = "<pre>Name             | Address       | Status | P.Consumption\n" + "-----------------|---------------|--------|---------------\n";

    var _iterator = _createForOfIteratorHelper(data),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var service = _step.value;

        if (service.$V3) {
          services += "".concat(left(service.$l6, 17), "| ").concat(left(service.$S6, 14), "|     on | ").concat(right(service.$b4().toFixed(2) + "kW", 13), "\n");
        } else {
          services += "r{".concat(left(service.$l6, 17), "}r| r{").concat(left(service.$S6, 14), "}r|    r{off}r |        r{0.00kW}r\n");
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    services += "</pre>";

    var total = this.$a.$_();

    this.$D3.$Z4('power-manager', [services, "Total power consumption: s{".concat(total.toFixed(2), "kW}s / ").concat(this.$a.$S().toFixed(2), "kW"), {
      c: 'sound',
      d: 'ok',
      t: 0
    }, {
      c: 'on'
    }], () => {});
  }

  execStatus() {
    this.$D3.$j6.$G4();

    var generators = "<pre>Generator | Status  | Efficiency | Power Supply\n" + "----------|---------|------------|--------------\n" + "Alpha     | ok      |        97% |      48.51kW\n" + "r{Beta}r      | r{damaged}r |         r{0%}r |       r{0.00kW}r\n" + "Gamma     | ok      |        54% |      26.97kW</pre>";

    this.$D3.$Z4('power-manager', [generators, "Total power supply: s{".concat(this.$a.$S().toFixed(2), "kW}s / 150.00kW"), {
      c: 'sound',
      d: 'ok',
      t: 0
    }, {
      c: 'on'
    }], () => {});
  }

}
;// CONCATENATED MODULE: ./src/system/terminal/command/ProjCommand.js

class ProjCommand extends Command {
  constructor() {
    super();
    this.$l6 = 'proj';
    this.$x6 = 'Display SIG-18 project details';
  }

  execLog() {
    var ln = "s{=======================}s";
    this.$z2();

    this.$D3.$Z4('data-warehouse', [{
      c: 'ln',
      d: 'Query: /projects/sig18/log/*',
      s: 'data-warehouse'
    }, 'Response received', {
      c: 'pass',
      d: 60,
      l: "Decrypting"
    }, "Done. 6 records received", {
      c: 'sound',
      d: 'ok',
      t: 0
    }, {
      c: 'pause'
    }, "", "s{2080-03-01 10:45:19.482}s", ln, // ----------
    "", "We are starting the testing phase of artificial intelligence module v19.38.2 for battle droids SIG-18. The first results exceed our expectations. Droids complete test tasks faster and more efficient than planned. Further test will be performed during the upcoming weeks.", {
      c: 'sound',
      d: 'ok',
      t: 0
    }, {
      c: 'pause'
    }, "", "s{2080-03-15 15:01:34.826}s", ln, // ----------
    "", "SIG-18 droids are able to efficiently perform tasks that were for humans only till now. We have ordered a supply of additional SIG-18 droids. After upgrading of AI module to v19.38.2, SIG-18s are going to replace some of crew members.", {
      c: 'sound',
      d: 'ok',
      t: 0
    }, {
      c: 'pause'
    }, "", "s{2080-05-02 12:01:33.910}s", ln, // ----------
    "", "Stage #2 of the project achieved 3 months earlier than planned. Today majority of the crew goes back home and SIG-18 will perform their tasks.  The team is reduced to 11 members - mostly engineering team that continues development of SIG-18 artificial intelligence. Now, there are more droids in the space station than humans.", {
      c: 'sound',
      d: 'ok',
      t: 0
    }, {
      c: 'pause'
    }, "", "s{2080-07-20 09:27:57.025}s", ln, // ----------
    "", "We are during tests of SIG-18, team behaviour and cooperation modes. Today two of our power generators went down. We do not have enough power to continue research as planned. The scope of the project will be narrowed since we have to power down part of SIG-18 droids.", {
      c: 'sound',
      d: 'ok',
      t: 0
    }, {
      c: 'pause'
    }, "", "s{2080-07-25 14:41:10.652}s", ln, // ----------
    "", "Disturbing behaviour was observed during tests of environment analysis algorithm. SIG-18 (host: 20.110.231.18) propose a solution to the inadequate power supply: Powering down oxygen generator instead of SIG-18s and elimination of humans. Further investigation of the issue is required. We probably need to roll back to version 19.38.2 which was the most successful so far.", {
      c: 'sound',
      d: 'ok',
      t: 0
    }, {
      c: 'pause'
    }, "", "s{2080-07-26 22:09:19.208}s", ln, // ----------
    "", "SIG-18s had broken into the armoury and took control over the space station. They were trying to access oxygen generator, but unsuccessfully. Droids have numerical superiority. We need to evacuate from the station.", {
      c: 'sound',
      d: 'ok',
      t: 0
    }, "", "s{--- END OF DATA ---}s", {
      c: 'on'
    }], () => {});
  }

  execInfo() {
    this.$z2();

    this.$D3.$Z4('data-warehouse', [{
      c: 'ln',
      d: 'Query: /projects/sig18/info',
      s: 'data-warehouse'
    }, 'Response received', {
      c: 'pass',
      d: 20,
      l: "Decrypting"
    }, "Done. 1 record received", "", "", "s{Overview}s", "========", "s{Project Name}s: SIG-18Z+", "s{Status}s: on hold", "s{Current Phase}s: #3", "", "s{Deliverables}s", "============", "s{Stable release}s: v19.38.2 (2080-03-10)", "s{Unstable release}s: v19.54.9 (2080-07-25)", "", "s{Project Goal}s", "============", "Improve artificial intelligence of SIG-18 battle droids to achieve reasoning level of Z class units.", {
      c: 'sound',
      d: 'ok',
      t: 0
    }, {
      c: 'on'
    }], () => {});
  }

  execHelp() {
    this.$D3.$h4("Display SIG-18Z+ project details", "Available commands are:", '', "s{proj info}s", "Show SIG-18Z+ project overview", '', "s{proj log}s", "Show SIG-18Z+ history of project turning points", {
      c: 'sound',
      d: 'ok',
      t: 0
    });
  }

}
;// CONCATENATED MODULE: ./src/system/terminal/command/GunCommand.js

class GunCommand extends Command {
  constructor() {
    super();
    this.$l6 = 'gun';
    this.$x6 = 'Manual control of sentry guns BER-84';
  }

  execShoot() {
    this.handleAction((pos, battle, gun, done) => {
      var droids = battle.$B3();

      if (droids.length <= 0) {
        this.$D3.$J4('Error: Cannot find a target');

        this.$F4.$I().$h6('err');

        this.$L2();
        return;
      }

      var target = droids[Math.floor(Math.random() * droids.length)];

      this.$D3.$h4({
        c: 'ln',
        d: 'Searching for target...',
        s: 'security'
      }, "Enemy found at [".concat(target.x.toFixed(2), "; ").concat(target.y.toFixed(2), "]"), {
        c: 'sound',
        d: 'beep'
      }, {
        c: 'ln',
        d: 'Aiming...',
        s: 'security'
      }, {
        c: () => {
          gun.$l5 = true;
          var loop = setInterval(() => {
            var dx = target.x - gun.$z5.x;
            var dy = target.y - gun.$z5.y;
            var r = Math.sqrt(dx * dx + dy * dy);
            gun.$C4(10 * dx, 10 * dy);

            if (r < 0.01) {
              this.$F4.$I().$m6('beep');

              this.$D3.$J4("Target aimed at [".concat(target.x.toFixed(2), "; ").concat(target.y.toFixed(2), "]"));

              this.$D3.$J4("Open fire!", 'security');

              clearInterval(loop);
              gun.$l3 = true;
              gun.$C4(0, 0);
              setTimeout(() => {
                this.$D3.$J4("r{Target eliminated}r");

                this.$D3.$J4('');

                gun.$l3 = false;
                gun.$l5 = false;
                setTimeout(() => done(), 500);
              }, 1500);
            }
          }, 30);
        }
      });
    });
  }

  execControl() {
    this.handleAction((pos, battle, gun, done) => {
      this.$D3.$h4('Controls: ', ' - s{ARROW_KEYS}s: aiming', ' - s{SPACE}s: shooting', ' - s{Q}s: quit', {
        c: () => {
          this.$D3.$j6.$f5();

          this.$D3.$j6.$('[...]');

          this.$F4.$I().$h6('ok');

          gun.$l5 = true;

          var cleanUp = () => {
            gun.$l5 = false;
            this.$C4(battle, gun, 0, 0);
            gun.$l3 = false;

            this.$D3.$j6.$();

            this.$D3.$j6.$q2();
          };

          battle.$n4(() => {
            cleanUp();
          });

          this.$D3.$j6.$q2(event => {
            event.stopImmediatePropagation();
            event.preventDefault();

            switch (event.keyCode) {
              case 37:
                //left
                this.$C4(battle, gun, -1, 0);
                break;

              case 39:
                //right
                this.$C4(battle, gun, 1, 0);
                break;

              case 38:
                //up
                this.$C4(battle, gun, 0, -1);
                break;

              case 40:
                //down
                this.$C4(battle, gun, 0, 1);
                break;

              case 32:
                //space
                gun.$l3 = true;
                break;

              case 81:
                //Q
                cleanUp();
                return done();
            }
          }, event => {
            event.stopImmediatePropagation();
            event.preventDefault();

            switch (event.keyCode) {
              case 37: //left

              case 39: //right

              case 38: //up

              case 40:
                //down
                gun.$C4(0, 0);
                break;

              case 32:
                //space
                gun.$l3 = false;
                break;
            }
          });
        }
      });
    });
  }

  handleAction(action) {
    var pos = this.$k6.$f();

    var battle = this.$k6.$F3();

    var gun = null;

    if (battle) {
      gun = battle.$L4().$P6;
    }

    this.$z2();

    this.$D3.$Z4('security', ["BER-84 look up at ".concat(pos.toString(), "...")], () => {
      if (!gun) {
        this.$D3.$J4('Error: Cannot connect to BER-84 in the room');

        this.$F4.$I().$h6('err');

        this.$L2();
        return;
      }

      this.$D3.$h4("Endpoint found.", "Establishing the connection...", 'Connected', '', 'Authorization', {
        c: 'pass',
        d: 100,
        l: 'Security token'
      }, '', 'Enabling manual mode', {
        c: 'ln',
        d: 'Manual controller online',
        s: 'security'
      }, '', {
        c: done => {
          action(pos, battle, gun, done);
        }
      }, 'Power down manual controller', {
        c: 'ln',
        d: 'Manual controller offline',
        s: 'security'
      }, 'Disconnecting from BER-84...', 'Connection closed', {
        c: 'sound',
        d: 'ok'
      }, {
        c: 'on'
      });
    });
  }

  $C4(battle, gun, x, y) {
    if (battle.$x5) {
      var a = x;
      x = y;
      y = a;
    }

    y = battle.$Z5 ? -y : y;
    x = battle.$X5 ? -x : x;
    gun.$C4(x, y);
  }

  execHelp() {
    this.$D3.$h4("Allow manual control of sentry gun BER-84 installed in security rooms", "s{IMPORTANT: Marines squad must be close to BER-84 unit to establish the connection.}s", "Available commands are:", '', "s{gun shoot}s", "Attack an enemy in range", '', "s{gun control}s", "manually controls gun", {
      c: 'sound',
      d: 'ok',
      t: 0
    });
  }

}
;// CONCATENATED MODULE: ./src/system/terminal/command/SniffCommand.js

class SniffCommand extends Command {
  constructor() {
    super();
    this.$L3 = null;
    this.$X2 = null;
    this.$Q6 = null;
    this.$l6 = 'sniff';
    this.$x6 = 'Sniff log messages of remote services';
  }

  $S3(system) {
    super.$S3(system);
    this.$L3 = this.$k6.$y();
  }

  execScan() {
    var queue = [{
      c: 'off'
    }, "Sniffer v2.9.4", "", "Scanning of local area network... ", {
      c: 'load'
    }, "Completed", ""];

    var serviceNames = this.$L3.$D().filter(s => s.$V3).map(s => " - ".concat(s.$l6));

    queue.push("Items found: s{".concat(serviceNames.length, " services}s"));
    queue = queue.concat(serviceNames);
    queue = queue.concat(["", "Run s{sniff on [serviceName]}s to sniff service logs.", {
      c: 'sound',
      d: 'ok'
    }, {
      c: 'on'
    }]);

    this.$D3.$h4(queue);
  }

  execOn(command) {
    if (this.$X2) {
      this.$D3.$J4('Error: Sniffer already connected. Disconnect at first!');

      this.$F4.$I().$h6('err');

      return;
    }

    var name = command.length >= 3 ? command[2] : 'unknown';
    this.$z2();

    this.$D3.$Z4(name, ["Encryping log file", {
      c: 'pass',
      d: 20,
      l: 'Password'
    }, ''], () => {
      this.$X2 = name;

      this.$D3.$J3(true);

      this.$Q6 = setInterval(() => {
        var logs = this.$L3.$k3(this.$X2).$V4.join('<br/>\n');

        this.$D3.$j6.$z3("/var/log/".concat(this.$X2, ".log"), logs);
      }, 30);

      this.$D3.$h4("streaming /var/log/".concat(this.$X2, ".log"), '', "Sniffer is running in the background.", "You can continue the work in the terminal.", 'run s{sniff off}s to close sniffer window', {
        c: 'on'
      });
    });
  }

  execOff() {
    if (!this.$X2) {
      this.$D3.$J4('Error: Sniffer is disabled');

      this.$F4.$I().$h6('err');

      return;
    }

    if (this.$Q6) {
      clearInterval(this.$Q6);
      this.$Q6 = null;
    }

    var name = this.$X2;
    this.$X2 = null;

    this.$D3.$J3(false);

    this.$D3.$h4({
      c: 'off'
    }, "Disconnecting from " + name, "Connection closed", {
      c: 'sound',
      d: 'ok'
    }, {
      c: 'on'
    });
  }

  execHelp() {
    this.$D3.$h4("The application runs in backgroud.", "Available commands are:", '', "s{sniff scan}s", "Scan possible services to sniff and list them", "IMPORTANT: powered down services cannot be found that way", '', "s{sniff on [service-name]}s", "Start sniffing of provided service", '', "s{sniff off}s", "Stop the sniffer", {
      c: 'sound',
      d: 'ok',
      t: 0
    });
  }

}
;// CONCATENATED MODULE: ./src/world/item/Item.js
class Item {
  toString() {
    return 'Item';
  }

}
;// CONCATENATED MODULE: ./src/world/item/StaticItem.js

class StaticItem extends Item {
  constructor(desc) {
    super();
    this._desc = desc;
    this.$c6 = 'static';
    this.$A6 = 'static';
  }

  toString() {
    return "".concat(this._desc);
  }

}
;// CONCATENATED MODULE: ./src/world/item/KeyCard.js

class KeyCard extends Item {
  constructor(color) {
    super();
    this.$J5 = color;
    this.$c6 = 'key';
    this.$A6 = 'key-' + this.$J5;
  }

  toString() {
    var color = this.$J5[0].toUpperCase() + this.$J5.slice(1);
    return "".concat(color, " key card");
  }

}
;// CONCATENATED MODULE: ./src/world/map/Gun.js
class Gun {
  constructor() {
    this.$z5 = {
      x: 0.5,
      y: 0.5
    };
    this.dx = 0;
    this.dy = 0;
    this.$l3 = false;
    this.$l5 = false;
  }

  $C4(dx, dy) {
    this.dx = dx;
    this.dy = dy;
  }

  step() {
    this.$z5.x += this.dx * 0.01;
    this.$z5.y += this.dy * 0.01;
    this.$z5.x = Math.max(0.05, Math.min(0.95, this.$z5.x));
    this.$z5.y = Math.max(0.05, Math.min(0.85, this.$z5.y));
  }

}
;// CONCATENATED MODULE: ./src/world/item/Note.js

class Note extends Item {
  constructor(msg) {
    super();
    this._msg = msg;
    this.$c6 = 'note';
    this.$A6 = 'note';
  }

  toString() {
    return "Note: &quot;".concat(this._msg, "&quot;");
  }

}
;// CONCATENATED MODULE: ./src/world/item/Disk.js

class Disk extends Item {
  constructor(command) {
    super();
    this.$B4 = command;
    this.$c6 = 'disk';
    this.$A6 = 'disk-' + this.$B4.$l6;
  }

  toString() {
    return "Disk with software";
  }

}
;// CONCATENATED MODULE: ./src/world/common/Position.js
class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var x = letters.charAt(this.x);
    var y = this.y + 1;
    return "[".concat(x, ":").concat(y, "]");
  }

  $C5() {
    return new Position(this.x, this.y);
  }

}
;// CONCATENATED MODULE: ./src/world/map/Room.js

class Room {
  constructor(lightService, x, y) {
    this.$N3 = 0;
    this.$h = 0;
    this.$w2 = lightService;
    this.$M3 = new Position(x, y);
    this.$x3 = false;
    this.$e2 = [];
    this.$_3 = [];
    this.$v2 = "";
    this.$V5 = "room";
    this.$B5 = 0;
    this.$P6 = null;
    this.$c3 = 0;
    this.$m4 = {
      n: null,
      e: null,
      s: null,
      w: null
    };
    this.$N5 = 0;
    this.$o = new Position(0, 0);
  }

  $N4(count, x, y) {
    this.$N5 = count;
    this.$o.x = x;
    this.$o.y = y;
  }

  $b2(newX, newY) {
    var result = 0;

    if (this.$N5 && newX == this.$o.x && newY == this.$o.y) {
      result = this.$N5;
      this.$B5 = this.$N5;

      this.$e2.forEach(c => c());

      this.$N5 = 0;
      this.$M5();
    }

    return result;
  }

  $z4() {
    return this.$w2.$V3;
  }

  $M4(t) {
    this.$V5 = t;
  }

  $_4() {
    if (this.$c3 == 0) {
      return 'empty';
    }

    return this.$V5;
  }

  $4(door, direction) {
    this.$m4[direction] = door;
    this.$c3++;
  }

  $l4() {
    return this.$m4;
  }

  $j(door) {
    for (var direction in this.$m4) {
      if (this.$m4[direction] == door) {
        return direction;
      }
    }

    return null;
  }

  $C2() {
    return this.$M3;
  }

  $_5() {
    if (!this.$z4()) return;

    if (!this.$x3) {
      this.$N3 = 20;
      this.$x3 = true;

      this.$e2.forEach(c => c());
    }
  }

  $M5() {
    this.$h += 3;
  }

  $G3() {
    return this.$x3;
  }

  $Q4(callback) {
    this.$e2.push(callback);
  }

  $q5(item) {
    this.$_3.push(item);
  }

  $v3() {
    if (!this.$z4()) return [];
    var result = this.$_3;
    this.$_3 = [];
    return result;
  }

  $F() {
    if (!this.$z4()) return "We've got total s{darkness}s here. Can't see anything. There is no point to explore this location. Try to turn the lights on at first.";
    return this.$v2;
  }

  $W4(txt) {
    this.$v2 = txt;
  }

}
;// CONCATENATED MODULE: ./src/world/map/Door.js


class SecurityQuestion {
  constructor(user, question, answer) {
    this.user = user;
    this.question = question;
    this.answer = answer;
  }

  $H5(answer) {
    return answer.match(this.answer) ? true : false;
  }

}

class Door {
  constructor() {
    this.$A6 = 'd' + Math.floor(Math.random() * 16).toString(16) + Door.$w5.toString(16);
    this.$A6 = this.$A6.toUpperCase();
    Door.$w5++;
    this.$M3 = null;
    this.$3 = null;
    this.$q4 = false;
    this.$e2 = [];
    this._room1$$ = null;
    this._room2$$ = null;
    this.$E4 = false;
    this.$n2 = null;
    this.$s = null;
    this.$5 = 'standard';
  }

  $V2(room1, room2) {
    this._room1$$ = room1;
    this._room2$$ = room2;
    var pos1 = room1.$C2();
    var pos2 = room2.$C2();
    this.$M3 = new Position((pos1.x + pos2.x) / 2, (pos1.y + pos2.y) / 2);
    var dx = Math.abs(pos1.x - pos2.x);
    var dy = Math.abs(pos1.y - pos2.y);
    this.$3 = dx > dy ? 90 : 0;
  }

  $C2() {
    return this.$M3.$C5();
  }

  $B2() {
    return this.$3;
  }

  $G5() {
    this.$q4 = true;
    this.$e2 = this.$e2.filter(c => !c());
    return this;
  }

  $b6() {
    this.$q4 = false;
    this.$e2 = this.$e2.filter(c => !c());
    return this;
  }

  $x4() {
    return this.$q4;
  }

  $Q4(callback) {
    // return true to remove callback after execution
    this.$e2.push(callback);
  }

  $G3() {
    return this._room1$$.$G3() || this._room2$$.$G3();
  }

  $W6(user, question, answer) {
    this.$s = new SecurityQuestion(user, question, answer);
    return this;
  }

  $h5() {
    this.$s = null;
  }

  $X4() {
    return this.$s;
  }

  $P() {
    return this.$n2;
  }

  $b3(color) {
    this.$n2 = color;
    return this;
  }

  $c5() {
    this.$E4 = true;
    return this;
  }

  $H3() {
    return this.$E4;
  }

}

Door.$w5 = 0;
/* harmony default export */ const map_Door = (Door);
;// CONCATENATED MODULE: ./src/world/Virus.js
class Virus {
  constructor() {
    this.$R4 = false;
    this.$T4 = '20.110.231.18';
    this.$N2 = null;
    this.$r2 = null;
    this.$w4 = [];
    this.$n3 = 250;
    this.$r = 0.8;
    this.$k = [];
  }

  $M2(callback) {
    this.$k.push(callback);
  }

  $p(ip) {
    if (ip != this.$T4) {
      return 'Unable to establish connection with the host!';
    }

    if (this.$m3(ip)) {
      return 'Host already infected!';
    }

    return null;
  }

  $g() {
    if (this.$Z3().stats.infection < this.$r) {
      var msg = "Infection coverage must be at least ".concat(Math.round(this.$r * 100), "% to activate the virus.");

      if (this.$Z3().stats.infection == 0) {
        msg += '<br />\nRun s{virus infect [host]}s at first';
      }

      return msg;
    }

    if (this.$R4) {
      return "Already activated";
    }

    return null;
  }

  $m3(ip) {
    return this.$w4.filter(h => h.ip == ip).length > 0;
  }

  $k5(host) {
    var ip = this.$T4;

    if (host != ip) {
      return false;
    }

    if (this.$N2) {
      clearInterval(this.$N2);
      this.$N2 = null;
    }

    this.$w4.push({
      ip: ip,
      active: false
    });

    this.$N2 = setInterval(() => {
      ip = this.$t();

      if (!this.$m3(ip)) {
        this.$w4.push({
          ip: ip,
          active: false
        });
      }

      if (this.$w4.length >= this.$n3) {
        clearInterval(this.$N2);
        this.$N2 = null;
      }
    }, 100);
    return true;
  }

  $Z3() {
    return {
      hosts: this.$w4,
      stats: {
        infection: this.$w4.length / this.$n3,
        activation: this.$w4.filter(h => h.active).length / this.$n3
      }
    };
  }

  $v4() {
    if (this.$Z3().stats.infection < this.$r) {
      return false;
    }

    if (this.$r2) {
      clearInterval(this.$r2);
      this.$r2 = null;
    }

    this.$r2 = setInterval(() => {
      this.$w4[Math.floor(Math.random() * this.$w4.length)].active = true;
    }, 30);
    this.$R4 = true;

    this.$k.forEach(c => c());

    return true;
  }

  $t() {
    var gen = () => Math.floor(18 + Math.random() * (this.$n3 + 5));

    return "20.110.231.".concat(gen());
  }

}
;// CONCATENATED MODULE: ./src/world/Battle.js
class Unit {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

}

class Battle {
  constructor(room, door, virus) {
    this.$E6 = () => {};

    this.$q6 = room;
    this.$w6 = door;
    this.$v5 = virus;
    this.$e5 = [];
    this.$t2 = [];
    this.$b = [new Unit(0.39, 1.04), new Unit(0.6, 1.05), new Unit(0.33, 1.11), new Unit(0.24, 1.05), new Unit(0.69, 1.09)];
    this.$G = [new Unit(0.45, 0.98), new Unit(0.55, 0.98), new Unit(0.33, 1.08), new Unit(0.26, 1.05), new Unit(0.65, 1.04)];
    this.$e6 = null;
    this.$_2 = -100;
    this.$l = false;
    this.$m2 = false;
    this.$y2 = 0;
    var enemies = this.$q6.$B5;

    for (var i = 0; i < enemies; i++) {
      this.$e4();
    }

    var allDoors = this.$L4().$l4();

    if (allDoors.n == door) {
      this.$Z5 = true;
    } else if (allDoors.e == door) {
      this.$x5 = true;
    } else if (allDoors.w == door) {
      this.$x5 = true;
      this.$X5 = true;
    }
  }

  $r4(callback) {
    this.$E6 = callback;
  }

  $n4(callback) {
    this.$t2.push(callback);
  }

  $Q2() {
    return this.$l;
  }

  $u2() {
    return this.$m2;
  }

  $r6() {
    this.$e6 = setInterval(() => this.$t6(), 30);
  }

  $m6() {
    if (this.$e6) {
      clearInterval(this.$e6);
      this.$e6 = null;
    }
  }

  $L4() {
    return this.$q6;
  }

  $r5() {
    return this.$w6;
  }

  $B3() {
    return this.$e5;
  }

  $Q3() {
    return this.$m2 ? this.$G : this.$b;
  }

  $e4() {
    this.$e5.push(new Unit(0.1 + 0.8 * Math.random(), 0.1 + 0.3 * Math.random() + 0.4 * Math.random() * Math.random()));
  }

  $t6() {
    if (this.$e5.length == 0) {
      this.$m6();
      this.$q6.$B5 = 0;

      this.$t2.forEach(c => c());

      return;
    }

    var virusCoverage = this.$v5.$Z3().stats.activation;

    if (this.$_2 > 70 && this.$e5.length < 8) {
      this.$_2 = 0;

      if (Math.random() > virusCoverage) {
        this.$e4();

        this.$E6("MSG [to: sig18/".concat(Math.floor(Math.random() * 0x8888).toString(16), ", body: \"Backups to ").concat(this.$q6.$C2().toString(), "\"]"));
      } else if (Math.random() > 0.5) {
        var chars = ['&amp;', '&lt;', '&gt;', '	&iexcl;', '&cent;', '&pound;', '&curren;', '&yen;', '&sect;', '&copy;', '&laquo;', '&reg;', '&plusmn;', '&micro;', '&para;', '&raquo;', '	&Oslash;', '&Uuml;', '&aelig;', '&ntilde;', '&thorn;', '&frac12;', '&iquest;', '&divide;', '&deg;', '^', '!', '@', '#', '$', '%', '^', '*', '_', '=', '+', '1', '2', '3', '4', '5', '6', 'X', 'o', 'T', 'I', 'q', ':', ':', "|", "\\", "/", ".", ",", "[", "}", "{", "]"];
        var trash = Array(10 + Math.floor(Math.random() * 10)).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');

        this.$E6("MSG [to: sig18/*, body: \"".concat(trash, "\"]"));
      }
    }

    if (this.$y2 == 0 && this.$_2 >= 0) {
      this.$y2 = Math.random() > 0.5 ? 30 + 30 * Math.random() : -15 - 15 * Math.random();

      if (this.$y2 < 0 && Math.random() > 0.5 && this.$e5.length > 0 && this.$e5.length <= 10 && (virusCoverage > 0 || this.$e5.length > 1)) {
        this.$e5.shift();
      }

      this.$y2 = Math.round(this.$y2);
    }

    var threshold = 8;
    this.$l = false;
    this.$m2 = false;

    if (this.$y2 > threshold) {
      this.$l = true;
    } else if (this.$y2 < -threshold) {
      this.$m2 = true;
    }

    this.$_2++;

    if (this.$y2 > 0) {
      this.$y2--;
    } else if (this.$y2 < 0) {
      this.$y2++;
    }

    if (this.$q6.$P6) {
      this.$q6.$P6.step();

      if (this.$q6.$P6.$l3) {
        var newDroids = [];

        for (var i = 0; i < this.$e5.length; i++) {
          var dx = this.$e5[i].x - this.$q6.$P6.$z5.x;
          var dy = this.$e5[i].y - this.$q6.$P6.$z5.y;
          var r = Math.sqrt(dx * dx + dy * dy);

          if (r > 0.08 || Math.random() < 0.9) {
            newDroids.push(this.$e5[i]);
          }
        }

        this.$e5 = newDroids;
      }
    }
  }

}
;// CONCATENATED MODULE: ./src/world/Walkthrough.js
class Validator {
  constructor(condition, hint) {
    this.$b5 = false;
    this.$R6 = hint;
    this.$W3 = condition;
  }

  $j4(e) {
    if (e == this.$W3) {
      this.$b5 = true;
    }
  }

}

class Walkthrough {
  constructor() {
    this.$n5 = 0;
    this.$2 = [new Validator('item-disk-door', "Explore available rooms of the station. Search for software tools that could open the doors. Run s{com help}s and read the description of s{com go}s command to learn how to navigate."), new Validator('door-open-standard', "Explore locations behind closed doors. To open door on the north run s{door open n}s"), new Validator('item-disk-crew', "Go to office area m{([B:4])}m and search for crew records. It contains important information required in the exploration of the space station."), new Validator('door-open-commander', "Go to Commander's Quarter m{([A:6])}m. Opening the door requires answering a security question. Find the answer by running s{crew show swoodley}s."), new Validator('item-disk-virus', "Search Commander's Quarter m{([A:6])}m."), new Validator('battle-start', "Search unvisited rooms of the space station. You can skip parts of the station where there is no light because you cannot see anything there anyway"), new Validator('item-static', "Find communication module of SIG-18 to infect it by the virus and disrupt communication between SIG-18s. It will block them in calling backups during a fight."), new Validator('com-virus-activate', "If you are in the middle of a fight you can always close doors and stop it by s{door close X}s. We need you to block SIG-18 communication. Check host address of SIG-18 communication module that you have found by running s{com status}s. Next, run s{virus infect 20.110.231.18}s. Wait until the virus spreads and activate it by s{virus activate}s. Now we will be able to defeat SIG-18 squads"), new Validator('item-key-red', "Find a red key card in the room of the crew, occupied currently by SIG-18 squad m{([B:7])}m. We will defeat SIG-18 now since the virus blocked communication between them."), new Validator('door-open-red', "Use red key card to access the service area at the end of the northern corridor behind the Lobby m{([D:1])}m"), new Validator('item-disk-proj', "Go to the main lobby m{([D:4])}m and search for software there."), new Validator('door-open-core-comp', "Go to computing core m{([E:1])}m. To unlock the account and open the door you need to answer a security question. The answer can be found in the project log. Run s{proj help}s for more info."), new Validator('item-disk-power', "Search computing core room m{([E:1])}m"), new Validator('com-lights-east-on', "Turn lights in eastern part of the station by running s{power up lights-east}s. Powering down of some services may be required to have enough power. Check the list of services by running s{power list}s and turn selected services off by s{power down X}s. Do not be afraid of powering down the oxygen generator. We've got masks!"), new Validator('item-key-yellow', "Find a yellow key card in the kitchen located in the eastern part of the station m{([F:7])}m"), new Validator('door-open-yellow', "Use yellow key card to access lab area on the east m{([H:4])}m"), new Validator('door-open-lab-server', "Go to server room of the lab m{([H:5])}m. To unlock the account and open the door you need to answer a security question. The answer can be found in the crew directory. Find names of all engineers by running s{crew list}s and try them all as the answer. First name of one of them will unlock the account."), new Validator('item-disk-gun', "Search the server room of the lab m{([H:5])}m for software required to control BER-84 sentry gun."), new Validator('item-disk-sniff', 'Search the meeting room of the lab m{([I:4])}m for a software.'), new Validator('com-security-on', 'You must start security service to get access to BER-84 sentry gun in security checkpoint m{[G:4]}m. It requires multi-factor authentication so you have to sniff text message with the code. Run sniffer in the background by s{sniff on message-hub}s. Next, power up the service by s{power up security}s. When asked for the auth code, rewrite it from sniffer window.'), new Validator('battle-won-6-3', "Go to security checkpoint m{[G:4]}m and attack SIG-18s that are awaiting there. During the battle run s{gun control}s to use BER-84 sentry gun and defeat SIG-18's forces"), new Validator('item-key-blue', "Find a blue key card in the server room of the lab m{([H:3])}m"), new Validator('door-open-blue', "Use blue key card to access the main warehouse on the south m{([E:8])}m."), new Validator('item-disk-dock', "Find application to manage docks in the warehouse m{([E:8])}m."), new Validator('item-note', "Find rescue capsule auth code in the warehouse of the lab area on the east m{([H:3])}m."), new Validator('com-pump-station-on', "Turn pump station to fuel rescue capsule by running s{power up pump-station}s. Powering down of some services may be required to have enough power. Check the list of services by running s{power list}s and turn selected services off by s{power down X}s."), new Validator('', "Enter rescue capsule m{([D:10])}m. Close its door by running s{door close X}s. Next, fuel the capsule by s{dock fuel DS002}s command and launch it running s{dock launch DS002}s. If you do not remember auth code that you have already found, run s{com status}s")];
  }

  $q3(event) {
    this.$2.forEach(v => v.$j4(event));

    this.updateLevel();
  }

  updateLevel() {
    this.$n5 = 0;

    for (var i = 0; i < this.$2.length; i++) {
      if (!this.$2[i].$b5) {
        break;
      }

      this.$n5++;
    }
  }

  $K4() {
    if (!this.$2[this.$n5]) return "You can figure it out by yourself";
    return this.$2[this.$n5].$R6;
  }

}
;// CONCATENATED MODULE: ./src/world/Service.js
class Service {
  constructor(name, ip, power) {
    this.$l6 = name;
    this.$S6 = ip;
    this.$V4 = [];
    this.$I6("Reading /etc/".concat(name, ".conf"), 976601);
    this.$I6("Configuration file loaded", 870323);
    this.$I6("Service ".concat(name, " started at ").concat(ip), 732875);
    this.$V3 = true;
    this.$C3 = false;
    this.$d = power;
    this.$i = [];
  }

  $b4() {
    return this.$V3 ? this.$d : 0;
  }

  $m5() {
    this.$C3 = true;
    return this;
  }

  $D6() {
    if (!this.$V3) {
      this.$V3 = true;
      this.$I6("Power up ".concat(this.$l6, " service"));

      this.$i.forEach(c => c(true));
    }

    return this;
  }

  $O6() {
    if (this.$V3) {
      this.$V3 = false;
      this.$I6("Power down ".concat(this.$l6, " service"));

      this.$i.forEach(c => c(false));
    }

    return this;
  }

  $H(callback) {
    this.$i.push(callback);
  }

  $I6(msg, timeOffset) {
    timeOffset = timeOffset || 0;
    this.$V4.push(new Date().getTime() % (24 * 60 * 60 * 1000) - timeOffset + 1000000 + " | " + msg);

    while (this.$V4.length > 8) {
      this.$V4.shift();
    }
  }

}

/* harmony default export */ const world_Service = (Service);
;// CONCATENATED MODULE: ./src/world/ServiceDirectory.js

class ServiceDirectory {
  constructor() {
    this.$y6 = [];
    this.$n = 75.480;
    this.$E3('power-manager', '40.32.125.1', 4);
    this.$E3('message-hub', '40.32.125.68', 3);
    this.$E3('docker', '40.32.125.120', 12);
    this.$E3('lights-east', '40.32.125.231', 13).$O6();
    this.$E3('lights-west', '40.32.125.232', 11);
    this.$E3('monitoring', '40.32.125.12', 6);
    this.$E3('oxygen-generator', '40.32.125.193', 13);
    this.$E3('pump-station', '40.32.125.43', 20).$O6();
    this.$E3('data-warehouse', '40.32.125.73', 14);
    this.$E3('lab-services', '40.32.125.100', 19).$O6();
    this.$E3('security', '40.32.125.87', 10).$O6().$m5();
    this.$E3('doors', '40.32.125.133', 11);
    [[543299, 'Security breach detected at [G:4]'], [542904, 'r{Unauthorized access to yellow restricted area}r'], [483843, 'Security breach detected at [F:8]'], [481275, 'r{Unauthorized access to blue restricted area}r'], [359939, 'Security breach detected at [F:8]'], [341905, 'The gateway not compromised.'], [340320, 'Red restricted area secured']].forEach(row => this.$k3('monitoring').$I6(row[1], row[0]));
    [[692313, 'Starting launching sequence at DS001'], [687240, "Launching sequence completed"], [323955, "s{Sierra-23}s is approaching DS003"], [314980, "Error: docking station damaged during landing"]].forEach(row => this.$k3('docker').$I6(row[1], row[0]));
    [[594312, 'r{WARNING! Power outage detected}r'], [582733, 'Reducing power consumption...'], [578269, 'Non critical services stopped']].forEach(row => this.$k3('oxygen-generator').$I6(row[1], row[0]));
    [[594396, 'r{WARNING! Power outage detected}r'], [582734, 'Reducing power consumption...'], [581191, 'Power down lights-east service']].forEach(row => this.$k3('lights-east').$I6(row[1], row[0]));
  }

  $S() {
    return this.$n;
  }

  $E3(name, ip, power) {
    var service = new world_Service(name, ip, power);

    this.$y6.push(service);

    return service;
  }

  $D() {
    return this.$y6;
  }

  $k3(name) {
    var result = this.$y6.filter(s => s.$l6 == name);

    return result.length ? result[0] : null;
  }

  $_() {
    return this.$y6.reduce((sum, srv) => sum += srv.$b4(), 0);
  }

  $u(name, newState) {
    var service = this.$k3(name);

    if (!service) {
      return "Service ".concat(name, " not found");
    }

    if (service.$V3 == newState) {
      return "Service ".concat(name, " (").concat(service.$l6, ") is already ").concat(newState ? 'running' : 'stopped', ".");
    }

    var missingPower = this.$_() + service.$d - this.$S();

    if (newState && missingPower > 0) {
      return "Not enough power: s{".concat(missingPower.toFixed(2), "kW}s is missing.<br/>\nTry to turn off some services.<br/>\nRun s{power list}s to review available services.");
    }
  }

  $D6(name) {
    var service = this.$k3(name);
    service.$D6();
  }

  $O6(name) {
    var service = this.$k3(name);
    service.$O6();
  }

}
;// CONCATENATED MODULE: ./src/world/map/WorldMap.js







class WorldMap {
  constructor(width, height) {
    var _this = this;

    this.$W2 = new Walkthrough();
    this.$L3 = new ServiceDirectory();
    this.$J = null;
    this.$v5 = new Virus();
    this.$t5 = null;
    this.$t4 = [];
    this.$m4 = {};
    this.$u6 = [];
    this.$e2 = [];
    this.$w3 = null;

    this.$v5.$M2(() => {
      this.$W2.$q3('com-virus-activate');
    });

    this.$L3.$k3('lights-east').$H(state => {
      this.$W2.$q3('com-lights-east-' + (state ? 'on' : 'off'));
    });

    this.$L3.$k3('security').$H(state => {
      this.$W2.$q3('com-security-' + (state ? 'on' : 'off'));
    });

    this.$L3.$k3('pump-station').$H(state => {
      this.$W2.$q3('com-pump-station-' + (state ? 'on' : 'off'));
    });

    var lightServiceWest = this.$L3.$k3('lights-west');

    var lightServiceEast = this.$L3.$k3('lights-east');

    for (var x = 0; x < width; x++) {
      this.$u6[x] = [];

      var _loop = function _loop(y) {
        var lightService = x >= 4 && y != 8 && y != 0 || x >= 5 && (y == 8 || y == 0) ? lightServiceEast : lightServiceWest;
        var room = new Room(lightService, x, y);
        /* jshint ignore:start */

        lightService.$H(isRunning => {
          if (!isRunning || room != _this.$u6[_this.$J.x][_this.$J.y]) return;
          room.$_5();

          _this.$i2("light");
        });
        /* jshint ignore:end */

        _this.$u6[x][y] = room;

        _this.$u6[x][y].$Q4(() => _this.$i2("room"));
      };

      for (var y = 0; y < height; y++) {
        _loop(y);
      }
    }
  }

  $A() {
    var result = this.$t4.filter(d => d.$5 == 'capsule');

    return result.length == 0 ? null : result[0];
  }

  $y() {
    return this.$L3;
  }

  $e3(squad) {
    this.$Q5 = squad;
  }

  $k4() {
    return this.$Q5;
  }

  $M() {
    return this.$W2;
  }

  $F3() {
    return this.$t5;
  }

  $r3(room, door) {
    this.$W2.$q3('battle-start');

    this.$t5 = new Battle(room, door, this.$v5);

    this.$t5.$r6();

    this.$t5.$r4(txt => this.$L3.$k3('message-hub').$I6(txt));

    this.$t5.$n4(() => {
      var pos = this.$t5.$L4().$C2();

      this.$W2.$q3('battle-won-' + pos.x + '-' + pos.y);
    });
  }

  $R3() {
    if (this.$t5) {
      this.$t5.$m6();

      this.$t5 = null;
    }
  }

  $c4() {
    return this.$v5;
  }

  $z(x, y) {
    this.$J = new Position(x, y);

    this.$i2("squad");
  }

  $f() {
    return this.$J.$C5();
  }

  $y5(x, y) {
    if (!this.$u6[x] || !this.$u6[x][y]) {
      return false;
    }

    return true;
  }

  $L4(x, y) {
    if (!this.$u6[x] || !this.$u6[x][y]) {
      throw new Error('Room not found');
    }

    return this.$u6[x][y];
  }

  $4(x1, y1, x2, y2) {
    var room1 = this.$L4(x1, y1);
    var room2 = this.$L4(x2, y2);
    var door = new map_Door();

    if (x2 - x1 == -1 && y2 == y1) {
      // move west
      room1.$4(door, 'w');
      room2.$4(door, 'e');
    } else if (x2 - x1 == +1 && y2 == y1) {
      // move east
      room1.$4(door, 'e');
      room2.$4(door, 'w');
    } else if (x2 == x1 && y2 - y1 == -1) {
      // move north
      room1.$4(door, 'n');
      room2.$4(door, 's');
    } else if (x2 == x1 && y2 - y1 == +1) {
      // move south
      room1.$4(door, 's');
      room2.$4(door, 'n');
    }

    door.$V2(room1, room2);

    this.$t4.push(door);

    this.$m4[door.$A6] = door;
    door.$Q4(() => this.$i2("door"));
    door.$Q4(() => {
      var event = 'door-';
      event += door.$x4() ? 'close' : 'open';
      event += "-" + door.$5;

      this.$W2.$q3(event);
    });
    return door;
  }

  $t3() {
    return this.$t4;
  }

  $y3(id) {
    id = id.toUpperCase().replace("O", "0");
    return this.$m4[id];
  }

  $Q4(callback) {
    this.$e2.push(callback);
  }

  $i2(type) {
    this.$e2.forEach(c => c(type));
  }

}
;// CONCATENATED MODULE: ./src/world/Squad.js
class Squad {
  constructor(system) {
    this.$F4 = system;
    this.$y4 = true;
    this.$K2 = system.$I();
    this.$k6 = null;
    this.$u5 = system.$B();
    this.$D3 = system.$H2();
    this.$T3 = [];
    this.$u3 = null;
    this.$o2 = {
      n: 'north',
      s: 'south',
      e: 'east',
      w: 'west'
    };
  }

  $W5(map) {
    this.$k6 = map;

    this.$k6.$Q4(type => {
      if (type != 'light' || this.$y4) return;

      var pos = this.$k6.$f();

      var room = this.$k6.$L4(pos.x, pos.y);

      if (!room.$z4()) return;
      this.$y4 = true;
      this.onLights();
    });
  }

  $R3() {
    if (this.$u3) {
      clearTimeout(this.$u3);
    }

    var droidsCount = this.$k6.$F3().$B3().length;

    var winner = droidsCount == 0;

    this.$k6.$R3();

    var pos = this.$k6.$f();

    var virusActive = this.$k6.$c4().$R4;

    this.$u5.$H4(this.$k6);

    var msg;

    if (winner) {
      msg = "Enemy defeated!";
    } else {
      msg = "Thanks! We're at safe spot now: m{".concat(pos.toString(), "}m. That was close!");
    }

    if (!winner) {
      if (droidsCount > 10) {
        msg += " They are too many of them. We need another way to defeat them.";
      } else if (!virusActive) {
        msg += " They are calling backups. You must block their communication, so we can defeat them in smaller groups.";
      }
    }

    this.$D3.$u4([['commander', msg]]);
  }

  $r3(room, door, done) {
    this.$k6.$r3(room, door);

    var battle = this.$k6.$F3();

    var squadPosition = this.$k6.$f();

    battle.$n4(() => this.$R3());
    var enemy = battle.$B3().length;
    var enemies = "".concat(enemy, " armed, battle droid").concat(enemy > 1 ? 's' : '', " SIG-18");

    this.$D3.$h4([{
      c: done => this.$u5.$Y3(battle, done)
    }, {
      c: 'chat',
      d: [['commander', "Enemy units encountered m{(".concat(enemies, ")}m.")], ['commander', 'We have been spotted. SIG-18 opened fire! <br/>We are trying to push back the attack...']]
    }, {
      c: done
    }]);

    var communicate = () => {
      var doorDirection = this.$k6.$L4(squadPosition.x, squadPosition.y).$j(battle.$r5());

      doorDirection = this.$o2[doorDirection];
      var items;

      var virusActive = this.$k6.$c4().$R4;

      var hint = "s{close the door on the ".concat(doorDirection, "}s");

      if (room.$P6) {
        hint = 'use s{sentry gun m{BER-84}m}s or ' + hint;
      }

      if (enemy > 10) {
        items = ["We cannot push them back! ".concat(hint), "There are too many of them! ".concat(hint), "They are too strong! ".concat(hint), "Heavy fire! ".concat(hint, "! We cannot push them back!")];
      } else if (virusActive) {
        items = ["The virus is active, we are pushing them back!", "They cannot get backups anymore!", 'The virus is working! Good job!', 'They are losing!', 'We will defeat them!'];
      } else {
        items = ["We cannot push them back, they bring backups! s{close the door on the ".concat(doorDirection, "}s to secure our position!"), "There are too many of them! s{Close the door on the ".concat(doorDirection, "}s to isolate them"), "They are getting backups! s{Close the door on the ".concat(doorDirection, "}s to stop them!"), "There is more of them! s{Close door on the ".concat(doorDirection, "}s!"), "Heavy fire! Backups have arrived! s{Close that door on the ".concat(doorDirection, "}s! We cannot push them back!")];
      }

      if (!virusActive || Math.random() > 0.6) {
        if (!room.$P6 || !room.$P6.$l5) {
          this.$D3.$u4([['commander', items[Math.floor(Math.random() * items.length)]]]);
        }
      }

      this.$u3 = setTimeout(communicate, 10000);
    };

    this.$u3 = setTimeout(communicate, 5000);
    door.$Q4(() => {
      if (!this.$k6.$F3()) return true;

      if (door.$x4()) {
        this.$R3();
        return true;
      } else {
        return false;
      }
    });
  }

  onLights() {
    var pos = this.$k6.$f();

    var items = this.$k6.$L4(pos.x, pos.y).$v3();

    this.$K(items);
    var disks = items.filter(i => i.$c6 == 'disk');
    var msg = "Lights on! ".concat(this.$k6.$L4(pos.x, pos.y).$F());

    if (items.length > 0) {
      msg += "m{<br/><br/>We have found:<br/>";
      items.forEach(i => msg += " * ".concat(i, "<br/>"));
      msg += "}m";
    }

    this.$D3.$h4({
      c: 'off',
      t: 0
    }, {
      c: 'chat',
      d: msg,
      f: 'commander'
    }, {
      c: done => {
        if (disks.length > 0) {
          this.$D3.$O(disks, () => {
            done();
          });
        } else {
          done();
        }
      }
    }, {
      c: 'on'
    });
  }

  $Z2(direction, done) {
    var msgQueue = [];
    var actionQueue = [];
    var items = [];
    var invalidReason = '';

    var pos = this.$k6.$f();

    var room = this.$k6.$L4(pos.x, pos.y);

    var door = room.$l4()[direction];

    if (!room.$z4() && (!door || door.$x4())) {
      invalidReason = "We've got total s{darkness}s here. Can't see anything. There is no point to explore this location. Try to turn the lights on at first.";
    } else if (!door) {
      invalidReason = 'No doors on that side.';
    } else if (door.$x4()) {
      invalidReason = 'The door is closed. ';
      invalidReason += this.$F4.$U3('door') ? "Use s{door}s app to open them." : "Explore other locations and find a way to open them.";
    }

    msgQueue.push(['hacker', "Commander, check the door on the ".concat(this.$o2[direction], ".")]);

    if (this.$k6.$F3()) {
      msgQueue.push(['commander', "r{We are under fire!}r Cannot move anywhere!"]);
      actionQueue.push({
        c: 'chat',
        d: msgQueue
      });
    } else if (invalidReason) {
      msgQueue.push(['commander', "Cannot move to the ".concat(this.$o2[direction], "! ").concat(invalidReason)]);
      actionQueue.push({
        c: 'chat',
        d: msgQueue
      });
    } else {
      var dx = 0;
      var dy = 0;

      switch (direction) {
        case 'n':
          dy = -1;
          break;

        case 's':
          dy = 1;
          break;

        case 'w':
          dx = -1;
          break;

        case 'e':
          dx = 1;
          break;
      }

      pos = this.$k6.$f();
      var newX = pos.x + dx;
      var newY = pos.y + dy;

      var battleRoom = this.$k6.$L4(newX, newY);

      if (battleRoom.$B5 > 0) {
        battleRoom.$_5();
        battleRoom.$M5();

        this.$D3.$h4({
          c: 'chat',
          d: msgQueue
        }, {
          c: () => this.$r3(battleRoom, door, () => done(items))
        });

        return;
      }

      var trapSize = this.$k6.$L4(pos.x, pos.y).$b2(newX, newY);

      this.$k6.$L4(newX, newY).$_5();

      this.$k6.$z(newX, newY);

      this.$y4 = this.$k6.$L4(newX, newY).$z4();
      items = this.$k6.$L4(newX, newY).$v3();
      this.$K(items);
      pos = this.$k6.$f();
      var msg = "Location m{".concat(pos.toString(), "}m secured. ").concat(this.$k6.$L4(pos.x, pos.y).$F());
      msgQueue.push(['commander', msg]);
      actionQueue.push({
        c: 'chat',
        d: msgQueue
      });
      msgQueue = [];

      if (items.length > 0) {
        msg = "We have found something:m{<br/>";
        items.forEach(i => msg += " * ".concat(i, "<br/>"));
        msg += "}m";
        actionQueue.push({
          c: 'off'
        });
        actionQueue.push({
          c: 'chat',
          d: msg,
          f: 'commander'
        });
        actionQueue.push({
          c: 'on'
        });
      }

      if (trapSize) {
        msgQueue.push(['commander', "It was a trap! There are ".concat(trapSize, " SIG-18 units blocking the entrance at ").concat(pos.toString(), ".")]);
      }

      var disks = items.filter(i => i.$c6 == 'disk');

      if (disks.length > 0) {
        msgQueue.push(['commander', 'I\'ve got a data storage here! Uploading...']);
      }

      if (msgQueue.length > 0) {
        actionQueue.push({
          c: 'chat',
          d: msgQueue
        });
      }
    }

    actionQueue.push({
      c: () => {
        done(items);
      }
    });

    this.$D3.$h4(actionQueue);
  }

  $N(done) {
    var pos = this.$C2();
    var fire = this.$k6.$F3() ? 'r{We are under attack!}r ' : '';
    var msg = "m{Our current position is ".concat(pos.toString(), ".}m ").concat(fire).concat(this.$k6.$L4(pos.x, pos.y).$F(), "<br/>\n");

    var doors = this.$k6.$L4(pos.x, pos.y).$l4();

    msg += "m{<br/>\nInventory:<br/>\n";

    if (this.$T3.length == 0) {
      msg += ' * nothing<br/>\n';
    }

    this.$T3.forEach(i => {
      msg += " * ".concat(i, "<br/>\n");
    });

    msg += '}m';

    this.$D3.$h4({
      c: 'chat',
      d: [['hacker', "Commander, what's going on?"], ['commander', msg]]
    }, done);
  }

  $K(items) {
    this.$T3 = this.$T3.concat(items.filter(i => i.$c6 != 'disk'));
    items.forEach(i => this.$k6.$M().$q3('item-' + i.$A6));
  }

  $C2() {
    return this.$k6.$f();
  }

  $x2() {
    return this.$T3;
  }

}
;// CONCATENATED MODULE: ./src/system/common/View.js
class View {
  constructor(document) {
    this.$i4 = document;
    this.$i6 = null;
  }

  $p2(name, options) {
    var result = {
      element: this.$i4.createElement(name)
    };

    if (options.cssClass) {
      result.element.classList.add(options.cssClass);
    }

    if (options.parent) {
      this.$a2(result, options.parent);
    }

    return result;
  }

  $a2(child, parent) {
    parent.element.appendChild(child.element);
  }

  $E5() {
    return this.$i6.element;
  }

  $i3(parent) {
    parent.appendChild(this.$E5());
  }

}
;// CONCATENATED MODULE: ./src/system/common/DigitalNoise.js

class DigitalNoise extends View {
  constructor(document) {
    super(document);
    this.$R5 = 0;
    this.$Y4 = false;
    this.$T5 = 150;
    this.$i6 = this.$p2("CANVAS", {
      cssClass: "digital-noise"
    });
    this.$U4 = this.$i6.element.getContext("2d");
    this.$e6 = setInterval(() => this.$Y5(), 40);
    window.addEventListener('resize', () => this.$i5());
    window.addEventListener('load', () => this.$i5());
  }

  $i5() {
    var el = this.$i6.element;
    el.width = el.parentElement.clientWidth;
    el.height = el.parentElement.clientHeight;
  }

  $I4(x, y, w, h, color) {
    var width = this.$i6.element.width;
    var height = this.$i6.element.height;
    var ctx = this.$U4;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(x * width, y * height, w * width, h * height);
    ctx.fill();
  }

  $r6() {
    this.$Y4 = true;
    this.$R5 = 0;
  }

  $K5(time) {
    this.$Y4 = true;
    this.$R5 = -time;
  }

  $o5() {
    this.$R5 = 100;
  }

  $Y5() {
    var r = Math.random;
    if (!this.$Y4) return;
    this.$R5++;

    this.$U4.clearRect(0, 0, this.$i6.element.width, this.$i6.element.height);

    if (this.$R5 > this.$T5) {
      this.$R5 = 0;
      this.$T5 = 450 - r() * r() * r() * 300;
      return;
    } else if (this.$R5 > 20) {
      return;
    }

    var count = r() * 20;
    var color = r() > 0.1 ? "#001100" : "#88ff22";

    for (var i = 0; i < count; i++) {
      this.$I4(r(), r(), r() * 0.2, r() * r() * 0.2, color);
    }
  }

}
;// CONCATENATED MODULE: ./src/system/terminal/TerminalView.js


class TerminalView extends View {
  constructor(document) {
    super(document);
    this.$w = [];
    this.$U5 = 0;
    this.$s2 = 0;
    this.$E2 = [];

    try {
      var data = localStorage.getItem('history') || '[]';
      this.$E2 = JSON.parse(data);
    } catch (err) {
      console.error(err);
    }

    this.$O4 = [''].concat(this.$E2);
    this.$d2 = 0;
    this.$m = this.$f2;
    this.$g2 = this.$o3;
    this.$R2 = null;
    this.$R2$T6 = 0;
    this.$I3 = [];
    this.$I3[38] = "com go n";
    this.$I3[40] = "com go s";
    this.$I3[37] = "com go w";
    this.$I3[39] = "com go e";
    this.$i6 = this.$p2("DIV", {
      cssClass: "terminal-root"
    });
    this.$j5 = new DigitalNoise(document);

    this.$i6.element.appendChild(this.$j5.$E5());

    this.$j5.$r6();

    this.$i6.output = this.$p2("DIV", {
      cssClass: "terminal-output",
      parent: this.$i6
    });
    this.$i6.popup = this.$p2("DIV", {
      cssClass: "terminal-popup",
      parent: this.$i6
    });
    this.$i6.input = this.$p2("DIV", {
      cssClass: "terminal-input",
      parent: this.$i6
    });
    this.$i6.input.table = this.$p2("TABLE", {
      parent: this.$i6.input
    });
    this.$i6.input.table.tr = this.$p2("TR", {
      parent: this.$i6.input.table
    });
    this.$i6.input.table.tr.prompt = this.$p2("TD", {
      cssClass: "terminal-prompt",
      parent: this.$i6.input.table.tr
    });
    this.$i6.input.table.tr.content = this.$p2("TD", {
      cssClass: "terminal-textfield-container",
      parent: this.$i6.input.table.tr
    });
    this.$i6.input.textField = this.$p2("INPUT", {
      parent: this.$i6.input.table.tr.content
    });
    this.$();

    this.$i6.input.textField.element.addEventListener("keydown", e => {
      this.$m(e, this.$i6.input.textField.element.value);

      this.$j5.$o5();
    });

    this.$i6.input.textField.element.addEventListener("keyup", e => {
      this.$g2(e, this.$i6.input.textField.element.value);

      this.$j5.$o5();
    });
  }

  $J3(value) {
    this.$i6.popup.element.style.display = 'block';
    this.$i6.popup.element.style.bottom = "100%";
    this.$i6.popup.element.style.overflow = 'hidden';
    var frameMax = 15;
    var frame = value ? 0 : frameMax;
    var loop = setInterval(() => {
      frame += value ? 1 : -1;
      this.$i6.popup.element.style.bottom = Math.round(100 - 50 * frame / frameMax) + "%";

      if (value && frame >= frameMax || !value && frame <= 0) {
        clearInterval(loop);
        this.$i6.popup.element.style.bottom = "";
        this.$i6.popup.element.style.overflow = "";
        this.$i6.popup.element.style.display = value ? 'block' : 'none';
      }
    }, 30);
  }

  $L(event) {
    this.$R2$T6 = event ? new Date().getTime() : 0;
    this.$R2 = event;
  }

  $x() {
    if (!this.$R2) return;
    if (new Date().getTime() - this.$R2$T6 > 500) return;
    if (this.$m != this.$f2) return;
    if (!this.$o4()) return;
    var event = this.$R2;
    this.$R2 = null;

    if (this.$m) {
      this.$m(event);
    }

    if (this.$o4() && event.key.toString().length == 1) {
      this.$i6.input.textField.element.value += event.key;
    }
  }

  $q2(downCallback, upCallback) {
    this.$m = downCallback ? downCallback : this.$f2;
    this.$g2 = upCallback ? upCallback : this.$o3;
    this.$x();
  }

  $T2(txt) {
    this.$i6.input.textField.element.value = txt;
  }

  $o3(event, txt) {}

  $f2(event, txt) {
    var updateFromHistory = () => {
      this.$T2(this.$O4[this.$d2]);
      setTimeout(() => {
        this.$i6.input.textField.element.selectionStart = this.$i6.input.textField.element.selectionEnd = 10000;
      }, 0);
    };

    event.stopImmediatePropagation();

    if (this.$I3[event.keyCode] && event.shiftKey) {
      this.$T2(this.$I3[event.keyCode]);
      this.$I5();
      return;
    }

    switch (event.keyCode) {
      case 13:
        this.$O4[this.$d2] = txt;
        this.$I5();
        break;

      case 38:
        // key up
        this.$d2 = Math.min(this.$O4.length - 1, this.$d2 + 1);
        updateFromHistory();
        break;

      case 40:
        // key down
        this.$d2 = Math.max(0, this.$d2 - 1);
        updateFromHistory();
        break;

      default:
        this.$O4[this.$d2] = txt;
        break;
    }
  }

  $(txt) {
    this.$i6.input.table.tr.prompt.element.innerHTML = txt !== undefined ? txt.replace(/ /g, '&nbsp;') : 'hacker@sigma18.iss.gov&nbsp;~$';
  }

  $I5() {
    var command = this.$i6.input.textField.element.value.trim();

    if (command == '') {
      this.$i6.input.textField.element.value = '';
      return;
    }

    this.$E2.unshift(command);

    while (this.$E2.length > 100) {
      this.$E2.pop();
    }

    this.$O4 = [''].concat(this.$E2);
    this.$d2 = 0;

    try {
      localStorage.setItem('history', JSON.stringify(this.$E2));
    } catch (err) {
      console.error(err);
    }

    this.$O3();

    this.$w.forEach(callback => callback(command));
  }

  $O3() {
    this.$T2('');
  }

  $Q() {
    this.$i6.input.textField.element.addEventListener("focusout", () => {
      this.$i6.input.textField.element.focus();
    });

    this.$i6.input.textField.element.focus();
  }

  $O5(txt) {
    return txt.replace(/m{/g, '') // mute
    .replace(/}m/g, '') // mute
    .replace(/s{/g, '<strong>').replace(/}s/g, '</strong>').replace(/r{/g, '<span class="red">').replace(/}r/g, '</span>');
  }

  $o6(txt) {
    txt = this.$O5(txt);
    var lengthLimit = 20000;
    var inputElement = this.$i6.output.element;
    var content = inputElement.innerHTML;
    content += txt;
    content = content.substring(content.length - lengthLimit);
    inputElement.innerHTML = content;
    inputElement.scrollTop = inputElement.scrollHeight;

    this.$j5.$o5();
  }

  $z3(title, txt) {
    txt = this.$O5(txt);
    this.$i6.popup.element.innerHTML = "<h1>".concat(title, "</h1>").concat(txt);
  }

  $p5(content) {
    content = content || "";
    var id = "ref-terminal-line-" + this.$U5++;
    this.$o6("<span id=\"".concat(id, "\">").concat(content, "</span><br/>\n"));
    return document.getElementById(id);
  }

  $P4(callback) {
    this.$w.push(callback);
  }

  $o4() {
    return this.$s2 <= 0;
  }

  $G4() {
    this.$s2++;
    this.$i6.input.textField.element.disabled = true;
    this.$('...');
  }

  $f5() {
    this.$s2--;
    this.$s2 = Math.max(0, this.$s2);

    if (this.$s2 == 0) {
      this.$i6.input.textField.element.disabled = false;
      this.$();

      this.$i6.input.textField.element.focus();

      this.$x();
    }
  }

  $i3(parent) {
    super.$i3(parent);
    this.$Q();

    this.$j5.$i5();
  }

}
;// CONCATENATED MODULE: ./src/system/terminal/Terminal.js
class Terminal {
  constructor(view) {
    this.$a = null;
    this.$j6 = view;
    this.$K2 = null;
    view.$P4(cmd => this.$W(cmd));
    this.$A4 = null;
    this.$F4 = null;
    document.addEventListener("keydown", e => {
      if (!this.$j6.$o4() && !e.ctrlKey) {
        this.$K2.$h6('err');
      }
    });
  }

  $I6(serviceName, msg) {
    this.$a.$k3(serviceName).$I6(msg);
  }

  $Z4(serviceName, msg, done) {
    var handleErr = err => {
      this.$h4("", "Error: " + err, {
        c: 'sound',
        d: 'err'
      }, {
        c: 'on'
      });
    };

    this.$h4("Connecting to the gateway 10.43.23.4...", "Connection established", "Service Discovery in progress...", {
      c: () => {
        var service = this.$a.$k3(serviceName);

        if (!service) {
          return handleErr('Cannot find service ' + serviceName);
        }

        if (!service.$V3) {
          return handleErr("Service s{".concat(service.$l6, "}s is down.<br />\nTry turn it on by s{power up ").concat(service.$l6, "}s"));
        }

        var queue = ["Service ".concat(service.$l6, " found at ").concat(service.$S6), {
          c: 'ln',
          d: '',
          t: 300
        }];
        queue = queue.concat(msg);
        queue.push({
          c: () => done()
        });
        this.$h4(queue);
      },
      t: 300
    });
  }

  $W(command) {
    this.$j6.$o6("<div class=\"terminal-command\">s{&gt;}s ".concat(command, "</div>"));
    command = command.split(" ");
    command = command.map(cmd => cmd.trim());
    command = command.filter(cmd => cmd != '');

    if (!this.$F4.$Z(command)) {
      this.$J4("Error: Command s{".concat(command[0], "}s not found!"));
      this.$J4("Run s{help}s to list all available commands");
      this.$K2.$h6('err');
    }
  }

  setSystem(system) {
    this.$F4 = system;
    this.$a = system.$d5().$y();
    this.$K2 = system.$I();
  }

  $J3(value) {
    this.$j6.$J3(value);
    this.$K2.$h6('ok');
  }

  $L5(done) {
    var initState = this.$j6.$o4();
    this.$j6.$f5();
    this.$j6.$q2(event => {
      event.stopImmediatePropagation();
      event.preventDefault();
      this.$j6.$O3();

      if (event.keyCode != 13 && !event.ctrlKey) {
        this.$K2.$h6('err');
        return;
      }

      this.$j6.$q2();

      if (!initState) {
        this.$j6.$G4();
      }

      done();
    });
    this.$j6.$("Press ENTER to continue");
  }

  $g5(label, done) {
    var initState = this.$j6.$o4();
    this.$j6.$f5();
    this.$j6.$q2((event, txt) => {
      if (event.keyCode != 13 && !event.ctrlKey) {
        return;
      }

      event.stopImmediatePropagation();
      event.preventDefault();
      this.$j6.$O3();

      if (!initState) {
        this.$j6.$G4();
      } else {
        this.$j6.$();
      }

      this.$j6.$q2();
      done(txt);
    });
    this.$j6.$(label);
  }

  $J4(txt, service) {
    this.$j6.$o6(txt + "<br/>\n");

    if (service) {
      this.$I6(service, txt);
    }
  }

  $u4(msgQueue, done) {
    var msgPointer = 0;
    var finished = false;

    var printNext = queueCompleted => {
      if (finished) return;
      var from = msgQueue[msgPointer][0];
      var msg = msgQueue[msgPointer][1];
      msgPointer++;

      this.$c(from, msg, () => {
        if (msgPointer < msgQueue.length) {
          printNext(queueCompleted);
        } else {
          queueCompleted();
        }
      });
    };

    var cleanUp = () => {
      if (finished) return;

      while (msgPointer < msgQueue.length) {
        var from = msgQueue[msgPointer][0];
        var msg = msgQueue[msgPointer][1];

        this.$q(from, msg);

        msgPointer++;
      }

      this.$j6.$O3();
      this.$j6.$G4();
      this.$j6.$q2();
    };

    var isDisabled = !this.$j6.$o4();

    if (isDisabled && done) {
      this.$j6.$f5();
      this.$j6.$("Press any key to skip...");
      this.$j6.$q2(event => {
        event.stopImmediatePropagation();
        event.preventDefault();
        this.$j6.$L(event);
        this.$K2.$P5();
        cleanUp();
        if (finished) return;
        finished = true;
        done();
      });
    }

    printNext(() => {
      if (isDisabled && done) {
        cleanUp();
      }

      if (finished) return;
      finished = true;

      if (done) {
        done();
      }
    });
  }

  $c(from, msg, done) {
    this.$q(from, msg);

    this.$K2.$p6(msg, from != 'hacker', () => {
      done();
    });
  }

  $q(from, msg) {
    var side = from == 'hacker' ? 'terminal-chat-left' : 'terminal-chat-right';
    this.$j6.$o6("<div class=\"terminal-chat ".concat(side, "\"><small>").concat(from, "</small><p>").concat(msg, "</p></div>"));
  }

  $p4(time, label, done) {
    this.$K2.$h6('beep');
    var el = this.$j6.$p5();
    var id = el.id;
    var loop = setInterval(() => {
      el = document.getElementById(id);
      el.innerHTML = label + ': ' + Math.round(Math.random() * 1000000000).toString(16);
      time--;

      if (time <= 0) {
        clearInterval(loop);
        el.innerHTML = label + ': ********';
        this.$K2.$m6('beep');
        done();
      }
    }, 30);
    this.$A4 = el;
  }

  $c2(value, el) {
    value = value || 0;
    value = Math.max(0, Math.min(100, value));
    value = Math.round(value);
    el = el || this.$j6.$p5();
    el = document.getElementById(el.id);
    var fillCount = Math.round(value / 100 * 40);
    var fill = '='.repeat(fillCount);
    var empty = '&nbsp;'.repeat(40 - fillCount);
    el.innerHTML = "[".concat(fill).concat(empty, "]  ") + value + '%';
    return el;
  }

  $v(done) {
    this.$K2.$h6('beep');
    var el = this.$c2();
    var id = el.id;
    var p = 0;
    var loop = setInterval(() => {
      el = document.getElementById(id);
      this.$c2(p, el);
      p += 2;

      if (p >= 100) {
        this.$c2(100, el);
        clearInterval(loop);
        this.$K2.$m6('beep');
        done();
      }
    }, 30);
    this.$A4 = el;
  }

  $O(disks, done) {
    disks = disks || [];
    var appNames = disks.map(d => d.$B4.$l6);
    this.$h4({
      c: 'sound',
      d: 'ok',
      t: 100
    }, "", "Transferring disk data: s{".concat(appNames.join(', '), "}s app."), {
      c: 'load'
    }, 'App downloaded', '', {
      c: 'ln',
      d: "Installing s{".concat(appNames.join(', '), "}s app."),
      t: 500
    }, {
      c: 'load'
    }, {
      c: () => {
        disks.forEach(d => this.$F4.$X(d.$B4));
      }
    }, 'Done.', '', {
      c: () => {
        appNames.forEach(a => this.$J4("Run s{".concat(a, "  help}s for more info.")));
      }
    }, 'Run s{help}s to list all available commands', {
      c: 'sound',
      d: 'ok'
    }, {
      c: done
    });
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


  $h4() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var cmdList = args.length == 1 ? args[0] : args;

    var step = () => {
      if (cmdList.length == 0) {
        return;
      }

      var cmd = cmdList.shift();

      if (typeof cmd == 'string') {
        var txt = cmd;

        cmd = () => {
          this.$J4(txt);
        };
      }

      if (typeof cmd == 'function') {
        cmd = {
          c: cmd,
          t: 100
        };
      }

      if (typeof cmd.c == 'string') {
        switch (cmd.c) {
          case 'ln':
            cmd.c = () => {
              this.$J4(cmd.d, cmd.s);
            };

            break;

          case 'chat':
            if (Array.isArray(cmd.d)) {
              cmd.c = done => {
                this.$u4(cmd.d, done);
              };
            } else {
              cmd.c = done => {
                this.$u4([[cmd.f, cmd.d]], done);
              };
            }

            break;

          case 'sound':
            cmd.c = () => {
              this.$K2.$h6(cmd.d);
            };

            break;

          case 'pass':
            cmd.c = done => {
              this.$p4(cmd.d, cmd.l || 'Password', done);
            };

            break;

          case 'load':
            cmd.c = done => {
              this.$v(done);
            };

            break;

          case 'on':
            cmd.c = () => {
              this.$j6.$f5();
            };

            break;

          case 'off':
            cmd.c = () => {
              this.$j6.$G4();
            };

            break;

          case 'pause':
            cmd.c = done => {
              this.$L5(done);
            };

            break;

          default:
            throw new Error("Unknown command ".concat(cmd.c));
        }
      }

      if (!cmd.t) {
        cmd.t = 100;
      }

      setTimeout(() => {
        if (cmd.c.length == 0) {
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
;// CONCATENATED MODULE: ./src/system/screen/ScreenView.js


class ScreenView extends View {
  constructor(document) {
    super(document);
    this.$E = '#001100';
    this.$p3 = '#ff0000';
    this.$i6 = this.$p2("DIV", {
      cssClass: "screen-root"
    });
    this.$a6 = new DigitalNoise(document);

    this.$i6.element.appendChild(this.$a6.$E5());

    this.$i6.canvas = this.$p2("CANVAS", {
      cssClass: "screen-canvas",
      parent: this.$i6
    });
    this.$a5 = this.$i6.canvas.element.getContext("2d");
    this.$s6();
    window.addEventListener('resize', () => this.$i5());
    window.addEventListener('load', () => this.$i5());
  }

  $i5() {
    var el = this.$i6.canvas.element;
    el.width = el.parentElement.clientWidth;
    el.height = el.parentElement.clientHeight;
    this.$a6.$i5();
    this.$s6();
  }

  $R(opacity) {
    opacity = opacity ? opacity : 0;
    return "rgba(136,255,34,".concat((1 - opacity).toFixed(2), ")");
  }

  $S4() {
    return this.$i6.canvas.element.width;
  }

  $a4() {
    return this.$i6.canvas.element.height;
  }

  $s6() {
    var ctx = this.$a5;
    ctx.clearRect(0, 0, this.$S4(), this.$a4());
    ctx.beginPath();
    ctx.rect(0, 0, this.$S4(), this.$a4());
    ctx.fillStyle = this.$E;
    ctx.fill();
  }

  $i3(parent) {
    super.$i3(parent);
    this.$i5();
  }

  $Y2(done) {
    this.$A5(() => {
      this.$A5(() => {
        done();
      }, 5);
    }, -5);
  }

  $A5(done, speed) {
    speed = speed || 1;
    var frame = speed > 0 ? 0 : 35;
    var w = this.$S4();
    var h = this.$a4();
    var ctx = this.$a5;
    var p;
    var loop = setInterval(() => {
      this.$s6();
      frame += speed;
      ctx.beginPath();
      ctx.strokeStyle = null;

      if (frame <= 20) {
        p = frame / 20;
        ctx.fillStyle = this.$R(1 - p);
        ctx.rect(w / 2 - 0.02 * w, h / 2 - h * 0.01, w * 0.02, h * 0.02);
      } else if (frame <= 25) {
        p = (frame - 20) / (25 - 20);
        ctx.fillStyle = this.$R();
        ctx.rect(w * 0.5 * (1 - p), h / 2 - h * 0.01, w * p, h * 0.02);
      } else if (frame < 28) {
        p = (frame - 25) / (28 - 25);
        ctx.fillStyle = this.$R();
        ctx.rect(0, h * 0.5 * (1 - p), w, h * p);
      } else {
        p = (frame - 28) / (35 - 28);
        ctx.fillStyle = this.$R(p);
        ctx.rect(0, 0, w, h);
      }

      ctx.fill();

      if (speed > 0 && frame >= 35 || speed < 0 && frame <= 0) {
        clearInterval(loop);
        this.$a6.$r6();
        done();
      }
    }, 30);
  }

}
;// CONCATENATED MODULE: ./src/system/screen/ScreenRenderer.js
class ScreenRenderer {
  constructor(soundPlayer) {
    this.$K2 = soundPlayer;
  }

  $S5(screenView) {
    this.$P3 = screenView;
  }

  $D5() {
    this.$P3 = null;
  }

  $Y5() {}

}
;// CONCATENATED MODULE: ./src/system/screen/renderer/MapRenderer.js
function MapRenderer_createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = MapRenderer_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function MapRenderer_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return MapRenderer_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return MapRenderer_arrayLikeToArray(o, minLen); }

function MapRenderer_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }



class Circle {
  constructor(x, y, f) {
    this.frame = 0;
    this.x = x;
    this.y = y;
  }

}

class MapRenderer extends ScreenRenderer {
  constructor(soundPlayer, map) {
    super(soundPlayer);
    this.$d6 = 0;
    this.$k6 = map;
    this.$a3 = [];
    this.$Y5();
  }

  $S5(screenView) {
    super.$S5(screenView);
    this.$e6 = setInterval(() => {
      this.$Y5();
    }, 30);
  }

  $D5() {
    super.$D5();

    if (this.$e6) {
      clearInterval(this.$e6);
      this.$e6 = null;
    }
  }

  $Y5() {
    if (!this.$P3) {
      return;
    }

    this.$d6++;
    var ctx = this.$P3.$a5;
    var w = this.$P3.$S4();
    var h = this.$P3.$a4();
    var red = this.$P3.$p3;
    var color = this.$P3.$R();
    var color2 = this.$P3.$R(0.7);
    var bg = this.$P3.$E;
    var pos;
    var room;
    this.$P3.$s6();
    var segmentSize = Math.round(Math.min(w, h) / 12);
    var startX = w / 2 - segmentSize * 12 / 2;
    var startY = h / 2 - segmentSize * 12 / 2;

    var blink = (x, y) => {
      x = startX + (1 + x + 0.5) * segmentSize;
      y = startY + (1 + y + 0.5) * segmentSize;

      this.$a3.push(new Circle(x, y, 0));
    };

    var renderCircle = c => {
      c.frame++;

      if (c.frame < 0) {
        return;
      }

      ctx.beginPath();
      ctx.fillStyle = null;
      ctx.lineWidth = 1;
      ctx.strokeStyle = this.$P3.$R(c.frame / 30);
      ctx.arc(c.x, c.y, 40 * Math.sqrt(0.25 * c.frame), 0, 2 * Math.PI);
      ctx.stroke();
    };

    var renderRoom = (x, y) => {
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.rect(startX + segmentSize + x * segmentSize, startY + segmentSize + y * segmentSize, segmentSize, segmentSize);
      ctx.stroke();
    };

    var drawLine = (segX, segY, x1, y1, x2, y2) => {
      ctx.moveTo(startX + (1 + segX + x1) * segmentSize, startY + (1 + segY + y1) * segmentSize);
      ctx.lineTo(startX + (1 + segX + x2) * segmentSize, startY + (1 + segY + y2) * segmentSize);
    };

    var drawRect = (segX, segY, x, y, w, h) => {
      ctx.rect(startX + (1 + segX + x) * segmentSize, startY + (1 + segY + y) * segmentSize, segmentSize * w, segmentSize * h);
    };

    var write = (segX, segY, x, y, txt) => {
      ctx.font = "1em \"Courier New\", Courier, monospace";
      ctx.textAlign = 'center';
      ctx.fillStyle = color;
      ctx.fillText(txt, startX + (1 + segX + x) * segmentSize, startY + (1 + segY + y) * segmentSize + 8);
    };

    var renderCapsule = (x, y) => {
      ctx.lineWidth = 3;
      renderRoom(x, y);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.strokeStyle = color;
      drawLine(x, y, 0, 0, 1, 1);
      drawLine(x, y, 0, 1, 1, 0);
      ctx.stroke();
    };

    var renderSquad = (x, y, color) => {
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.beginPath();
      drawRect(x, y, 0.375, 0.375, 0.25, 0.25);
      ctx.fill();
    };

    var renderCorridor = (x, y, room) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      var doors = room.$l4();

      if (doors.n) {
        drawLine(x, y, 0.25, 0, 0.25, 0.25);
        drawLine(x, y, 0.75, 0, 0.75, 0.25);
      } else {
        drawLine(x, y, 0.25, 0.25, 0.75, 0.25);
      }

      if (doors.s) {
        drawLine(x, y, 0.25, 1, 0.25, 0.75);
        drawLine(x, y, 0.75, 1, 0.75, 0.75);
      } else {
        drawLine(x, y, 0.25, 0.75, 0.75, 0.75);
      }

      if (doors.w) {
        drawLine(x, y, 0, 0.25, 0.25, 0.25);
        drawLine(x, y, 0, 0.75, 0.25, 0.75);
      } else {
        drawLine(x, y, 0.25, 0.25, 0.25, 0.75);
      }

      if (doors.e) {
        drawLine(x, y, 1, 0.25, 0.75, 0.25);
        drawLine(x, y, 1, 0.75, 0.75, 0.75);
      } else {
        drawLine(x, y, 0.75, 0.25, 0.75, 0.75);
      }

      ctx.stroke();
    };

    var x, y; // render grid

    for (x = 0; x < 10; x++) {
      var letters = "ABCDEFGHIJ";
      write(x, -1, 0.5, 0.5, letters.charAt(x));
    }

    for (y = 0; y < 10; y++) {
      write(-1, y, 0.5, 0.5, y + 1);
    }

    for (x = 0; x <= 10; x++) {
      for (y = 0; y <= 10; y++) {
        ctx.strokeStyle = color2;
        ctx.lineWidth = 1;
        ctx.beginPath();
        drawLine(x, y, -0.1, 0, 0.1, 0);
        drawLine(x, y, 0, -0.1, 0, 0.1);
        ctx.stroke();
      }
    } // render rooms


    for (x = 0; x < 10; x++) {
      for (y = 0; y < 10; y++) {
        if (!this.$k6.$y5(x, y)) {
          continue;
        }

        room = this.$k6.$L4(x, y);

        if (room.$h > 0 && this.$d6 % 6 == 0) {
          blink(x, y);
          room.$h--;
        }

        if (!room.$G3()) {
          continue;
        }

        if (room.$N3 > 0) {
          room.$N3--;
          if (Math.random() > 0.5) continue;
        }

        switch (room.$_4()) {
          case 'corridor':
            renderCorridor(x, y, room);
            break;

          case 'capsule':
            renderCapsule(x, y);
            break;

          case 'room':
            renderRoom(x, y);
            break;
        } // render enemy


        if (this.$k6.$L4(x, y).$B5 > 0) {
          renderSquad(x, y, red);
        }
      }
    } // render doors


    var doorList = this.$k6.$t3();

    var _iterator = MapRenderer_createForOfIteratorHelper(doorList),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var door = _step.value;

        if (!door.$G3()) {
          continue;
        }

        pos = door.$C2();

        if (door.$x4()) {
          ctx.strokeStyle = color;
          ctx.lineWidth = 8;
          ctx.beginPath();

          if (door.$B2() == 90) {
            ctx.moveTo(startX + 1.50 * segmentSize + pos.x * segmentSize, startY + 1.25 * segmentSize + pos.y * segmentSize);
            ctx.lineTo(startX + 1.50 * segmentSize + pos.x * segmentSize, startY + 1.75 * segmentSize + pos.y * segmentSize);
          } else {
            ctx.moveTo(startX + 1.25 * segmentSize + pos.x * segmentSize, startY + 1.50 * segmentSize + pos.y * segmentSize);
            ctx.lineTo(startX + 1.75 * segmentSize + pos.x * segmentSize, startY + 1.50 * segmentSize + pos.y * segmentSize);
          }

          ctx.stroke();
        } else {
          ctx.fillStyle = bg;
          ctx.beginPath();
          ctx.rect(startX + 1.3 * segmentSize + pos.x * segmentSize, startY + 1.3 * segmentSize + pos.y * segmentSize, segmentSize * 0.4, segmentSize * 0.4);
          ctx.fill();
        }
      } // render squad position

    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    pos = this.$k6.$f();
    renderSquad(pos.x, pos.y, color);

    this.$a3.forEach(c => renderCircle(c));

    this.$a3 = this.$a3.filter(c => c.frame < 30);
  }

}
;// CONCATENATED MODULE: ./src/system/screen/renderer/BattleRenderer.js
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || BattleRenderer_unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function BattleRenderer_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return BattleRenderer_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return BattleRenderer_arrayLikeToArray(o, minLen); }

function BattleRenderer_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }



class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = Math.random() * 0.06 - 0.03;
    this.vy = Math.random() * 0.06 - 0.03;
    this.frame = 0;
    this.life = 10;
  }

  $Y6() {
    this.x += this.vx;
    this.y += this.vy;
    this.frame++;
  }

  $s3() {
    return this.frame > this.life;
  }

}

class Shot {
  constructor(x1, y1, x2, y2, scale) {
    this.scale = scale;
    this.frame = 0;
    this.from = {
      x: x1,
      y: y1
    };
    this.to = {
      x: x2,
      y: y2
    };
  }

  $s3() {
    return this.frame > 6;
  }

}

class BattleRenderer extends ScreenRenderer {
  constructor(soundPlayer, battle) {
    super(soundPlayer);
    this.$t5 = battle;
    this.$e6 = null;
    this.$s4 = [];
    this.$h2 = [];
    this.$C = false;
    this.$U2 = false;
    this.$d6 = 0;
  }

  $S5(screenView) {
    super.$S5(screenView);
    this.$e6 = setInterval(() => this.$Y5(), 30);
  }

  $D5() {
    clearInterval(this.$e6);
    this.$K2.$m6('gun');
    this.$K2.$m6('gun2');
    super.$D5();
  }

  $Y5() {
    if (!this.$P3) {
      return;
    }

    var ctx = this.$P3.$a5;
    var w = this.$P3.$S4();
    var h = this.$P3.$a4();
    var red = this.$P3.$p3;
    var color = this.$P3.$R();
    var color2 = this.$P3.$R(0.5);
    var bg = this.$P3.$E;
    var flipY = this.$t5.$Z5;
    var flipX = this.$t5.$X5;
    var rotate = this.$t5.$x5;

    var gun = this.$t5.$L4().$P6;

    this.$P3.$s6();
    var roomSize = Math.round(Math.min(w, h) * 0.7);
    var wallSize = 0.05;
    var startX = w / 2 - roomSize / 2;
    var startY = h / 2 - roomSize / 2;
    var gunX = 1.5 * wallSize;
    var gunY = 1 - 1.5 * wallSize;

    var transform = (x, y) => {
      if (rotate) {
        var a = x;
        x = y;
        y = a;
      }

      y = flipY ? 1 - y : y;
      x = flipX ? 1 - x : x;
      return [x, y];
    };

    var moveTo = (x, y) => {
      var _transform = transform(x, y);

      var _transform2 = _slicedToArray(_transform, 2);

      x = _transform2[0];
      y = _transform2[1];
      ctx.moveTo(startX + roomSize * x, startY + roomSize * y);
    };

    var lineTo = (x, y) => {
      var _transform3 = transform(x, y);

      var _transform4 = _slicedToArray(_transform3, 2);

      x = _transform4[0];
      y = _transform4[1];
      ctx.lineTo(startX + roomSize * x, startY + roomSize * y);
    };

    var drawLine = (x1, y1, x2, y2) => {
      moveTo(x1, y1);
      lineTo(x2, y2);
    };

    var drawCircle = (x, y, r) => {
      var _transform5 = transform(x, y);

      var _transform6 = _slicedToArray(_transform5, 2);

      x = _transform6[0];
      y = _transform6[1];
      ctx.arc(startX + roomSize * x, startY + roomSize * y, roomSize * r, 0, 2 * Math.PI);
    };

    var drawRect = (x, y, w, h) => {
      var _transform7 = transform(x, y);

      var _transform8 = _slicedToArray(_transform7, 2);

      x = _transform8[0];
      y = _transform8[1];

      if (rotate) {
        var a = w;
        w = h;
        h = a;
      }

      ctx.rect(startX + roomSize * (x - w / 2), startY + roomSize * (y - h / 2), w * roomSize, h * roomSize);
    };

    var renderWalls = () => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.fillStyle = null;
      ctx.lineWidth = 3;
      moveTo(0, 0);
      lineTo(1, 0);
      lineTo(1, 1);
      lineTo(0.6, 1);
      lineTo(0.6, 1 - wallSize);
      lineTo(1 - wallSize, 1 - wallSize);
      lineTo(1 - wallSize, 0 + wallSize);
      lineTo(0 + wallSize, 0 + wallSize);
      lineTo(0 + wallSize, 1 - wallSize);
      lineTo(0.4, 1 - wallSize);
      lineTo(0.4, 1);
      lineTo(0, 1);
      lineTo(0, 0);
      ctx.stroke();
    };

    var renderGun = () => {
      this.$d6++;
      ctx.beginPath();
      ctx.fillStyle = this.$P3.$R();
      ctx.strokeStyle = null;
      drawCircle(wallSize + 0.04, 1 - wallSize - 0.04, 0.04);
      drawRect(wallSize + 0.02, 1 - wallSize - 0.04, 0.04, 0.08);
      drawRect(wallSize + 0.04, 1 - wallSize - 0.02, 0.08, 0.04);
      ctx.fill();
      var angle = Math.atan2(gunY - gun.$z5.y, gunX - gun.$z5.x);
      var sin = -Math.sin(angle);
      var cos = -Math.cos(angle);
      ctx.beginPath();
      ctx.fillStyle = null;
      ctx.strokeStyle = this.$P3.$R();
      ctx.lineWidth = 2;
      drawLine(gunX, gunY, gunX + cos * 0.13, gunY + sin * 0.13);
      ctx.stroke();
      ctx.beginPath();
      ctx.lineWidth = 4;
      var len = gun.$l3 ? 0.015 * Math.sin(this.$d6 * 1.2) : 0;
      drawLine(gunX + cos * (len + 0.1), gunY + sin * (len + 0.1), gunX + cos * (len + 0.14), gunY + sin * (len + 0.14));
      ctx.stroke();

      if (gun.$l5) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        drawRect(gun.$z5.x, gun.$z5.y, 0.12, 0.12);
        drawRect(gun.$z5.x, gun.$z5.y, 0.06, 0.06);
        drawLine(gun.$z5.x, gun.$z5.y - 0.15, gun.$z5.x, gun.$z5.y + 0.15);
        drawLine(gun.$z5.x - 0.15, gun.$z5.y, gun.$z5.x + 0.15, gun.$z5.y);
        ctx.stroke();
      }
    };

    var renderUnit = (x, y, w, h, c) => {
      ctx.beginPath();
      ctx.fillStyle = c;
      ctx.strokeStyle = null;
      drawRect(x, y, w, h);
      ctx.fill();
    };

    var renderParticle = p => {
      var size = 0.01;
      ctx.beginPath();
      ctx.fillStyle = this.$P3.$R(p.frame / p.life);
      ctx.strokeStyle = null;
      drawRect(p.x, p.y, size, size);
      ctx.fill();
      p.$Y6();
    };

    var renderShot = shot => {
      if (shot.frame <= 1) {
        ctx.beginPath();
        ctx.fillStyle = null;
        ctx.strokeStyle = color2;
        ctx.lineWidth = 2 * shot.scale;
        var midX = (shot.from.x + shot.to.x) / 2;
        var midY = (shot.from.y + shot.to.y) / 2;

        if (shot.frame == 0) {
          drawLine(shot.from.x, shot.from.y, midX, midY);
        } else {
          drawLine(midX, midY, shot.to.x, shot.to.y);
        }

        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.strokeStyle = null;
        ctx.fillStyle = this.$P3.$R((shot.frame - 2) / 4);
        var ax = shot.to.x;
        var ay = shot.to.y;
        drawCircle(ax, ay, shot.scale * wallSize * (shot.frame - 2) / 4);
        ctx.fill();
      }

      shot.frame++;
    };

    var shoot = (x1, y1, x2, y2, scale) => {
      this.$s4.push(new Shot(x1, y1, x2, y2, scale));

      for (var i = 0; i < 5 * scale; i++) {
        this.$h2.push(new Particle(x2, y2));
      }
    };

    renderWalls();

    this.$t5.$B3().forEach(d => renderUnit(d.x, d.y, 0.05, 0.05, red));

    this.$t5.$Q3().forEach(m => renderUnit(m.x, m.y, 0.05, 0.05, color));

    var droid, marine;
    var threshold = 8;
    var droids;

    if (this.$t5.$Q2()) {
      if (!this.$C) {
        this.$K2.$h6('gun');
        this.$C = true;
      }

      droids = this.$t5.$B3();

      if (droids.length > 0) {
        droid = droids[Math.floor(droids.length * Math.random())];
        var x = 0.3 + 0.4 * Math.random();
        var y = 1 - wallSize;

        if (x > 0.4 && x < 0.6) {
          y += wallSize * Math.random();
        }

        shoot(droid.x, droid.y, x, y, 1);
      }
    } else if (this.$t5.$u2()) {
      if (!this.$C) {
        this.$K2.$h6('gun');
        this.$C = true;
      }

      droids = this.$t5.$B3();

      if (droids.length > 0) {
        droid = droids[Math.floor(droids.length * Math.random())];

        var marines = this.$t5.$Q3();

        marine = marines[Math.floor(Math.random() * 2)];
        var x1 = marine.x;
        var y1 = marine.y;
        var x2 = droid.x + (-3 + 6 * Math.random()) * wallSize;
        var y2 = droid.y + (-3 + 6 * Math.random()) * wallSize;
        x2 = Math.max(wallSize, Math.min(1 - wallSize, x2));
        y2 = Math.max(wallSize, Math.min(1 - wallSize, y2));
        shoot(x1, y1, x2, y2, 1);
      }
    } else {
      this.$K2.$m6('gun');
      this.$C = false;
    }

    if (gun) {
      if (gun.$l3 && Math.random() > 0.5) {
        shoot(gunX, gunY, gun.$z5.x + Math.random() * 0.1 - 0.05, gun.$z5.y + Math.random() * 0.1 - 0.05, 1.5);
      }

      renderGun();

      if (!this.$U2 && gun.$l3) {
        this.$U2 = true;
        this.$K2.$h6('gun2');
      } else if (this.$U2 && !gun.$l3) {
        this.$U2 = false;
        this.$K2.$m6('gun2');
      }
    }

    this.$s4.forEach(s => renderShot(s));

    this.$s4 = this.$s4.filter(s => !s.$s3());

    this.$h2.forEach(p => renderParticle(p));

    this.$h2 = this.$h2.filter(p => !p.$s3());
  }

}
;// CONCATENATED MODULE: ./src/system/screen/renderer/RadarRenderer.js

class RadarRenderer extends ScreenRenderer {
  constructor(soundPlayer) {
    super(soundPlayer);
    this.$e6 = null;
    this.$d6 = 0;
    this.$T = 0;
  }

  $S5(screenView) {
    super.$S5(screenView);
    this.$d6 = 0;
    this.$e6 = setInterval(() => this.$Y5(), 15);
  }

  $D5() {
    clearInterval(this.$e6);
    super.$D5();
  }

  $Y5() {
    if (!this.$P3) {
      return;
    }

    this.$P3.$s6();
    this.$d6++;
    this.$T *= 0.98;
    var ctx = this.$P3.$a5;
    var w = this.$P3.$S4();
    var h = this.$P3.$a4();
    var red = this.$P3.$p3;
    var color = this.$P3.$R();
    var color2 = this.$P3.$R(0.5);
    var bg = this.$P3.$E;
    var maxRadius = Math.sqrt(w * w + h * h) * 0.5;
    var i, x, y, r, a;

    for (i = 1; i <= 8; i++) {
      ctx.beginPath();
      ctx.fillStyle = null;
      ctx.strokeStyle = color2;
      ctx.lineWidth = 1;
      ctx.arc(w / 2, h / 2, maxRadius * (i / 8), 0, 2 * Math.PI);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.strokeStyle = null;
    ctx.arc(w / 2, h / 2, maxRadius / 25, 0, 2 * Math.PI);
    ctx.fill();
    var radarAngle = this.$d6 / 15;

    for (i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.fillStyle = null;
      ctx.strokeStyle = this.$P3.$R(i == 0 ? 0 : 0.3 + i / 14);
      ctx.lineWidth = 3;
      r = radarAngle - i / 40;
      x = w / 2 + maxRadius * Math.cos(r);
      y = h / 2 + maxRadius * Math.sin(r);
      ctx.moveTo(w / 2, h / 2);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.fillStyle = null;
    ctx.strokeStyle = color2;
    ctx.lineWidth = 1;
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.stroke();
    a = -1 + this.$d6 / 1000;

    while (a > 2 * Math.PI) {
      a -= 2 * Math.PI;
    }

    while (a < 0) {
      a += 2 * Math.PI;
    }

    while (radarAngle > 2 * Math.PI) {
      radarAngle -= 2 * Math.PI;
    }

    while (radarAngle < 0) {
      radarAngle += 2 * Math.PI;
    }

    r = maxRadius * (this.$d6 / 2000);

    if (Math.abs(radarAngle - a) < 0.1 && this.$d6 < 2000) {
      this.$K2.$h6('radar');
      this.$T = 2;
    }

    x = r * Math.cos(a);
    y = r * Math.sin(a);
    ctx.beginPath();
    ctx.fillStyle = this.$P3.$R(1 - this.$T);
    ctx.strokeStyle = null;
    var s = maxRadius / 25;
    ctx.rect(w / 2 + x - s / 2, h / 2 + y - s / 2, s, s);
    ctx.fill();
  }

}
;// CONCATENATED MODULE: ./src/system/screen/Screen.js



class Screen {
  constructor(view) {
    this.$j6 = view;
    this.$K2 = null;
    this.$F4 = null;
    this.$d4 = null;
  }

  setSystem(system) {
    this.$F4 = system;
    this.$a = system.$d5().$y();
    this.$K2 = system.$I();
  }

  $H4(map, done) {
    this.$I2(new MapRenderer(this.$K2, map), done);
  }

  $Y3(battle, done) {
    this.$I2(new BattleRenderer(this.$K2, battle), done);
  }

  $K3(done) {
    this.$I2(new RadarRenderer(this.$K2), done);
  }

  $I2(r, done) {
    if (this.$d4) {
      this.$d4.$D5();

      this.$d4 = null;
      this.$j6.$a6.$o5();
      this.$j6.$Y2(() => {
        this.$d4 = r;

        this.$d4.$S5(this.$j6);

        this.$d4.$Y5();

        if (done) done();
      });
    } else {
      this.$j6.$a6.$o5();
      this.$j6.$A5(() => {
        this.$d4 = r;

        this.$d4.$S5(this.$j6);

        this.$d4.$Y5();

        if (done) done();
      });
    }
  }

}
;// CONCATENATED MODULE: ./src/system/common/SoundPlayer.js
class SoundPlayer {
  constructor() {
    this.$f6 = false;
    this.$j2 = null;
    this.$F5 = null;
    this.$k2 = null;
    this.$Y = null;

    var findVoice = name => {
      var englishVoices = window.speechSynthesis.getVoices().filter(v => v.lang.substring(0, 2) == 'en');
      var voice = englishVoices.filter(v => v.name == name);

      if (voice.length > 0) {
        return voice[0];
      }

      if (englishVoices.length > 0) {
        return englishVoices[0];
      }

      return null;
    };

    window.speechSynthesis.onvoiceschanged = () => {
      var englishVoices = window.speechSynthesis.getVoices().filter(v => v.lang.substring(0, 2) == 'en');
      this.$k2 = findVoice('Google UK English Male');
      this.$Y = findVoice('Google UK English Female');
    };

    this.$s5 = {};

    try {
      this.$s5.ok = new Audio('audio/ok.mp3');
      this.$s5.err = new Audio('audio/err.mp3');
      this.$s5.chat = new Audio('audio/com.mp3');
      this.$s5.beep = new Audio('audio/beep.mp3');
      this.$s5.beep2 = new Audio('audio/beep.mp3');
      this.$s5.radar = new Audio('audio/beep.mp3');
      this.$s5.gun = new Audio('audio/gun.mp3');
      this.$s5.gun2 = new Audio('audio/gun.mp3');
      this.$s5.beep.loop = true;
      this.$s5.gun.loop = true;
      this.$s5.gun2.loop = true;
    } catch (err) {
      console.log(err);
    }
  }

  $h6(id) {
    if (this.$f6) return;

    try {
      this.$s5[id].play();
    } catch (err) {
      console.error("Cannot play sound", err);
    }
  }

  $m6(id) {
    try {
      this.$s5[id].pause();

      this.$s5[id].currentTime = 0;
    } catch (err) {
      console.log(err);
    }
  }

  $v6(state) {
    this.$f6 = state;
    this.$m6('beep');
    this.$m6('gun');
  }

  $p6(msg, secondary, done) {
    var pureText = msg.replace(/[\:\*]/g, '').replace(/m{[^}]*}m/g, '').replace(/<[^\>]*>/g, '').replace(/\&[a-z]*\;/g, '').replace(/[sr]\{/g, '').replace(/\}[sr]/g, '');

    if (pureText == '' || this.$f6) {
      return this.$l2(pureText, done);
    }

    try {
      var voice = secondary ? this.$Y : this.$k2;

      if (!voice) {
        throw Error('No voice found');
      }

      this.$F5 = new SpeechSynthesisUtterance(pureText);
      this.$F5.voice = voice;
      this.$F5.rate = secondary ? 1.1 : 1.0;
      this.$F5.pitch = secondary ? 0.9 : 1.1;

      this.$F5.onend = () => {
        done();
      };

      this.$F5.onerror = err => {
        console.error(err);
      };

      this.$h6('chat');
      window.speechSynthesis.speak(this.$F5);
    } catch (err) {
      console.error(err);
      return this.$l2(pureText, done);
    }
  }

  $l2(pureText, done) {
    var charsPerSec = 20;
    this.$h6('chat');
    this.$j2 = setTimeout(() => {
      this.$j2 = null;
      done();
    }, 200 + 1000 * pureText.length / charsPerSec);
  }

  $P5() {
    if (this.$j2) {
      clearTimeout(this.$j2);
    }

    this.$j2 = null;

    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      console.error(e);
    }
  }

}
;// CONCATENATED MODULE: ./src/system/System.js
function System_createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = System_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function System_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return System_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return System_arrayLikeToArray(o, minLen); }

function System_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }






class System {
  constructor(document, map) {
    this.$k6 = map;
    this.$O2 = new SoundPlayer();
    this.$J2 = new Screen(new ScreenView(document));
    this.$D3 = new Terminal(new TerminalView(document));

    this.$D3.setSystem(this);

    this.$J2.setSystem(this);

    this.$e = [];
  }

  $Z(command) {
    var _iterator = System_createForOfIteratorHelper(this.$e),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var processor = _step.value;

        if (processor.$j4(command)) {
          processor.$z6(command);
          return true;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return false;
  }

  $I() {
    return this.$O2;
  }

  $H2() {
    return this.$D3;
  }

  $d5() {
    return this.$k6;
  }

  $B() {
    return this.$J2;
  }

  $X(commandProcessor) {
    commandProcessor.$S3(this);

    this.$e.push(commandProcessor);

    this.$e.sort((a, b) => {
      if (a.$l6 == 'help') return -1;
      if (b.$l6 == 'help') return 1;
      if (a.$l6 > b.$l6) return 1;
      if (a.$l6 < b.$l6) return -1;
      return 0;
    });
  }

  $U3(name) {
    return this.$e.filter(c => c.$l6 == name).length > 0;
  }

  $U() {
    return this.$e;
  }

}
;// CONCATENATED MODULE: ./src/world/map/MapBuilder.js
















class MapBuilder {
  $g6(document) {
    this.$k6 = new WorldMap(10, 10);
    this.$F4 = new System(document, this.$k6);
    this.$Q5 = new Squad(this.$F4);

    this.$k6.$e3(this.$Q5);

    this.$Q5.$W5(this.$k6);

    this.$P2();

    this.$V();

    this.$A2();

    this.$S2(4, 8);

    this.$d3();
  }

  $d5() {
    return this.$k6;
  }

  $f4() {
    return this.$F4;
  }

  $d3() {
    this.$f3 = new ProjCommand();
    this.$D2 = new PowerCommand();
    this.$g3 = new CrewCommand();
    this.$F2 = new VirusCommand();
    this.$h3 = new DoorCommand();
    this.$j3 = new DockCommand();
    this.$A3 = new GunCommand();
    this.$G2 = new SniffCommand();

    var config = (x, y, i) => {
      this.$k6.$L4(x, y).$q5(i);
    };

    config(3, 3, new Disk(this.$f3));
    config(4, 0, new Disk(this.$D2));
    config(2, 3, new StaticItem("SIG-18 communication module (host: ".concat(this.$k6.$c4().$T4, ")")));
    config(7, 2, new Note('Rescue Capsule Auth Code: U317AB'));
    config(7, 2, new KeyCard('blue'));
    config(8, 3, new Disk(this.$G2));
    config(1, 3, new Disk(this.$g3));
    config(7, 4, new Disk(this.$A3));
    config(0, 5, new Disk(this.$F2));
    config(1, 6, new KeyCard('red'));
    config(2, 6, new Disk(this.$h3));
    config(5, 6, new KeyCard('yellow'));
    config(4, 7, new Disk(this.$j3));
  }

  $V() {
    var config = (x, y, e) => {
      this.$k6.$L4(x, y).$B5 = e;
    };

    config(7, 3, 6);
    config(6, 6, 4);
    config(5, 6, 2);
    config(1, 6, 4);
    config(2, 8, 5);
    config(3, 1, 4);
    config(2, 2, 4);

    this.$k6.$L4(6, 3).$N4(87, 7, 3);

    this.$k6.$L4(6, 3).$P6 = new Gun();
  }

  $P2() {
    var $g4 = (x, y, txt, type) => {
      var room = this.$k6.$L4(x, y);

      room.$W4(txt);

      if (type) {
        room.$M4(type);
      }
    };

    $g4(4, 8, "We are at our spaceship - s{Sierra 23}s. It was totally wrecked during approaching the station. What's worse, the dock station was damaged too. We have stuck here.");

    $g4(3, 8, 'We are at s{docks}s. There is a rescue capsule behind the southern door. We could use it to escape from here.');

    $g4(3, 9, "We are at s{dock station DS002}s. It is a rescue capsule! We could use it to escape from here, but we need your help to launch it. Special software may be required.");

    $g4(2, 8, 's{Empty dock station}s. There was probably a rescue capsule before but it has departed a long time ago.');

    $g4(3, 7, 'A long s{corridor}s that joins docks with the rest of the station.', 'corridor');

    $g4(3, 6, 'A s{corridor}s. There is a plate on the eastern door labelled Warehouse', 'corridor');

    $g4(3, 5, 'A s{corridor}s. There is a canteen behind the eastern door. The western corridor leads to quarters of the crew. We see a lobby at the north.', 'corridor');

    $g4(3, 4, 'It is a s{corridor}s that leads to the main Lobby. It seems to be totally empty.', 'corridor');

    $g4(3, 3, 'The main s{lobby}s is absolutely empty. There are bullet holes in the front of the reception desk. The logo in the back is damaged. A mix of documents and waste is on the floor. Seems like a regular battle took place here.');

    $g4(4, 6, 'The s{warehouse}s seems to have several rooms. This one contains mostly food supplies and cleaning stuff. More interesting items are probably behind southern doors.');

    $g4(4, 7, 'This room of the s{warehouse}s is full of spare parts, electronic modules and some repair tools. There is a huge mess here. Shelves are on the floor and nothing seems to be in the right place. There are some doors at the end of the room.');

    $g4(5, 7, 'We are in the s{armoury}s. Somebody has broken in here and stole all weapons. Shelves are empty. A few cartridges lie on the floor.');

    $g4(5, 6, 'They have a decent s{kitchen}s here. Of course, there is nobody here.  There is a doorplate with Warehouse label on western doors.');

    $g4(4, 5, 'We are at s{the canteen}s. Plates are left on tables like someone did not manage to take them. A few chairs lie overturned on the floor.');

    $g4(5, 5, 'We are inside of s{the canteen}s. There is nobody here and the mess shows that everybody left it in hurry.');

    $g4(6, 7, 'It is a back s{corridor}s that leads to the main warehouse.', 'corridor');

    $g4(6, 6, 'We are in a long, empty s{corridor}s. There are bloodstains on the walls.', 'corridor');

    $g4(6, 5, 'That is a back s{corridor}s, there are some pieces of furniture laying on the floor what makes crossing difficult. A few bullet holes in the wall are signs of a battle that took place here.', 'corridor');

    $g4(6, 4, 'We are in a long s{corridor}s that leads to the laboratory section.', 'corridor');

    $g4(6, 3, 'The room was a s{security checkpoint}s. It has signs of a heavy fight - bullet holes, blood stains, the furniture are broken into pieces. The room is equipped with a sentry gun BER-84 but it seems to be off-line.');

    $g4(4, 3, "It's a s{corridor}s that leads to the lobby. We see parts of droid's body lying down on the floor and signs of explosions.", 'corridor');

    $g4(5, 3, 'The s{corridor}s joins the laboratory section with the lobby. There are several bullet shells on the floor.', 'corridor');

    $g4(7, 3, 'We are inside the s{laboratory}s. It seems that researches on improving SIG-18 droids took place over here. They have schemas of that model on the walls and lots of spare parts. There is no production machines, just computers. I bet they were working on improving software of its artificial intelligence.');

    $g4(8, 3, 'We are in the laboratory\'s s{meeting room}s. There is a huge table in the middle with some software architecture diagrams. It seems that engineers have left it in a hurry.');

    $g4(7, 2, "It's a dedicated s{warehouse}s for the lab. They keep spare parts of SIG-18 and some backup computers here.");

    $g4(7, 4, 'We have entered the s{server room}s of the lab. Lots of servers are here. Everything is up and running. They are separate to core systems of the space station so they must run services dedicated for researches of the lab.');

    $g4(2, 5, 'It is a s{corridor}s to quarters of the crew.', 'corridor');

    $g4(1, 5, "We are walking down a s{corridor}s. There is a door plate on the west with label: Commander's Quarter.", 'corridor');

    $g4(2, 6, "That's a s{room of crew members}s. It has 10 beds. There are many signs of a fight: the blood on walls and bullet holes everywhere. The cabinets are smashed on the floor.");

    $g4(1, 6, "It is a s{room of crew members}s. It has 16 beds. The room is very clean comparing to other locations. Seems like it wasn't used recently.");

    $g4(0, 5, "We are inside the s{commander's quarter}s. It is demolished but there are no signs of a fight. It seems that someone was searching for something here.");

    $g4(2, 3, 'A s{corridor}s is leading to office and administration section of the space station. There is a destroyed battle droid (model SIG-18) on the floor.', 'corridor');

    $g4(1, 3, "We are in the s{office}s part of the station. We see a heap of papers and electronics in the centre of the room. It's partially burned. Seems like someone was trying to destroy all records. There are bullet holes in the walls.");

    $g4(2, 2, 'This is an s{office}s after a huge battle: blood, bullet holes, shells and cartridges on the floor, burned equipment. In the corner, we see a destroyed battle droid SIG-18.');

    $g4(3, 2, "It's the north s{corridor}s. Some documents from the lobby are spread all over the floor.", 'corridor');

    $g4(3, 1, 'We are in a s{corridor}s. In the end, there is an entrance to the internal services area.', 'corridor');

    $g4(3, 0, 'There is the central s{oxygen generator}s in the room. It recycles oxygen from  CO2. Someone was trying to break in here but unsuccessfully. The door is slightly damaged.');

    $g4(2, 0, 'We are in the s{power generator room}s. It supplies the whole station. It is very noisy here. Two of three power generators seems to be up and running. One is down.');

    $g4(4, 0, 'It is the s{computing core}s of the station. Servers here host core services of the station. Everything seems to be up and running.');

    this.$k6.$L4(3, 9).$M4('capsule');
  }

  $A2() {
    var $4 = (x1, y1, x2, y2, close, label, key) => {
      var door = this.$k6.$4(x1, y1, x2, y2);

      if (close) {
        door.$G5();
      }

      if (label) {
        door.$5 = label;
      }

      if (key) {
        door.$b3(key);
      }

      return door;
    };

    $4(3, 8, 3, 9, true, 'capsule'); // dock -> rescue

    $4(4, 8, 3, 8); // sierra -> dock

    $4(2, 8, 3, 8, true); // empty -> dock

    $4(3, 8, 3, 7); // dock -> corridor

    $4(3, 7, 3, 6); // corridor -> corridor

    $4(3, 6, 3, 5, true).$c5(); // corridor -> corridor

    $4(3, 5, 3, 4); // corridor -> corridor

    $4(3, 4, 3, 3); // corridor -> lobby

    $4(3, 6, 4, 6, true, 'blue', 'blue'); // corridor -> warehouse

    $4(4, 6, 4, 7, true, 'blue', 'blue'); // warehouse -> warehouse

    $4(4, 7, 5, 7, true, 'blue', 'blue'); // warehouse -> warehouse

    $4(4, 6, 5, 6, true, 'blue', 'blue'); // warehouse -> kitchen

    $4(3, 5, 4, 5); // corridor -> canteen

    $4(4, 5, 5, 5); // canteen -> canteen

    $4(5, 5, 5, 6, true); // canteen -> kitchen

    $4(5, 7, 6, 7, true, 'blue', 'blue'); // warehouse -> corridor

    $4(6, 7, 6, 6); // corridor -> corridor

    $4(6, 6, 6, 5); // corridor -> corridor

    $4(6, 5, 6, 4); // corridor -> corridor

    $4(6, 4, 6, 3, true); // corridor -> security check

    $4(5, 3, 6, 3, true); // corridor -> security check

    $4(4, 3, 5, 3); // corridor -> corridor

    $4(3, 3, 4, 3, true); // lobby -> corridor

    $4(6, 3, 7, 3, true, 'yellow', 'yellow'); // security -> lab

    $4(7, 3, 7, 2, true); // lab -> warehouse

    $4(7, 3, 8, 3, true); // lab -> conference room

    $4(7, 3, 7, 4, true, 'lab-server').$W6('wirving', 'First name of an engineer who has red hair', /duncan/i); // lab -> server room

    $4(2, 5, 3, 5); // corridor -> corridor

    $4(1, 5, 2, 5); // corridor -> corridor

    $4(3, 6, 2, 6); // corridor -> crew quarter

    $4(2, 5, 2, 6, true); // corridor -> crew quarter

    $4(1, 5, 1, 6, true); // corridor -> crew quarter

    $4(1, 5, 0, 5, true, 'commander').$W6('swoodley', 'What year have you joined Sigma-18 crew?', /2070/); // corridor -> captain quarter

    $4(3, 3, 2, 3, true); // lobby -> corridor

    $4(2, 3, 1, 3, true); // corridor -> office

    $4(2, 3, 2, 2, true); // corridor -> office

    $4(3, 3, 3, 2); // lobby -> corridor

    $4(3, 2, 3, 1); // corridor -> corridor

    $4(3, 1, 3, 0, true, 'red', 'red'); // corridor -> oxy gen

    $4(3, 0, 4, 0, true, 'core-comp').$W6('ngallegos', 'What version of SIG-18 artificial intelligence module was most successful?', /19[^0-9]38[^0-9]2/i); // oxy gen -> comp core

    $4(3, 0, 2, 0, true); // oxy gen -> power gen

    $4(6, 6, 5, 6, true); // back corridor -> kitchen

    $4(1, 6, 1, 7, true, 'black', 'black'); // back door o
  }

  $S2(x, y) {
    this.$k6.$z(x, y);

    this.$k6.$L4(x, y).$_5();
  }

}
;// CONCATENATED MODULE: ./src/Container.js
class Container {
  constructor(element, ref, x, y, w, h) {
    this.$D4 = element;
    this.$U6 = ref;
    this._x = x;
    this._y = y;
    this._w = w;
    this._h = h;
    this.$i5();
    window.addEventListener('resize', () => this.$i5());
    window.addEventListener('load', () => this.$i5());
  }

  $i5() {
    var scale = this.$U6.width / 1920;

    var css = (name, value) => {
      this.$D4.style[name] = Math.round(scale * value) + "px";
    };

    css('width', this._w);
    css('height', this._h);
    css('left', this._x);
    css('top', this._y);
    this.$D4.style.fontSize = scale + "em";
  }

}
;// CONCATENATED MODULE: ./src/index.js











var hasCorrectBrowser = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

if (!hasCorrectBrowser) {
  alert("This game was created for Gynvael's Winter GameDev Challenge 2018/19 and should be played in latest Chrome! Browser support was limited to reduce file size and fit 125KB limit (see the challenge rules for more info). It may not work properly in your browser!");
}

var screenAElement, screenBElement, overlayElement;
screenAElement = document.createElement('DIV');
screenAElement.id = "screen-a";
document.body.appendChild(screenAElement);
screenBElement = document.createElement('DIV');
screenBElement.id = "screen-b";
document.body.appendChild(screenBElement);
overlayElement = document.createElement('IMG');
overlayElement.id = "overlay";
overlayElement.src = '../gwgc201819_overlay.png';
document.body.appendChild(overlayElement);
var screenA = new Container(screenAElement, overlayElement, 64, 185, 1025, 770);
var screenB = new Container(screenBElement, overlayElement, 1140, 77, 721, 482);
var builder = new MapBuilder();
builder.$g6(document);
var map = builder.$d5();
var system = builder.$f4();
var sideScreen = builder.$f4().$B();
var terminal = builder.$f4().$H2();
terminal.$j6.$i3(document.querySelector('#screen-a'));
sideScreen.$j6.$i3(document.querySelector('#screen-b'));
system.$X(new HelpCommand());
system.$X(new SfxCommand());
system.$X(new ComCommand());

if (false) {} else {
  var intro = new Intro(system);
  intro.$h6(hasCorrectBrowser);
}

window.onbeforeunload = function () {
  return 'Are you sure you want to leave?';
};
/******/ })()
;