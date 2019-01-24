class Validator {
  constructor(condition, hint) {
    this.passed$$ = false;
    this.hint$$ = hint;
    this._condition$$ = condition;
  }

  validate$$(e) {
    if(e == this._condition$$) {
      this.passed$$ = true;
    }
  }
}

export default class Walkthrough {

  constructor() {
    this._level$$ = 0;
    this._validators$$ = [
      new Validator('item-disk-door', "Explore available rooms of the station. Search for software tools that could open the doors. Run s{com help}s and read the description of s{com go}s command to learn how to navigate."),
      new Validator('door-open-standard', "Explore locations behind closed doors. To open door on the north run s{door open n}s"),
      new Validator('item-disk-crew', "Go to office area m{([B:4])}m and search for crew records. It contains important information required in the exploration of the space station."),
      new Validator('door-open-commander', "Go to Commander's Quarter m{([A:6])}m. Opening the door requires answering a security question. Find the answer by running s{crew show swoodley}s."),
      new Validator('item-disk-virus', "Search Commander's Quarter m{([A:6])}m."),
      new Validator('battle-start', "Search unvisited rooms of the space station. You can skip parts of the station where there is no light because you cannot see anything there anyway"),
      new Validator('item-static', "Find communication module of SIG-18 to infect it by the virus and disrupt communication between SIG-18s. It will block them in calling backups during a fight."),
      new Validator('com-virus-activate', "If you are in the middle of a fight you can always close doors and stop it by s{door close X}s. We need you to block SIG-18 communication. Check host address of SIG-18 communication module that you have found by running s{com status}s. Next, run s{virus infect 20.110.231.18}s. Wait until the virus spreads and activate it by s{virus activate}s. Now we will be able to defeat SIG-18 squads"),
      new Validator('item-key-red', "Find a red key card in the room of the crew, occupied currently by SIG-18 squad m{([B:7])}m. We will defeat SIG-18 now since the virus blocked communication between them."),
      new Validator('door-open-red', "Use red key card to access the service area at the end of the northern corridor behind the Lobby m{([D:1])}m"),
      new Validator('door-open-core-comp', "Go to computing core m{([E:1])}m. To unlock the account and open the door you need to answer a security question. The answer can be found in the project log. Run s{proj help}s for more info."),
      new Validator('item-disk-power', "Search computing core room m{([E:1])}m"),
      new Validator('com-lights-east-on', "Turn lights in eastern part of the station by running s{power up lights-east}s. Powering down of some services may be required to have enough power. Check the list of services by running s{power list}s and turn selected services off by s{power down X}s. Do not be afraid of powering down the oxygen generator. We've got masks!"),
      new Validator('item-key-yellow', "Find a yellow key card in the kitchen located in the eastern part of the station m{([F:7])}m"),
      new Validator('door-open-yellow', "Use yellow key card to access lab area on the east m{([H:4])}m"),
      new Validator('door-open-lab-server', "Go to server room of the lab m{([H:5])}m. To unlock the account and open the door you need to answer a security question. The answer can be found in the crew directory. Find names of all engineers by running s{crew list}s and try them all as the answer. First name of one of them will unlock the account."),
      new Validator('item-disk-gun', "Search the server room of the lab m{([H:5])}m for software required to control BER-84 sentry gun."),
      new Validator('item-disk-sniff', 'Search the meeting room of the lab m{([I:4])}m for a software.'),
      new Validator('com-security-on', 'You must start security service to get access to BER-84 sentry gun in security checkpoint m{[G:4]}m. It requires multi-factor authentication so you have to sniff text message with the code. Run sniffer in the background by s{sniff on message-hub}s. Next, power up the service by s{power up security}s. When asked for the auth code, rewrite it from sniffer window.'),
      new Validator('battle-won-6-3', "Go to security checkpoint m{[G:4]}m and attack SIG-18s that are awaiting there. During the battle run s{gun control}s to use BER-84 sentry gun and defeat SIG-18's forces"),
      new Validator('item-key-blue', "Find a blue key card in the server room of the lab m{([H:3])}m"),
      new Validator('door-open-blue', "Use blue key card to access the main warehouse on the south m{([E:8])}m."),
      new Validator('item-disk-dock', "Find application to manage docks in the warehouse m{([E:8])}m."),
      new Validator('item-note', "Find rescue capsule auth code in the warehouse of the lab area on the east m{([H:3])}m."),
      new Validator('com-pump-station-on', "Turn pump station to fuel rescue capsule by running s{power up pump-station}s. Powering down of some services may be required to have enough power. Check the list of services by running s{power list}s and turn selected services off by s{power down X}s."),
      new Validator('', "Enter rescue capsule m{([D:10])}m. Close its door by running s{door close X}s. Next, fuel the capsule by s{dock fuel DS002}s command and launch it running s{dock launch DS002}s. If you do not remember auth code that you have already found, run s{com status}s")
    ];
  }

  handleEvent$$(event) {
    this._validators$$.forEach((v) => v.validate$$(event));
    this.updateLevel();
  }

  updateLevel() {
    this._level$$ = 0;
    for(let i=0; i < this._validators$$.length; i++) {
      if(!this._validators$$[i].passed$$) {
        break;
      }
      this._level$$++;
    }
  }

  getHint$$() {
    if(!this._validators$$[this._level$$]) return "You can figure it out by yourself";
    return this._validators$$[this._level$$].hint$$;
  }

}
