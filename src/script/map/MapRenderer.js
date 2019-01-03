export default class MapRenderer {

  constructor(map, screenView) {
    this._map = map;
    this._screenView = screenView;

    this._map.onChange(() => {
      this.render();
    });
    this.render();
  }

  render() {
    let ctx = this._screenView.getContext();
    let w = this._screenView.getWidth();
    let h = this._screenView.getHeight();
    let red = this._screenView.getDangerColor();
    let color = this._screenView.getPrimaryColor();
    let bg = this._screenView.getBackgroundColor();
    let pos;

    this._screenView.clear();

    let segmentSize = Math.round(Math.min(w, h)/12);
    let startX = w/2 - (segmentSize*12)/2;
    let startY = h/2 - (segmentSize*12)/2;

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
      let doors = room.getDoors();
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

    // render rooms
    for(let x=0; x <10; x++) {
      for(let y=0; y <10; y++) {
        if(!this._map.hasRoom(x, y) || !this._map.getRoom(x, y).isVisited()) {
          continue;
        }
        let room = this._map.getRoom(x, y);
        switch(room.getType()) {
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
        if(this._map.getRoom(x, y).getEnemy() > 0) {
          renderSquad(x, y, red);
        }
      }
    }


    // render doors
    let doorList = this._map.getDoorList();

    for(let door of doorList) {
      if(!door.isVisited()) {
        continue;
      }
      pos = door.getPosition();
      if(door.isClosed()) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 8;
        ctx.beginPath();
        if(door.getRotation() == 90) {
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
    pos = this._map.getSquadPosition();
    renderSquad(pos.x, pos.y, color);
  }

}
