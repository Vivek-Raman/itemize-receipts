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

  }

  const autofillButton = document.createElement('button');
  autofillButton.id = AUTOFILL_BTN_ID;
  autofillButton.innerText = `Autofill receipt from ${contents.storeName}`;
  autofillButton.addEventListener('click', (event) => {
    event.preventDefault();
    doAutofill(contents);
  });

  document.querySelector(DONE_BTN_SELECTOR).parentElement.appendChild(autofillButton);
}

async function fetchContents() {
  // TODO: Fetch from storage
  // const { contents } = await chrome.storage.local.get('contents');
  const contents = {
    "date": "2025-05-21",
    "items": [
      {
        "name": "KANAN PLN PARATA 2KG",
        "price": 11.99
      },
      {
        "name": "VKNGR CREAM OF BROCC",
        "price": 1.79
      },
      {
        "name": "VKNGR SUNFLOWER OIL",
        "price": 1.79
      },
      {
        "name": "VKNGR MUSHROOM SOUP",
        "price": 1.79
      },
      {
        "name": "CHING'S TOMATO SOUP",
        "price": 1.69
      },
      {
        "name": "31 PARIPPU",
        "price": 3.49
      },
      {
        "name": "VEER GHEE 16 OZ",
        "price": 1.99
      },
      {
        "name": "VRIG SUNFLOWER OIL 1",
        "price": 3.99
      },
      {
        "name": "3B TAJ MAHAL",
        "price": 3.49
      },
      {
        "name": "DEEP CINNAMON STICKS",
        "price": 1.99
      },
      {
        "name": "SAMOSA& SPRING ROLL",
        "price": 6.6
      },
      {
        "name": "BREAD",
        "price": 1.5
      }
    ],
    "storeName": "store2k.com",
    "tax": 58.57,
    "tip": null,
    "total": 59.17
  };

  console.log(contents);
  return contents;
}

async function doAutofill(contents) {

}
