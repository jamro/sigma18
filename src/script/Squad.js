export default class Squad {

  constructor(map) {
    this._map = map;
  }

  validateMove(direction) {
    let pos = this._map.getSquadPosition();
    let room = this._map.getRoom(pos.x, pos.y);
    let doors = room.getDoors();
    if(!doors[direction]) {
      return 'No doors on that direction.';
    }
    return '';
  }

  requestMove(direction, done) {
    if(this.validateMove(direction) != '') {
      return done();
    }
    let dx = 0;
    let dy = 0;
    switch(direction) {
      case 'n':
        dy = -1;
        break;
      case 's':
        dy = 1;
        break;
      case 'w':
        dx = -1;
        break;
      case 'e':
        dx = 1;
        break;
    }
    let pos = this._map.getSquadPosition();
    setTimeout(() => {
      let pos = this._map.getSquadPosition();
      this._map.setSquadPosition(pos.x + dx, pos.y + dy);
      done();
    }, 500);
  }

  getPosition() {
    return this._map.getSquadPosition();
  }

}
