export default class Squad {

  constructor(x, y) {
    this._position = {
      x: x | 0,
      y: y | 0
    };
  }

  requestMove(dx, dy, done) {
    setTimeout(() => {
      this._position.x += dx;
      this._position.y += dy;
      done();
    }, 1500);
  }

  getPosition() {
    return this._position;
  }

}
