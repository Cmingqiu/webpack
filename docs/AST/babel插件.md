## babel 插件

其实 babel 插件就是一个包含 visitor 的对象，visitor 是对象，属性就是 AST 语法树节点的 type 名称  
babel 插件的核心: <span class="important-tip">将老的语法树转成新的语法树</span>

- [@babel/core](https://www.npmjs.com/package/@babel/core) Babel 的编译器，核心 API 都在这里面，比如常见的 transform、parse
- [babylon Babel](http://www.zhufengpeixun.com/grow/html/103.4.webpack-ast.html) 的解析器
- [babel-types](https://github.com/babel/babel/tree/master/packages/babel-types) 用于 AST 节点的 Lodash 式工具库, 它包含了构造、验证以及变换 AST 节点的方法，对编写处理 AST 逻辑非常有用
- [babel-traverse](https://www.npmjs.com/package/babel-traverse) 用于对 AST 的遍历，维护了整棵树的状态，并且负责替换、移除和添加节点
- [babel-types-api](https://babeljs.io/docs/en/next/babel-types.html)
- [Babel 插件手册](https://github.com/brigand/babel-plugin-handbook/blob/master/translations/zh-Hans/README.md#asts)
- [babeljs.io](https://babeljs.io/en/repl.html) babel 可视化编译器

## 转换箭头函数

`@babel/core` 的 `transform` 方法 包含了：

- 将源代码转成 AST 语法树（类似`@babel/parser`、 `esprima.parse(sourceCode)`）
- 遍历抽象语法树，并调用插件将语法树转成新的语法树（类似 `@babel/traverse`、`estraverse.traverse( ast , { enter(){} , leave(){} } )`）
- 将新的语法树生成代码（类似`@babel/generator`、 `escodegen.generate(ast)`）

```js
const core = require('@babel/core');
const types = require('babel-types');
const sourceCode = `
  const sum =  (a,b)=>{
    console.log(a+b)
  }
`;

const BabelPluginTransformEs2015ArrowFunctions = {
  visitor: {
    ArrowFunctionExpression(nodePath) {
      const node = nodePath.node;
      node.type = 'FunctionExpression';
    }
  }
};

let es5Code = core.transform(sourceCode, {
  plugins: [BabelPluginTransformEs2015ArrowFunctions]
});

console.log(es5Code.code);

/* 结果：
const sum = function (a, b) {
  console.log(a + b);
};
*/
```

处理 this 指向

```js
let core = require('@babel/core');
let types = require('babel-types');
let BabelPluginTransformEs2015ArrowFunctions = require('babel-plugin-transform-es2015-arrow-functions');
const sourceCode = `
const sum = (a,b)=>{
    console.log(this);
    return a+b;
}
`;
//babel插件其实是一个对象，它会有一个visitor访问器
let BabelPluginTransformEs2015ArrowFunctions2 = {
  //每个插件都会有自己的访问器
  visitor: {
    //属性就是节点的类型，babel在遍历到对应类型的节点的时候会调用此函数
    ArrowFunctionExpression(nodePath) {
      //参数是节点的数据
      let node = nodePath.node; //获取 当前路径上的节点
      //处理this指针的问题
      hoistFunctionEnvironment(nodePath);
      node.type = 'FunctionExpression';
    }
  }
};
function hoistFunctionEnvironment(fnPath) {
  const thisEnvFn = fnPath.findParent((p) => {
    //是一个函数，不能是箭头函数 或者 是根节点也可以
    return (p.isFunction() && !p.isArrowFunctionExpression()) || p.isProgram();
  });
  //找一找当前作用域哪些地方用到了this的路径
  let thisPaths = getScopeInfoInformation(fnPath);
  //声明了一个this的别名变量，默认是_this __this
  let thisBinding = '_this';
  if (thisPaths.length > 0) {
    //在thisEnvFn的作用域内添加一个变量，变量名_this,初始化的值为this
    thisEnvFn.scope.push({
      id: types.identifier(thisBinding),
      init: types.thisExpression()
    });
    thisPaths.forEach((item) => {
      //创建一个_this的标识符
      let thisBindingRef = types.identifier(thisBinding);
      //把老的路径 上的节点替换成新节点
      item.replaceWith(thisBindingRef);
    });
  }
}
function getScopeInfoInformation(fnPath) {
  let thisPaths = [];
  //遍历当前path所有的子节点路径，
  //告诉 babel我请帮我遍历fnPath的子节点，遇到ThisExpression节点就执行函数，并且把对应的路径传进去
  fnPath.traverse({
    ThisExpression(thisPath) {
      thisPaths.push(thisPath);
    }
  });
  return thisPaths;
}

let targetCode = core.transform(sourceCode, {
  plugins: [BabelPluginTransformEs2015ArrowFunctions2]
});
console.log(targetCode.code);
```
