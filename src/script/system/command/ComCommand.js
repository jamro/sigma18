import Command from '../Command.js';

export default class ComCommand extends Command {

  constructor(squad, map, terminal) {
    super();
    this._terminal = terminal;
    this._squad = squad;
    this._map = map;
    this._directionMap = {
      n: 'north',
      s: 'south',
      e: 'east',
      w: 'west',
    };
  }

  getName$$() {
    return 'com';
  }

  getHelp$$() {
    return "Communication with squad of marines in the field";
  }

  execStatus() {
    this.disableInput$$();
    this._terminal.printChat$$(`Commander, what's going on?`, 'hacker', () => {
      this._squad.requestStatus$$(() => {
        this.enableInput$$();
      });
    });
  }

  execGo(command) {
    let direction = command.length >= 3 ? command[2] : '';
    direction = direction.toLowerCase();
    if(!this._directionMap[direction]) {
      this._terminal.getSoundPlayer$$().play$$('err');
      this._terminal.println$$(`Error: unknown direction ${direction}`);
      return;
    }
    this.disableInput$$();
    this._terminal.printChat$$(`Commander, check the door on the ${this._directionMap[direction]}.`, 'hacker', () => {
      this._squad.requestMove$$(direction, (items) => {
        items = items || [];
        let disks = items.filter((i) => i.getType$$() == 'disk');
        if(disks.length > 0) {
          this._terminal.uploadSoftware$$(disks, () => {
            this.enableInput$$();
          });
        } else {
          this.enableInput$$();
        }
      });
    });
  }

  execHelp() {
    this._terminal.sequence$$(
      "Use this command to communicate with squad of marines in the field",
      "Available commands are:",
      '',
      "s{com status}s",
      "Ask marines to send status report from the field.",
      '',
      "s{com go [direction]}s",
      "Ask marines to explore next location in defined direction.",
      "Possible directions are:",
      "* s{n}s - North",
      "* s{e}s - East",
      "* s{s}s - South",
      "* s{w}s - West",
      "For example: s{com go n}s",
      {c: 'sound', d: 'ok', t:0}
    );
  }
}
