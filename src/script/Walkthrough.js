class Validator {
  constructor(condition, hint) {
    this._passed$$ = false;
    this._hint$$ = hint;
    this._condition$$ = condition;
  }

  validate$$(e) {
    if(e == this._condition$$) {
      this._passed$$ = true;
    }
  }

  getHint$$() {
    return this._hint$$;
  }

  isPassed$$() {
    return this._passed$$;
  }
}


export default class Walkthrough {

  constructor() {
    this._level$$ = 0;
    this._validators$$ = [
      new Validator('item-disk-door', "Explore available rooms of the station. Search for software tools that could open the doors. Run s{com help}s and read description of s{com go}s command to learn how to navigate."),
      new Validator('item-disk-crew', "Go to office area m{([B:4])}m and search for crew records. It contains important information required in exploration of the space station. You can open the doors using s{door open id}s command. To get ID of the door run s{com status}s."),
      new Validator('door-open-commander', "Go to Commander's Quarter m{([A:6])}m. Opening the door requires answering sequirity question. Find the answer by running s{crew show swoodley}s."),
      new Validator('item-disk-virus', "Search Commander's Quarter m{([A:6])}m."),
      new Validator('battle-start', "Search unvisited rooms of the space station. You can skip parts of the station where there is no light because you cannot see anything there anyway"),
      new Validator('item-static', "Find communiction module of SIG-18 to infect it by the virus and disrupt communication between SIG-18s. It will block them in calling backups during a fight."),
      new Validator('com-virus-activate', "If you are in the middle of a fight you can always close doors and stop it by s{door close DXX}s. Then, check address of SIG-18 communication module that you have found by running s{com status}s. Next, run s{virus infect 20.110.231.18}s. Wait until the virus spread and activate it by s{virus activate}s. Now we will be able to defeat SIG-18 squads"),
      new Validator('item-key-red', "Find a red key card in room of the crew, occupied currently by SIG-18 squad m{([B:7])}m. We will defeat SIG-18 now since the virus blocked communication between them."),
      new Validator('door-open-red', "Use red key card to access the servie area at the end of northern corridor behind the Lobby m{([D:1])}m"),
      new Validator('door-open-core-comp', "Go to computing core m{([E:1])}m. To unlock account and open the door you need to answer security question. The answer can be found in crew directory. Run s{crew help}s for more info."),
      new Validator('item-disk-power', "Search computing core room m{([E:1])}m"),
      new Validator('com-lights-east-on', "Turn lights in eastern part of the station by running s{power up S3}s. Powering down of some services may be required to have enough power. Check list of services by running s{power list}s and turn selected services off by s{power down SX}s."),
      new Validator('item-key-yellow', "Find a yellow key card in the kitchen located in eastern part of the station m{([F:7])}m"),
      new Validator('door-open-yellow', "Use yellow key card to access lab area on the east m{([H:4])}m"),
      new Validator('door-open-lab-server', "Go to server room of the lab m{([H:5])}m. To unlock account and open the door you need to answer security question. The answer can be found in crew directory. Find names of all engineers by running s{crew list}s and try them as the answer. First name of them will unlock the account."),
      new Validator('item-key-blue', "Find a blue key card in the server room of the lab m{([H:5])}m"),
      new Validator('door-open-blue', "Use blue key card to access the main warehouse omn the south m{([E:8])}m."),
      new Validator('item-disk-dock', "Find application to manage docks in the warehouse m{([A:6])}m."),
      new Validator('item-note', "Find rescue capsule auth code in warehouse of the lab area on the east m{([H:3])}m."),
      new Validator('com-pump-station-on', "Turn pump station to fuel rescue capsule by running s{power up S7}s. Powering down of some services may be required to have enough power. Check list of services by running s{power list}s and turn selected services off by s{power down SX}s."),
      new Validator('', "Enter rescue capsule m{([D:10])}m. Close its door by running s{door close DXX}s. Next, fuel the capsule by s{dock fuel DS002}s comand and launch it running s{dock launch DS002}s")
    ];
    this._validators$$.push();
    this._validators$$.push(new Validator('item-disk-crew'));

  }

  handleEvent$$(event) {
    this._level$$ = 0;
    this._validators$$.forEach((v) => v.validate$$(event));
    for(let i=0; i < this._validators$$.length; i++) {
      if(!this._validators$$[i].isPassed$$()) {
        break;
      }
      this._level$$++;
    }
  }

  getHint$$() {
    if(!this._validators$$[this._level$$]) return "You can figure it out by yourself";
    return this._validators$$[this._level$$].getHint$$();
  }

}
