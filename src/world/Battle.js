
class Unit {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

export default class Battle {

  constructor(room, door, virus) {
    this._log$$ = () => {};
    this._room$$ = room;
    this._door$$ = door;
    this._virus$$ = virus;
    this._droids$$ = [];
    this._onFinishList$$ = [];
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
    let enemies = this._room$$.enemy$$;
    for(let i=0; i < enemies; i++) {
      this._addDroid$$();
    }

    let allDoors = this.getRoom$$().getDoors$$();

    if(allDoors.n == door) {
      this.flipY$$ = true;
    } else if (allDoors.e == door) {
      this.rotate$$ = true;
    } else if (allDoors.w == door) {
      this.rotate$$ = true;
      this.flipX$$ = true;
    }
  }

  setLogger$$(callback) {
    this._log$$ = callback;
  }

  onFinish$$(callback) {
    this._onFinishList$$.push(callback);
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
    this._droids$$.push(new Unit(0.1 + 0.8*Math.random(), 0.1 + 0.3*Math.random() + 0.4*Math.random()*Math.random()));
  }

  _step$$() {
    if(this._droids$$.length == 0) {
      this.stop$$();
      this._room$$.enemy$$ = 0;
      this._onFinishList$$.forEach((c) => c());
      return;
    }
    if(this._backupTime$$ > 70 && this._droids$$.length < 100) {
      this._backupTime$$ = 0;
      if(Math.random() > this._virus$$.getStatus$$().stats.activation) {
        this._addDroid$$();
        this._log$$(`MSG [to: sig18/${Math.floor(Math.random()*0x8888).toString(16)}, body: "Backups to ${this._room$$.getPosition$$().toString()}"]`);
      } else if(Math.random() > 0.5) {
        const chars = ['&amp;', '&lt;', '&gt;', '	&iexcl;', '&cent;', '&pound;', '&curren;', '&yen;', '&sect;', '&copy;', '&laquo;', '&reg;', '&plusmn;', '&micro;', '&para;', '&raquo;', '	&Oslash;', '&Uuml;', '&aelig;', '&ntilde;', '&thorn;', '&frac12;', '&iquest;', '&divide;', '&deg;', '^', '!', '@', '#', '$', '%', '^', '*', '_', '=', '+', '1', '2', '3', '4', '5', '6', 'X', 'o', 'T', 'I', 'q', ':', ':', "|", "\\", "/", ".", ",", "[", "}", "{", "]"];
        let trash = Array(10+Math.floor(Math.random()*10))
                      .fill(0)
                      .map(() => chars[Math.floor(Math.random()*chars.length)])
                      .join('');
        this._log$$(`MSG [to: sig18/*, body: "${trash}"]`);
      }
    }
    if(this._shootCounter$$ == 0 && this._backupTime$$ >= 0) {
      this._shootCounter$$ = (Math.random() > 0.5) ? 30 + 30*Math.random() : -15 - 15*Math.random();
      if(this._shootCounter$$ < 0 && Math.random() > 0.5 && this._droids$$.length > 0 && this._droids$$.length <= 10) {
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

    if(this._room$$.gun$$) {
      this._room$$.gun$$.step();
      if(this._room$$.gun$$.isShooting$$) {
        let newDroids = [];
        for(let i=0; i < this._droids$$.length; i++) {
          let dx = this._droids$$[i].x - this._room$$.gun$$.target$$.x;
          let dy = this._droids$$[i].y - this._room$$.gun$$.target$$.y;
          let r = Math.sqrt(dx*dx + dy*dy);
          if(r > 0.08 || Math.random() < 0.9) {
            newDroids.push(this._droids$$[i]);
          }
        }
        this._droids$$ = newDroids;
      }
    }
  }

}
