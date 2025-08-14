export const drawContents = async (contents) => {
  const receiptHeader = document.getElementById('receipt-header');
  const receiptBody = document.getElementById('receipt-table-body');
  const receiptFooter = document.getElementById('receipt-footer');

  if (!contents) {
    receiptHeader.innerHTML = `
      <p>Scan a receipt to get started</p>
    `.trim();
    receiptBody.innerHTML = ``;
    receiptFooter.innerHTML = ``;
    return;
  }

  receiptHeader.innerHTML = `
    <p><strong>${contents.storeName}</strong></p>
    <p>${contents.date}</p>
  `.trim();

  receiptBody.innerHTML = `${contents.items.map((item, index) => `
    <tr>
      <td class="selected">
        <!-- TODO: This should do something, but I am lazy -->
        <input type="checkbox" name="line-item-${index}" checked disabled />
      </td>
      <td class="line-item">${item.name.toLowerCase()}</td>
      <td class="price">${item.price.toFixed(2)}</td>
    </tr>
  `.trim()).join('\n')}`;

  receiptFooter.innerHTML = `
    <p><strong>Tax</strong>: ${(contents.tax ?? 0).toFixed(2)}</p>
    <p><strong>Tip</strong>: ${(contents.tip ?? 0).toFixed(2)}</p>
    <p><strong>Total</strong>: ${(contents.total ?? 0).toFixed(2)}</p>
  `.trim();
}

export const handleLinks = () => {
  wireUpLink("openAbout", "https://vivekraman.dev/blog/itemize-receipts");
  wireUpLink("openSettings", () => chrome.runtime.openOptionsPage());
}

const wireUpLink = (linkId, url) => {
  const container = document.getElementById(linkId);
  if (container) {
    container.addEventListener("click", (event) => {
      event.preventDefault();
      if (typeof url === 'function') {
        url();
      } else if (typeof browser !== 'undefined' && browser.tabs) {
        browser.tabs.create({ url: url });
      } else if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.create({ url: url });
      } else {
        window.open(url, "_blank");
      }
    });
  }
}
