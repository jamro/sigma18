import Command from '../Command.js';

export default class HelpCommand extends Command {

  getName() {
    return 'help';
  }

  getHelp() {
    return "List all available commands";
  }

  exec(command) {
    this.println("Available commands:");
    let commandList = this._terminal.getCommandList();
    for(let i=0; i < commandList.length; i++) {
      let command = commandList[i];
      let help = command.getHelp();
      let name = command.getName();
      if(help && name) {
        this.println(` * <strong>${name}</strong> - ${help}`);
      }
    }
    this.println("Run <strong>[command] help</strong> for more info");
    this.playDoneSound(true);
  }
}
