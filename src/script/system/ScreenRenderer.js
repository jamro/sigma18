export default class ScreenRenderer {

  constructor(soundPlayer) {
    this._soundPlayer$$ = soundPlayer;
  }

  getSoundPlayer$$() {
    return this._soundPlayer$$;
  }

  attach$$(screenView) {
    this._screenView = screenView;
  }

  detach$$() {
    this._screenView = null;
  }

  getScreenView$$() {
    return this._screenView;
  }

  render$$() {

  }
}
