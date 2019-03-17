import {getWrapperTargets} from "./trademe_dom";
import {Target} from "./target";
import style from "./style.scss";
import {buildTargetWrapper} from "./wrapper";

function wrapTarget(target: Target): void {
  buildTargetWrapper(target)
    .then((element) => {
      target.rootElement.insertAdjacentElement('afterbegin', element);
    });
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
