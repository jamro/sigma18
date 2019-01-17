import Command from '../Command.js';

export default class HelpCommand extends Command {

  getName$$() {
    return 'help';
  }

  getHelp$$() {
    return "List all available commands";
  }

  exec$$(command) {
    this._terminal$$.println$$("Available commands:");
    let commandList = this._terminal$$.getCommandList$$();
    for(let i=0; i < commandList.length; i++) {
      let command = commandList[i];
      let help = command.getHelp$$();
      let name = command.getName$$();
      if(help && name) {
        this._terminal$$.println$$(` * s{${name}}s - ${help}`);
      }
    }
    this._terminal$$.println$$("Run s{[command] help}s for more info");
    this._terminal$$.println$$("");
    this._terminal$$.println$$("-------------------");
    this._terminal$$.println$$("If you really got stuck and you have no idea what to do, ask marines for a hint. Type s{com hint}s and press ENTER");
    this._terminal$$.soundPlayer$$.play$$('ok');
  }
}
