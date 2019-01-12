import Item from './Item.js';

export default class Disk extends Item {

  constructor(command) {
    super();
    this._command = command;
  }

  getType$$() {
    return 'disk';
  }

  getCommand$$() {
    return this._command;
  }

  getId$$() {
    return 'disk-' + this._command.getName$$();
  }

  toString() {
    return `Disk with software`;
  }
}
