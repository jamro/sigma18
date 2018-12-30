import Command from '../Command.js';

export default class HelpCommand extends Command {

  getName() {
    return 'help';
  }

  getHelp() {
    return "List all available commands";
  }

  validate(command) {
    return (command[0].toLowerCase() == 'help');
  }

  exec(command) {
    this.println("");
    this.println("Available commands:");
    let commandList = this._terminal.getCommandList();
    for(let command of commandList) {
      let help = command.getHelp();
      let name = command.getName();
      if(help && name) {
        this.println(` * <strong>${name}</strong> - ${help}`);
      }
    }
  }
}
