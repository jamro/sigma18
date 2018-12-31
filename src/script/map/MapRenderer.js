export default class MapRenderer {

  constructor(map, screenView) {
    this._map = map;
    this._screenView = screenView;
  }

  render() {
    let ctx = this._screenView.getContext();
    let w = this._screenView.getWidth();
    let h = this._screenView.getHeight();
    let color = this._screenView.getPrimaryColor();
    let bg = this._screenView.getBackgroundColor();
    let pos;

    this._screenView.clear();

    let segmentSize = Math.round(Math.min(w, h)/13);
    let startX = w/2 - (segmentSize*13)/2;
    let startY = h/2 - (segmentSize*13)/2;

    // render grid
    ctx.strokeStyle = color;
    ctx.beginPath();
    for(let x=0; x <10; x++) {
      for(let y=0; y <10; y++) {
        ctx.rect(startX + 2*segmentSize + x*segmentSize, startY + 2*segmentSize + y*segmentSize, segmentSize, segmentSize);
      }
    }
    ctx.stroke();

    // render doors
    let doorList = this._map.getDoorList();
    ctx.fillStyle = bg;
    ctx.beginPath();
    for(let door of doorList) {
      pos = door.getPosition();
      ctx.rect(
        startX + 2.25*segmentSize + pos.x*segmentSize,
        startY + 2.25*segmentSize + pos.y*segmentSize,
        segmentSize/2,
        segmentSize/2
      );
    }
    ctx.fill();

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
