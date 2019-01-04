import ScreenRenderer from '../system/ScreenRenderer.js';

class Unit {
  constructor(x, y) {
    this.x = x;
    this.y = y;
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

  isCompleted() {
    return this.frame > 4;
  }
}

export default class BattleRenderer extends ScreenRenderer {

  constructor(room) {
    super();
    this._room = room;
    this._enemyCount = room.getEnemy();
    this._droids = [];
    this._marines = [];
    this._loop = null;
    this._shotList = [];
    this._shootCounter = 0;
    this._backupTime = -80;

    for(let i=0; i < this._enemyCount; i++) {
      this.addDroid();
    }

    this._marines.push(new Unit(0.39, 1.04));
    this._marines.push(new Unit(0.6, 1.05));

    this._marines.push(new Unit(0.33, 1.11));
    this._marines.push(new Unit(0.24, 1.05));
    this._marines.push(new Unit(0.69, 1.09));
  }

  addDroid() {
    this._droids.push(new Unit(0.1 + 0.8*Math.random(), 0.1 + 0.7*Math.random()));
  }

  attach(screenView) {
    super.attach(screenView);
    this._loop = setInterval(() => this.render(), 30);
  }

  detach() {
    super.detach();
    clearInterval(this._loop);
  }


  render() {
    if(!this.getScreenView()) {
      return;
    }
    this._backupTime++;
    let ctx = this.getScreenView().getContext();
    let w = this.getScreenView().getWidth();
    let h = this.getScreenView().getHeight();
    let red = this.getScreenView().getDangerColor();
    let color = this.getScreenView().getPrimaryColor();
    let bg = this.getScreenView().getBackgroundColor();

    this.getScreenView().clear();

    let roomSize = Math.round(Math.min(w, h)*0.7);
    let wallSize = 0.05;
    let startX = w/2 - roomSize/2;
    let startY = h/2 - roomSize/2;

    let lineTo = (x, y) => {
      ctx.lineTo(startX + roomSize*x, startY + roomSize*y);
    };

    let drawLine = (x1, y1, x2, y2) => {
      ctx.moveTo(startX + roomSize*x1, startY + roomSize*y1);
      lineTo(x2, y2);
    };

    let renderWalls = () => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.fillStyle = null;
      ctx.lineWidth = 3;
      ctx.moveTo(startX, startY);
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
        ctx.arc(startX + roomSize*shot.to.x, startY + roomSize*shot.to.y, wallSize*roomSize*shot.frame/4, 0, 2 * Math.PI);
        ctx.fill();
      }
      shot.frame++;
    };

    renderWalls();

    this._droids.forEach((d) => renderUnit(d.x, d.y, 0.05, 0.05, red));
    this._marines.forEach((m) => renderUnit(m.x, m.y, 0.05, 0.05, color));

    if(this._shootCounter == 0 && this._backupTime >= 0) {
      this._shootCounter = (Math.random() > 0.5) ? 30 + 30*Math.random() : -15 - 15*Math.random();
      this._shootCounter = Math.round(this._shootCounter);
    }

    let droid, marine;
    if(this._shootCounter > 8) {
      droid = this._droids[Math.floor(this._droids.length*Math.random())];
      let x = 0.3+0.4*Math.random();
      let y = 1-wallSize;
      if(x > 0.4 && x < 0.6) {
        y += wallSize*Math.random();
      }
      this._shotList.push(new Shot(droid.x, droid.y, x, y));

      this._marines[0].x = 0.39;
      this._marines[0].y = 1.04;
      this._marines[1].x = 0.6;
      this._marines[1].y = 1.05;
      this._marines[2].y = 1.11;
      this._marines[3].x = 0.24;
      this._marines[4].y = 1.09;

    } else if (this._shootCounter < -8) {
      droid = this._droids[Math.floor(this._droids.length*Math.random())];
      marine = this._marines[Math.floor(Math.random()*2)];
      let x1 = marine.x;
      let y1 = marine.y;
      let x2 = droid.x + (-3+6*Math.random())*wallSize;
      let y2 = droid.y + (-3+6*Math.random())*wallSize;

      x2 = Math.max(wallSize, Math.min(1-wallSize, x2));
      y2 = Math.max(wallSize, Math.min(1-wallSize, y2));
      this._shotList.push(new Shot(x1, y1, x2, y2));

      this._marines[0].x = 0.45;
      this._marines[0].y = 0.98;
      this._marines[1].x = 0.55;
      this._marines[1].y = 0.98;
      this._marines[2].y = 1.08;
      this._marines[3].x = 0.26;
      this._marines[4].y = 1.04;
    }

    if(this._shootCounter > 0) {
      this._shootCounter --;
    } else if (this._shootCounter < 0) {
      this._shootCounter++;
    }

    this._shotList.forEach((s) => renderShot(s));
    this._shotList = this._shotList.filter((s) => !s.isCompleted());

    if(this._backupTime > 100 && this._droids.length < 100) {
      this._backupTime = 0;
      this.addDroid();
    }

  }

}
