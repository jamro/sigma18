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
      this._terminal.println("<pre>Station ID | Location | Status  | Docked Unit\n" +
                        "-----------|----------|---------|-----------------\n" +
                        "DS001      | [C:9]    | Empty   | - \n" +
                        "DS002      | [D:10]   | Ready   | Rescue Capsule\n" +
                        "DS003      | [E:9]    | Damaged | OSS Sierra-23</pre>");
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
        this._terminal.println(`Error: Cannot start launching sequence at ${id}.`);
        this.enableInput();
        this.playDoneSound(false);
        return;
      }
      // @TODO: update door id
      if(!this._capsuleDoor.isClosed()) {
        this._terminal.println(`Error: Close the door of the station before starting launch sequence.`);
        this.enableInput();
        this.playDoneSound(false);
        return;
      }
      if(pass != 'U317AB') {
        this._terminal.println(`Error: Authorization failed. Incorrect pass code.`);
        this.enableInput();
        this.playDoneSound(false);
        return;
      }
      let pos = this._map.getSquadPosition();
      // @TODO: update capsule position
      if(pos.x != 3 || pos.y != 9) {
        this._terminal.println(`Error: Cannot launch empty capsule without passengers.`);
        this.enableInput();
        this.playDoneSound(false);
        return;
      }

      this._terminal.sequence(
        `Authorization... ok`,
        `Starting launching sequence at ${id}`,
        `Health check:`,
        {c: 'load'},
        `All systems up and running`,
        `Opening docking gates...`,
        `Staring the engine...`,
        `Enabling shields...`,
        `Disconnecting from docking port...`,
        {c: 'ln', d: ``, t: 2000},
        `Done... Unit launched successfully`,
        `Closing docking gates`,
        `Launching sequence completed`,
        {c: 'sound', d: 'ok', t: 0},
        {c: 'chat', d: 's|GOOD JOB SOLIDER!|s<br/>\n We are saved! Going back home!', f: 'commander', t: 1000},
        {c: 'sound', d: 'com', t: 0},
        {c: 'chat', d: 'Roger that! Good luck commander!', f: 'hacker', t: 1000},
        {c: 'sound', d: 'com', t: 0},
        {c: 'ln', d: '<div class="finito">THE END</div>', t: 3000},
        {c: 'sound', d: 'ok', t: 0}
      );
    });
  }

  execStatus(command) {
    this.disableInput();
    let id = command.length >= 3 ? command[2].toUpperCase() : '';
    this.connect('Dock', '10.43.23.91', [`Station record found`], () => {
      let gates, port, net, pressure, health;
      let unit = [];
      let ok = 's|ok|s';
      let damaged = 'r|damaged|r';
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
          gates = 'r|open|r';
          port = damaged;
          net = 'r|disconnected|r';
          pressure = 'r|depressurized|r';
          health = damaged;
          break;
        default:
          this._terminal.println(`Error: Dock station ${id} not found`);
          this.enableInput();
          return;
      }
      switch(id) {
        case 'DS001':
          unit = ['* s|none|s'];
          break;
        case 'DS002':
          unit = [
            '* Name: s|Rescue Capsule|s',
            '* Fuel: s|94%|s'
          ];
          break;
        case 'DS003':
          unit = [
            '* Name: s|OSS Sierra-23|s',
            '* Fuel: s|8%|s'
          ];
          break;
      }
      if(id == 'DS002' || id == 'DS003') {
        unit = unit.concat([
          `* Cargo: s|none|s`,
          `* Engine: ${health}`,
          `* Shields: ${health}`,
          `* Steering System: ${health}`,
          `* Radar: s|ok|s`,
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
      this._terminal.sequence(msg);
    });
  }

  execHelp() {
    this._terminal.sequence(
      "Use this command to operate docking stations and rescue capsules",
      "Available commands are:",
      '',
      "s|dock list|s",
      "Lists status of all docking stations",
      '',
      "s|dock status [stationId]|s",
      "Health report of the station and docked spaceship",
      '',
      "s|dock launch [stationId] [pass]|s",
      "Launch spaceship docked at [stationId].",
      "Password ([pass] argument) is required to run this operation.",
      "For example: s|dock launch DS001 MySecretPassword|s",
      {c: 'sound', d: 'ok', t:0}
    );
  }

}
