import View from './View.js';

export default class DigitalNoise extends View {
  constructor(document) {
    super(document);
    this._timer$$ = 0;
    this._enabled$$ = false;
    this._limit$$ = 150;
    this._view$$ = this.createElement$$("CANVAS", {
      cssClass: "digital-noise"
    });
    this._context$$ = this._view$$.element.getContext("2d");
    this._loop$$ = setInterval(() => this.render$$(), 40);
    window.addEventListener('resize', () => this.rescale$$());
    window.addEventListener('load', () => this.rescale$$());
  }

  rescale$$() {
    let el = this._view$$.element;
    el.width = el.parentElement.clientWidth;
    el.height = el.parentElement.clientHeight;
  }

  drawRect$$(x, y, w, h, color) {
    let width = this._view$$.element.width;
    let height = this._view$$.element.height;
    let ctx = this._context$$;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(x*width, y*height, w*width, h*height);
    ctx.fill();
  }

  start$$() {
    this._enabled$$ = true;
    this._timer$$ = 0;
  }

  prevent$$() {
    this._timer$$ = 100;
  }

  render$$() {
    let r = Math.random;
    if(!this._enabled$$) return;
    this._timer$$++;
    this._context$$.clearRect(0, 0, this._view$$.element.width, this._view$$.element.height);

    if(this._timer$$ > this._limit$$) {
      this._timer$$ = 0;
      this._limit$$ = 450 - r()*r()*r()*300;
      return;
    } else if(this._timer$$ > 20) {
      return;
    }

    let count = r()*20;
    let color = (r() > 0.1) ? "#001100" : "#88ff22";
    for(let i=0; i < count; i++) {
      this.drawRect$$(
        r(),
        r(),
        r()*0.2,
        r()*r()*0.2,
        color
      );
    }
  }
}
