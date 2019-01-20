import ScreenRenderer from '../ScreenRenderer.js';

export default class RadarRenderer extends ScreenRenderer {

  constructor(soundPlayer) {
    super(soundPlayer);
    this._loop$$ = null;
    this._time$$ = 0;
    this._spaceShipAlpha$$ = 0;
  }

  attach$$(screenView) {
    super.attach$$(screenView);
    this._time$$ = 0;
    this._loop$$ = setInterval(() => this.render$$(), 15);
  }

  detach$$() {
    clearInterval(this._loop$$);
    super.detach$$();
  }

  render$$() {
    if(!this.screenView$$) {
      return;
    }
    this.screenView$$.clear$$();
    this._time$$++;
    this._spaceShipAlpha$$ *= 0.98;
    let ctx = this.screenView$$.context$$;
    let w = this.screenView$$.getWidth$$();
    let h = this.screenView$$.getHeight$$();
    let red = this.screenView$$.dangerColor$$;
    let color = this.screenView$$.getPrimaryColor$$();
    let color2 = this.screenView$$.getPrimaryColor$$(0.5);
    let bg = this.screenView$$.backgroundColor$$;

    let maxRadius = Math.sqrt(w*w + h*h)*0.5;
    let i, x, y, r, a;

    for(i=1; i <= 8; i++) {
      ctx.beginPath();
      ctx.fillStyle = null;
      ctx.strokeStyle = color2;
      ctx.lineWidth = 1;
      ctx.arc(w/2, h/2, maxRadius*(i/8), 0, 2 * Math.PI);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.strokeStyle = null;
    ctx.arc(w/2, h/2, maxRadius/25, 0, 2 * Math.PI);
    ctx.fill();

    let radarAngle = this._time$$/15;
    for(i=0; i < 20; i++) {
      ctx.beginPath();
      ctx.fillStyle = null;
      ctx.strokeStyle = this.screenView$$.getPrimaryColor$$((i == 0 )? 0 : 0.3 + i/14);
      ctx.lineWidth = 3;
      r = radarAngle - i/40;
      x = w/2+maxRadius*Math.cos(r);
      y = h/2+maxRadius*Math.sin(r);
      ctx.moveTo(w/2, h/2);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.fillStyle = null;
    ctx.strokeStyle = color2;
    ctx.lineWidth = 1;
    ctx.moveTo(0, h/2);
    ctx.lineTo(w, h/2);
    ctx.moveTo(w/2, 0);
    ctx.lineTo(w/2, h);
    ctx.stroke();

    a = -1 + this._time$$/1000;

    while(a > 2*Math.PI) a-= 2*Math.PI;
    while(a < 0) a+= 2*Math.PI;
    while(radarAngle > 2*Math.PI) radarAngle-= 2*Math.PI;
    while(radarAngle < 0) radarAngle+= 2*Math.PI;

    r = maxRadius*(this._time$$/2000);

    if(Math.abs(radarAngle - a) < 0.1 && this._time$$ < 2000) {
      this.soundPlayer$$.play$$('radar');
      this._spaceShipAlpha$$ = 2;
    }

    x = r*Math.cos(a);
    y = r*Math.sin(a);

    ctx.beginPath();
    ctx.fillStyle = this.screenView$$.getPrimaryColor$$(1-this._spaceShipAlpha$$);
    ctx.strokeStyle = null;
    let s = maxRadius/25;

    ctx.rect(w/2+x-s/2, h/2+y-s/2, s, s);
    ctx.fill();


  }

}
