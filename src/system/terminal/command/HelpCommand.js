import Command from '../Command.js';

export default class HelpCommand extends Command {

  constructor() {
    super();
    this.name$$ = 'help';
    this.help$$ = 'List all available commands';
  }

  exec$$(command) {
    this._terminal$$.println$$("Available commands:");
    let commandList = this._system$$.getCommandList$$();
    for(let i=0; i < commandList.length; i++) {
      let command = commandList[i];
      let help = command.help$$;
      let name = command.name$$;
      if(help && name) {
        this._terminal$$.println$$(` * s{${name}}s - ${help}`);
      }
    }
    this._terminal$$.println$$("Run s{[command] help}s for more info. For example: s{com help}s");
    this._terminal$$.println$$("");
    this._terminal$$.println$$("-------------------");
    this._terminal$$.println$$("If you really got stuck and you have no idea what to do, ask marines for a hint. Type s{com hint}s and press ENTER");
    this._system$$.getSoundPlayer$$().play$$('ok');
  }
}
