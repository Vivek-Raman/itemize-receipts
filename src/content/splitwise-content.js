const observer = new MutationObserver((mutations) => {
  if (checkForItemizedSplit()) {
    tryAddAutofillButton();
  }
});

observer.observe(document.getElementById('add_bill'), {
  childList: true,
  subtree: true,
  attributes: true,
  characterData: false
});

const AUTOFILL_BTN_ID = 'ext_itemize_receipt_autofill_button';
const DONE_BTN_SELECTOR = '#choose_split > div > div.split-details > div.split_method.itemized > button';

function checkForItemizedSplit() {
  const itemizedSplit = document.querySelector(DONE_BTN_SELECTOR);
  return !!itemizedSplit;
}

async function tryAddAutofillButton() {
  if (document.getElementById(AUTOFILL_BTN_ID)) {
    return;
  }

  const contents = await fetchContents();
  if (!contents) {
    return;
  }

  const autofillButton = document.createElement('button');
  autofillButton.id = AUTOFILL_BTN_ID;
  autofillButton.innerText = `Autofill receipt from ${contents.storeName}`;
  autofillButton.addEventListener('click', (event) => {
    event.preventDefault();
    doAutofill();
  });

  document.querySelector(DONE_BTN_SELECTOR).parentElement.appendChild(autofillButton);
}

async function fetchContents() {
  const { contents } = await chrome.storage.local.get('contents');
  return contents;
}

const LINE_ITEMS_TABLE_ID = "item_holder";
const LINE_ITEM_ROW_SELECTOR = "#item_holder > tr.itemized_item > td.input";
const LINE_ITEM_NAME_SELECTOR = LINE_ITEM_ROW_SELECTOR + " > input[name='item_name']";
const LINE_ITEM_PRICE_SELECTOR = LINE_ITEM_ROW_SELECTOR + " > input[name='amount']";

function setInputValueAndNotify(input, value) {
  const previousValue = input.value;
  const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
  if (nativeSetter) {
    nativeSetter.call(input, value);
  } else {
    input.value = value;
  }

  // Keep attribute in sync for any consumers reading attributes instead of properties
  input.setAttribute('value', value);

  // If it's a number input, also clear valueAsNumber to ensure model updates
  try {
    if (input.type === 'number') {
      input.valueAsNumber = Number.NaN;
    }
  } catch (_) { }

  // React-specific: ensure its internal value tracker sees the change
  const valueTracker = input._valueTracker || input.__valueTracker;
  if (valueTracker) {
    valueTracker.setValue(previousValue);
  }

  // Simulate a realistic interaction sequence so various handlers react
  const eventInit = { bubbles: true, composed: true, cancelable: true };
  input.dispatchEvent(new FocusEvent('focus', eventInit));
  input.dispatchEvent(new Event('focusin', eventInit));

  try {
    input.dispatchEvent(new InputEvent('beforeinput', { ...eventInit, inputType: 'deleteContentBackward', data: null }));
  } catch (_) {
    input.dispatchEvent(new Event('beforeinput', eventInit));
  }

  input.dispatchEvent(new KeyboardEvent('keydown', { ...eventInit, key: 'Backspace', code: 'Backspace' }));
  try {
    input.dispatchEvent(new InputEvent('input', { ...eventInit, inputType: 'deleteContentBackward', data: null }));
  } catch (_) {
    input.dispatchEvent(new Event('input', eventInit));
  }
  input.dispatchEvent(new KeyboardEvent('keyup', { ...eventInit, key: 'Backspace', code: 'Backspace' }));

  input.dispatchEvent(new Event('change', eventInit));
  input.dispatchEvent(new Event('focusout', eventInit));
  input.dispatchEvent(new FocusEvent('blur', eventInit));
}

async function doAutofill() {
  // fetch fresh contents to account for time-of-fetch vs time-of-use differences
  const contents = await fetchContents();
  if (!contents) {
    return;
  }

  const table = document.getElementById(LINE_ITEMS_TABLE_ID);
  if (!table) {
    console.error("Line items table not found");
    return;
  }

  // clear all existing line items
  [
    ...table.querySelectorAll(LINE_ITEM_NAME_SELECTOR),
    ...table.querySelectorAll(LINE_ITEM_PRICE_SELECTOR),
  ].forEach(field => {
    setInputValueAndNotify(field, "");
  });

  // populate line items
  contents.items.forEach((item, index) => {
    const nameField = table.querySelectorAll(LINE_ITEM_NAME_SELECTOR)[index];
    const priceField = table.querySelectorAll(LINE_ITEM_PRICE_SELECTOR)[index];
    setInputValueAndNotify(nameField, item.name.toLowerCase());
    setInputValueAndNotify(priceField, item.price.toFixed(2));
  });

  // Encourage any container-level listeners to recompute
  table.dispatchEvent(new Event('input', { bubbles: true }));
  table.dispatchEvent(new Event('change', { bubbles: true }));
}
