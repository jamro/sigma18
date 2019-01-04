

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
    this._view.playSound('err');
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

  getView() {
    return this._view;
  }


  playOk() {
    this._view.playSound('ok');
  }

  playErr() {
    this._view.playSound('err');
  }

  playChat() {
    this._view.playSound('com');
  }

  startBeepLoop() {
    this._view.playSound('beep');
  }

  stopBeepLoop() {
    this._view.stopSound('beep');
  }

  println(txt) {
    this._view.print(txt + "<br/>\n");
  }

  printel() {
    let id = "ref-terminal-line-" + this._refId++;
    this._view.print(`<span id=\"${id}\"></span><br/>\n`);
    return document.getElementById(id);
  }

  printChat(msg, from) {
    from = from ? from : 'hacker';
    let side = (from == 'hacker') ? 'terminal-chat-left' : 'terminal-chat-right';
    this._view.print(`<div class="terminal-chat ${side}"><small>${from}</small><p>${msg}</p></div>`);
  }
}
