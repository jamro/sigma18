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
    this._element$$.style.width = Math.round(scale*this._w)+ "px";
    this._element$$.style.height = Math.round(scale*this._h) + "px";
    this._element$$.style.left = Math.round(scale*this._x) + "px";
    this._element$$.style.top = Math.round(scale*this._y) + "px";
    this._element$$.style.fontSize = scale + "em";
  }

}
