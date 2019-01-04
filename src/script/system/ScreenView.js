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
    let el = this._view.element;
    el.width = el.parentElement.clientWidth;
    el.height = el.parentElement.clientHeight;
  }

  getPrimaryColor() {
    return '#88ff22';
  }

  getBackgroundColor() {
    return '#112211';
  }

  getDangerColor() {
    return '#ff0000';
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

  attachToDOM(parent) {
    super.attachToDOM(parent);
    this.rescale();
  }

}
