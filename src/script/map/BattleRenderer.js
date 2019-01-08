import ScreenRenderer from '../system/ScreenRenderer.js';

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
    return this.frame > 4;
  }
}

export default class BattleRenderer extends ScreenRenderer {

  constructor(soundPlayer, battle) {
    super(soundPlayer);
    this._battle = battle;
    this._loop = null;
    this._shotList = [];
    this._shooting = false;
  }

  attach$$(screenView) {
    super.attach$$(screenView);
    this._loop = setInterval(() => this.render$$(), 30);
  }

  detach$$() {
    clearInterval(this._loop);
    this.getSoundPlayer$$().stop$$('gun');
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
    let bg = this.getScreenView$$().getBackgroundColor$$();

    let flipY = false;
    let flipX = false;
    let rotate = false;

    let allDoors = this._battle.getRoom$$().getDoors$$();
    let door = this._battle.getDoor$$();

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

    let renderShot = (shot) => {
      if(shot.frame == 0) {
        ctx.beginPath();
        ctx.fillStyle = null;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        drawLine(shot.from.x, shot.from.y, shot.to.x, shot.to.y);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.strokeStyle = null;
        ctx.fillStyle = 'rgba(255, 255, 255, ' + (1-shot.frame/4).toFixed(2) + ')';
        let ax = shot.to.x;
        let ay = shot.to.y;
        [ax, ay] = transform(ax, ay);
        ctx.arc(startX + roomSize*ax, startY + roomSize*ay, wallSize*roomSize*shot.frame/4, 0, 2 * Math.PI);
        ctx.fill();
      }
      shot.frame++;
    };

    renderWalls();

    this._battle.getDroids$$().forEach((d) => renderUnit(d.x, d.y, 0.05, 0.05, red));
    this._battle.getMarines$$().forEach((m) => renderUnit(m.x, m.y, 0.05, 0.05, color));

    let droid, marine;
    let threshold = 8;
    let droids;
    if(this._battle.isDroidsTurn$$()) {
      if(!this._shooting) {
        this.getSoundPlayer$$().play$$('gun');
        this._shooting = true;
      }
      droids = this._battle.getDroids$$();
      if(droids.length > 0) {
        droid = droids[Math.floor(droids.length*Math.random())];
        let x = 0.3+0.4*Math.random();
        let y = 1-wallSize;
        if(x > 0.4 && x < 0.6) {
          y += wallSize*Math.random();
        }
        this._shotList.push(new Shot(droid.x, droid.y, x, y));
      }

    } else if (this._battle.isMarinesTurn$$()) {
      if(!this._shooting) {
        this.getSoundPlayer$$().play$$('gun');
        this._shooting = true;
      }
      droids = this._battle.getDroids$$();
      if(droids.length > 0) {
        droid = droids[Math.floor(droids.length*Math.random())];
        let marines = this._battle.getMarines$$();
        marine = marines[Math.floor(Math.random()*2)];
        let x1 = marine.x;
        let y1 = marine.y;
        let x2 = droid.x + (-3+6*Math.random())*wallSize;
        let y2 = droid.y + (-3+6*Math.random())*wallSize;

        x2 = Math.max(wallSize, Math.min(1-wallSize, x2));
        y2 = Math.max(wallSize, Math.min(1-wallSize, y2));
        this._shotList.push(new Shot(x1, y1, x2, y2));
      }
    } else {
      this.getSoundPlayer$$().stop$$('gun');
      this._shooting = false;
    }
    this._shotList.forEach((s) => renderShot(s));
    this._shotList = this._shotList.filter((s) => !s.isCompleted$$());
  }

}
