## 什么是 loader？

<span class="important-tip">loader 本质上就是一个方法</span>，入参 context 是匹配到的所有文件的内容，loader 方法有 pitch 属性，也是函数（大部分不配置）。webpack 只能识别 js 和 json 文件，要想处理其他类型就要使用 loader，比如：  
`require('./index.css')`
不能直接引入 css，因为 css 文件不是模块，需要 webpack 的 loader 处理，less/scss  
同理插件：
`mini-css-extract-plugin` 处理引入 css 的方式，以 link 标签方式引入 css

```js
/*
 * @param {*} source 上一个loader的返回值或者最原始的模块内容
 * @param {*} inoutSourceMap 上一个loader传递来的sourcemap
 * @param {*} data
 */
function loader(source, inoutSourceMap, data) {
  //...

  return code;
  //return this.callback(null,code,map,ast)
}
module.exports = loader;

/**
 * 什么时候使用this.callback？
 *    当需要返回多个值时用this.callback来传递多个值 或者 异步情况只能使用callback
 *    当需要返回一个值，可以直接return
 *
 * loader的返回值？
 *    最后的loader返回值必须是js代码，因为这个返回值要给webpack，用来生产ast
 *    其他的loader返回值没有要求，可以是任意内容，但是下一个loader要能识别
 */
```

![webpackflowloader](@public/img/loader/webpackflowloader.jpg)

## 使用场景:

对于某一类文件的处理，处理其他类型的文件： 因为 webpack 只识别 js , json 文件,处理其他类型的文件是的 webpack 能够识别
对内容进行处理

## loader 执行顺序（不考虑 pitch）

**loader 分为 4 类：分别是 pre、normal、inline、post**

<div class="important-tip">不同类型loader执行顺序：pre前置->normal正常->inline内联->post后置  </div>
<div class="important-tip">  同类型的loader再区分执行顺序：先下后上，先右后左（倒序执行） </div>

![loader-runner.jpg](@public/img/loader/loader-runner.jpg)

## loader.pitch

- 比如 a!b!c!module, 正常调用顺序应该是 c、b、a，但是真正调用顺序是 a(pitch)、b(pitch)、c(pitch)、c、b、a,如果其中任何一个 - pitching loader 返回了值就相当于在它以及它右边的 loader 已经执行完毕
- 比如如果 b 返回了字符串"result b", 接下来只有 a 会被系统执行，且 a 的 loader 收到的参数是 result b
- loader 根据返回值可以分为两种，一种是返回 js 代码（一个 module 的代码，含有类似 module.export 语句）的 loader，还有不能作为最左边 - loader 的其他 loader
- 有时候我们想把两个第一种 loader chain 起来，比如 style-loader!css-loader! 问题是 css-loader 的返回值是一串 js 代码，如果按正常方- 式写 style-loader 的参数就是一串代码字符串
- 为了解决这种问题，我们需要在 style-loader 里执行 require(css-loader!resources)

---

:::details Q&A
**_为什么分成 4 类？_**  
因为 loder 的配置是分散的，要想保证执行顺序就分类。

---

_**行内 loader（inline）如何书写？**_

```js
//inline loader  不能在配置文件中配置，强制写在代码中
require('inline-loader1!inline-loader2!./title.js');
```

---

---

**_inline loader 前面可以加符号，决定 loader 的组合?_**
符号|变量|含义
:---:|:--:|--
!|noPreAutoLoaders|不要前置和普通 loader
!!|noAutoLoaders|不要普通 loader
-!|noPrePostAutoLoaders|不要前后置和普通 loader,只要内联 loader
例如：

```js
require('!inline-loader1!inline-loader2!./title.js');
require('!!inline-loader1!inline-loader2!./title.js');
require('-!inline-loader1!inline-loader2!./title.js');
```

:::

## 手写 loader

### babel-loader

```js
cnpm i @babel/preset-env @babel/core -D
```

```js
//babel-loader.js
const babel = require('@babel/core');
function loader(source, inputSourceMap, data) {
  //C:\webpack-analysis2\loaders\babel-loader.js!C:\webpack-analysis2\src\index.js
  const options = {
    presets: ['@babel/preset-env'],
    inputSourceMap: inputSourceMap,
    sourceMaps: true, //sourceMaps: true 是告诉 babel 要生成 sourcemap
    filename: this.request
      .split('!')[1]
      .split('/')
      .pop()
  };
  //在webpack.config.js中 增加devtool: 'eval-source-map'
  let { code, map, ast } = babel.transform(source, options);
  return this.callback(null, code, map, ast);
}
module.exports = loader;
```

```js
//webpack.config.js
resolveLoader: {
    alias: {//可以配置别名
      "babel-loader": resolve('./build/babel-loader.js')
    },//也可以配置loaders加载目录
    modules: [path.resolve('./loaders'), 'node_modules']
},
{
    test: /\.js$/,
    use:['babel-loader']
}
```
