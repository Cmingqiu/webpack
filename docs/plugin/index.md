插件向第三方开发者提供了 webpack 引擎中完整的能力。使用阶段式的构建回调，开发者可以引入它们自己的行为到 webpack 构建流程中。创建插件比创建 loader 更加高级，因为你将需要理解一些 webpack 底层的内部特性来做相应的钩子。配置的插件在 compiler 执行 run 方法后、编译前就挂载了。之后在编译的各个阶段执行对应钩子。

**plugin 本质上就是 class 类或构造函数，都有 apply 方法。注意：new plugin()只是把构造函数执行一遍，webpack 不会执行这个构造函数，而是执行构造函数的原型上的 apply 方法。**

## compiler 和 compilation

在插件开发中最重要的两个就是 compiler 和 compilation 对象。

- compiler 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。可以使用它来访问 webpack 的主环境。

- compilation 对象代表了一次资源版本构建。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。compilation 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。

compiler 的一些钩子
|序号|钩子名称|钩子类型|参数|执行时机|
|:--:|:--:|:--:|:--|--|
|1|entryOption|SyncBailHook|context,entry|在 webpack 中的 entry 配置处理过之后|
|2|afterPlugins|SyncHook|compiler|初始化完内置插件之后|
|3|beforeRun|AsyncSeriesHook|compiler|开始正式编译之前|
|4|run|AsyncSeriesHook|compiler|开始编译之后，读取 records 之前；监听模式触发 watch-run|
|5|normalModuleFactory|SyncHook|normalModuleFactory|NormalModuleFactory 创建之后|
|6|beforeCompile|AsyncSeriesHook|params|compilation 实例化需要的参数创建完毕之后|
|7|compile|SyncHook|params|一次 compilation 编译创建之前|
|8|compilation|SyncHook|compilation,params|compilation 创建成功之后|
|9|make|AsyncParallelHook|compilation|完成编译之前|
|10|afterCompile|AsyncSeriesHook|compilation|完成编译和封存（seal）编译产出之后|
|11|emit|AsyncSeriesHook|compilation|生成资源到 output 目录之前|
|12|done|AsyncSeriesHook|stats|compilation 完成之后|

compilation 的一些钩子
|序号|钩子名称|钩子类型|参数|执行时机|
|:--:|:--:|:--:|:--|--|
|1|chunkAsset|SyncHook|chunk,filename|一个 chunk 中的一个资源被添加到编译中|
|2|processAssets|AsyncSeriesHook|assets||
|3|afterHash|SyncHook||在编译被哈希（hashed）之后|

## 手写 plugin

编写插件需要知道以下几点:

1. compiler 和 compilation 有哪些钩子
2. 这些钩子的执行时机
3. 钩子的参数
4. 钩子的类型

### ZipPlugin

将输出文件统一压缩成一个 zip 文件

```js
// /plugins/zip-plugin.js
const { RawSource } = require('webpack-sources');
const JSZip = require('jszip');

class ZipPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    let that = this;
    compiler.hooks.compilation.tap('ZipPlugin', compilation => {
      compilation.hooks.processAssets.tapAsync(
        'ZipPlugin',
        (assets, callback) => {
          const zip = new JSZip();
          for (let filename in assets) {
            zip.file(filename, assets[filename].source());
          }
          zip.generateAsync({ type: 'nodebuffer' }).then(data => {
            assets[that.options.zipName] = new RawSource(data);
            callback();
          });
        }
      );
    });
  }
}

module.exports = ZipPlugin;
```

```js
// webpack.config.js

const ZipPlugin = require('./plugins/zip-pluign');

module.exports = {
  plugins: [
    new ZipPlugin({
      zipName: 'main.zip'
    })
  ]
};
```

### style-loader

```js
function styleLoader(source) {
  let script = `
    let style = document.createElement('style')
    style.innerHTML = ${JSON.stringify(source)}
    document.head.appendChild(style);
  `;
  return script;
}
module.exports = styleLoader;
```

### sass-loader

```js
const sass = require('node-sass');
function sassLoader(source) {
  //异步
  const callback = this.async();
  sass.render(
    {
      data: source
    },
    (err, res) => {
      if (err) {
        console.log(err);
      } else {
        // console.log(res.css.toString());
        callback(null, res.css); //res.css 是一个Buffer
      }
    }
  );
  /*  同步
   * const result = sass.renderSync({data: source})
   * return result.css */
}
module.exports = sassLoader;
```

### less-loader

```js
const less = require('less');
function lessLoader(source) {
  const callback = this.async();
  less.render(
    source,
    {
      filename: 'index.js'
    },
    (err, res) => {
      callback(null, res.css);
    }
  );
}
module.exports = lessLoader;
```
