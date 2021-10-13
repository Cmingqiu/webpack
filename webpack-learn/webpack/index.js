/**
 * webpack 是一个函数，参数是配置对象
 * @param {*} options
 * @returns 返回compiler实例
 */

const Compiler = require('./Compiler');

function webpack(options) {
  // 1.初始化参数：将配置文件和shell语句参数合并，得到一个最终的配置对象
  // 拿到命令行参数process.argv
  let shellConfig = process.argv.slice(2).reduce((shellConfig, current) => {
    const [key, value] = current.split('=');
    shellConfig[key.slice(2)] = value;
    return shellConfig;
  }, {});
  options = Object.assign({}, options, shellConfig);

  // 2.从第一步得到的最终配置对象初始化Compiler
  const compiler = new Compiler(options);

  // 3.加载所有配置的插件，传入compiler
  const plugins = options.plugins;
  plugins.forEach(plugin => {
    plugin.apply.call(compiler, compiler);
  });

  return compiler;
}

module.exports = webpack;
