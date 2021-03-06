import ScreenRenderer from '../ScreenRenderer.js';

class Circle {
  constructor(x, y, f) {
    this.frame = 0;
    this.x = x;
    this.y = y;
  }
}

export default class MapRenderer extends ScreenRenderer {

  constructor(soundPlayer, map) {
    super(soundPlayer);
    this._time$$ = 0;
    this._map$$ = map;
    this._circleList$$ = [];
    this.render$$();
  }

  attach$$(screenView) {
    super.attach$$(screenView);
    this._loop$$ = setInterval(() => {
      this.render$$();
    }, 30);
  }

  detach$$() {
    super.detach$$();
    if(this._loop$$ ) {
      clearInterval(this._loop$$);
      this._loop$$  = null;
    }
  }

  render$$() {
    if(!this.screenView$$) {
      return;
    }
    this._time$$++;
    let ctx = this.screenView$$.context$$;
    let w = this.screenView$$.getWidth$$();
    let h = this.screenView$$.getHeight$$();
    let red = this.screenView$$.dangerColor$$;
    let color = this.screenView$$.getPrimaryColor$$();
    let color2 = this.screenView$$.getPrimaryColor$$(0.7);
    let bg = this.screenView$$.backgroundColor$$;
    let pos;
    let room;

    this.screenView$$.clear$$();

    let segmentSize = Math.round(Math.min(w, h)/12);
    let startX = w/2 - (segmentSize*12)/2;
    let startY = h/2 - (segmentSize*12)/2;

    let blink = (x, y) => {
      x = startX + (1 + x + 0.5)*segmentSize;
      y = startY + (1 + y + 0.5)*segmentSize;
      this._circleList$$.push(new Circle(x, y, 0));
    };

    let renderCircle = (c) => {
      c.frame++;
      if(c.frame < 0) {
        return;
      }
      ctx.beginPath();
      ctx.fillStyle = null;
      ctx.lineWidth = 1;
      ctx.strokeStyle = this.screenView$$.getPrimaryColor$$(c.frame/30);
      ctx.arc(c.x, c.y, 40*Math.sqrt(0.25*c.frame), 0, 2 * Math.PI);
      ctx.stroke();
    };

    let renderRoom = (x, y) => {
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.rect(startX + segmentSize + x*segmentSize, startY + segmentSize + y*segmentSize, segmentSize, segmentSize);
      ctx.stroke();
    };

    let drawLine = (segX, segY, x1, y1, x2, y2) => {
      ctx.moveTo(startX + (1 + segX + x1)*segmentSize, startY + (1 + segY+y1)*segmentSize);
      ctx.lineTo(startX + (1 + segX + x2)*segmentSize, startY + (1 + segY+y2)*segmentSize);
    };

    let drawRect = (segX, segY, x, y, w, h) => {
      ctx.rect(
        startX + (1 + segX + x)*segmentSize,
        startY + (1 + segY + y)*segmentSize,
        segmentSize*w,
        segmentSize*h
      );
    };

    let write = (segX, segY, x, y, txt) => {
      ctx.font = "1em \"Courier New\", Courier, monospace";
      ctx.textAlign = 'center';
      ctx.fillStyle = color;
      ctx.fillText(
        txt,
        startX + (1 + segX + x)*segmentSize,
        startY + (1 + segY + y)*segmentSize + 8
      );
    };

    let renderCapsule = (x, y) => {
      ctx.lineWidth = 3;
      renderRoom(x, y);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.strokeStyle = color;
      drawLine(x, y, 0, 0, 1, 1);
      drawLine(x, y, 0, 1, 1, 0);
      ctx.stroke();
    };

    let renderSquad = (x, y, color) => {
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.beginPath();
      drawRect(x, y, 0.375, 0.375, 0.25, 0.25);
      ctx.fill();
    };

    let renderCorridor = (x, y, room) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      let doors = room.getDoors$$();
      if(doors.n) {
        drawLine(x, y, 0.25, 0, 0.25, 0.25);
        drawLine(x, y, 0.75, 0, 0.75, 0.25);
      } else {
        drawLine(x, y, 0.25, 0.25, 0.75, 0.25);
      }
      if(doors.s) {
        drawLine(x, y, 0.25, 1, 0.25, 0.75);
        drawLine(x, y, 0.75, 1, 0.75, 0.75);
      } else {
        drawLine(x, y, 0.25, 0.75, 0.75, 0.75);
      }
      if(doors.w) {
        drawLine(x, y, 0, 0.25, 0.25, 0.25);
        drawLine(x, y, 0, 0.75, 0.25, 0.75);
      } else {
        drawLine(x, y, 0.25, 0.25, 0.25, 0.75);
      }
      if(doors.e) {
        drawLine(x, y, 1, 0.25, 0.75, 0.25);
        drawLine(x, y, 1, 0.75, 0.75, 0.75);
      } else {
        drawLine(x, y, 0.75, 0.25, 0.75, 0.75);
      }
      ctx.stroke();
    };

    let x, y;
    // render grid
    for(x=0; x <10; x++) {
      let letters = "ABCDEFGHIJ";
      write(x, -1, 0.5, 0.5, letters.charAt(x));
    }
    for(y=0; y <10; y++) {
      write(-1, y, 0.5, 0.5, (y+1));
    }

    for(x=0; x <=10; x++) {
      for(y=0; y <=10; y++) {
        ctx.strokeStyle = color2;
        ctx.lineWidth = 1;
        ctx.beginPath();
        drawLine(x, y, -0.1, 0, 0.1, 0);
        drawLine(x, y, 0, -0.1, 0, 0.1);
        ctx.stroke();
      }
    }

    // render rooms
    for(x=0; x <10; x++) {
      for(y=0; y <10; y++) {
        if(!this._map$$.hasRoom$$(x, y)) {
          continue;
        }
        room = this._map$$.getRoom$$(x, y);
        if(room.highlightCounter$$ > 0 && this._time$$ % 6 == 0) {
          blink(x, y);
          room.highlightCounter$$--;
        }
        if(!room.isVisited$$()) {
          continue;
        }
        if(room.animation$$ > 0) {
          room.animation$$--;
          if(Math.random() > 0.5) continue;
        }
        switch(room.getType$$()) {
          case 'corridor':
            renderCorridor(x, y, room);
            break;
          case 'capsule':
            renderCapsule(x, y);
            break;
          case 'room':
            renderRoom(x, y);
            break;
        }

        // render enemy
        if(this._map$$.getRoom$$(x, y).enemy$$ > 0) {
          renderSquad(x, y, red);
        }
      }
    }


    // render doors
    let doorList = this._map$$.getDoorList$$();

    for(let door of doorList) {
      if(!door.isVisited$$()) {
        continue;
      }
      pos = door.getPosition$$();
      if(door.isClosed$$()) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 8;
        ctx.beginPath();
        if(door.getRotation$$() == 90) {
          ctx.moveTo(
            startX + 1.50*segmentSize + pos.x*segmentSize,
            startY + 1.25*segmentSize + pos.y*segmentSize
          );
          ctx.lineTo(
            startX + 1.50*segmentSize + pos.x*segmentSize,
            startY + 1.75*segmentSize + pos.y*segmentSize
          );
        } else {
          ctx.moveTo(
            startX + 1.25*segmentSize + pos.x*segmentSize,
            startY + 1.50*segmentSize + pos.y*segmentSize
          );
          ctx.lineTo(
            startX + 1.75*segmentSize + pos.x*segmentSize,
            startY + 1.50*segmentSize + pos.y*segmentSize
          );
        }
        ctx.stroke();
      } else {
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.rect(
          startX + 1.3*segmentSize + pos.x*segmentSize,
          startY + 1.3*segmentSize + pos.y*segmentSize,
          segmentSize*0.4,
          segmentSize*0.4
        );
        ctx.fill();
      }
    }

    // render squad position
    pos = this._map$$.getSquadPosition$$();
    renderSquad(pos.x, pos.y, color);

    this._circleList$$.forEach((c) => renderCircle(c));
    this._circleList$$ = this._circleList$$.filter((c) => c.frame < 30);
  }

}
