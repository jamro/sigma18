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
      this.println(`Error: door ID is missing!`);
      this.playDoneSound(false);
    } else if(!door) {
      this.println(`Error: Door (ID: ${id}) not found!`);
      this.playDoneSound(false);
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
          this.println(`Door found`);
          this.println(`Error: Door already ${doClose ? 'closed' : 'opened'}!`);
          this.playDoneSound(false);
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
        this.playDoneSound(false);
        this.enableInput();
      }
    });
  }

  execHelp() {
    this.println("Use this command to open and close doors of the space station");
    this.println("Available commands are:");
    this.println('');
    this.println("s|door open [id]|s");
    this.println("Open the door. For example s|door open D-1234|s");
    this.println('');
    this.println("s|door close [id]|s");
    this.println("Close the door. For example s|door close D-1234|s");
    this.playDoneSound(true);
  }
}
