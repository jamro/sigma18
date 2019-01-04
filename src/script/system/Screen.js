import ScreenView from './ScreenView.js';

export default class Screen {

  constructor(view) {
    this._view = view;
    this._renderer = null;
  }

  setRenderer(r) {
    if(this._renderer) {
      this._renderer.detach();
    }
    this._renderer = r;
    this._renderer.attach(this._view);
    this._renderer.render();
  }

  getView() {
    return this._view;
  }

}
