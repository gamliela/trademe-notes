import {getWrapperTargets} from "./trademe_dom";
import {newStatefulTarget, StatefulTarget, Target, TargetState} from "./target";
import style from "./style.scss";

const STATE_ICONS = {
  "yes": "fa-thumbs-up",
  "no": "fa-thumbs-down",
  "undetermined": "fa-eraser"
};

function buildStateButton(state: TargetState, statefulTarget: StatefulTarget, wrapper: Element): Element {

  function stateButtonClickHandler() {
    statefulTarget
      .updateData({state: state})
      .then(() => {
        wrapper.setAttribute("data-state", state);
      });
  }

  const icon = document.createElement('i');
  icon.className = `fas ${STATE_ICONS[state]}`;

  const iconContainer = document.createElement('span');
  iconContainer.className = 'icon is-small';
  iconContainer.insertAdjacentElement('afterbegin', icon);

  const button = document.createElement('a');
  button.className = 'button is-small';
  button.insertAdjacentElement('afterbegin', iconContainer);
  button.addEventListener('click', stateButtonClickHandler);

  return button;
}

async function buildTargetWrapper(target: Target): Promise<Element> {
  const statefulTarget = await newStatefulTarget(target);
  const wrapper = document.createElement('div');

  const stateYesButton = buildStateButton("yes", statefulTarget, wrapper);
  const stateNoButton = buildStateButton("no", statefulTarget, wrapper);
  const stateUndeterminedButton = buildStateButton("undetermined", statefulTarget, wrapper);

  wrapper.setAttribute("data-state", statefulTarget.data.state);
  wrapper.className = style.ElementWrapper;
  wrapper.insertAdjacentElement('afterbegin', stateUndeterminedButton);
  wrapper.insertAdjacentElement('afterbegin', stateNoButton);
  wrapper.insertAdjacentElement('afterbegin', stateYesButton);

  return wrapper;
}

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
