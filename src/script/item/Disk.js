import Item from './Item.js';

export default class Disk extends Item {

  constructor(command) {
    super();
    this._command = command;
  }

  getType() {
    return 'disk';
  }

  getCommand() {
    return this._command;
  }

  toString() {
    return `Disk with software`;
  }
}
