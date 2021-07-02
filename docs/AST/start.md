## 1. 抽象语法树(Abstract Syntax Tree)

`webpack` 和 `Lint` 等很多的工具和库的核心都是通过 Abstract Syntax Tree 抽象语法树这个概念来实现对代码的检查、分析等操作的

- 通过了解抽象语法树这个概念，你也可以随手编写类似的工具
- [AST 可视化](https://astexplorer.net/)

## 2. 抽象语法树用途

- 代码语法的检查、代码风格的检查、代码的格式化、代码的高亮、代码错误提示、代码自动补全等等
  - 如 JSLint、JSHint 对代码错误或风格的检查，发现一些潜在的错误
  - IDE 的错误提示、格式化、高亮、自动补全等等
- 代码混淆压缩

- UglifyJS2 等

- 优化变更代码，改变代码结构使达到想要的结构
  - 代码打包工具 webpack、rollup 等等
  - CommonJS、AMD、CMD、UMD 等代码规范之间的转化
  - CoffeeScript、TypeScript、JSX 等转化为原生 Javascript

## 3. 抽象语法树定义

这些工具的原理都是通过 JavaScript Parser 把代码转化为一颗抽象语法树（AST），这颗树定义了代码的结构，通过操纵这颗树，我们可以精准的定位到声明语句、赋值语句、运算语句等等，实现对代码的分析、优化、变更等操作

> 在计算机科学中，抽象语法树（abstract syntax tree 或者缩写为 AST），或者语法树（syntax tree），是源代码的抽象语法结构的树状表现形式，这里特指编程语言的源代码。  
> Javascript 的语法是为了给开发者更好的编程而设计的，但是不适合程序的理解。所以需要转化为 AST 来使之更适合程序分析，浏览器编译器一般会把源码转化为 AST 来进行进一步的分析等其他操作。

![ast1](@public/img/AST/ast1.jpg)

## 4. JavaScript Parser

- JavaScript Parser 是把 JavaScript 源码转化为抽象语法树的解析器。
- 浏览器会把 JavaScript 源码通过解析器转为抽象语法树,再进一步转化为字节码或直接生成机器码。
- 一般来说每个 JavaScript 引擎都会有自己的抽象语法树格式，Chrome 的 v8 引擎，firefox 的 SpiderMonkey 引擎等等，MDN 提供了详细 SpiderMonkey AST format 的详细说明，算是业界的标准。

常用的 JavaScript Parser

- esprima
- traceur
- acorn (webpack 内部解析 AST 使用的)
- shift

## AST 遍历

1. AST 是深度优先遍历
2. 访问者模式 Visitor 对于某个对象或者一组对象，不同的访问者，产生的结果不同，执行操作也不同
3. Visitor 的对象定义了用于 AST 中获取具体节点的方法
4. Visitor 上挂载以节点 type 命名的方法，当遍历 AST 的时候，如果匹配上 type，就会执行对应的方法
