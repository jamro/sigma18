export default class ScreenRenderer {

  attach(screenView) {
    this._screenView = screenView;
  }

  detach() {
    this._screenView = null;
  }

  getScreenView() {
    return this._screenView;
  }
  
  render() {

  }
}
