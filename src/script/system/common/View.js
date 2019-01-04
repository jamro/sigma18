export default class View {

  constructor(document) {
    this._document = document;
    this._mute = false;
  }

  createElement(name, options) {
    let result = {
      element: this._document.createElement(name)
    };
    if(options.cssClass) {
      result.element.classList.add(options.cssClass);
    }
    if(options.parent) {
      this.appendElement(result, options.parent);
    }
    return result;
  }

  appendElement(child, parent) {
    parent.element.appendChild(child.element);
  }

  getDOM() {
    return this._view.element;
  }

  attachToDOM(parent) {
    parent.appendChild(this.getDOM());
  }

  enableSound(state) {
    this._mute = !state;
  }
}
