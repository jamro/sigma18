import Position from '../common/Position.js';

export default class Room {

  constructor(lightService, x, y) {
    this.animation$$ = 0;
    this._lightService$$ = lightService;
    this._position$$ = new Position(x, y);
    this._isVisited$$ = false;
    this._onChangeList$$ = [];
    this._itemList$$ = [];
    this._description$$ = "";
    this._type$$ = "room";
    this.enemy$$ = 0;
    this.gun$$ = null;
    this._doorCount$$ = 0;
    this._doorMap$$ = {
      n: null, e: null, s: null, w: null
    };
    this._trap$$ = 0;
    this._trapExitDirection$$ = new Position(0, 0);
  }

  setTrap$$(count, x, y) {
    this._trap$$ = count;
    this._trapExitDirection$$.x = x;
    this._trapExitDirection$$.y = y;
  }

  validateTrap$$(newX, newY) {
    let result = 0;
    if(this._trap$$ && newX == this._trapExitDirection$$.x && newY == this._trapExitDirection$$.y) {
      result = this._trap$$;
      this.enemy$$ = this._trap$$;
      this._onChangeList$$.forEach((c) => c());
      this._trap$$ = 0;
    }
    return result;
  }

  hasLight$$() {
    return this._lightService$$.isRunning$$;
  }

  setType$$(t) {
    this._type$$ = t;
  }

  getType$$() {
    if(this._doorCount$$ == 0) {
      return 'empty';
    }
    return this._type$$;
  }

  addDoor$$(door, direction) {
    this._doorMap$$[direction] = door;
    this._doorCount$$++;
  }

  getDoors$$() {
    return this._doorMap$$;
  }

  getDoorDirection$$(door) {
    for(let direction in this._doorMap$$) {
      if(this._doorMap$$[direction] == door) {
        return direction;
      }
    }
    return null;
  }

  getPosition$$() {
    return this._position$$;
  }

  visit$$() {
    if(!this.hasLight$$()) return;
    if(!this._isVisited$$) {
      this.animation$$ = 20;
      this._isVisited$$ = true;
      this._onChangeList$$.forEach((c) => c());
    }
  }

  isVisited$$() {
    return this._isVisited$$;
  }

  onChange$$(callback) {
    this._onChangeList$$.push(callback);
  }

  addItem$$(item) {
    this._itemList$$.push(item);
  }

  flushItems$$() {
    if(!this.hasLight$$()) return [];
    let result = this._itemList$$;
    this._itemList$$ = [];
    return result;
  }

  getDescription$$() {
    if(!this.hasLight$$()) return "We've got total s{darkness}s here. Can't see anything. There is no point to explore this location. Try to turn the lights on at first.";
    return this._description$$;
  }

  describe$$(txt) {
    this._description$$ = txt;
  }

}
