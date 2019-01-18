import Command from '../Command.js';

export default class GunCommand extends Command {

  constructor(map) {
    super();
    this._map$$ = map;

    this.name$$ = 'gun';
    this.help$$ = 'Manual control of sentry guns BER-84';
    super();
  }


  execControl() {
    let pos = this._map$$.getSquadPosition$$();
    let battle = this._map$$.getBattle$$();
    let gun = null;
    if(battle) {
      gun = battle.getRoom$$().gun$$;
    }

    this.disableInput$$();
    this._terminal$$.connect$$('security', [`BER-84 look up at ${pos.toString()}...`], () => {
      if(!gun) {
        this._terminal$$.println$$('Error: Cannot connect to BER-84 in the room');
        this._terminal$$.soundPlayer$$.play$$('err');
        this.enableInput$$();
        return;
      }
      this._terminal$$.sequence$$(
        "Endpoint found.",
        "Establishing the connection...",
        'Connected',
        '',
        'Authorization',
        {c:'pass', d: 100, l:'Security token'},
        '',
        'Enabling manual mode',
        'Manual controller online',
        '',
        'Controls: ',
        ' - s{ARROW_KEYS}s: aiming',
        ' - s{SPACE}s: shooting',
        ' - s{Q}s: quit',
        {c:() => {
          this._terminal$$.view$$.enable$$();
          this._terminal$$.view$$.setPromptText$$('[...]');
          this._terminal$$.soundPlayer$$.play$$('ok');
          gun.online$$ = true;

          let cleanUp = () => {
            gun.online$$ = false;
            this.setMove$$(battle, gun, 0, 0);
            gun.isShooting$$ = false;
            this._terminal$$.view$$.setPromptText$$();
            this._terminal$$.view$$.setKeyHandler$$();
          };

          battle.onFinish$$(() => {
            cleanUp();
          });

          this._terminal$$.view$$.setKeyHandler$$(
            (event) => {
              event.stopImmediatePropagation();
              event.preventDefault();
              switch(event.keyCode) {
                case 37: //left
                  this.setMove$$(battle, gun, -1, 0);
                  break;
                case 39: //right
                  this.setMove$$(battle, gun, 1, 0);
                  break;
                case 38: //up
                  this.setMove$$(battle, gun, 0, -1);
                  break;
                case 40: //down
                  this.setMove$$(battle, gun, 0, 1);
                  break;
                case 32: //space
                  gun.isShooting$$ = true;
                  break;
                case 81: //Q
                  cleanUp();
                  this._terminal$$.sequence$$(
                    'Power down manual controller',
                    'Disconnecting from BER-84...',
                    'Connection closed',
                    {c:'sound', d:'ok'},
                    {c:'on'}
                  );
                  break;
              }
            },
            (event) => {
              event.stopImmediatePropagation();
              event.preventDefault();
              switch(event.keyCode) {
                case 37: //left
                case 39: //right
                case 38: //up
                case 40: //down
                  gun.setMove$$(0, 0);
                  break;
                case 32: //space
                  gun.isShooting$$ = false;
                  break;
              }
            }
          );
        }}
      );
    });
  }

  setMove$$(battle, gun, x, y) {
    if(battle.rotate$$) {
      let a = x;
      x = y;
      y = a;
    }
    y = battle.flipY$$ ? -y : y;
    x = battle.flipX$$ ? -x : x;

    gun.setMove$$(x, y);
  }

  execHelp() {
    this._terminal$$.sequence$$(
      "Allow manual control of sentry gun BER-84 installed in security rooms",
      "Available commands are:",
      '',
      "s{gun control}s",
      "manually controls gun in the current room",
      {c: 'sound', d: 'ok', t:0}
    );
  }
}
