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
    this._terminal.sequence(
      "Available commands are:",
      '',
      "s{sfx on}s",
      "Turn the sound on",
      '',
      "s{sfx off}s",
      "Turn the sound off",
      {c: 'sound', d: 'ok', t:0}
    );
  }

  execOn() {
    this._terminal.getSoundPlayer().mute(false);
    this._terminal.println("Sound enabled");
    this._terminal.getSoundPlayer().play('ok');
  }

  execOff() {
    this._terminal.getSoundPlayer().mute(true);
    this._terminal.println("Sound disabled");
    this._terminal.getSoundPlayer().play('ok');
  }


}
