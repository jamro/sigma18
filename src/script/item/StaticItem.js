import Item from './Item.js';

export default class StaticItem extends Item {

  constructor(desc) {
    super();
    this._desc = desc;
  }

  getType() {
    return 'static';
  }

  toString() {
    return `${this._desc}`;
  }
}
