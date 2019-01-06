import Command from '../Command.js';

export default class CrewCommand extends Command {

  constructor() {
    super();
    //today 2080
    this._data = [
      ['swoodley',    'Sean Woodley',     'Commander',            '2036-01-08', 'Crux Academy',       'm', 'is ultimately responisble for', 'space station management',       "manager", "master's",                23, 10, "army",                      "NESA, ISA and MTR",                                           "operational management of ISS Sigma-18", "space station management"],
      ['wirving',     'Walter Irving',    'Research Director',    '2045-07-21', 'Enderson Institute', 'm', 'looks after', 'team of researchers',                              "engineer", "doctoral",               14,  3, "computer science",          "Enderson Institute, NESA and Elcroy",                         "improving artifical inteligence of SIG-18 battle droids", "artifical inteligence"],
      ['lparra',      'Lea Parra',        'Engineer',             '2051-03-15', 'Yathe University',   'f', 'develops', 'SIG-18\'s image recognition',                         "engineer", "master's",                6,  3, "software development",      "DataTech and Elcroy",                                         "implementation of artifical inteligence modules for SIG-18 battle droids", "neural networks"],
      ['dschaefer',   'Duncan Schaefer',  'Engineer',             '2053-09-30', 'Enderson Institute', 'm', 'develops', 'SIG-18\'s decision alghoritms',                       "engineer", "master's",                4,  2, "software development",      "Elcroy, CorpData an Eclipse Inc",                             "implementation of artifical inteligence modules for SIG-18 battle droids", "machine learning"],
      ['cmcmanus',    'Cristiano Mcmanus','Engineer',             '2050-11-03', 'Sawyr Institute',    'm', 'develops', 'SIG-18\'s battle behaviour',                          "engineer", "master's",                7,  1, "software development",      "SpaceZ, Elcroy and INO Tech",                                 "implementation of artifical inteligence modules for SIG-18 battle droids", "big data"],
      ['ffountain',   'Frank Fountain',   'Security Officer',     '2049-02-22', 'Crux Academy',       'm', 'is responsible for', 'secuirity',                                 "security specialist", "bachelor's",  10,  3, "army",                      "MTR and Seq Inc",                                             "securing researches on artifical inteligence of SIG-18 battle droids", "monitoring systems"],
      ['ngallegos',   'Nick Gallegos',    'System Administrator', '2045-01-01', 'Yathe University',   'm', 'looks after', 'Sigma-18, core systems and services',              "engineer", "master's",               10,  4, "computer science",          "Elcroy, CorpData and DellaX",                                 "administration of internal systems of ISS Sigma-18", "Clustered Core Systems"],
      ['fortiz',      'Felix Ortiz',      'Mechanic',             '2052-12-15', 'Sawyr Institute',    'm', 'looks after', 'hardware maintenance in ISS Sigma-18',             "engineer", "bachelor's",              8,  4, "space equipment servicing", "SpaceZ, Elcroy and Tesllo",                                   "fixing and installation of space equipment at ISS Sigma-18", "space equipment level IX"],
      ['grodriquez',  'Giorgio Rodriquez','Office Worker',        '2038-06-06', 'Blane School',       'm', 'supports the team, providing', 'documentation and legal support', "office administrator", "bachelor's", 15,  8, "comiplance and HR",         "BIM Inc, Headspace and LSX Institute",                        "HR and compilance processes", "human resources management"],
      ['mhahn',       'Mikey Hahn',       'Medical Doctor',       '2040-10-29', 'Balo University',    'm', 'looks after', 'health care in ISS Sigma-18',                      "doctor", "medical master's",         14,  5, "medicine",                  "Zralo Medical Center, Fafield Hospital and Osacaster Clinic", "regular health checks and tratments of the crew", "space adaptation syndrome"],
      ['rballard',    'Ritchie Ballard',  'Chief',                '2044-04-23', 'Blane School',       'm', 'supports the team by taking care of', 'food supply',              "cook", "bachelor's",                  8,  2, "gastronomy",                "ISA, Elcroy and Druburg Institute",                           "preparing meals and maintenance of food supplies ", "space logistic"],
    ];
  }

  getName() {
    return 'crew';
  }

  getHelp() {
    return "Show information about crew members of Sigma-18";
  }

  execList() {
    let pad = (t, n) => {
      while(t.length < n) t += " ";
      return t;
    };
    this.disableInput();
    this.connect('CrewDB', '10.43.23.121', ['Query crew data...', this._data.length + " records received"], () => {
      let msg = "<pre>User Name   |Full Name          |Role\n" +
                     "------------|-------------------|------------------------\n" ;
      this._data.forEach((r) => {
        msg += pad(r[0],12) + "|" + pad(r[1],19) + "|" + r[2] + "\n";
      });

      this._terminal.println(msg);
      this.enableInput();
      this._terminal.getSoundPlayer().play('ok');
    });
  }

  execShow(command) {
    let name = command.length >= 3 ? command[2] : '';
    let record = this._data.filter((r) => r[0] == name);
    record = record.length ? record[0] : null;

    this.disableInput();
    this.connect('CrewDB', '10.43.23.121', [
      'Search Criteria: username=' + name,
      '1 record found',
      {c:'ln', d:"", t: 500}
    ], () => {
      if(!record) {
        this._terminal.println(`Error: no crew record matching the criteria`);
        this._terminal.getSoundPlayer().play('err');
        this.enableInput();
        return;
      }

      let heshe = record[5] == 'm' ? 'he' : 'she';

      let bio = `${record[1]} is a ${record[2]} with ISS Sigma-18. In this role, ${heshe} ${record[6]} all aspects of ${record[7]}.  ${record[1]} is a qualified ${record[8]} and holds the ${record[9]} degree from ${record[4]}. Has more than ${record[10]} years of experience in ${record[12]}. Before joining ISS Sigma-18 in ${(2080-record[11])}, ${heshe} worked for ${(record[10]-record[11])} years for a diverse range of organizations, including ${record[13]}. In current role, ${heshe} is responsible for ${record[14]}. ${record[1]} specializes in ${record[15]}.`;

      this._terminal.sequence(
        's{Full Name}s:  ' + record[1],
        's{Login}s:      ' + record[0],
        's{Role}s:       ' + record[2],
        's{Birth Date}s: ' + record[3],
        '',
        's{Bio}s:',
        bio,
        {c: 'sound', d: 'ok'},
        {c: 'on'}
      );
      this._terminal.getSoundPlayer().play('ok');
      this.enableInput();

    });
  }

  execHelp() {
    this._terminal.sequence(
      "Available commands are:",
      '',
      "s{crew list}s",
      "List members of Sigma-18 crew.",
      '',
      "s{crew show [username]}s",
      "Show details about crew member with user name [username]",
      "For example: s{crew show jdoe}s",
      {c: 'sound', d: 'ok', t:0}
    );
  }
}
