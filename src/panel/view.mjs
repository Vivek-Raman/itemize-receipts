export const drawContents = async (contents) => {
  const contentsContainer = document.getElementById('contents');
  contentsContainer.innerHTML = `
    <div class="receipt-info">
      <p><strong>Store</strong>: ${contents.storeName}</p>
      <p><strong>Date</strong>: ${contents.date}</p>
      <p><strong>Tax</strong>: ${contents.tax}</p>
      <p><strong>Tip</strong>: ${contents.tip}</p>
      <p><strong>Total</strong>: ${contents.total}</p>
    </div>
    <form>
      <table class="receipt-table">
        <thead>
          <tr>
            <th>Line Item</th>
            <th>Price</th>
            <th>Selected</th>
          </tr>
        </thead>
        <tbody>
        ${contents.items.map(item => `
          <tr>
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td><input type="checkbox" checked /></td>
          </tr>
        `).join('\n')}
        </tbody>
      </table>
    </form>
    <button id="saveReceipt">Save Receipt</button>
    <button id="clearReceipt">Clear Receipt</button>
    <button id="deleteReceipt">Delete Receipt</button>
  `;
}
