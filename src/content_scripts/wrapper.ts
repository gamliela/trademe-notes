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

function buildNotesInput(initialText: string, statefulTarget: StatefulTarget): Element {
  function inputKeydownHandler(event: KeyboardEvent) {
    if (!event.repeat && event.metaKey && !event.shiftKey && !event.altKey && !event.ctrlKey && (event.key == 's')) {
      statefulTarget
        .updateData({notes: input.value})
        .then(() => {
          input.setAttribute("data-changed", "false");
        });
      event.stopPropagation();
      event.preventDefault();
    }
  }

  function inputInputHandler() {
    input.setAttribute("data-changed", "true");
  }

  const input = document.createElement('textarea');
  input.value = statefulTarget.data.notes;
  input.rows = 4;
  input.setAttribute("data-changed", "false");
  input.addEventListener('keydown', inputKeydownHandler);
  input.addEventListener('input', inputInputHandler);

  return input;
}

async function buildTargetWrapper(target: Target): Promise<Element> {
  const statefulTarget = await newStatefulTarget(target);
  const wrapper = document.createElement('div');

  const stateYesButton = buildStateButton("yes", statefulTarget, wrapper);
  const stateNoButton = buildStateButton("no", statefulTarget, wrapper);
  const stateUndeterminedButton = buildStateButton("undetermined", statefulTarget, wrapper);
  const buttonsWrapper = document.createElement('div');
  buttonsWrapper.insertAdjacentElement('beforeend', stateYesButton);
  buttonsWrapper.insertAdjacentElement('beforeend', stateNoButton);
  buttonsWrapper.insertAdjacentElement('beforeend', stateUndeterminedButton);

  const notesInput = buildNotesInput(statefulTarget.data.notes, statefulTarget);

  wrapper.setAttribute("data-state", statefulTarget.data.state);
  wrapper.className = style.ElementWrapper;
  wrapper.insertAdjacentElement('beforeend', buttonsWrapper);
  wrapper.insertAdjacentElement('beforeend', notesInput);

  return wrapper;
}

export {buildTargetWrapper};
