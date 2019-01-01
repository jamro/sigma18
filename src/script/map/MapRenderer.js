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
    let color = this._screenView.getPrimaryColor();
    let bg = this._screenView.getBackgroundColor();
    let pos;

    this._screenView.clear();

    let segmentSize = Math.round(Math.min(w, h)/12);
    let startX = w/2 - (segmentSize*12)/2;
    let startY = h/2 - (segmentSize*12)/2;

    // render rooms
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for(let x=0; x <10; x++) {
      for(let y=0; y <10; y++) {
        if(this._map.hasRoom(x, y) && this._map.getRoom(x, y).isVisited()) {
          ctx.rect(startX + 2*segmentSize + x*segmentSize, startY + 2*segmentSize + y*segmentSize, segmentSize, segmentSize);
        }
      }
    }
    ctx.stroke();

    // render doors
    let doorList = this._map.getDoorList();

    for(let door of doorList) {
      pos = door.getPosition();
      if(door.isClosed()) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 8;
        ctx.beginPath();
        if(door.getRotation() == 90) {
          ctx.moveTo(
            startX + 2.50*segmentSize + pos.x*segmentSize,
            startY + 2.25*segmentSize + pos.y*segmentSize
          );
          ctx.lineTo(
            startX + 2.50*segmentSize + pos.x*segmentSize,
            startY + 2.75*segmentSize + pos.y*segmentSize
          );
        } else {
          ctx.moveTo(
            startX + 2.25*segmentSize + pos.x*segmentSize,
            startY + 2.50*segmentSize + pos.y*segmentSize
          );
          ctx.lineTo(
            startX + 2.75*segmentSize + pos.x*segmentSize,
            startY + 2.50*segmentSize + pos.y*segmentSize
          );
        }
        ctx.stroke();
      } else {
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.rect(
          startX + 2.25*segmentSize + pos.x*segmentSize,
          startY + 2.25*segmentSize + pos.y*segmentSize,
          segmentSize/2,
          segmentSize/2
        );
        ctx.fill();
      }
    }


    // render squad position
    pos = this._map.getSquadPosition();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(
      startX + 2.375*segmentSize + pos.x*segmentSize,
      startY + 2.375*segmentSize + pos.y*segmentSize,
      segmentSize/4,
      segmentSize/4
    );
    ctx.fill();
  }

}
