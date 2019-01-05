import MapRenderer from '../map/MapRenderer.js';
import BattleRenderer from '../map/BattleRenderer.js';

export default class Screen {

  constructor(view, soundPlayer) {
    this._view = view;
    this._soundPlayer = soundPlayer;
    this._renderer = null;
  }

  getSoundPlayer() {
    return this._soundPlayer;
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

}
