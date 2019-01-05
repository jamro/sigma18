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
        this._terminal.sequence(
          "Door found",
          "",
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
        );
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
      "s|door open [id]|s",
      "Open the door. For example s|door open D-1234|s",
      '',
      "s|door close [id]|s",
      "Close the door. For example s|door close D-1234|s",
      {c: 'sound', d: 'ok', t:0}
    );

  }
}
