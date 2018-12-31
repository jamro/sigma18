export default class Position {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let x = letters.charAt(this.x);
    let y = this.y;

    return `[${x}:${y}]`;
  }

  clone() {
    return new Position(this.x, this.y);
  }


}
