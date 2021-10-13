

class RunPlugin {
  constructor(opts) {
    this.opts = opts
  }
  apply (compiler) {
    compiler.hooks.run.tap('run', () => {
      console.log('run============');
    })
  }
}


module.exports = RunPlugin