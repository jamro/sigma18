import MapRenderer from './renderer/MapRenderer.js';
import BattleRenderer from './renderer/BattleRenderer.js';

export default class Screen {

  constructor(view, soundPlayer) {
    this._view$$ = view;
    this._soundPlayer$$ = soundPlayer;
    this._renderer$$ = null;
  }

  getSoundPlayer$$() {
    return this._soundPlayer$$;
  }

  getView$$() {
    return this._view$$;
  }

  showMap$$(map) {
    this._setRenderer$$(new MapRenderer(this._soundPlayer$$, map));
  }

  showBattle$$(battle) {
    this._setRenderer$$(new BattleRenderer(this._soundPlayer$$, battle));
  }

  _setRenderer$$(r) {
    if(this._renderer$$) {
      this._renderer$$.detach$$();
    }
    this._renderer$$ = r;
    this._renderer$$.attach$$(this._view$$);
    this._renderer$$.render$$();
  }

}