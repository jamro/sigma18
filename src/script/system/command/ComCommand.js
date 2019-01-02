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
    this.printChat(`Commander, what's going on?`, 'hacker');
    setTimeout(() => {
      let pos = this._squad.getPosition();
      let msg = `Our current position is ${pos.toString()}. ${this._map.getRoom(pos.x, pos.y).getDescription()}<br/>\n<br/>\nPossible ways out:<br/>`;
      let doors = this._map.getRoom(pos.x, pos.y).getDoors();

      for(let direction in doors) {
        if(doors[direction]) {
          let state = doors[direction].isClosed() ? 'Locked' : 'Opened';
          msg += ` * ${state} door on the ${this._directionMap[direction]} (ID: ${doors[direction].getId()})<br/>`;
        }
      }
      msg += "<br/>\nInventory:<br/>\n";
      if(this._squad.getInventory().length == 0) {
        msg += ' * nothing<br/>\n';
      }
      this._squad.getInventory().forEach((i) => {
        msg += ` * ${i}<br/>\n`;
      });
      this.printChat(msg, 'commander');
      this.enableInput();
    }, 500);
  }

  execGo(command) {
    let direction = command.length >= 3 ? command[2] : '';
    let dx = 0;
    let dy = 0;
    direction = direction.toLowerCase();
    if(!this._directionMap[direction]) {
      this.println(`Error: unknown direction ${direction}`);
      return;
    }
    this.disableInput();
    this.printChat(`Commander, check the door on the ${this._directionMap[direction]}.`, 'hacker');
    setTimeout(() => {
      let invalidReason = this._squad.validateMove(direction);
      if(invalidReason) {
        this.printChat(`Cannot move to the ${this._directionMap[direction]}! ${invalidReason}`, 'commander');
        this.enableInput();
      } else {
        this.printChat(`Exploring location on the ${this._directionMap[direction]}... Move! Move! Move!`, 'commander');

        this._squad.requestMove(direction, (items) => {
          let pos = this._squad.getPosition();
          let msg = `Location ${pos.toString()} secured. ${this._map.getRoom(pos.x, pos.y).getDescription()}`;

          if(items.length > 0) {
            msg += "<br/><br/>We have found:<br/>";
            items.forEach((i) => msg += ` * ${i}<br/>`);
          }
          this.printChat(msg, 'commander');

          let disks = items.filter((i) => i.getType() == 'disk');
          let appNames = disks.map((d) => d.getCommand().getName());
          if(disks.length > 0) {
            setTimeout(() => {
              this.println('');
              this.println(`Transferring disk data: <strong>${appNames.join(', ')}</strong> app.`);
              this.showProgress(() => {
                this.println('App downloaded');
                this.println('');
                this.println(`Installing <strong>${appNames.join(', ')}</strong> app.`);
                this.showProgress(() => {
                  disks.forEach((d) => this._terminal.installCommand(d.getCommand()));
                  this.println('Done.');
                  this.println('');
                  appNames.forEach((a) => this.println(`Run <strong>${a}  help</strong> for more info.`));
                  this.enableInput();
                });
              });
            }, 1000);
          } else {
            this.enableInput();
          }
        });
      }
    }, 500);
  }

  execHelp() {
    this.println("Use this command to communicate with squad of marines in the field");
    this.println("Available commands are:");
    this.println('');
    this.println("<strong>com status</strong>");
    this.println("Ask marines to send status report from the field.");
    this.println('');
    this.println("<strong>com go [direction]</strong>");
    this.println("Ask marines to explore next location in defined direction.");
    this.println("Possible directions are:");
    this.println("* <strong>n</strong> - North");
    this.println("* <strong>e</strong> - East");
    this.println("* <strong>s</strong> - South");
    this.println("* <strong>w</strong> - West");
    this.println("For example: <strong>com go n</strong>");
  }
}
