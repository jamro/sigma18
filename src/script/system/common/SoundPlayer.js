export default class SoundPlayer {

  constructor() {
    this._mute$$ = false;
    this._speakTimeout$$ = null;
    this._utter$$ = null;
    this._primaryVoice$$ = null;
    this._secondaryVoice$$ = null;

    window.speechSynthesis.onvoiceschanged = () => {
      let voice = window.speechSynthesis.getVoices().filter((v) => v.name == 'Google UK English Male');
      this._primaryVoice$$ = voice.length > 0 ? voice[0] : null;
      voice = window.speechSynthesis.getVoices().filter((v) => v.name == 'Google UK English Female');
      this._secondaryVoice$$ = voice.length > 0 ? voice[0] : null;
    };

    this._sounds$$ = {};
    try {
      this._sounds$$.ok = new Audio('audio/ok.mp3');
      this._sounds$$.err = new Audio('audio/err.mp3');
      this._sounds$$.chat = new Audio('audio/com.mp3');
      this._sounds$$.beep = new Audio('audio/beep.mp3');
      this._sounds$$.gun = new Audio('audio/gun.mp3');
      this._sounds$$.beep.loop = true;
      this._sounds$$.gun.loop = true;
    } catch(err) {
      console.log(err);
    }
  }

  play$$(id) {
    if(this._mute$$) return;
    try {
      this._sounds$$[id].play();
    } catch(err) {
      console.log(err);
    }
  }

  stop$$(id) {
    try {
      this._sounds$$[id].pause();
      this._sounds$$[id].currentTime = 0;
    } catch(err) {
      console.log(err);
    }
  }

  mute$$(state) {
    this._mute$$ = state;
    this.stop$$('beep');
    this.stop$$('gun');
  }

  speak$$(msg, secondary, done) {
    let pureText = msg
      .replace(/[\:\*]/g, '')
      .replace(/m{[^}]*}m/g, '')
      .replace(/<[^\>]*>/g, '')
      .replace(/\&[a-z]*\;/g, '')
      .replace(/[sr]\{/g, '')
      .replace(/\}[sr]/g, '');

    if(pureText == '' || this._mute$$) {
      return this._emulateSpeak$$(pureText, done);
    }

    try {
      this._utter$$ = new SpeechSynthesisUtterance(pureText);
      this._utter$$.voice = secondary ? this._secondaryVoice$$ : this._primaryVoice$$;
      this._utter$$.rate = secondary ? 1.1 : 1.0;
      this._utter$$.pitch = secondary ? 0.9 : 1.1;
      this._utter$$.onend = () => {
        done();
      };
      this._utter$$.onerror = (err) => {
        console.error(err);
      };
      this.play$$('chat');
      window.speechSynthesis.speak(this._utter$$);
    } catch (err) {
      console.error(err);
      return this._emulateSpeak$$(pureText, done);
    }
  }

  _emulateSpeak$$(pureText, done) {
    let charsPerSec = 20;
    this.play$$('chat');
    this._speakTimeout$$ = setTimeout(() => {
      this._speakTimeout$$ = null;
      done();
    }, 200+1000*pureText.length/charsPerSec);
  }

  shutUp$$() {
    if(this._speakTimeout$$) {
      clearTimeout(this._speakTimeout$$);
    }
    this._speakTimeout$$ = null;
    try {
      window.speechSynthesis.cancel();
    } catch(e) {
      console.error(e);
    }
  }

}
