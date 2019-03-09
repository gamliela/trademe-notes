import {getWrapperTargets} from "./trademe_dom";
import style from "./style.scss";

function buildElementWrapper(): Element {
  const elementWrapper = document.createElement('div');
  elementWrapper.className = style.ElementWrapper;
  return elementWrapper;
}

function wrapElement(targetElement: Element): void {
  targetElement.insertAdjacentElement('afterbegin', buildElementWrapper());
}

function unwrapElement(element: Element): void {
  element.firstElementChild.remove();
}

function detectWrapStateForElement(element: Element): boolean {
  return element.firstElementChild && (element.firstElementChild.className == style.ElementWrapper);
}

function toggleWrapStateForElement(element: Element, state: boolean) {
  const currentState = detectWrapStateForElement(element);
  if (state && !currentState)
    wrapElement(element);
  if (!state && currentState)
    unwrapElement(element);
}

function toggleWrapState(state: boolean) {
  getWrapperTargets().forEach(element => toggleWrapStateForElement(element, state));
}

function keyboardEventHandler(event: KeyboardEvent) {
  if (!event.repeat && event.metaKey && !event.shiftKey && !event.altKey && !event.ctrlKey) {
    if (event.key == 'F1')
      toggleWrapState(true);
    if (event.key == 'F2')
      toggleWrapState(false);
  }
}

function installWrappingKeyboardTrigger() {
  window.addEventListener("keydown", keyboardEventHandler);
}

export {installWrappingKeyboardTrigger}
