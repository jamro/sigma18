import Command from '../Command.js';

export default class ComCommand extends Command {

  constructor(squad, map) {
    super();
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

  exec(command) {
    let subcommand = command.length >= 2 ? command[1] : "";

    switch(subcommand.toLowerCase()) {
      case 'help':
        return this.execHelp();
      case 'go':
        return this.execGo(command);
      case 'status':
        return this.execStatus();
      default:
        this.println('Command not found! Run <strong>com help</strong> for more info.');
    }
  }

  printChat(msg, from) {
    from = from ? from : 'hacker';
    let side = (from == 'hacker') ? 'terminal-chat-left' : 'terminal-chat-right';
    this.print(`<div class="terminal-chat ${side}"><small>${from}</small><p>${msg}</p></div>`);
  }

  execStatus() {
    this.disableInput();
    this.printChat(`Commander, what's going on?`, 'hacker');
    setTimeout(() => {
      let pos = this._squad.getPosition();
      let msg = `Our current position is ${pos.toString()}. <br/>\n<br/>\nPossible ways out:<br/>`;
      let doors = this._map.getRoom(pos.x, pos.y).getDoors();

      for(let direction in doors) {
        if(doors[direction]) {
          let state = doors[direction].isClosed() ? 'Locked' : 'Open';
          msg += ` * ${state} door on the ${this._directionMap[direction]} (ID: ${doors[direction].getId()})<br/>`;
        }
      }
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

        this._squad.requestMove(direction, (result) => {
          let pos = this._squad.getPosition().toString();
          this.printChat(`Location ${pos} secured.`, 'commander');
          this.enableInput();
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
