import TerminalView from './terminal/TerminalView.js';
import Terminal from './terminal/Terminal.js';
import ScreenView from './screen/ScreenView.js';
import Screen from './screen/Screen.js';
import SoundPlayer from './common/SoundPlayer.js';


export default class System {

  constructor(document, map) {
    this._map$$ = map;
    this._soundPlayer$$ = new SoundPlayer();
    this._sideScreen$$ = new Screen(new ScreenView(document));
    this._terminal$$ = new Terminal(new TerminalView(document));
    this._terminal$$.setSystem(this);
    this._sideScreen$$.setSystem(this);
    this._commandProcessorList$$ = [];
  }

  processCommand$$(command) {
    for(let processor of this._commandProcessorList$$) {
      if(processor.validate$$(command)) {
        processor.exec$$(command);
        return true;
      }
    }
    return false;
  }

  getSoundPlayer$$() {
    return this._soundPlayer$$;
  }

  getTerminal$$() {
    return this._terminal$$;
  }

  getMap$$() {
    return this._map$$;
  }

  getSideScreen$$() {
    return this._sideScreen$$;
  }

  installCommand$$(commandProcessor) {
    commandProcessor.setSystem$$(this);
    this._commandProcessorList$$.push(commandProcessor);
    this._commandProcessorList$$.sort((a, b) => {
      if(a.name$$ == 'help') return -1;
      if(b.name$$ == 'help') return 1;
      if(a.name$$ > b.name$$) return 1;
      if(a.name$$ < b.name$$) return -1;
      return 0;
    });
  }

  hasCommand$$(name) {
    return this._commandProcessorList$$.filter((c) => c.name$$ == name).length > 0;
  }

  getCommandList$$() {
    return this._commandProcessorList$$;
  }
}
