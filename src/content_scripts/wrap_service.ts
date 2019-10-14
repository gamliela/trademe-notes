import {getWrapperTargets} from "./trademe_dom";
import {Target} from "./target";
import style from "./style.scss";
import {buildTargetWrapper} from "./wrapper";

function wrapTarget(target: Target): void {
  buildTargetWrapper(target)
    .then((element) => {
      target.rootElement.insertAdjacentElement('afterbegin', element);
    })
    .catch((error) => {
      window.alert("Problem with fetching data! please try again.");
      console.log(error);
    });
}

function unwrapTarget(target: Target): void {
  target.rootElement.firstElementChild.remove();
}

function detectWrapStateForTarget(target: Target): boolean {
  return target.rootElement.firstElementChild && (target.rootElement.firstElementChild.className == style.ElementWrapper);
}

function toggleWrapStateForTarget(target: Target) {
  if (detectWrapStateForTarget(target)) {
    unwrapTarget(target);
  } else {
    wrapTarget(target);
  }
}

function toggleWrapState() {
  getWrapperTargets().forEach(target => toggleWrapStateForTarget(target));
}

const isWindows = window.navigator && window.navigator.platform && (window.navigator.platform == "Win32") || (window.navigator.platform == "Win64");

function isKeyboardEventRelevant(event: KeyboardEvent) {
  return isWindows ?
    (!event.repeat && !event.metaKey && !event.shiftKey && event.altKey && !event.ctrlKey)
    :
    (!event.repeat && event.metaKey && !event.shiftKey && !event.altKey && !event.ctrlKey);
}

function keyboardEventHandler(event: KeyboardEvent) {
  if (isKeyboardEventRelevant(event)) {
    if (event.key == 'F1') {
      toggleWrapState();
    }
  }
}

function installWrappingKeyboardTrigger() {
  window.addEventListener("keydown", keyboardEventHandler);
}

export {isKeyboardEventRelevant, installWrappingKeyboardTrigger}
