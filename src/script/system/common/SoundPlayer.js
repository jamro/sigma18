export default class SoundPlayer {

  constructor() {
    this._mute = false;

    this._sounds = {};
    try {
      this._sounds.ok = new Audio('audio/ok.mp3');
      this._sounds.err = new Audio('audio/err.mp3');
      this._sounds.chat = new Audio('audio/com.mp3');
      this._sounds.beep = new Audio('audio/beep.mp3');
      this._sounds.gun = new Audio('audio/gun.mp3');
      this._sounds.beep.loop = true;
      this._sounds.gun.loop = true;
    } catch(err) {
      console.log(err);
    }
  }

  play(id) {
    if(this._mute) return;
    try {
      this._sounds[id].play();
    } catch(err) {
      console.log(err);
    }
  }

  stop(id) {
    try {
      this._sounds[id].pause();
      this._sounds[id].currentTime = 0;
    } catch(err) {
      console.log(err);
    }
  }

  mute(state) {
    this._mute = state;
    this.stop('beep');
    this.stop('gun');
  }

}
