import Item from './Item.js';

export default class KeyCard extends Item {

  constructor(color) {
    super();
    this.color$$ = color;
    this.type$$ = 'key';
    this.id$$ = 'key-' + this.color$$;
  }

  toString() {
    let color = this.color$$[0].toUpperCase() + this.color$$.slice(1);
    return `${color} key card`;
  }
}
