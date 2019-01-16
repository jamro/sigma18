import Item from './Item.js';

export default class KeyCard extends Item {

  constructor(color) {
    super();
    this._color$$ = color;
  }

  getType$$() {
    return 'key';
  }

  getColor$$() {
    return this._color$$;
  }

  getId$$() {
    return 'key-' + this._color$$;
  }

  toString() {
    let color = this._color$$[0].toUpperCase() + this._color$$.slice(1);
    return `${color} key card`;
  }
}
