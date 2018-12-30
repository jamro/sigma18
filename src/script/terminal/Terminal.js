

export default class Terminal {

  constructor(view) {
    this._view = view;
    this._commandProcessorList = [];
    view.onSubmit((cmd) => this.commandReceived(cmd));
  }

  commandReceived(command) {
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
    this._view.println(`Error: Command <strong>${command[0]}</strong> not found!`);
  }

  installCommand(commandProcessor) {
    commandProcessor.setTerminal(this);
    this._commandProcessorList.push(commandProcessor);
  }

  getCommandList() {
    return this._commandProcessorList;
  }
}
