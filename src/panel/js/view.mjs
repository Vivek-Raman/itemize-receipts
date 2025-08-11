export const drawContents = async (contents) => {
  const receiptHeader = document.getElementById('receipt-header');
  receiptHeader.innerHTML = `
    <p><strong>${contents.storeName}</strong></p>
    <p>${contents.date}</p>
  `.trim();

  const receiptBody = document.getElementById('receipt-table-body');
  receiptBody.innerHTML = `${contents.items.map((item, index) => `
    <tr>
      <td class="line-item">${item.name.toLowerCase()}</td>
      <td class="price">${item.price.toFixed(2)}</td>
      <td class="selected"><input type="checkbox" name="line-item-${index}" checked /></td>
    </tr>
  `.trim()).join('\n')}`;

  const receiptFooter = document.getElementById('receipt-footer');
  receiptFooter.innerHTML = `
    <p><strong>Tax</strong>: ${(contents.tax ?? 0).toFixed(2)}</p>
    <p><strong>Tip</strong>: ${(contents.tip ?? 0).toFixed(2)}</p>
    <p><strong>Total</strong>: ${(contents.total ?? 0).toFixed(2)}</p>
  `.trim();
}

export const handleLinks = () => {
  wireUpLink("authorLink", "https://vivekraman.dev/blog/itemize-receipts");
  wireUpLink("openSettings", "chrome-extension://" + chrome.runtime.id + "/options.html");
}

const wireUpLink = (linkId, url) => {
  const container = document.getElementById(linkId);
  if (container) {
    container.addEventListener("click", (event) => {
      event.preventDefault();
      if (typeof browser !== 'undefined' && browser.tabs) {
        browser.tabs.create({ url: url });
      } else if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.create({ url: url });
      } else {
        window.open(url, "_blank");
      }
    });
  }
}
