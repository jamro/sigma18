import ScreenRenderer from '../ScreenRenderer.js';

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = Math.random()*0.06-0.03;
    this.vy = Math.random()*0.06-0.03;
    this.frame = 0;
    this.life = 10;
  }

  step$$() {
    this.x += this.vx;
    this.y += this.vy;
    this.frame++;
  }

  isCompleted$$() {
    return this.frame > this.life;
  }
}

class Shot {
  constructor(x1, y1, x2, y2) {
    this.frame = 0;
    this.from = {
      x: x1,
      y: y1
    };
    this.to = {
      x: x2,
      y: y2
    };
  }

  isCompleted$$() {
    return this.frame > 6;
  }
}

export default class BattleRenderer extends ScreenRenderer {

  constructor(soundPlayer, battle) {
    super(soundPlayer);
    this._battle$$ = battle;
    this._loop$$ = null;
    this._shotList$$ = [];
    this._particleList$$ = [];
    this._shooting$$ = false;
  }

  attach$$(screenView) {
    super.attach$$(screenView);
    this._loop$$ = setInterval(() => this.render$$(), 30);
  }

  detach$$() {
    clearInterval(this._loop$$);
    this.soundPlayer$$.stop$$('gun');
    super.detach$$();
  }

  render$$() {
    if(!this.getScreenView$$()) {
      return;
    }
    let ctx = this.getScreenView$$().getContext$$();
    let w = this.getScreenView$$().getWidth$$();
    let h = this.getScreenView$$().getHeight$$();
    let red = this.getScreenView$$().getDangerColor$$();
    let color = this.getScreenView$$().getPrimaryColor$$();
    let color2 = this.getScreenView$$().getPrimaryColor$$(0.5);
    let bg = this.getScreenView$$().getBackgroundColor$$();

    let flipY = false;
    let flipX = false;
    let rotate = false;

    let allDoors = this._battle$$.getRoom$$().getDoors$$();
    let door = this._battle$$.getDoor$$();

    if(allDoors.n == door) {
      flipY = true;
    } else if (allDoors.e == door) {
      rotate = true;
    } else if (allDoors.w == door) {
      rotate = true;
      flipX = true;
    }

    this.getScreenView$$().clear$$();

    let roomSize = Math.round(Math.min(w, h)*0.7);
    let wallSize = 0.05;
    let startX = w/2 - roomSize/2;
    let startY = h/2 - roomSize/2;

    let transform = (x, y) => {
      if(rotate) {
        let a = x;
        x = y;
        y = a;
      }
      y = flipY ? 1-y : y;
      x = flipX ? 1-x : x;
      return [x, y];
    };

    let moveTo = (x, y) => {
      [x, y] = transform(x, y);
      ctx.moveTo(startX + roomSize*x, startY + roomSize*y);
    };

    let lineTo = (x, y) => {
      [x, y] = transform(x, y);
      ctx.lineTo(startX + roomSize*x, startY + roomSize*y);
    };

    let drawLine = (x1, y1, x2, y2) => {
      moveTo(x1, y1);
      lineTo(x2, y2);
    };

    let renderWalls = () => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.fillStyle = null;
      ctx.lineWidth = 3;
      moveTo(0, 0);
      lineTo(1, 0);
      lineTo(1, 1);
      lineTo(0.6, 1);
      lineTo(0.6, 1-wallSize);
      lineTo(1-wallSize, 1-wallSize);
      lineTo(1-wallSize, 0+wallSize);
      lineTo(0+wallSize, 0+wallSize);
      lineTo(0+wallSize, 1-wallSize);
      lineTo(0.4, 1-wallSize);
      lineTo(0.4, 1);
      lineTo(0, 1);
      lineTo(0, 0);
      ctx.stroke();
    };

    let renderUnit = (x, y, w, h, c) => {
      [x, y] = transform(x, y);
      ctx.beginPath();
      ctx.fillStyle = c;
      ctx.strokeStyle = null;
      ctx.rect(startX + roomSize*(x-w/2), startY + roomSize*(y-h/2), w*roomSize, h*roomSize);
      ctx.fill();
    };

    let renderParticle = (p) => {
      let x, y;
      let size = 0.01;
      [x, y] = transform(p.x, p.y);
      ctx.beginPath();
      ctx.fillStyle = this.getScreenView$$().getPrimaryColor$$(p.frame/p.life);
      ctx.strokeStyle = null;
      ctx.rect(startX + roomSize*(x-size/2), startY + roomSize*(y-size/2), size*roomSize, size*roomSize);
      ctx.fill();
      p.step$$();
    };

    let renderShot = (shot) => {
      if(shot.frame <= 1) {
        ctx.beginPath();
        ctx.fillStyle = null;
        ctx.strokeStyle = color2;
        ctx.lineWidth = 2;
        let midX = (shot.from.x + shot.to.x)/2;
        let midY = (shot.from.y + shot.to.y)/2;
        if(shot.frame == 0) {
          drawLine(shot.from.x, shot.from.y, midX, midY);
        } else {
          drawLine(midX, midY, shot.to.x, shot.to.y);
        }
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.strokeStyle = null;
        ctx.fillStyle = this.getScreenView$$().getPrimaryColor$$((shot.frame-2)/4);
        let ax = shot.to.x;
        let ay = shot.to.y;
        [ax, ay] = transform(ax, ay);
        ctx.arc(startX + roomSize*ax, startY + roomSize*ay, wallSize*roomSize*(shot.frame-2)/4, 0, 2 * Math.PI);
        ctx.fill();
      }
      shot.frame++;
    };

    let shoot = (x1, y1, x2, y2) => {
      this._shotList$$.push(new Shot(x1, y1, x2, y2));
      for(let i=0; i < 5; i++) {
        this._particleList$$.push(new Particle(x2, y2));
      }
    };
    renderWalls();

    this._battle$$.getDroids$$().forEach((d) => renderUnit(d.x, d.y, 0.05, 0.05, red));
    this._battle$$.getMarines$$().forEach((m) => renderUnit(m.x, m.y, 0.05, 0.05, color));

    let droid, marine;
    let threshold = 8;
    let droids;
    if(this._battle$$.isDroidsTurn$$()) {
      if(!this._shooting$$) {
        this.soundPlayer$$.play$$('gun');
        this._shooting$$ = true;
      }
      droids = this._battle$$.getDroids$$();
      if(droids.length > 0) {
        droid = droids[Math.floor(droids.length*Math.random())];
        let x = 0.3+0.4*Math.random();
        let y = 1-wallSize;
        if(x > 0.4 && x < 0.6) {
          y += wallSize*Math.random();
        }
        shoot(droid.x, droid.y, x, y);
      }

    } else if (this._battle$$.isMarinesTurn$$()) {
      if(!this._shooting$$) {
        this.soundPlayer$$.play$$('gun');
        this._shooting$$ = true;
      }
      droids = this._battle$$.getDroids$$();
      if(droids.length > 0) {
        droid = droids[Math.floor(droids.length*Math.random())];
        let marines = this._battle$$.getMarines$$();
        marine = marines[Math.floor(Math.random()*2)];
        let x1 = marine.x;
        let y1 = marine.y;
        let x2 = droid.x + (-3+6*Math.random())*wallSize;
        let y2 = droid.y + (-3+6*Math.random())*wallSize;

        x2 = Math.max(wallSize, Math.min(1-wallSize, x2));
        y2 = Math.max(wallSize, Math.min(1-wallSize, y2));
        shoot(x1, y1, x2, y2);
      }
    } else {
      this.soundPlayer$$.stop$$('gun');
      this._shooting$$ = false;
    }
    this._shotList$$.forEach((s) => renderShot(s));
    this._shotList$$ = this._shotList$$.filter((s) => !s.isCompleted$$());
    this._particleList$$.forEach((p) => renderParticle(p));
    this._particleList$$ = this._particleList$$.filter((p) => !p.isCompleted$$());
  }

}
