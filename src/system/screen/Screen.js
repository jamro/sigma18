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

  showMap$$(map, done) {
    this._setRenderer$$(new MapRenderer(this.soundPlayer$$, map), done);
  }

  showBattle$$(battle, done) {
    this._setRenderer$$(new BattleRenderer(this.soundPlayer$$, battle), done);
  }

  showRadar$$(done) {
    this._setRenderer$$(new RadarRenderer(this.soundPlayer$$), done);
  }

  _setRenderer$$(r, done) {
    if(this._renderer$$) {
      this._renderer$$.detach$$();
      this._renderer$$ = null;
      this.view$$.noise$$.prevent$$();
      this.view$$.switchScreen$$(() => {
        this._renderer$$ = r;
        this._renderer$$.attach$$(this.view$$);
        this._renderer$$.render$$();
        if(done) done();
      });
    } else {
      this.view$$.noise$$.prevent$$();
      this.view$$.turnOn$$(() => {
        this._renderer$$ = r;
        this._renderer$$.attach$$(this.view$$);
        this._renderer$$.render$$();
        if(done) done();
      });
    }
  }

}
