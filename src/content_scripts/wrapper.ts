import {newStatefulTarget, StatefulTarget, Target, TargetState} from "./target";
import {isKeyboardEventRelevant} from "./wrap_service";
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
      })
      .catch((error) => {
        window.alert("Problem with save! please try again.");
        console.log(error);
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

function buildPriceField(priceProp: string, statefulTarget: StatefulTarget): Element {
  const priceInputLabel = {
    "rvPrice": "RV $",
    "insightsPrice": "Trademe Insights $",
    "homesPrice": "Homes $",
    "beoPrice": "BEO $"
  };

  const priceInputHref = {
    "insightsPrice": "https://www.trademe.co.nz/property/insights/",
    "homesPrice": "https://homes.co.nz/"
  };

  const href = priceInputHref[priceProp];
  const labelSpan = document.createElement(href ? 'a' : 'span');
  if (href) {
    (labelSpan as HTMLAnchorElement).href = href;
    (labelSpan as HTMLAnchorElement).target = "_blank";
  }
  labelSpan.innerText = priceInputLabel[priceProp];
  labelSpan.className = "is-small " + style.Toolbar__label;

  const input = document.createElement('input');
  input.value = statefulTarget.data[priceProp] || '';
  input.className = "input is-small";
  input.setAttribute("data-changed", "false");

  const wrapper = document.createElement('span');
  wrapper.className = "price-field " + priceProp;
  wrapper.insertAdjacentElement('beforeend', labelSpan);
  wrapper.insertAdjacentElement('beforeend', input);

  return wrapper;
}

function buildLastUpdatedSpan(statefulTarget: StatefulTarget) {
  const labelSpan = document.createElement('span');
  if (statefulTarget.data.lastUpdated) {
    const date = new Date(parseInt(statefulTarget.data.lastUpdated));
    labelSpan.innerText = date.toLocaleDateString();
    labelSpan.className = "is-small " + style.Toolbar__label;
  }
  return labelSpan;
}

function buildNotesInput(initialText: string, statefulTarget: StatefulTarget): HTMLTextAreaElement {
  const input = document.createElement('textarea');
  input.value = statefulTarget.data.notes;
  input.rows = 3;

  return input;
}

async function buildTargetWrapper(target: Target): Promise<Element> {
  function saveHandler(event: KeyboardEvent) {
    if (isKeyboardEventRelevant(event) && (event.key == 's')) {
      statefulTarget
        .updateData({
          rvPrice: (toolbar.querySelector(".price-field.rvPrice input") as HTMLInputElement).value,
          insightsPrice: (toolbar.querySelector(".price-field.insightsPrice input") as HTMLInputElement).value,
          homesPrice: (toolbar.querySelector(".price-field.homesPrice input") as HTMLInputElement).value,
          beoPrice: (toolbar.querySelector(".price-field.beoPrice input") as HTMLInputElement).value,
          notes: notesInput.value,
          lastUpdated: new Date().getTime() + "",
        })
        .then(() => {
          this.setAttribute("data-changed", "false");
        })
        .catch((error) => {
          window.alert("Problem with save! please try again.");
          console.log(error);
        });
      wrapper.setAttribute("data-changed", "false");
      event.stopPropagation();
      event.preventDefault();
    }
  }

  function inputTextHandler(event) {  // the type is InputEvent, which is not supported by default yet
    wrapper.setAttribute("data-changed", "true");
    event.stopPropagation();
    event.preventDefault();
  }

  const statefulTarget = await newStatefulTarget(target);
  const wrapper = document.createElement('div');

  const stateYesButton = buildStateButton("yes", statefulTarget, wrapper);
  const stateNoButton = buildStateButton("no", statefulTarget, wrapper);
  const stateUndeterminedButton = buildStateButton("undetermined", statefulTarget, wrapper);
  const priceRVField = buildPriceField("rvPrice", statefulTarget);
  const priceInsightsField = buildPriceField("insightsPrice", statefulTarget);
  const priceHomesField = buildPriceField("homesPrice", statefulTarget);
  const priceBEOField = buildPriceField("beoPrice", statefulTarget);
  const lastUpdatedSpan = buildLastUpdatedSpan(statefulTarget);
  const toolbar = document.createElement('div');
  toolbar.className = style.Toolbar;
  toolbar.insertAdjacentElement('beforeend', stateYesButton);
  toolbar.insertAdjacentElement('beforeend', stateNoButton);
  toolbar.insertAdjacentElement('beforeend', stateUndeterminedButton);
  toolbar.insertAdjacentElement('beforeend', priceRVField);
  toolbar.insertAdjacentElement('beforeend', priceInsightsField);
  toolbar.insertAdjacentElement('beforeend', priceHomesField);
  toolbar.insertAdjacentElement('beforeend', priceBEOField);
  toolbar.insertAdjacentElement('beforeend', lastUpdatedSpan);

  const notesInput = buildNotesInput(statefulTarget.data.notes, statefulTarget);

  wrapper.setAttribute("data-state", statefulTarget.data.state);
  wrapper.setAttribute("data-changed", "false");
  wrapper.className = style.ElementWrapper;
  wrapper.insertAdjacentElement('beforeend', toolbar);
  wrapper.insertAdjacentElement('beforeend', notesInput);

  wrapper.addEventListener('keydown', saveHandler);
  wrapper.addEventListener('input', inputTextHandler);

  return wrapper;
}

export {buildTargetWrapper};
