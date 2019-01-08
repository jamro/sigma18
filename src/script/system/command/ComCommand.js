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
    this._terminal.getSoundPlayer$$().play$$('chat');
    this._terminal.printChat$$(`Commander, what's going on?`, 'hacker');
    this._squad.requestStatus$$(() => {
      this.enableInput$$();
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
    this._terminal.getSoundPlayer$$().play$$('chat');
    this._terminal.printChat$$(`Commander, check the door on the ${this._directionMap[direction]}.`, 'hacker');

    this._squad.requestMove$$(direction, (items) => {
      items = items || [];
      let disks = items.filter((i) => i.getType$$() == 'disk');
      let appNames = disks.map((d) => d.getCommand$$().getName$$());
      if(disks.length > 0) {

        this._terminal.sequence$$(
          {c: 'sound', d: 'ok', t: 1000},
          "",
          `Transferring disk data: s{${appNames.join(', ')}}s app.`,
          {c: 'load'},
          'App downloaded',
          '',
          {c: 'ln', d: `Installing s{${appNames.join(', ')}}s app.`, t: 500},
          {c: 'load'},
          {c: () => {
            disks.forEach((d) => this._terminal.installCommand$$(d.getCommand$$()));
          }},
          'Done.',
          '',
          {c: () => {
            appNames.forEach((a) => this._terminal.println$$(`Run s{${a}  help}s for more info.`));
          }},
          {c: 'sound', d: 'ok'},
          {c: 'on'}
        );
      } else {
        this.enableInput$$();
      }
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
