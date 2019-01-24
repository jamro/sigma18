import Command from '../Command.js';

export default class DoorCommand extends Command {

  constructor() {
    super();
    this._squad = null;

    this.name$$ = 'door';
    this.help$$ = 'Open/close doors';
  }

  setSystem$$(system) {
    super.setSystem$$(system);
    this._squad = this._map$$.getSquad$$();
  }

  getDoorOnDirection(direction) {
    if(['n', 's', 'e', 'w'].indexOf(direction) != -1) {
      let pos = this._map$$.getSquadPosition$$();
      let room = this._map$$.getRoom$$(pos.x, pos.y);
      let door = room.getDoors$$()[direction.toLowerCase()];
      if(!room.hasLight$$() && !this._map$$.getBattle$$()) {
        return null;
      }
      if(door) {
        return door;
      }
    }
    return null;
  }

  findDoor(command) {
    let direction = command.length >= 3 ? command[2].toLowerCase() : "unknown";
    let door = this.getDoorOnDirection(direction);
    if(!door) {
      this._terminal$$.println$$(`Error: door not found on direction ${direction}!`);
      this._system$$.getSoundPlayer$$().play$$('err');
    }
    return door;
  }

  execOpen(command) {
    this.doorSwitch(command, false);
  }

  execClose(command) {
    this.doorSwitch(command, true);
  }

  doorSwitch(command, doClose) {
    let door = this.findDoor(command);
    if(!door) {
      return;
    }
    this.disableInput$$();
    this._terminal$$.connect$$('doors', [`Door look up...`], () => {
      if(!door) {
        this._system$$.getSoundPlayer$$().play$$('err');
        this.enableInput$$();
        return;
      }
      if(door.isClosed$$() == doClose) {
        this._terminal$$.println$$(`Door found`);
        this._terminal$$.println$$(`Error: Door already ${doClose ? 'closed' : 'open'}!`);
        this._system$$.getSoundPlayer$$().play$$('err');
        this.enableInput$$();
        return;
      }
      if(door.isDamaged$$()) {
        this._terminal$$.println$$(`Door found`);
        this._terminal$$.println$$(`Error: Door damaged! Cannot ${doClose ? 'close' : 'open'}!`);
        this._system$$.getSoundPlayer$$().play$$('err');
        this.enableInput$$();
        return;
      }

      this._terminal$$.println$$("Door found");
      this._terminal$$.println$$("");
      let lock = door.getLock$$();
      let requiredKey = door.getRequiredKey$$();

      let openSequence = [
        "Password authorization is required.",
        {c: 'pass', d: 60},
        doClose ? `Closing...` : `Opening...`,
        {c:'ln', d:`Done. Door ${door.id$$} ${doClose ? 'closed' : 'open'}.`, s:'doors',t:500},
        {c: 'sound', d: 'ok', t: 0},
        {c: 'on'},
        {c: () => {
          if(doClose) {
            door.close$$();
          } else {
            door.open$$();
          }
        }, t: 500},
      ];
      if(lock) {
        this._terminal$$.sequence$$([
          {c:'sound', d: 'ok', t:300},
          {c:'ln', d:`Account (s{${lock.user}}s) has been locked.`,s:'doors'},
          "There were 3 unsuccessful attempts of login.",
          "Answer security question to unlock:",
          `s{${lock.question}}s`,
          {c: (done) => {
            this._terminal$$.prompt$$("Answer:", (txt) => {
              this._terminal$$.println$$('Answer: ' + txt);
              if(lock.check$$(txt)) {
                door.unlock$$();
                this._terminal$$.sequence$$([
                  {c:'sound', d: 'ok'},
                  {c:'ln', d:"The answer is correct. Account unlocked.",s:'doors'},
                  "",
                ].concat(openSequence));
                done();
              } else {
                this._terminal$$.sequence$$(
                  {c:'ln', d:"Error: Incorrect Answer! The account remains locked",s:'doors'},
                  {c:'sound', d: 'err'},
                  {c:'on'}
                );
                done();
              }
            });
          }}
        ]);
      } else if(requiredKey) {
        let hasKey = this._squad
          .getInventory$$()
          .filter((i) => (i.type$$ == 'key' && i.color$$ == requiredKey));
        hasKey = hasKey.length ? true : false;
        let info = {c: 'ln', d:`This area is restricted! A s{${requiredKey} key card}s is required to access`, t: 500};
        if(hasKey) {
          this._terminal$$.sequence$$([
            info,
            {c:'chat', d:[
              ['hacker', `Commander, I need your assistance. Use ${requiredKey} key card to open the door ${door.id$$}`],
              ['commander', `The key card is in the reader. Done!`]
            ], t: 800},
            "",
            {c:'ln', d:`Verification of key card...`, s:'doors',t: 1000},
            {c:'sound', d:'ok', t:0},
            {c:'ln', d:`Access to s{${requiredKey} restricted area}s granted.`, s:'doors', t: 500},
            "Proceeding to next authorization step",
            ""
          ].concat(openSequence));
        } else {
          this._terminal$$.sequence$$([
            info,
            {c:'chat', d:[
              ['hacker', `Commander, We need a ${requiredKey} key card to open the door ${door.id$$}`],
              ['commander', `We do not have required key card!`]
            ], t: 800},
            "",
            {c:'ln', d:`Timeout... access to s{${requiredKey} restricted area}s denied.`, s:'doors', t: 1700},
            {c:'sound', d:'err', t:0},
            {c: 'on'}
          ]);
        }
      } else {
        this._terminal$$.sequence$$(openSequence);
      }
    });
  }

  execHelp() {
    this._terminal$$.sequence$$(
      "Open/close doors in current location of the squad",
      "(The operation requires of being near to the doors due to low range of manual transmitters)",
      "",
      "Available commands are:",
      '',
      "s{door open [N/E/S/W]}s",
      "Open the door on north (s{N}s), east (s{E}s), south (s{S}s) or west (s{W}s)",
      "For example s{door open N}s",
      '',
      "s{door close [N/E/S/W]}s",
      "Close the door on north (s{N}s), east (s{E}s), south (s{S}s) or west (s{W}s)",
      "For example s{door close N}s",
      {c: 'sound', d: 'ok', t:0}
    );

  }
}
