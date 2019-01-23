import Command from '../Command.js';

export default class ProjCommand extends Command {

  constructor() {
    super();
    this.name$$ = 'proj';
    this.help$$ = 'Display SIG-18 project details';
  }

  execLog() {
    let ln = "s{=======================}s";
    this.disableInput$$();
    this._terminal$$.connect$$('data-warehouse', [
      {c:'ln', d:'Query: /projects/sig18/log/*', s:'data-warehouse'},
      'Response received',
      {c:'pass', d:60, l:"Decrypting"},
      "Done. 6 records received",
      {c:'sound', d: 'ok', t:0},
      {c:'pause'},
      "",
      "s{2080-03-01 10:45:19.482}s",
      ln, // ----------
      "",
      "We are starting the testing phase of artificial intelligence module v19.38.2 for battle droids SIG-18. The first results exceed our expectations. Droids complete test tasks faster and more efficient than planned. Further test will be performed during the upcoming weeks.",
      {c:'sound', d: 'ok', t:0},
      {c:'pause'},
      "",
      "s{2080-03-15 15:01:34.826}s",
      ln, // ----------
      "",
      "SIG-18 droids are able to efficiently perform tasks that were for humans only till now. We have ordered a supply of additional SIG-18 droids. After upgrading of AI module to v19.38.2, SIG-18s are going to replace some of crew members.",
      {c:'sound', d: 'ok', t:0},
      {c:'pause'},
      "",
      "s{2080-05-02 12:01:33.910}s",
      ln, // ----------
      "",
      "Stage #2 of the project achieved 3 months earlier than planned. Today majority of the crew goes back home and SIG-18 will perform their tasks.  The team is reduced to 11 members - mostly engineering team that continues development of SIG-18 artificial intelligence. Now, there are more droids in the space station than humans.",
      {c:'sound', d: 'ok', t:0},
      {c:'pause'},
      "",
      "s{2080-07-20 09:27:57.025}s",
      ln, // ----------
      "",
      "We are during tests of SIG-18, team behaviour and cooperation modes. Today two of our power generators went down. We do not have enough power to continue research as planned. The scope of the project will be narrowed since we have to power down part of SIG-18 droids.",
      {c:'sound', d: 'ok', t:0},
      {c:'pause'},
      "",
      "s{2080-07-25 14:41:10.652}s",
      ln, // ----------
      "",
      "Disturbing behaviour was observed during tests of environment analysis algorithm. SIG-18 (host: 20.110.231.18) propose a solution to the inadequate power supply: Powering down oxygen generator instead of SIG-18s and elimination of humans. Further investigation of the issue is required.",
      {c:'sound', d: 'ok', t:0},
      {c:'pause'},
      "",
      "s{2080-07-26 22:09:19.208}s",
      ln, // ----------
      "",
      "SIG-18s had broken into the armoury and took control over the space station. They were trying to access oxygen generator, but unsuccessfully. Droids have numerical superiority. We need to evacuate from the station.",
      {c:'sound', d: 'ok', t:0},
      "",
      "s{--- END OF DATA ---}s",
      {c:'on'}
    ], () => {});
  }

  execInfo() {
    this.disableInput$$();
    this._terminal$$.connect$$('data-warehouse', [
      {c:'ln', d:'Query: /projects/sig18/info', s:'data-warehouse'},
      'Response received',
      {c:'pass', d:20, l:"Decrypting"},
      "Done. 1 record received",
      "",
      "",
      "s{Overview}s",
      "========",
      "s{Project Name}s: SIG-18Z+",
      "s{Status}s: on hold",
      "s{Current Phase}s: #3",
      "",
      "s{Project Goal}s",
      "============",
      "Improve artificial intelligence of SIG-18 battle droids to achieve reasoning level of Z class units.",
      {c:'sound', d: 'ok', t:0},
      {c:'on'}
    ], () => {

    });
  }

  execHelp() {
    this._terminal$$.sequence$$(
      "Display SIG-18Z+ project details",
      "Available commands are:",
      '',
      "s{proj info}s",
      "Show SIG-18Z+ project overview",
      '',
      "s{proj log}s",
      "Show SIG-18Z+ history of project turning points",
      {c: 'sound', d: 'ok', t:0}
    );
  }


}
