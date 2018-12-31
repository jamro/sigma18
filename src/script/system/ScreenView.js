import View from './common/View.js';
import '../../styles/screen.scss';

export default class ScreenView extends View {

  constructor(document) {
    super(document);

    this._view = this.createElement("CANVAS", {
      cssClass: "screen-root"
    });



    this._context = this._view.element.getContext("2d");
    this.clear();
  }

  rescale() {
    this._view.element.width = this._view.element.parentElement.clientWidth;
    this._view.element.height = this._view.element.parentElement.clientHeight;
  }

  getPrimaryColor() {
    return '#88ff22';
  }

  getBackgroundColor() {
    return '#112211';
  }

  getContext() {
    return this._context;
  }

  getWidth() {
    return this._view.element.width;
  }

  getHeight() {
    return this._view.element.height;
  }

  clear() {
    let ctx = this.getContext();
    ctx.clearRect(0, 0, this.getWidth(), this.getHeight());
    ctx.beginPath();
    ctx.rect(0, 0, this.getWidth(), this.getHeight());
    ctx.fillStyle = this.getBackgroundColor();
    ctx.fill();
  }

}
