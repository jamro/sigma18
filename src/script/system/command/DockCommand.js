import Command from '../Command.js';

export default class DockCommand extends Command {

  constructor(map, capsuleDoor) {
    super();
    this._map = map;
    this._capsuleDoor = capsuleDoor;
    this._fuel = {
      DS001: 0,
      DS002: 0,
      DS003: 8,
    };
  }

  getName$$() {
    return 'dock';
  }

  getHelp$$() {
    return 'Operate docking stations and rescue capsules';
  }

  execList() {
    this.disableInput$$();
    this._terminal.connect$$('docker', ['Query station list...'], () => {
      // @TODO update location of dock stations
      this._terminal.println$$("<pre>Station ID | Location | Status  | Docked Unit\n" +
                        "-----------|----------|---------|-----------------\n" +
                        "DS001      | [C:9]    | Empty   | - \n" +
                        "DS002      | [D:10]   | Ready   | Rescue Capsule\n" +
                        "r{DS003}r      | r{[E:9]}r    | r{Damaged}r | r{ISS Sierra-23}r</pre>");
      this.enableInput$$();
      this._terminal.getSoundPlayer$$().play$$('ok');
    });
  }

  execLaunch(command) {
    let id = command.length >= 3 ? command[2].toUpperCase() : '';
    if(!id) {
      this._terminal.println$$(`Error: StationId argument is required. Run s{dock help}s for more info.`);
      this._terminal.getSoundPlayer$$().play$$('err');
      return;
    }
    this.disableInput$$();
    this._terminal.connect$$('docker', [], () => {
      this._terminal.println$$("Authorization is required!");
      this._terminal.prompt$$('Auth Code:', (pass) => {
        if(pass.toUpperCase() != 'U317AB') {
          this._terminal.println$$("");
          this._terminal.println$$(`Error: Authorization failed. Incorrect pass code.`);
          this.enableInput$$();
          this._terminal.getSoundPlayer$$().play$$('err');
          return;
        }
        this._terminal.println$$("Authorization... ok");
        this._terminal.println$$("");

        if(id != 'DS002') {
          this._terminal.println$$(`Error: Cannot start launching sequence at ${id}.`);
          this.enableInput$$();
          this._terminal.getSoundPlayer$$().play$$('err');
          return;
        }
        if(!this._capsuleDoor.isClosed$$()) {
          this._terminal.println$$(`Error: Close the door of the station before starting launch sequence.`);
          this.enableInput$$();
          this._terminal.getSoundPlayer$$().play$$('err');
          return;
        }
        let pos = this._map.getSquadPosition$$();
        // @TODO: update capsule position
        if(pos.x != 3 || pos.y != 9) {
          this._terminal.println$$("");
          this._terminal.println$$(`Error: Cannot launch empty capsule without passengers.`);
          this.enableInput$$();
          this._terminal.getSoundPlayer$$().play$$('err');
          return;
        }
        if(this._fuel.DS002 <= 50) {
          this._terminal.println$$("");
          this._terminal.println$$(`Error: Spaceship at ${id} has low fuel level! Launch procedure stopped! See s{dock status ${id}}s for more details`);
          this.enableInput$$();
          this._terminal.getSoundPlayer$$().play$$('err');
          return;
        }

        this._terminal.sequence$$(
          `Starting launching sequence at ${id}`,
          `Modules health check:`,
          {c: 'load'},
          `All systems up and running`,
          {c:'ln', d:`Opening docking gates...`, t:700},
          {c:'ln', d:`Staring the engine...`, t:900},
          {c:'ln', d:`Enabling shields...`, t:800},
          {c:'ln', d:`Disconnecting from docking port...`, t:750},
          {c: 'ln', d: ``, t: 2000},
          `Done... Unit launched successfully`,
          {c:'ln', d:`Closing docking gates`, t:1000},
          `Launching sequence completed`,
          {c: 'sound', d: 'ok', t: 0},
          {c: 'chat', d: 's{GOOD JOB SOLDIER!}s<br/>\n We are saved! Going back home!', f: 'commander', t: 2000},
          {c: 'chat', d: 'Roger that! Good luck commander!', f: 'hacker'},
          {c: 'ln', d: '<div class="finito">THE END</div>', t: 1000},
          {c: 'sound', d: 'ok', t: 0}
        );
      });
    });
  }

  execFuel(command) {
    let id = command.length >= 3 ? command[2].toUpperCase() : '';
    if(!id) {
      this._terminal.println$$(`Error: StationId argument is required. Run s{dock help}s for more info.`);
      this._terminal.getSoundPlayer$$().play$$('err');
      return;
    }
    this._fuel[id] = 100;
    let msg;
    if(id == 'DS002' || id == 'DS003') {
      msg = [
        `Fueling spaceship at ${id}...`,
        {c: 'load'},
        ``,
        `Done. Fuel level: 100%`,
        {c: 'sound', d:'ok'},
        {c: 'on'}
      ];
    } else {
      msg = [
        `Error: No spaceship at ${id}`,
        {c: 'sound', d:'err'},
        {c: 'on'}
      ];
    }


    this.disableInput$$();
    this._terminal.connect$$('pump-station', msg, () => {});
  }

  execStatus(command) {
    this.disableInput$$();
    let id = command.length >= 3 ? command[2].toUpperCase() : '';
    this._terminal.connect$$('docker', [`Station record found`], () => {
      let gates, port, net, pressure, health;
      let unit = [];
      let ok = 's{ok}s';
      let damaged = 'r{damaged}r';
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
          gates = 'r{open}r';
          port = damaged;
          net = 'r{disconnected}r';
          pressure = 'r{depressurized}r';
          health = damaged;
          break;
        default:
          this._terminal.println$$(`Error: Dock station ${id} not found`);
          this.enableInput$$();
          return;
      }
      switch(id) {
        case 'DS001':
          unit = ['* s{none}s'];
          break;
        case 'DS002':
          unit = [
            '* Name: s{Rescue Capsule}s'
          ];
          break;
        case 'DS003':
          unit = [
            '* Name: s{OSS Sierra-23}s'
          ];
          break;
      }
      if(id == 'DS002' || id == 'DS003') {
        unit = unit.concat([
          this._fuel[id] > 50 ? `* Fuel: s{${this._fuel[id]}%}s` : `* Fuel: r{${this._fuel[id]}%}r`,
          `* Cargo: s{none}s`,
          `* Engine: ${health}`,
          `* Shields: ${health}`,
          `* Steering System: ${health}`,
          `* Radar: s{ok}s`,
          `* Communication Systems: ${health}`
        ]);
      }

      let msg = [
        `Health check of ${id}...`,
        ``,
        `Dock station:`,
        `* Docking gates: ${gates}`,
        `* Docking port: ${port}`,
        `* Network: ${net}`,
        `* Air pressure: ${pressure}`,
        ``,
        `Docked Unit:`
      ];
      msg = msg.concat(unit, [
        {c: 'sound', d: 'ok', t: 0},
        {c: 'on'}
      ]);
      this._terminal.sequence$$(msg);
    });
  }

  execHelp() {
    this._terminal.sequence$$(
      "Use this command to operate docking stations and rescue capsules",
      "Available commands are:",
      '',
      "s{dock list}s",
      "Lists status of all docking stations",
      '',
      "s{dock status [stationId]}s",
      "Health report of the station and docked spaceship",
      '',
      "s{dock fuel [stationId]}s",
      "Fuel spaceship docked at provided station",
      '',
      "s{dock launch [stationId]}s",
      "Launch spaceship docked at [stationId].",
      "For example: s{dock launch DS001}s",
      {c: 'sound', d: 'ok', t:0}
    );
  }

}
