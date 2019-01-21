import Command from '../Command.js';

export default class ComCommand extends Command {

  constructor(map) {
    super();
    this._squad = map.getSquad$$();
    this._map = map;
    this._directionMap = {
      n: 'north',
      s: 'south',
      e: 'east',
      w: 'west',
    };

    this.name$$ = 'com';
    this.help$$ = 'Communication with squad of marines in the field';
  }

  execStatus() {
    this.disableInput$$();
    this._squad.requestStatus$$(() => {
      this.enableInput$$();
    });
  }

  execGo(command) {
    let direction = command.length >= 3 ? command[2] : '';
    if(!direction) {
      this._terminal$$.soundPlayer$$.play$$('err');
      this._terminal$$.println$$(`Error: Direction argument is required. Run s{com help}s for more info.`);
      return;
    }
    direction = direction.toLowerCase();
    if(!this._directionMap[direction]) {
      this._terminal$$.soundPlayer$$.play$$('err');
      this._terminal$$.println$$(`Error: unknown direction ${direction}`);
      return;
    }
    this.disableInput$$();
    this._squad.requestMove$$(direction, (items) => {
      items = items || [];
      let disks = items.filter((i) => i.type$$ == 'disk');
      if(disks.length > 0) {
        this._terminal$$.uploadSoftware$$(disks, () => {
          this.enableInput$$();
        });
      } else {
        this.enableInput$$();
      }
    });
  }

  execHint() {
    let hint = this._map.getWalthrough$$().getHint$$();
    this._terminal$$.sequence$$(
      {c:'off'},
      {c:'chat', d:[
        ['hacker','Commander, any ideas what to do next?'],
        ['commander','Really? I thought that you are the hacker here! ' + hint]
      ]},
      {c:'on'}
    );
  }

  execHelp() {
    this._terminal$$.sequence$$(
      "Use this command to communicate with squad of marines in the field",
      "Available commands are:",
      '',
      "s{com hint}s",
      "r{NOTICE! Real hacker does not need that! FOR NOOBS ONLY!}r",
      "Ask marines for a hint. Use it whenever you got stuck and you do not know what to do.",
      '',
      "s{com status}s",
      "Ask marines to send status report from the field.",
      '',
      "s{com go [direction]}s",
      "Ask marines to explore next location in defined direction.",
      "Possible directions are:",
      "* s{n}s - North (shortcut s{SHIFT + UP_ARROW}s)",
      "* s{e}s - East (shortcut s{SHIFT + RIGHT_ARROW}s)",
      "* s{s}s - South (shortcut s{SHIFT + DOWN_ARROW}s)",
      "* s{w}s - West (shortcut s{SHIFT + LEFT_ARROW}s)",
      "For example: s{com go w}s",
      "",
      "s{Hint}s: Use key shortcuts (SHIFT + ARROW_KEY) to navigate quicker.",
      {c: 'sound', d: 'ok', t:0}
    );
  }
}
