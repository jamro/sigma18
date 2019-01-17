export default class ScreenRenderer {

  constructor(soundPlayer) {
    this.soundPlayer$$ = soundPlayer;
  }

  attach$$(screenView) {
    this.screenView$$ = screenView;
  }

  detach$$() {
    this.screenView$$ = null;
  }

  render$$() {

  }
}
