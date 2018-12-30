import Command from '../Command.js';
import {positionToString} from '../../common/utils.js';

export default class ComCommand extends Command {

  constructor(squad) {
    super();
    this._squad = squad;
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
    from = from ? from : 'commander';
    this.print(`<div class="terminal-chat"><small>${from}</small><p>&quot;${msg}&quot;</p></div>`);
  }

  execStatus() {
    let pos = this._squad.getPosition();
    pos = positionToString(pos.x, pos.y);
    this.printChat(`Our current position is ${pos}.`);
  }

  execGo(command) {
    let direction = command.length >= 3 ? command[2] : '';
    let dx = 0;
    let dy = 0;
    let directionFull;
    switch(direction.toLowerCase()) {
      case 'n':
        dy = -1;
        directionFull = 'north';
        break;
      case 's':
        dy = 1;
        directionFull = 'south';
        break;
      case 'e':
        dx = 1;
        directionFull = 'east';
        break;
      case 'w':
        dx = -1;
        directionFull = 'west';
        break;
      default:
        this.print('Error! Unknown direction. Available options are: n, e, s, w');
        return;
    }

    this.printChat(`Exploring location on ${directionFull}... Move! Move! Move!`);
    this.disableInput();
    this._squad.requestMove(dx, dy, () => {
      let pos = this._squad.getPosition();
      pos = positionToString(pos.x, pos.y);
      this.printChat(`Location ${pos} secured.`);
      this.enableInput();
    })

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
