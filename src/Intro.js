export default class Intro {

  constructor(system) {
    this._system$$ = system;
  }

  play$$(hasCorrectBrowser) {
    let chromeInfo = hasCorrectBrowser ? '' : 'r{WARNING! Use Chrome web browser for the best gaming experience!}r';
    this._system$$.getTerminal$$().view$$.disable$$();
    this._system$$.getTerminal$$().sequence$$(
      "",
      "-----------------------------",
      "SIGMA-18 GAME" + (DEBUG_MODE ? " (DEBUG MODE)" : ""),
      "-----------------------------",
      `Version of the terminal: ${VERSION}`,
      "Have fun :)",
      "",
      chromeInfo,
      "",
      "s{PRESS ENTER TO BEGIN YOUR ADVENTURE :)}s",
      "",
      {c:'pause'},
      {c:'sound', d:'ok'},
      {c:'chat', d:[
        ['comander', 'This is commander of Sierra-23, Alex Decker speaking!!!'],
        ['comander', 'Sir! Two of our engines are damaged! Emergency landing at Sigma-18! Approaching DS003...'],
        ['comander', 'We cannot keep the approach path! We are too far on the left!'],
        ['comander', "Mayday, mayday, mayday..."],
        ['comander', "m{...}m"]
      ], t: 100},
      {c:'chat', d:[
        ['hacker', "Sierra-23, What is the status?"],
        ['commander', "Spaceship wrecked during landing. We cannot use it to get out from here anymore. We are at Sigma-18 Space Station. There seems to be not a soul in the whole location."],
        ['commander', "Sir! We need your help! Connect to Sigma-18 Space Station gateway and help us to get away from here!"]
      ], t: 500},
      {c:'pause'},
      {c: 'ln', d:'<div class="terminal-command">s{&gt;}s ssh hacker@sigma18.iss.gov</div>'},
      {c: 'ln', d:"Connecting to sigma18.iss.gov port 22...", t: 500},
      {c: 'ln', d:"Connection established", t: 500},
      "",
      "Enabling compatibility mode for protocol 2.0",
      "Remote protocol version 2.0, remote software version OpenSSH 7",
      "Authenticating to sigma18.iss.gov:22...",
      "Server accepts key",
      "Authentication succeeded (publickey)",
      "",
      "Floor plan streaming.",
      "Buffering...",
      {c: 'sound', d: 'ok', t:0},
      {c: (done) => {
        this._system$$.getSideScreen$$().showMap$$(this._system$$.getMap$$(), done);
      }},
      "Map preview available.",
      "r{WARNING: the connection may be unstable due to low bandwidth}r",
      "",
      "Welcome to Space Station Sigma-18",
      "Type s{help}s and press ENTER to see available commands.",
      {c: 'sound', d: 'ok', t:0},
      {c: 'on', t:0}
    );
  }

}
