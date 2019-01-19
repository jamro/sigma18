import Position from '../common/Position.js';

class SecurityQuestion {
  constructor(user, question, answer) {
    this.user = user;
    this.question = question;
    this.answer = answer;
  }

  check$$(answer) {
    return answer.match(this.answer) ? true : false;
  }
}

class Door {

  constructor() {
    this.id$$ = 'd' + Math.floor(Math.random()*16).toString(16) + Door._nextId$$.toString(16);
    this.id$$ = this.id$$.toUpperCase();
    Door._nextId$$++;
    this._position$$ = null;
    this._rotation$$ = null;
    this._isClosed$$ = false;
    this._onChangeList$$ = [];
    this._room1$$ = null;
    this._room2$$ = null;
    this._damaged$$ = false;
    this._requiredKey$$ = null;
    this._securityQuestion$$ = null;
    this.label$$ = 'standard';
  }

  assignRooms$$(room1, room2) {
    this._room1$$ = room1;
    this._room2$$ = room2;

    let pos1 = room1.getPosition$$();
    let pos2 = room2.getPosition$$();
    this._position$$ = new Position((pos1.x + pos2.x)/2, (pos1.y + pos2.y)/2);

    let dx = Math.abs(pos1.x - pos2.x);
    let dy = Math.abs(pos1.y - pos2.y);
    this._rotation$$ = (dx > dy) ? 90 : 0;
  }

  getPosition$$() {
    return this._position$$.clone$$();
  }

  getRotation$$() {
    return this._rotation$$;
  }

  close$$() {
    this._isClosed$$ = true;
    this._onChangeList$$ = this._onChangeList$$.filter((c) => !c());
    return this;
  }

  open$$() {
    this._isClosed$$ = false;
    this._onChangeList$$ = this._onChangeList$$.filter((c) => !c());
    return this;
  }

  isClosed$$() {
    return this._isClosed$$;
  }

  onChange$$(callback) { // return true to remove callback after execution
    this._onChangeList$$.push(callback);
  }

  isVisited$$() {
    return this._room1$$.isVisited$$() ||this._room2$$.isVisited$$();
  }

  lock$$(user, question, answer) {
    this._securityQuestion$$ = new SecurityQuestion(user, question, answer);
    return this;
  }

  unlock$$() {
    this._securityQuestion$$ = null;
  }

  getLock$$() {
    return this._securityQuestion$$;
  }

  getRequiredKey$$() {
    return this._requiredKey$$;
  }

  requireKey$$(color) {
    this._requiredKey$$ = color;
    return this;
  }

  damage$$() {
    this._damaged$$ = true;
    return this;
  }

  isDamaged$$() {
    return this._damaged$$;
  }

}

Door._nextId$$ = 0;

export default Door;
