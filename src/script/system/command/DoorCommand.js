import Command from '../Command.js';

export default class DoorCommand extends Command {

  constructor(map, squad) {
    super();
    this._squad = squad;
    this._map = map;
  }

  getName$$() {
    return 'door';
  }

  getHelp$$() {
    return "Open/close doors";
  }

  getDoorId(command) {
    return command.length >= 3 ? command[2].toUpperCase() : "";
  }

  findDoor(command) {
    let id = this.getDoorId(command);
    let door = this._map.getDoorById$$(id);
    if(id == "") {
      this._terminal.println$$(`Error: door ID is missing!`);
      this._terminal.getSoundPlayer$$().play$$('err');
    } else if(!door) {
      this._terminal.println$$(`Error: Door (ID: ${id}) not found!`);
      this._terminal.getSoundPlayer$$().play$$('err');
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
    this.disableInput$$();
    this.connect$$('Door', '10.43.23.37', [`Door look up: ${this.getDoorId(command)}...`], () => {
      let door = this.findDoor(command);
      if(!door) {
        this._terminal.getSoundPlayer$$().play$$('err');
        this.enableInput$$();
        return;
      }
      if(door.isClosed$$() == doClose) {
        this._terminal.println$$(`Door found`);
        this._terminal.println$$(`Error: Door already ${doClose ? 'closed' : 'opened'}!`);
        this._terminal.getSoundPlayer$$().play$$('err');
        this.enableInput$$();
        return;
      }
      if(door.isDamaged$$()) {
        this._terminal.println$$(`Door found`);
        this._terminal.println$$(`Error: Door damaged! Cannot ${doClose ? 'close' : 'open'}!`);
        this._terminal.getSoundPlayer$$().play$$('err');
        this.enableInput$$();
        return;
      }

      this._terminal.println$$("Door found");
      this._terminal.println$$("");
      let lock = door.getLock$$();
      let requiredKey = door.getRequiredKey$$();

      let openSequence = [
        "Password authorization is required.",
        {c: 'pass', d: 60},
        doClose ? `Closing...` : `Opening...`,
        {c: () => {
          if(doClose) {
            door.close$$();
          } else {
            door.open$$();
          }
        }, t: 500},
        `Done. Door ${door.getId$$()} ${doClose ? 'closed' : 'opened'}.`,
        {c: 'sound', d: 'ok', t: 0},
        {c: 'on'}
      ];
      if(lock) {
        this._terminal.sequence$$([
          {c:'sound', d: 'err', t:300},
          `Your account (s{${lock.user}}s) has been locked.`,
          "There were 3 unsuccessful attempts of login.",
          "Answer security question to unlock:",
          `s{${lock.question}}s`,
          {c: (done) => {
            this._terminal.prompt$$("Answer:", (txt) => {
              this._terminal.println$$(txt);
              if(lock.check$$(txt)) {
                door.unlock$$();
                this._terminal.sequence$$([
                  {c:'sound', d: 'ok'},
                  "Answer correct. Account unlocked.",
                  "",
                ].concat(openSequence));
                done();
              } else {
                this._terminal.sequence$$(
                  "Error: Incorrect Answer! The account remains locked",
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
          .filter((i) => (i.getType$$() == 'key' && i.getColor$$() == requiredKey));
        hasKey = hasKey.length ? true : false;
        let info = {c: 'ln', d:`This area is restricted! A s{${requiredKey} key card}s is required to access`, t: 500};
        if(hasKey) {
          this._terminal.sequence$$([
            info,
            {c:'chat', d:`Commander, I need your assistance. Use ${requiredKey} key card to open the door ${door.getId$$()}`, f:'hacker', t: 1800},
            {c:'sound', d:'chat', t:0},
            {c:'chat', d:`Done`, f:'commander', t: 1800},
            {c:'sound', d:'chat', t:0},
            "",
            {c:'ln', d:`Verification of key card...`, t: 1000},
            {c:'sound', d:'ok', t:0},
            {c:'ln', d:`Access to s{${requiredKey} restricted area}s granted.`, t: 500},
            "Proceeding to next authorization step",
            ""
          ].concat(openSequence));
        } else {
          this._terminal.sequence$$([
            info,
            {c:'chat', d:`Commander, We need a ${requiredKey} key card to open the door ${door.getId$$()}`, f:'hacker', t: 1800},
            {c:'sound', d:'chat', t:0},
            {c:'chat', d:`We do not have required key card!`, f:'commander', t: 1800},
            {c:'sound', d:'chat', t:0},
            "",
            {c:'ln', d:`Timeout... access to s{${requiredKey} restricted area}s denied.`, t: 1700},
            {c:'sound', d:'err', t:0},
            {c: 'on'}
          ]);
        }
      } else {
        this._terminal.sequence$$(openSequence);
      }
    });
  }

  execHelp() {
    this._terminal.sequence$$(
      "Use this command to open and close doors of the space station",
      "Available commands are:",
      '',
      "s{door open [id]}s",
      "Open the door. For example s{door open D-1234}s",
      '',
      "s{door close [id]}s",
      "Close the door. For example s{door close D-1234}s",
      {c: 'sound', d: 'ok', t:0}
    );

  }
}
