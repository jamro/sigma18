import Command from '../Command.js';

export default class SfxCommand extends Command {

  constructor(soundPlayer) {
    super();
    this.soundPlayer$$ = soundPlayer;
  }

  getName$$() {
    return 'sfx';
  }

  getHelp$$() {
    return "Turn off/on terminal sound";
  }

  execHelp() {
    this._terminal$$.sequence$$(
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
    this.soundPlayer$$.mute$$(false);
    this._terminal$$.println$$("Sound enabled");
    this.soundPlayer$$.play$$('ok');
  }

  execOff() {
    this.soundPlayer$$.mute$$(true);
    this._terminal$$.println$$("Sound disabled");
    this.soundPlayer$$.play$$('ok');
  }


}
