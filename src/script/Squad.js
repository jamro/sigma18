export default class Squad {

  constructor(map, terminalView) {
    this._map = map;
    this._terminalView = terminalView;
    this._inventory = [];
    this._directionMap = {
      n: 'north',
      s: 'south',
      e: 'east',
      w: 'west',
    };
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
    setTimeout(() => {
      let invalidReason = this.validateMove(direction);
      if(invalidReason) {
        this._terminalView.printChat(`Cannot move to the ${this._directionMap[direction]}! ${invalidReason}`, 'commander');
        return done();
      }
      this._terminalView.printChat(`Exploring location on the ${this._directionMap[direction]}... Move! Move! Move!`, 'commander');
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

        pos = this._map.getSquadPosition();
        this._terminalView.playChat();
        let msg = `Location ${pos.toString()} secured. ${this._map.getRoom(pos.x, pos.y).getDescription()}`;

        if(items.length > 0) {
          msg += "<br/><br/>We have found:<br/>";
          items.forEach((i) => msg += ` * ${i}<br/>`);
        }
        this._terminalView.printChat(msg, 'commander');
        done(items);
      }, 500);
    }, 500);
  }

  requestStatus(done) {
    setTimeout(() => {
      let pos = this.getPosition();
      let msg = `Our current position is ${pos.toString()}. ${this._map.getRoom(pos.x, pos.y).getDescription()}<br/>\n<br/>\nPossible ways out:<br/>`;
      let doors = this._map.getRoom(pos.x, pos.y).getDoors();

      for(let direction in doors) {
        if(doors[direction]) {
          let state = doors[direction].isClosed() ? 'Locked' : 'Opened';
          msg += ` * ${state} door on the ${this._directionMap[direction]} (ID: ${doors[direction].getId()})<br/>`;
        }
      }
      msg += "<br/>\nInventory:<br/>\n";
      if(this._inventory.length == 0) {
        msg += ' * nothing<br/>\n';
      }
      this._inventory.forEach((i) => {
        msg += ` * ${i}<br/>\n`;
      });
      this._terminalView.printChat(msg, 'commander');
      done();
    }, 500);
  }

  getPosition() {
    return this._map.getSquadPosition();
  }

  getInventory() {
    return this._inventory;
  }

}
