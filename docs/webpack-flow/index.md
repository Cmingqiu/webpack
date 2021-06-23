## 工作流程

1. 初始化参数：从配置文件和 Shell 语句中读取并合并参数,得出最终的配置对象
2. 用上一步得到的参数初始化 `Compiler` 对象
3. 加载所有配置的插件，传入 `compiler` 实例
4. 执行 `compiler` 对象的 `run` 方法，开始编译
5. 根据配置中的 entry 找出入口文件
6. 从入口文件出发,调用所有配置的 Loader 对模块进行编译
7. 再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
8. 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk
9. 再把每个 Chunk 转换成一个单独的文件加入到输出列表
10. 在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

![webpackflow](@public/img/flow/webpackflow.jpg)

## 1. 初始化参数：从配置文件和 Shell 语句中读取并合并参数,得出最终的配置对象

```js
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

  return compiler;
}

module.exports = webpack;
```

## 2. 用上一步得到的参数初始化 `Compiler` 对象

```js
const compiler = new Compiler(options);
```

## 3. 加载所有配置的插件，传入 `compiler` 实例

```js
const plugins = options.plugins;
plugins.forEach(plugin => {
  plugin.apply.call(compiler, compiler);
});
```

## 4. 执行 `compiler` 对象的 `run` 方法，开始编译

```js
const config = require('./webpack.config');

const compiler = webpack(config);
compiler.run((err, stats) => {
   console.log(stats.toJson(
     {
       assets: true,
       chunks: true,
       modules: true,
       entries: true,
     }
   ));
```

## 5. 根据配置中的 entry 找出入口文件

```js
class Compiler {
  constructor(options) {
    this.options = options;
    this.hooks = {
      //钩子
      run: new SyncHook(),
      emit: new SyncHook(),
      done: new SyncHook()
    };
  }
  run() {
    this.hooks.run.call();
    // 编译阶段

    // 5.从配置文件中找到entry入口文件
    // entry格式化成一个对象，如果配置的是但入口（字符串）就是属性为main的对象
    let entries = {},
      entry = this.options.entry;
    if (typeof entry === 'string') entries['main'] = entry;
    else entries = entry;

    this.hooks.done.call();
  }
}
```

## 6. 从入口文件出发,调用所有配置的 Loader 对模块进行编译

```js
 buildModule(entryName, modulePath) {
    const moduleSource = fs.readFileSync(modulePath, 'utf-8');
    let targetSource = moduleSource;
    const rules = this.options.module.rules;
    let loaders = []; //loader倒序执行
    rules.forEach(rule => {
      if (rule.test.test(modulePath)) {
        if (Array.isArray(rule.use)) loaders.push(...rule.use);
        else loaders.push(rule.use);
      }
    });
    for (let i = loaders.length - 1; i >= 0; i--) {
      targetSource = require(loaders[i])(targetSource);
    }

    return module;
  }
```

## 7. 再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理

```js
let ast = parser.parse(targetSource, { sourceType: 'module' });
traverse(ast, {
  CallExpression: nodePath => {
    const { node } = nodePath;
    if (node.callee.name === 'require') {
      //1.处理文件后缀 ; 2.拿到依赖模块的绝对路径
      let depModuleName = node.arguments[0].value; // ./title
      const dirPath = path.dirname(modulePath);
      let depModulePath = path.posix.join(dirPath, depModuleName);
      depModulePath = tryExtension(
        depModulePath,
        this.options.resolve.extensions,
        depModuleName,
        dirPath
      );
      const depModuleId = getModuleID(depModulePath);
      node.arguments = [types.stringLiteral(depModuleId)];
      module.dependencies.push(depModulePath);
    }
  }
});
module.dependencies.forEach(dependence => {
  const depModule = this.buildModule(entryName, dependence);
  this.modules.push(depModule);
});

const { code } = generator(ast);
module._source = code;
```

## 8. 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk

```js
for (let entryName in entries) {
  //entryName :main / page1 / page2
  // 将入口路径entryPath转成绝对路径
  let entryPath = entries[entryName];
  entryPath = path.posix.join(baseDir, entryPath);
  const entryModule = this.buildModule(entryName, entryPath);

  const chunk = {
    name: entryName,
    entryModule,
    modules: this.modules.filter(module => module.entryName === entryName)
  };
  this.chunks.push(chunk);
}
```

## 9. 再把每个 Chunk 转换成一个单独的文件加入到输出列表

```js
const { path: outputPath, filename } = this.options.output;
this.chunks.forEach(chunk => {
  const ouputDir = (outputPath + '/' + filename).replace('[name]', chunk.name);
  this.assets[ouputDir] = getSource(chunk);
});
this.files = Object.keys(this.assets);
```

## 10. 在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

```js
//写入文件之前触发emit钩子
this.hooks.emit.call();
this.files.forEach(file => {
  fs.writeFileSync(file, this.assets[file]);
});
```

[完整 demo](/webpack/assets/source-code.rar)
