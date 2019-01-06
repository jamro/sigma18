import Command from '../Command.js';

export default class DoorCommand extends Command {

  constructor(map) {
    super();
    this._map = map;
  }

  getName() {
    return 'door';
  }

  getHelp() {
    return "Open/close doors";
  }

  getDoorId(command) {
    return command.length >= 3 ? command[2].toUpperCase() : "";
  }

  findDoor(command) {
    let id = this.getDoorId(command);
    let door = this._map.getDoorById(id);
    if(id == "") {
      this._terminal.println(`Error: door ID is missing!`);
      this._terminal.getSoundPlayer().play('err');
    } else if(!door) {
      this._terminal.println(`Error: Door (ID: ${id}) not found!`);
      this._terminal.getSoundPlayer().play('err');
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
    this.disableInput();
    this.connect('Door', '10.43.23.37', [`Door look up: ${this.getDoorId(command)}...`], () => {
      let door = this.findDoor(command);
      if(door) {
        if(door.isClosed() == doClose) {
          this._terminal.println(`Door found`);
          this._terminal.println(`Error: Door already ${doClose ? 'closed' : 'opened'}!`);
          this._terminal.getSoundPlayer().play('err');
          this.enableInput();
          return;
        }
        let lock = door.getLock();
        let openSequence = [
          "Authorization is required.",
          {c: 'pass', d: 60},
          doClose ? `Closing...` : `Opening...`,
          {c: () => {
            if(doClose) {
              door.close();
            } else {
              door.open();
            }
          }, t: 500},
          `Done. Door ${door.getId()} ${doClose ? 'closed' : 'opened'}.`,
          {c: 'sound', d: 'ok', t: 0},
          {c: 'on'}
        ];
        if(lock) {
          this._terminal.sequence([
            "Door found",
            "",
            {c:'sound', d: 'err'},
            `Your account (s{${lock.user}}s) has been locked.`,
            "There were 3 unsuccessful attempts of login.",
            "Answer security question to unlock:",
            `s{${lock.question}}s`,
            {c: (done) => {
              this._terminal.prompt("Answer:", (txt) => {
                this._terminal.println(txt);
                if(lock.check(txt)) {
                  door.unlock();
                  this._terminal.sequence([
                    {c:'sound', d: 'ok'},
                    "Answer correct. Account unlocked.",
                    "",
                  ].concat(openSequence));
                  done();
                } else {
                  this._terminal.sequence(
                    "Error: Incorrect Answer! The account remains locked",
                    {c:'sound', d: 'err'},
                    {c:'on'}
                  );
                  done();
                }
              });
            }}
          ]);
        } else {
          this._terminal.sequence([
            "Door found",
            ""
          ].concat(openSequence));
        }
      } else {
        this._terminal.getSoundPlayer().play('err');
        this.enableInput();
      }
    });
  }

  execHelp() {
    this._terminal.sequence(
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
