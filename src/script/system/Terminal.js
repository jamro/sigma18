

export default class Terminal {

  constructor(view) {
    this._view = view;
    this._commandProcessorList = [];
    view.onSubmit((cmd) => this.commandReceived(cmd));
  }

  commandReceived(command) {
    this._view.print(`<div class="terminal-command">s|&gt;|s ${command}</div>`);
    //clean command up
    command = command.split(" ");
    command = command.map((cmd) => cmd.trim());
    command = command.filter((cmd) => cmd != '');
    for(let processor of this._commandProcessorList) {
      if(processor.validate(command)) {
        processor.exec(command);
        return;
      }
    }
    this._view.println(`Error: Command s|${command[0]}|s not found!`);
    this._view.playErr();
  }

  installCommand(commandProcessor) {
    commandProcessor.setTerminal(this);
    this._commandProcessorList.push(commandProcessor);
    this._commandProcessorList.sort((a, b) => {
      if(a.getName() == 'help') return -1;
      if(b.getName() == 'help') return 1;
      if(a.getName() > b.getName()) return 1;
      if(a.getName() < b.getName()) return -1;
      return 0;
    });
  }

  getCommandList() {
    return this._commandProcessorList;
  }

  enableSound(state) {
    this._view.enableSound(state);
  }
}
