import {getWrapperTargets, Target} from "./trademe_dom";
import style from "./style.scss";

function buildStateButton(): Element {
  const button = document.createElement('a');
  button.className = 'button is-small';
  const iconContainer = document.createElement('span');
  iconContainer.className = 'icon is-small';
  const icon = document.createElement('i');
  icon.className = 'fas fa-thumbs-up';
  button.insertAdjacentElement('afterbegin', iconContainer);
  iconContainer.insertAdjacentElement('afterbegin', icon);
  return button;
}

function buildElementWrapper(): Element {
  const elementWrapper = document.createElement('div');
  elementWrapper.className = style.ElementWrapper;
  const stateButton = buildStateButton();
  elementWrapper.insertAdjacentElement('afterbegin', stateButton);
  return elementWrapper;
}

function wrapTarget(target: Target): void {
  target.rootElement.insertAdjacentElement('afterbegin', buildElementWrapper());
}

function unwrapTarget(target: Target): void {
  target.rootElement.firstElementChild.remove();
}

function detectWrapStateForTarget(target: Target): boolean {
  return target.rootElement.firstElementChild && (target.rootElement.firstElementChild.className == style.ElementWrapper);
}

function toggleWrapStateForTarget(target: Target, state: boolean) {
  const currentState = detectWrapStateForTarget(target);
  if (state && !currentState)
    wrapTarget(target);
  if (!state && currentState)
    unwrapTarget(target);
}

function toggleWrapState(state: boolean) {
  getWrapperTargets().forEach(target => toggleWrapStateForTarget(target, state));
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
