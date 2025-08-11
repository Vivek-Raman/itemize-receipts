class Logger {
  constructor() {
    this.enabled = false;
    try {
      this.container = document.getElementById('logger');
      if (this.container) {
        this.enabled = true;
      }
    } catch (e) {
      console.error('Logger container not found');
    }
  }

  log(message) {
    console.debug(message);

    if (!this.enabled) {
      return;
    }
    this.container.innerHTML = message;
  }
}