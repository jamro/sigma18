import Command from '../Command.js';

export default class SfxCommand extends Command {

  constructor(terminal, sideScreen) {
    super();
    this._terminal = terminal;
    this._screen = sideScreen;
  }

  getName() {
    return 'sfx';
  }

  getHelp() {
    return "Turn off/on terminal sound";
  }

  execHelp() {
    this._terminal.sequence(
      "Available commands are:",
      '',
      "s|sfx on|s",
      "Turn the sound on",
      '',
      "s|sfx off|s",
      "Turn the sound off",
      {c: 'sound', d: 'ok', t:0}
    );
  }

  execOn() {
    this._terminal.getView().enableSound(true);
    this._screen.getView().enableSound(true);
    this._terminal.println("Sound enabled");
    this.playDoneSound(true);
  }

  execOff() {
    this._terminal.getView().enableSound(false);
    this._screen.getView().enableSound(false);
    this._terminal.println("Sound disabled");
    this.playDoneSound(true);
  }


}
