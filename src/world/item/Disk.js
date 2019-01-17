import Item from './Item.js';

export default class Disk extends Item {

  constructor(command) {
    super();
    this.command$$ = command;
    this.type$$ = 'disk';
    this.id$$ = 'disk-' + this.command$$.name$$;
  }

  toString() {
    return `Disk with software`;
  }
}
