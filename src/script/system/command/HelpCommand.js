import Command from '../Command.js';

export default class HelpCommand extends Command {

  getName() {
    return 'help';
  }

  getHelp() {
    return "List all available commands";
  }

  exec(command) {
    this._terminal.println("Available commands:");
    let commandList = this._terminal.getCommandList();
    for(let i=0; i < commandList.length; i++) {
      let command = commandList[i];
      let help = command.getHelp();
      let name = command.getName();
      if(help && name) {
        this._terminal.println(` * s|${name}|s - ${help}`);
      }
    }
    this._terminal.println("Run s|[command] help|s for more info");
    this.playDoneSound(true);
  }
}
