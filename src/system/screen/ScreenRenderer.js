export default class ScreenRenderer {

  constructor(soundPlayer) {
    this.soundPlayer$$ = soundPlayer;
  }

  attach$$(screenView) {
    this._screenView$$ = screenView;
  }

  detach$$() {
    this._screenView$$ = null;
  }

  getScreenView$$() {
    return this._screenView$$;
  }

  render$$() {

  }
}
