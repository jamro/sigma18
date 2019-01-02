import Command from '../Command.js';

export default class DockCommand extends Command {

  constructor(map, capsuleDoor) {
    super();
    this._map = map;
    this._capsuleDoor = capsuleDoor;
  }

  getName() {
    return 'dock';
  }

  getHelp() {
    return 'Operate docking stations and rescue capsules';
  }

  execList() {
    this.disableInput();
    this.connect('Dock', '10.43.23.91', ['Query station list...'], () => {
      // @TODO update location of dock stations
      this.println("<pre>Station ID | Location | Status  | Docked Unit\n" +
                        "-----------|----------|---------|-----------------\n" +
                        "DS001      | [C:4]    | Empty   | - \n" +
                        "DS002      | [D:5]    | Ready   | Rescue Capsule\n" +
                        "DS003      | [E:4]    | Damaged | OSS Sierra-23</pre>");
      this.enableInput();
      this.playDoneSound(true);
    });
  }

  execLaunch(command) {
    let id = command.length >= 3 ? command[2].toUpperCase() : '';
    let pass = command.length >= 4 ? command[3].toUpperCase() : '';
    this.disableInput();
    this.connect('Dock', '10.43.23.91', [], () => {

      if(id == 'DS001' || id == 'DS003') {
        this.println(`Error: Cannot start launching sequence at ${id}.`);
        this.enableInput();
        this.playDoneSound(false);
        return;
      }
      // @TODO: update door id
      if(!this._capsuleDoor.isClosed()) {
        this.println(`Error: Close the door of the station before starting launch sequence.`);
        this.enableInput();
        this.playDoneSound(false);
        return;
      }
      if(pass != 'U317AB') {
        this.println(`Error: Authorization failed. Incorrect pass code.`);
        this.enableInput();
        this.playDoneSound(false);
        return;
      }
      let pos = this._map.getSquadPosition();
      // @TODO: update capsule position
      if(pos.x != 4 || pos.y != 3) {
        this.println(`Error: Cannot launch empty capsule without passengers.`);
        this.enableInput();
        this.playDoneSound(false);
        return;
      }

      this.typeText([
        `Authorization... ok`,
        `Starting launching sequence at ${id}`,
        `Health check:`
      ], () => {
        this.showProgress(() => {
          this.typeText([
            `All systems up and running`,
            `Opening docking gates...`,
            `Staring the engine...`,
            `Enabling shields...`,
            `Disconnecting from docking port...`,
            ``
          ], () => {
            setTimeout(()=> {
              this.typeText([
                `Unit launched`,
                `Closing docking gates`,
                `Launching sequence completed`
              ], () => {
                this.playDoneSound(true);
                setTimeout(() => {
                  this.playChatSound();
                  this.printChat('<strong>GOOD JOB SOLIDER!</strong><br/>\n We are saved! Going back home!', 'commander');
                  setTimeout(() => {
                    this.playChatSound();
                    this.printChat('Roger that! Good luck commander!', 'hacker');
                    setTimeout(() => {
                      this.playDoneSound(true);
                      this.println('<div class="finito">THE END</div>');
                    }, 3000);
                  }, 1000);
                }, 1000);
              });
            });
          });
        });
      });

    });
  }

  execStatus(command) {
    this.disableInput();
    let id = command.length >= 3 ? command[2].toUpperCase() : '';
    this.connect('Dock', '10.43.23.91', [`Station record found`], () => {
      let gates, port, net, pressure, health;
      let unit = [];
      let ok = '<strong>ok</strong>';
      let damaged = '<strong class="red">damaged</strong>';
      switch(id) {
        case 'DS001':
        case 'DS002':
          gates = ok;
          port = ok;
          net = ok;
          pressure = ok;
          health = ok;
          break;
        case 'DS003':
          gates = '<strong class="red">open</strong>';
          port = damaged;
          net = '<strong class="red">disconnected</strong>';
          pressure = '<strong class="red">depressurized</strong>';
          health = damaged;
          break;
        default:
          this.println(`Error: Dock station ${id} not found`);
          this.enableInput();
          return;
      }
      switch(id) {
        case 'DS001':
          unit = ['* <strong>none</strong>'];
          break;
        case 'DS002':
          unit = [
            '* Name: <strong>Rescue Capsule</strong>',
            '* Fuel: <strong>94%</strong>'
          ];
          break;
        case 'DS003':
          unit = [
            '* Name: <strong>OSS Sierra-23</strong>',
            '* Fuel: <strong>8%</strong>'
          ];
          break;
      }
      if(id == 'DS002' || id == 'DS003') {
        unit = unit.concat([
          `* Cargo: <strong>none</strong>`,
          `* Engine: ${health}`,
          `* Shields: ${health}`,
          `* Steering System: ${health}`,
          `* Radar: <strong>ok</strong>`,
          `* Communication Systems: ${health}`
        ]);
      }

      let msg = [
        `Health check of ${id}...`,
        ``,
        `Dock station:`,
        `* Docking gates: <strong>${gates}</strong>`,
        `* Docking port: <strong>${port}</strong>`,
        `* Network: <strong>${port}</strong>`,
        `* Air pressure: <strong>${pressure}</strong>`,
        ``,
        `Docked Unit:`
      ];
      this.typeText(msg.concat(unit), () => {
        this.enableInput();
        this.playDoneSound(true);
      });
    });
  }

  execHelp() {
    this.println("Use this command to operate docking stations and rescue capsules");
    this.println("Available commands are:");
    this.println('');
    this.println("<strong>dock list</strong>");
    this.println("Lists status of all docking stations");
    this.println('');
    this.println("<strong>dock status [stationId]</strong>");
    this.println("Health report of the station and docked space ship");
    this.println('');
    this.println("<strong>dock launch [stationId] [pass]</strong>");
    this.println("Launch space ship docked at [stationId].");
    this.println("Password ([pass] argument) is required to run this operation.");
    this.println("For example: <strong>dock launch DS001 MySecretPassword</strong>");
    this.playDoneSound(true);
  }

}
