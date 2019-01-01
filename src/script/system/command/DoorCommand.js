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
    } else if(!door) {
      this.println(`Error: Door (ID: ${id}) not found!`);
    }
    return door;
  }

  connect(id, done) {
    this.typeText([
      `Connecting to the gateway 10.43.23.4...`,
      `Connection established`,
      `Service Discovery in progress...`,
      `Door Service found: 10.43.23.34`,
      ``,
      `Door look up: ${id}...`
    ], done);
  }


  execOpen(command) {
    this.doorSwitch(command, false);
  }

  execClose(command) {
    this.doorSwitch(command, true);
  }


  doorSwitch(command, doClose) {
    this.disableInput();
    this.connect(this.getDoorId(command), () => {
      let door = this.findDoor(command);
      if(door) {
        if(door.isClosed() == doClose) {
          this.println(`Door found`);
          this.println(`Error: Door already ${doClose ? 'closed' : 'opened'}!`);
          this.enableInput();
          return;
        }
        this.typeText([
          "Door found",
          "",
          "Authorization is required."
        ], () => {
          this.passCrack(60, () => {
            this.println(doClose ? `Closing...` : `Opening...`);
            setTimeout(() => {
              if(doClose) {
                door.close();
              } else {
                door.open();
              }
              this.println(`Done. Door ${door.getId()} ${doClose ? 'closed' : 'opened'}.`);
              this.enableInput();
            }, 500);
          });
        });
      }
    });
  }

  execHelp() {
    this.println("Use this command to open and close doors of the space station");
    this.println("Available commands are:");
    this.println('');
    this.println("<strong>door open [id]</strong>");
    this.println("Open the door. For example <strong>door open D-1234</strong>");
    this.println('');
    this.println("<strong>door close [id]</strong>");
    this.println("Close the door. For example <strong>door close D-1234</strong>");
  }
}
