import Item from './Item.js';

export default class Note extends Item {

  constructor(msg) {
    super();
    this._msg = msg;
  }

  getType() {
    return 'note';
  }

  toString() {
    return `Note: &quot;${this._msg}&quot;`;
  }
}
