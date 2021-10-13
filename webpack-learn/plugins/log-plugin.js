

class LogPlugin {
  constructor(opts) {
    this.opts = opts
  }
  apply (compiler) {
    console.log('LogPlugin~~~~~~~');

  }
}

module.exports = LogPlugin