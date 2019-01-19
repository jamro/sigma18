export default class Container {

  constructor(element, ref,  x, y, w, h) {
    this._element$$ = element;
    this._ref$$ = ref;
    this._x = x;
    this._y = y;
    this._w = w;
    this._h = h;
    this.rescale$$();
    window.addEventListener('resize',() => this.rescale$$());
    window.addEventListener('load',() => this.rescale$$());
  }

  rescale$$() {
    let scale = this._ref$$.width/1920;
    let css = (name, value) => {
      this._element$$.style[name] = Math.round(scale*value)+ "px";
    };
    css('width', this._w);
    css('height', this._h);
    css('left', this._x);
    css('top', this._y);
    this._element$$.style.fontSize = scale + "em";
  }

}
