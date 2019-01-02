import Command from '../Command.js';

export default class SfxCommand extends Command {

  constructor(terminal) {
    super();
    this._terminal = terminal;
  }

  getName() {
    return 'sfx';
  }

  getHelp() {
    return "Turn off/on terminal sound";
  }

  execHelp() {
    this.println("Available commands are:");
    this.println('');
    this.println("<strong>sfx on</strong>");
    this.println("Turn the sound on");
    this.println('');
    this.println("<strong>sfx off</strong>");
    this.println("Turn the sound off");
    this.playDoneSound(true);
  }

  execOn() {
    this._terminal.enableSound(true);
    this.println("Sound enabled");
    this.playDoneSound(true);
  }

  execOff() {
    this._terminal.enableSound(false);
    this.println("Sound disabled");
    this.playDoneSound(true);
  }


}
