import MapRenderer from '../map/MapRenderer.js';
import BattleRenderer from '../map/BattleRenderer.js';

export default class Screen {

  constructor(view) {
    this._view = view;
    this._renderer = null;
  }

  getView() {
    return this._view;
  }

  showMap(map) {
    this._setRenderer(new MapRenderer(map));
  }

  showBattle(room) {
    this._setRenderer(new BattleRenderer(room));
  }

  _setRenderer(r) {
    if(this._renderer) {
      this._renderer.detach();
    }
    this._renderer = r;
    this._renderer.attach(this._view);
    this._renderer.render();
  }

  enableSound(state) {
    this._view.enableSound(state);
  }

}
