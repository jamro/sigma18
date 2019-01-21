import MapRenderer from './renderer/MapRenderer.js';
import BattleRenderer from './renderer/BattleRenderer.js';
import RadarRenderer from './renderer/RadarRenderer.js';

export default class Screen {

  constructor(view) {
    this.view$$ = view;
    this.soundPlayer$$ = null;
    this._system$$ = null;
    this._renderer$$ = null;
  }

  setSystem(system) {
    this._system$$ = system;
    this._serviceDirectory$$ = system.getMap$$().getServiceDirectory$$();
    this.soundPlayer$$ = system.getSoundPlayer$$();
  }

  showMap$$(map) {
    this._setRenderer$$(new MapRenderer(this.soundPlayer$$, map));
  }

  showBattle$$(battle) {
    this._setRenderer$$(new BattleRenderer(this.soundPlayer$$, battle));
  }

  showRadar$$() {
    this._setRenderer$$(new RadarRenderer(this.soundPlayer$$));
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
