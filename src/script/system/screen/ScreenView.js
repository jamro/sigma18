import DigitalNoise from '../common/DigitalNoise.js';
import View from '../common/View.js';
import '../../../styles/screen.scss';

export default class ScreenView extends View {

  constructor(document) {
    super(document);

    this._view$$ = this.createElement$$("DIV", {
      cssClass: "screen-root"
    });

    this._noise$$ = new DigitalNoise(document);
    this._view$$.element.appendChild(this._noise$$.getDOM$$());

    this._view$$.canvas = this.createElement$$("CANVAS", {
      cssClass: "screen-canvas",
      parent: this._view$$
    });

    this._context$$ = this._view$$.canvas.element.getContext("2d");
    this.clear$$();
  }

  rescale$$() {
    let el = this._view$$.canvas.element;
    el.width = el.parentElement.clientWidth;
    el.height = el.parentElement.clientHeight;
    this._noise$$.rescale$$();
    this.clear$$();
  }

  getPrimaryColor$$(opacity) {
    opacity = opacity ? opacity : 0;
    return `rgba(136,255,34,${(1-opacity).toFixed(2)})`;
  }

  getBackgroundColor$$() {
    return '#001100';
  }

  getDangerColor$$() {
    return '#ff0000';
  }

  getContext$$() {
    return this._context$$;
  }

  getWidth$$() {
    return this._view$$.canvas.element.width;
  }

  getHeight$$() {
    return this._view$$.canvas.element.height;
  }

  clear$$() {
    let ctx = this.getContext$$();
    ctx.clearRect(0, 0, this.getWidth$$(), this.getHeight$$());
    ctx.beginPath();
    ctx.rect(0, 0, this.getWidth$$(), this.getHeight$$());
    ctx.fillStyle = this.getBackgroundColor$$();
    ctx.fill();
  }

  attachToDOM$$(parent) {
    super.attachToDOM$$(parent);
    this.rescale$$();
  }

  turnOn$$(done) {
    let frame = 0;
    let w = this.getWidth$$();
    let h = this.getHeight$$();
    let ctx = this.getContext$$();
    let p;
    let loop = setInterval(() => {
      this.clear$$();
      frame++;
      ctx.beginPath();
      ctx.strokeStyle = null;
      if(frame <= 20) {
        p = frame/20;
        ctx.fillStyle = this.getPrimaryColor$$(1-p);
        ctx.rect(w/2-0.02*w, h/2-h*0.01, w*0.02, h*0.02);
      } else if(frame <= 25) {
        p = (frame-20)/(25-20);
        ctx.fillStyle = this.getPrimaryColor$$();
        ctx.rect(w*0.5*(1-p), h/2-h*0.01, w*p, h*0.02);
      } else if( frame < 28) {
        p = (frame-25)/(28-25);
        ctx.fillStyle = this.getPrimaryColor$$();
        ctx.rect(0, h*0.5*(1-p), w, h*p);
      } else {
        p = (frame-28)/(35-28);
        ctx.fillStyle = this.getPrimaryColor$$(p);
        ctx.rect(0, 0, w, h);
      }
      ctx.fill();

      if(frame >= 35) {
        clearInterval(loop);
        this._noise$$.start();
        done();
      }
    }, 30);
  }

}
