export default class Gun {

  constructor() {
    this.target$$ = {
      x: 0.5,
      y: 0.5
    };
    this.dx = 0;
    this.dy = 0;
    this.isShooting$$ = false;
    this.online$$ = false;
  }

  setMove$$(dx, dy) {
    this.dx = dx;
    this.dy = dy;
  }

  step() {
    this.target$$.x += this.dx*0.01;
    this.target$$.y += this.dy*0.01;
    this.target$$.x = Math.max(0.05, Math.min(0.95, this.target$$.x));
    this.target$$.y = Math.max(0.05, Math.min(0.85, this.target$$.y));
  }

}
