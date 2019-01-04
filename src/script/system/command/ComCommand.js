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

  getName() {
    return 'com';
  }

  getHelp() {
    return "Communication with squad of marines in the field";
  }

  execStatus() {
    this.disableInput();
    this.playChatSound();
    this.printChat(`Commander, what's going on?`, 'hacker');
    this._squad.requestStatus(() => {
      this.enableInput();
    });
  }

  execGo(command) {
    let direction = command.length >= 3 ? command[2] : '';
    direction = direction.toLowerCase();
    if(!this._directionMap[direction]) {
      this.playDoneSound(false);
      this.println(`Error: unknown direction ${direction}`);
      return;
    }
    this.disableInput();
    this.playChatSound();
    this.printChat(`Commander, check the door on the ${this._directionMap[direction]}.`, 'hacker');

    this._terminal.sequence(

    );
    this._squad.requestMove(direction, (items) => {
      items = items || [];
      let disks = items.filter((i) => i.getType() == 'disk');
      let appNames = disks.map((d) => d.getCommand().getName());
      if(disks.length > 0) {

        this._terminal.sequence(
          {c: 'sound', d: 'ok', t: 1000},
          "",
          `Transferring disk data: s|${appNames.join(', ')}|s app.`,
          {c: 'load'},
          'App downloaded',
          '',
          {c: 'ln', d: `Installing s|${appNames.join(', ')}|s app.`, t: 500},
          {c: 'load'},
          {c: () => {
            disks.forEach((d) => this._terminal.installCommand(d.getCommand()));
          }},
          'Done.',
          '',
          {c: () => {
            appNames.forEach((a) => this.println(`Run s|${a}  help|s for more info.`));
          }},
          {c: 'sound', d: 'ok'},
          {c: 'on'}
        );
      } else {
        this.enableInput();
      }
    });
  }

  execHelp() {
    this.println("Use this command to communicate with squad of marines in the field");
    this.println("Available commands are:");
    this.println('');
    this.println("s|com status|s");
    this.println("Ask marines to send status report from the field.");
    this.println('');
    this.println("s|com go [direction]|s");
    this.println("Ask marines to explore next location in defined direction.");
    this.println("Possible directions are:");
    this.println("* s|n|s - North");
    this.println("* s|e|s - East");
    this.println("* s|s|s - South");
    this.println("* s|w|s - West");
    this.println("For example: s|com go n|s");
    this.playDoneSound(true);
  }
}
