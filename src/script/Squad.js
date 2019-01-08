export default class Squad {

  constructor(map, terminal, screen, soundPlayer) {
    this._soundPlayer$$ = soundPlayer;
    this._map$$ = map;
    this._screen$$ = screen;
    this._terminal$$ = terminal;
    this._inventory$$ = [];
    this._battleLoop$$ = null;
    this._directionMap$$ = {
      n: 'north',
      s: 'south',
      e: 'east',
      w: 'west',
    };
  }

  stopBattle$$() {
    if(this._battleLoop$$) {
      clearInterval(this._battleLoop$$);
    }
    let winner = this._map$$.getBattle$$().getDroids$$().length == 0;
    setTimeout(()=> {
      this._map$$.stopBattle$$();
      this._soundPlayer$$.play$$('chat');
      let pos = this._map$$.getSquadPosition$$();
      let virusActive = this._map$$.getVirus$$().isActive$$();
      let queue = [];
      if(winner) {
        queue.push({c: 'chat', d: `Enemy defeated!`, f: 'commander'});
      } else {
        queue.push({c: 'chat', d: `Thanks! We're at safe spot now: ${pos.toString()}. That was close!`, f: 'commander'});
      }
      queue.push({c: () => {this._screen$$.showMap$$(this._map$$); }});
      if(!winner && !virusActive) {
        queue.push({c: 'chat', d: `They are calling backups. You must block their communication somehow so we can defeat them in smaller groups.`, f: 'commander', t:1000});
      }
      queue.push({c: 'sound', d: 'chat', t: 0});

      this._terminal$$.sequence$$(queue);

    }, 200);
  }

  startBattle$$(room, door, done) {
    this._map$$.startBattle$$(room, door, () => this.stopBattle$$());
    let battle = this._map$$.getBattle$$();
    let enemy = battle.getDroids$$().length;
    let enemies = `${enemy} armed, battle droid${enemy > 1 ? 's' : ''} SIG-18`;
    this._screen$$.showBattle$$(battle);
    this._terminal$$.sequence$$([
      {c:'chat', d:`Enemy units encountered (${enemies}).<br/> We need going back to previous position!`, f:'commander'},
      {c:'sound', d:'chat', t:0},
      {c:'chat', d:'We have been spotted. SIG-18 opened fire! <br/>We are trying to push back the attack...', f:'commander', t:1000},
      {c: done}
    ]);
    this._battleLoop$$ = setInterval(() => {
      let doorId = door.getId$$();
      let items;
      let virusActive = this._map$$.getVirus$$().isActive$$();
      if(virusActive) {
        items = [
          `Virus is active, we are pushing them back!`,
          `They cannot get backups anymore!`,
          'Virus is working! Good job!',
          'They are losing!',
          'We will defeat them!'
        ];
      } else {
        items = [
          `We cannot push them back, they bring backups! s{close the door (${doorId})}s to secure our position!`,
          `There are too many of them! s{Close the door (${doorId})}s to isolate them`,
          `They are getting backups! s{Close the door (${doorId})}s to stop them!`,
          `There is more of them! s{Close door (${doorId})}s!`,
          `Heavy fire! Backups have arrived! s{Close that door (${doorId})}s! We cannot push them back!`
        ];
      }
      if(!virusActive || Math.random() > 0.6) {
        this._soundPlayer$$.play$$('chat');
        this._terminal$$.printChat$$(
          items[Math.floor(Math.random()*items.length)],
          'commander'
        );
      }
    }, 6000);
    door.onChange$$(() => {
      if(door.isClosed$$()) {
        this.stopBattle$$();
        return true;
      } else {
        return false;
      }
    });
  }

  requestMove$$(direction, done) {
    let doneOnObstacle = () => { done([]); };
    if(this._map$$.getBattle$$()) {
      return this._terminal$$.sequence$$(
        {c: 'chat', d: `r{We are under fire!}r Cannot move anywhere!`, f: 'commander', t: 500},
        doneOnObstacle
      );
    }

    let invalidReason = '';
    let pos = this._map$$.getSquadPosition$$();
    let room = this._map$$.getRoom$$(pos.x, pos.y);
    let door = room.getDoors$$()[direction];
    if(!door) {
      invalidReason = 'No doors on that side.';
    } else if(door.isClosed$$()) {
      invalidReason = 'The door is locked.';
    }

    if(invalidReason) {
      return this._terminal$$.sequence$$(
        {c: 'chat', d: `Cannot move to the ${this._directionMap$$[direction]}! ${invalidReason}`, f: 'commander', t: 500},
        doneOnObstacle
      );
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
    pos = this._map$$.getSquadPosition$$();
    let newX = pos.x + dx;
    let newY = pos.y + dy;

    let moveToNewLocation = () => {
      this._map$$.getRoom$$(newX, newY).visit$$();

      let battleRoom = this._map$$.getRoom$$(newX, newY);
      if(battleRoom.getEnemy$$() > 0) {
        this.startBattle$$(battleRoom, door, doneOnObstacle);
        return;
      }
      this._map$$.setSquadPosition$$(newX, newY);
    };

    let processItems = () => {
      if(this._map$$.getBattle$$()) {
        return done([]);
      }
      let items = this._map$$.getRoom$$(newX, newY).flushItems$$();
      this._inventory$$ = this._inventory$$.concat(items.filter((i) => i.getType$$() != 'disk'));

      pos = this._map$$.getSquadPosition$$();
      let msg = `Location ${pos.toString()} secured. ${this._map$$.getRoom$$(pos.x, pos.y).getDescription$$()}`;
      if(items.length > 0) {
        msg += "<br/><br/>We have found:<br/>";
        items.forEach((i) => msg += ` * ${i}<br/>`);
      }
      this._terminal$$.printChat$$(msg, 'commander');
      done(items);
    };

    this._terminal$$.sequence$$(
      {c: 'chat', d: `Exploring location on the ${this._directionMap$$[direction]}... Move! Move! Move!`, f: 'commander', t: 500},
      {c: moveToNewLocation, t: 500},
      {c: 'sound', d: 'chat', t: 0},
      {c: processItems, t: 0}
    );
  }

  requestStatus$$(done) {
    let pos = this.getPosition$$();
    let fire = this._map$$.getBattle$$() ? 'r{We are under attack!}r ' : '';
    let msg = `Our current position is ${pos.toString()}. ${fire}${this._map$$.getRoom$$(pos.x, pos.y).getDescription$$()}<br/>\n<br/>\nPossible ways out:<br/>`;
    let doors = this._map$$.getRoom$$(pos.x, pos.y).getDoors$$();

    for(let direction in doors) {
      if(doors[direction]) {
        let state = doors[direction].isClosed$$() ? 'Locked' : 'Opened';
        msg += ` * ${state} door on the ${this._directionMap$$[direction]} (ID: ${doors[direction].getId$$()})<br/>`;
      }
    }
    msg += "<br/>\nInventory:<br/>\n";
    if(this._inventory$$.length == 0) {
      msg += ' * nothing<br/>\n';
    }
    this._inventory$$.forEach((i) => {
      msg += ` * ${i}<br/>\n`;
    });
    this._terminal$$.sequence$$(
      {c: 'chat', d: msg, f: 'commander', t: 500},
      done
    );
  }

  getPosition$$() {
    return this._map$$.getSquadPosition$$();
  }

  getInventory$$() {
    return this._inventory$$;
  }

}
