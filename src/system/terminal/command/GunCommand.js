import Command from '../Command.js';

export default class GunCommand extends Command {

  constructor() {
    super();

    this.name$$ = 'gun';
    this.help$$ = 'Manual control of sentry guns BER-84';
  }

  execShoot() {
    this.handleAction((pos, battle, gun, done) => {
      let droids = battle.getDroids$$();
      if(droids.length <= 0) {
        this._terminal$$.println$$('Error: Cannot find a target');
        this._terminal$$.soundPlayer$$.play$$('err');
        this.enableInput$$();
        return;
      }
      let target = droids[Math.floor(Math.random() * droids.length)];
      this._terminal$$.sequence$$(
        {c:'ln',d:'Searching for target...', s:'security'},
        `Enemy found at [${target.x.toFixed(2)}; ${target.y.toFixed(2)}]`,
        {c:'sound', d:'beep'},
        {c:'ln',d:'Aiming...', s:'security'},
        {c:() => {
          gun.online$$ = true;
          let loop = setInterval(() => {
            let dx = (target.x - gun.target$$.x);
            let dy = (target.y - gun.target$$.y);
            let r = Math.sqrt(dx*dx + dy*dy);
            gun.setMove$$(10 * dx, 10 * dy);
            if(r < 0.01) {
              this._terminal$$.soundPlayer$$.stop$$('beep');
              this._terminal$$.println$$(`Target aimed at [${target.x.toFixed(2)}; ${target.y.toFixed(2)}]`);
              this._terminal$$.println$$(`Open fire!`, 'security');
              clearInterval(loop);
              gun.isShooting$$ = true;
              gun.setMove$$(0, 0);

              setTimeout(() => {
                this._terminal$$.println$$(`r{Target eliminated}r`);
                this._terminal$$.println$$('');
                gun.isShooting$$ = false;
                gun.online$$ = false;
                setTimeout(() => done(), 500);
              }, 1500);
            }
          }, 30);
        }}
      );
    });
  }

  execControl() {
    this.handleAction((pos, battle, gun, done) => {
      this._terminal$$.sequence$$(
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
                  return done();
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

  handleAction(action) {
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
        {c:'ln',d:'Manual controller online', s:'security'},
        '',
        {c: (done) => {
          action(pos, battle, gun, done);
        }},
        'Power down manual controller',
        {c:'ln',d:'Manual controller offline', s:'security'},
        'Disconnecting from BER-84...',
        'Connection closed',
        {c:'sound', d:'ok'},
        {c:'on'}
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
      "s{IMPORTANT: Marines squad must be close to BER-84 unit to establish the connection.}s",
      "Available commands are:",
      '',
      "s{gun shoot}s",
      "Attack an enemy in range",
      '',
      "s{gun control}s",
      "manually controls gun",
      {c: 'sound', d: 'ok', t:0}
    );
  }
}
