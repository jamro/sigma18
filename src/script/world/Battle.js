
class Unit {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

export default class Battle {

  constructor(room, door, virus, onFinish) {
    this._room$$ = room;
    this._door$$ = door;
    this._virus$$ = virus;
    this._droids$$ = [];
    this._onFinish$$ = onFinish;
    this._marinesDefense$$ = [
      new Unit(0.39, 1.04),
      new Unit(0.6, 1.05),
      new Unit(0.33, 1.11),
      new Unit(0.24, 1.05),
      new Unit(0.69, 1.09)
    ];
    this._marinesAttack$$ = [
      new Unit(0.45, 0.98),
      new Unit(0.55, 0.98),
      new Unit(0.33, 1.08),
      new Unit(0.26, 1.05),
      new Unit(0.65, 1.04)
    ];
    this._loop$$ = null;
    this._backupTime$$ = -100;
    this._loop_droidsTurn$$ = false;
    this._marinesTurn$$ = false;
    this._shootCounter$$ = 0;
    let enemies = this._room$$.getEnemy$$();
    for(let i=0; i < enemies; i++) {
      this._addDroid$$();
    }
  }

  isDroidsTurn$$() {
    return this._loop_droidsTurn$$;
  }

  isMarinesTurn$$() {
    return this._marinesTurn$$;
  }

  start$$() {
    this._loop$$ = setInterval(() => this._step$$(), 30);
  }

  stop$$() {
    if(this._loop$$) {
      clearInterval(this._loop$$);
      this._loop$$ = null;
    }
  }

  getRoom$$() {
    return this._room$$;
  }

  getDoor$$() {
    return this._door$$;
  }

  getDroids$$() {
    return this._droids$$;
  }

  getMarines$$() {
    return this._marinesTurn$$ ? this._marinesAttack$$ : this._marinesDefense$$;
  }

  _addDroid$$() {
    this._droids$$.push(new Unit(0.1 + 0.8*Math.random(), 0.1 + 0.7*Math.random()));
  }

  _step$$() {
    if(this._droids$$.length == 0) {
      this.stop$$();
      this._room$$.setEnemy$$(0);
      return this._onFinish$$();
    }
    if(this._backupTime$$ > 70 && this._droids$$.length < 100) {
      this._backupTime$$ = 0;
      if(Math.random() > this._virus$$.getStatus$$().stats.activation) {
        this._addDroid$$();
      }
    }
    if(this._shootCounter$$ == 0 && this._backupTime$$ >= 0) {
      this._shootCounter$$ = (Math.random() > 0.5) ? 30 + 30*Math.random() : -15 - 15*Math.random();
      if(this._shootCounter$$ < 0 && Math.random() > 0.5 && this._droids$$.length > 0) {
        this._droids$$.shift();
      }
      this._shootCounter$$ = Math.round(this._shootCounter$$);
    }

    let threshold = 8;
    this._loop_droidsTurn$$ = false;
    this._marinesTurn$$ = false;
    if(this._shootCounter$$ > threshold) {
      this._loop_droidsTurn$$ = true;
    } else if(this._shootCounter$$ < -threshold) {
      this._marinesTurn$$ = true;
    }

    this._backupTime$$++;
    if(this._shootCounter$$ > 0) {
      this._shootCounter$$ --;
    } else if (this._shootCounter$$ < 0) {
      this._shootCounter$$++;
    }
  }

}
