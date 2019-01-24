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
  constructor(x1, y1, x2, y2, scale) {
    this.scale = scale;
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
    this._unitsShooting$$ = false;
    this._gunShooting$$ = false;
    this._time$$ = 0;
  }

  attach$$(screenView) {
    super.attach$$(screenView);
    this._loop$$ = setInterval(() => this.render$$(), 30);
  }

  detach$$() {
    clearInterval(this._loop$$);
    this.soundPlayer$$.stop$$('gun');
    this.soundPlayer$$.stop$$('gun2');
    super.detach$$();
  }

  render$$() {
    if(!this.screenView$$) {
      return;
    }
    let ctx = this.screenView$$.context$$;
    let w = this.screenView$$.getWidth$$();
    let h = this.screenView$$.getHeight$$();
    let red = this.screenView$$.dangerColor$$;
    let color = this.screenView$$.getPrimaryColor$$();
    let color2 = this.screenView$$.getPrimaryColor$$(0.5);
    let bg = this.screenView$$.backgroundColor$$;

    let flipY = this._battle$$.flipY$$;
    let flipX  = this._battle$$.flipX$$;
    let rotate = this._battle$$.rotate$$;

    let gun = this._battle$$.getRoom$$().gun$$;

    this.screenView$$.clear$$();

    let roomSize = Math.round(Math.min(w, h)*0.7);
    let wallSize = 0.05;
    let startX = w/2 - roomSize/2;
    let startY = h/2 - roomSize/2;
    let gunX = 1.5*wallSize;
    let gunY = 1-1.5*wallSize;

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

    let drawCircle = (x, y, r) => {
      [x, y] = transform(x, y);
      ctx.arc(startX + roomSize*x, startY + roomSize*y, roomSize*r, 0, 2 * Math.PI);
    };

    let drawRect = (x, y, w, h) => {
      [x, y] = transform(x, y);
      if(rotate) {
        let a = w;
        w = h;
        h = a;
      }
      ctx.rect(startX + roomSize*(x-w/2), startY + roomSize*(y-h/2), w*roomSize, h*roomSize);
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

    let renderGun = () => {
      this._time$$++;
      ctx.beginPath();
      ctx.fillStyle = this.screenView$$.getPrimaryColor$$();
      ctx.strokeStyle = null;
      drawCircle(wallSize+0.04, 1-wallSize-0.04, 0.04);
      drawRect(wallSize+0.02, 1-wallSize-0.04, 0.04, 0.08);
      drawRect(wallSize+0.04, 1-wallSize-0.02, 0.08, 0.04);
      ctx.fill();
      let angle = Math.atan2(gunY-gun.target$$.y, gunX-gun.target$$.x);
      let sin = -Math.sin(angle);
      let cos = -Math.cos(angle);
      ctx.beginPath();
      ctx.fillStyle = null;
      ctx.strokeStyle = this.screenView$$.getPrimaryColor$$();
      ctx.lineWidth = 2;
      drawLine(
        gunX,
        gunY,
        gunX + cos*0.13,
        gunY + sin*0.13
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.lineWidth = 4;
      let len = gun.isShooting$$ ? 0.015*Math.sin(this._time$$*1.2) : 0;
      drawLine(
        gunX + cos*(len+0.1),
        gunY + sin*(len+0.1),
        gunX + cos*(len+0.14),
        gunY + sin*(len+0.14)
      );
      ctx.stroke();
      if(gun.online$$) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        drawRect(
          gun.target$$.x,
          gun.target$$.y,
          0.12,
          0.12
        );
        drawRect(
          gun.target$$.x,
          gun.target$$.y,
          0.06,
          0.06
        );
        drawLine(gun.target$$.x, gun.target$$.y-0.15, gun.target$$.x, gun.target$$.y+0.15);
        drawLine(gun.target$$.x-0.15, gun.target$$.y, gun.target$$.x+0.15, gun.target$$.y);
        ctx.stroke();
      }
    };

    let renderUnit = (x, y, w, h, c) => {
      ctx.beginPath();
      ctx.fillStyle = c;
      ctx.strokeStyle = null;
      drawRect(x, y, w, h);
      ctx.fill();
    };

    let renderParticle = (p) => {
      let size = 0.01;
      ctx.beginPath();
      ctx.fillStyle = this.screenView$$.getPrimaryColor$$(p.frame/p.life);
      ctx.strokeStyle = null;
      drawRect(p.x, p.y, size, size);
      ctx.fill();
      p.step$$();
    };

    let renderShot = (shot) => {
      if(shot.frame <= 1) {
        ctx.beginPath();
        ctx.fillStyle = null;
        ctx.strokeStyle = color2;
        ctx.lineWidth = 2*shot.scale;
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
        ctx.fillStyle = this.screenView$$.getPrimaryColor$$((shot.frame-2)/4);
        let ax = shot.to.x;
        let ay = shot.to.y;
        drawCircle(ax, ay, shot.scale*wallSize*(shot.frame-2)/4);
        ctx.fill();
      }
      shot.frame++;
    };

    let shoot = (x1, y1, x2, y2, scale) => {
      this._shotList$$.push(new Shot(x1, y1, x2, y2, scale));
      for(let i=0; i < 5*scale; i++) {
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
      if(!this._unitsShooting$$) {
        this.soundPlayer$$.play$$('gun');
        this._unitsShooting$$ = true;
      }
      droids = this._battle$$.getDroids$$();
      if(droids.length > 0) {
        droid = droids[Math.floor(droids.length*Math.random())];
        let x = 0.3+0.4*Math.random();
        let y = 1-wallSize;
        if(x > 0.4 && x < 0.6) {
          y += wallSize*Math.random();
        }
        shoot(droid.x, droid.y, x, y, 1);
      }

    } else if (this._battle$$.isMarinesTurn$$()) {
      if(!this._unitsShooting$$) {
        this.soundPlayer$$.play$$('gun');
        this._unitsShooting$$ = true;
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
        shoot(x1, y1, x2, y2, 1);
      }
    } else {
      this.soundPlayer$$.stop$$('gun');
      this._unitsShooting$$ = false;
    }
    if(gun) {
      if(gun.isShooting$$ && Math.random() > 0.5) {
        shoot(gunX, gunY, gun.target$$.x+Math.random()*0.1-0.05, gun.target$$.y+Math.random()*0.1-0.05, 1.5);
      }
      renderGun();
      if(!this._gunShooting$$ && gun.isShooting$$) {
        this._gunShooting$$ = true;
        this.soundPlayer$$.play$$('gun2');
      } else if(this._gunShooting$$ && !gun.isShooting$$) {
        this._gunShooting$$ = false;
        this.soundPlayer$$.stop$$('gun2');
      }
    }

    this._shotList$$.forEach((s) => renderShot(s));
    this._shotList$$ = this._shotList$$.filter((s) => !s.isCompleted$$());
    this._particleList$$.forEach((p) => renderParticle(p));
    this._particleList$$ = this._particleList$$.filter((p) => !p.isCompleted$$());
  }

}
