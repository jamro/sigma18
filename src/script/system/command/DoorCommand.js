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
      this._terminal.println$$(`Get IDs of doors in current location by s{com status}s.`);
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
    let id = this.getDoorId(command);
    if(!id) {
      this._terminal.println$$(`Error: DoorID argument is required. Run s{door help}s for more info.`);
      this._terminal.println$$(`Get IDs of doors in current location by s{com status}s.`);
      this._terminal.getSoundPlayer$$().play$$('err');
      return;
    }
    this.disableInput$$();
    this._terminal.connect$$('doors', [`Door look up: ${id}...`], () => {
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
        {c:'ln', d:`Done. Door ${door.getId$$()} ${doClose ? 'closed' : 'opened'}.`, t:500},
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
        this._terminal.sequence$$([
          {c:'sound', d: 'ok', t:300},
          `Your account (s{${lock.user}}s) has been locked.`,
          "There were 3 unsuccessful attempts of login.",
          "Answer security question to unlock:",
          `s{${lock.question}}s`,
          {c: (done) => {
            this._terminal.prompt$$("Answer:", (txt) => {
              this._terminal.println$$('Answer: ' + txt);
              if(lock.check$$(txt)) {
                door.unlock$$();
                this._terminal.sequence$$([
                  {c:'sound', d: 'ok'},
                  "The answer is correct. Account unlocked.",
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
            {c:'chat', d:`Commander, I need your assistance. Use ${requiredKey} key card to open the door ${door.getId$$()}`, f:'hacker', t: 800},
            {c:'chat', d:`The key card is in the reader. Done!`, f:'commander', t: 800},
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
            {c:'chat', d:`Commander, We need a ${requiredKey} key card to open the door ${door.getId$$()}`, f:'hacker', t: 800},
            {c:'chat', d:`We do not have required key card!`, f:'commander'},
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
      "It requires ID of door.",
      "Run s{com status}s to get IDs of all doors in the room",
      "",
      "Available commands are:",
      '',
      "s{door open [id]}s",
      "Open the door. For example s{door open D12}s",
      '',
      "s{door close [id]}s",
      "Close the door. For example s{door close D12}s",
      {c: 'sound', d: 'ok', t:0}
    );

  }
}
