export default class Squad {

  constructor(map) {
    this._map = map;
    this._inventory = [];
  }

  validateMove(direction) {
    let pos = this._map.getSquadPosition();
    let room = this._map.getRoom(pos.x, pos.y);
    let doors = room.getDoors();
    if(!doors[direction]) {
      return 'No doors on that side.';
    }
    if(doors[direction].isClosed()) {
      return 'The door is locked.';
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
      let newX = pos.x + dx;
      let newY = pos.y + dy;
      this._map.setSquadPosition(newX, newY);
      this._map.getRoom(newX, newY).visit();
      let items = this._map.getRoom(newX, newY).flushItems();
      this._inventory = this._inventory.concat(items.filter((i) => i.getType() != 'disk'));
      done(items);
    }, 500);
  }

  getPosition() {
    return this._map.getSquadPosition();
  }

  getInventory() {
    return this._inventory;
  }

}
