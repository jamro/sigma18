export default class Squad {

  constructor(system) {
    this._system$$ = system;
    this._hasLight$$ = true;
    this.soundPlayer$$ = system.getSoundPlayer$$();
    this._map$$ = null;
    this._screen$$ = system.getSideScreen$$();
    this._terminal$$ = system.getTerminal$$();
    this._inventory$$ = [];
    this._battleLoop$$ = null;
    this._directionMap$$ = {
      n: 'north',
      s: 'south',
      e: 'east',
      w: 'west',
    };
  }

  setMap$$(map) {
    this._map$$ = map;
    this._map$$.onChange$$((type) => {
      if(type != 'light' || this._hasLight$$) return;
      let pos = this._map$$.getSquadPosition$$();
      let room = this._map$$.getRoom$$(pos.x, pos.y);
      if(!room.hasLight$$()) return;
      this._hasLight$$ = true;
      this.onLights();
    });
  }

  stopBattle$$() {
    if(this._battleLoop$$) {
      clearTimeout(this._battleLoop$$);
    }
    let droidsCount = this._map$$.getBattle$$().getDroids$$().length;
    let winner = (droidsCount == 0);

    this._map$$.stopBattle$$();
    let pos = this._map$$.getSquadPosition$$();
    let virusActive = this._map$$.getVirus$$().isActive$$;

    this._screen$$.showMap$$(this._map$$);
    let msg;
    if(winner) {
      msg = `Enemy defeated!`;
    } else {
      msg = `Thanks! We're at safe spot now: m{${pos.toString()}}m. That was close!`;
    }
    if(!winner) {
      if(droidsCount > 10) {
        msg += ` They are too many of them. We need another way to defeat them.`;
      } else if(!virusActive) {
        msg += ` They are calling backups. You must block their communication, so we can defeat them in smaller groups.`;
      }
    }

    this._terminal$$.printChat$$([['commander', msg]]);
  }

  startBattle$$(room, door, done) {
    this._map$$.startBattle$$(room, door);
    let battle = this._map$$.getBattle$$();
    let squadPosition = this._map$$.getSquadPosition$$();
    battle.onFinish$$(() => this.stopBattle$$());
    let enemy = battle.getDroids$$().length;
    let enemies = `${enemy} armed, battle droid${enemy > 1 ? 's' : ''} SIG-18`;
    this._terminal$$.sequence$$([
      {c: (done) => this._screen$$.showBattle$$(battle, done)},
      {c:'chat', d:[
        ['commander', `Enemy units encountered m{(${enemies})}m.`],
        ['commander', 'We have been spotted. SIG-18 opened fire! <br/>We are trying to push back the attack...']
      ]},
      {c: done}
    ]);
    let communicate = () => {
      let doorDirection = this._map$$.getRoom$$(squadPosition.x, squadPosition.y).getDoorDirection$$(battle.getDoor$$());
      doorDirection = this._directionMap$$[doorDirection];
      let items;
      let virusActive = this._map$$.getVirus$$().isActive$$;
      let hint = `s{close the door on the ${doorDirection}}s`;
      if(room.gun$$) {
        hint = 'use s{sentry gun m{BER-84}m}s or ' + hint;
      }
      if(enemy > 10) {
        items = [
          `We cannot push them back! ${hint}`,
          `There are too many of them! ${hint}`,
          `They are too strong! ${hint}`,
          `Heavy fire! ${hint}! We cannot push them back!`
        ];
      } else if (virusActive) {
        items = [
          `The virus is active, we are pushing them back!`,
          `They cannot get backups anymore!`,
          'The virus is working! Good job!',
          'They are losing!',
          'We will defeat them!'
        ];
      } else {
        items = [
          `We cannot push them back, they bring backups! s{close the door on the ${doorDirection}}s to secure our position!`,
          `There are too many of them! s{Close the door on the ${doorDirection}}s to isolate them`,
          `They are getting backups! s{Close the door on the ${doorDirection}}s to stop them!`,
          `There is more of them! s{Close door on the ${doorDirection}}s!`,
          `Heavy fire! Backups have arrived! s{Close that door on the ${doorDirection}}s! We cannot push them back!`
        ];
      }
      if(!virusActive || Math.random() > 0.6) {
        if(!room.gun$$ || !room.gun$$.online$$) {
          this._terminal$$.printChat$$([[
            'commander',
            items[Math.floor(Math.random()*items.length)]
          ]]);
        }
      }
      this._battleLoop$$ = setTimeout(communicate, 10000);
    };
    this._battleLoop$$ = setTimeout(communicate, 5000);
    door.onChange$$(() => {
      if(!this._map$$.getBattle$$()) return true;
      if(door.isClosed$$()) {
        this.stopBattle$$();
        return true;
      } else {
        return false;
      }
    });
  }

  onLights() {
    let pos = this._map$$.getSquadPosition$$();
    let items = this._map$$.getRoom$$(pos.x, pos.y).flushItems$$();
    this.addToInventory$$(items);
    let disks = items.filter((i) => i.type$$ == 'disk');
    let msg = `Lights on! ${this._map$$.getRoom$$(pos.x, pos.y).getDescription$$()}`;
    if(items.length > 0) {
      msg += "m{<br/><br/>We have found:<br/>";
      items.forEach((i) => msg += ` * ${i}<br/>`);
      msg += "}m";
    }
    this._terminal$$.sequence$$(
      {c:'off', t:0},
      {c:'chat', d:msg, f:'commander'},
      {c: (done) => {
        if(disks.length > 0) {
          this._terminal$$.uploadSoftware$$(disks, () => {
            done();
          });
        } else {
          done();
        }
      }},
      {c:'on'}
    );

  }

  requestMove$$(direction, done) {
    let msgQueue = [];
    let actionQueue = [];
    let items = [];
    let invalidReason = '';
    let pos = this._map$$.getSquadPosition$$();
    let room = this._map$$.getRoom$$(pos.x, pos.y);
    let door = room.getDoors$$()[direction];

    if(!room.hasLight$$() && (!door || door.isClosed$$())) {
      invalidReason = "We've got total s{darkness}s here. Can't see anything. There is no point to explore this location. Try to turn the lights on at first.";
    } else if(!door) {
      invalidReason = 'No doors on that side.';
    } else if(door.isClosed$$()) {
      invalidReason = 'The door is closed. ';
      invalidReason += this._system$$.hasCommand$$('door') ? "Use s{door}s app to open them." : "Explore other locations and find a way to open them.";
    }

    msgQueue.push(['hacker', `Commander, check the door on the ${this._directionMap$$[direction]}.`]);

    if(this._map$$.getBattle$$()) {
      msgQueue.push(['commander', `r{We are under fire!}r Cannot move anywhere!`]);
      actionQueue.push({c:'chat', d:msgQueue});
    } else if(invalidReason) {
      msgQueue.push(['commander', `Cannot move to the ${this._directionMap$$[direction]}! ${invalidReason}`]);
      actionQueue.push({c:'chat', d:msgQueue});
    } else {
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

      pos = this._map$$.getSquadPosition$$();
      let newX = pos.x + dx;
      let newY = pos.y + dy;

      let battleRoom = this._map$$.getRoom$$(newX, newY);
      if(battleRoom.enemy$$ > 0) {
        battleRoom.visit$$();
        battleRoom.blink$$();
        this._terminal$$.sequence$$(
          {c:'chat', d:msgQueue},
          {c:() => this.startBattle$$(battleRoom, door, () => done(items))}
        );
        return;
      }

      let trapSize = this._map$$.getRoom$$(pos.x, pos.y).validateTrap$$(newX, newY);
      this._map$$.getRoom$$(newX, newY).visit$$();
      this._map$$.setSquadPosition$$(newX, newY);
      this._hasLight$$ = this._map$$.getRoom$$(newX, newY).hasLight$$();
      items = this._map$$.getRoom$$(newX, newY).flushItems$$();
      this.addToInventory$$(items);
      pos = this._map$$.getSquadPosition$$();

      let msg = `Location m{${pos.toString()}}m secured. ${this._map$$.getRoom$$(pos.x, pos.y).getDescription$$()}`;
      msgQueue.push(['commander', msg]);
      actionQueue.push({c:'chat', d:msgQueue});
      msgQueue = [];

      if(items.length > 0) {
        msg = "We have found something:m{<br/>";
        items.forEach((i) => msg += ` * ${i}<br/>`);
        msg += "}m";
        actionQueue.push({c:'off'});
        actionQueue.push({c:'chat', d:msg, f:'commander'});
        actionQueue.push({c:'on'});
      }

      if(trapSize) {
        msgQueue.push(['commander', `It was a trap! There are ${trapSize} SIG-18 units blocking the entrance at ${pos.toString()}.`]);
      }

      let disks = items.filter((i) => i.type$$ == 'disk');
      if(disks.length > 0) {
        msgQueue.push(['commander', 'I\'ve got a data storage here! Uploading...']);
      }
      if(msgQueue.length > 0) {
        actionQueue.push({c:'chat', d:msgQueue});
      }
    }
    actionQueue.push({c:() => {
      done(items);
    }});
    this._terminal$$.sequence$$(actionQueue);
  }

  requestStatus$$(done) {
    let pos = this.getPosition$$();
    let fire = this._map$$.getBattle$$() ? 'r{We are under attack!}r ' : '';
    let msg = `m{Our current position is ${pos.toString()}.}m ${fire}${this._map$$.getRoom$$(pos.x, pos.y).getDescription$$()}<br/>\n`;
    let doors = this._map$$.getRoom$$(pos.x, pos.y).getDoors$$();

    msg += "m{<br/>\nInventory:<br/>\n";
    if(this._inventory$$.length == 0) {
      msg += ' * nothing<br/>\n';
    }
    this._inventory$$.forEach((i) => {
      msg += ` * ${i}<br/>\n`;
    });
    msg += '}m';

    this._terminal$$.sequence$$(
      {c: 'chat', d: [
        ['hacker', `Commander, what's going on?`],
        ['commander', msg]
      ]},
      done
    );
  }

  addToInventory$$(items) {
    this._inventory$$ = this._inventory$$.concat(items.filter((i) => i.type$$ != 'disk'));
    items.forEach((i) => this._map$$.getWalthrough$$().handleEvent$$('item-' + i.id$$));
  }

  getPosition$$() {
    return this._map$$.getSquadPosition$$();
  }

  getInventory$$() {
    return this._inventory$$;
  }

}
