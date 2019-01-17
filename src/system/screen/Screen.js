import MapRenderer from './renderer/MapRenderer.js';
import BattleRenderer from './renderer/BattleRenderer.js';

export default class Screen {

  constructor(view, soundPlayer) {
    this.view$$ = view;
    this.soundPlayer$$ = soundPlayer;
    this._renderer$$ = null;
  }

  showMap$$(map) {
    this._setRenderer$$(new MapRenderer(this.soundPlayer$, map));
  }

  showBattle$$(battle) {
    this._setRenderer$$(new BattleRenderer(this.soundPlayer$, battle));
  }

  _setRenderer$$(r) {
    if(this._renderer$$) {
      this._renderer$$.detach$$();
    }
    this._renderer$$ = r;
    this._renderer$$.attach$$(this.view$$);
    this._renderer$$.render$$();
  }

}
