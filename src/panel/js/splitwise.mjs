export const handleSplitwiseTabActive = () => {
  const container = document.getElementById('splitwise-container');
  if (!container) return;

  container.innerHTML = `
    <button id="insertToSplitwise">Insert to Splitwise</button>
  `.trim();
}

export const handleSplitwiseTabInactive = () => {
  const container = document.getElementById('splitwise-container');
  if (!container) return;

  container.innerHTML = '';
}
