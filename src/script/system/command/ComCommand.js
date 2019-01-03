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

    this._squad.requestMove(direction, (items) => {
      items = items || [];
      let disks = items.filter((i) => i.getType() == 'disk');
      let appNames = disks.map((d) => d.getCommand().getName());
      if(disks.length > 0) {
        setTimeout(() => {
          this.playDoneSound(true);
          this.println('');
          this.println(`Transferring disk data: s|${appNames.join(', ')}|s app.`);
          this.showProgress(() => {
            this.println('App downloaded');
            this.println('');

            setTimeout(() => {
              this.println(`Installing s|${appNames.join(', ')}|s app.`);
              this.showProgress(() => {
                disks.forEach((d) => this._terminal.installCommand(d.getCommand()));
                this.println('Done.');
                this.println('');
                appNames.forEach((a) => this.println(`Run s|${a}  help|s for more info.`));
                this.playDoneSound(true);
                this.enableInput();
              });
            }, 500);
          });
        }, 1000);
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
