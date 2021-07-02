(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{359:function(t,a,r){t.exports=r.p+"assets/img/ast1.56c12282.jpg"},374:function(t,a,r){"use strict";r.r(a);var v=r(44),_=Object(v.a)({},(function(){var t=this,a=t.$createElement,v=t._self._c||a;return v("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[v("h2",{attrs:{id:"_1-抽象语法树-abstract-syntax-tree"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_1-抽象语法树-abstract-syntax-tree"}},[t._v("#")]),t._v(" 1. 抽象语法树(Abstract Syntax Tree)")]),t._v(" "),v("p",[v("code",[t._v("webpack")]),t._v(" 和 "),v("code",[t._v("Lint")]),t._v(" 等很多的工具和库的核心都是通过 Abstract Syntax Tree 抽象语法树这个概念来实现对代码的检查、分析等操作的")]),t._v(" "),v("ul",[v("li",[t._v("通过了解抽象语法树这个概念，你也可以随手编写类似的工具")]),t._v(" "),v("li",[v("a",{attrs:{href:"https://astexplorer.net/",target:"_blank",rel:"noopener noreferrer"}},[t._v("AST 可视化"),v("OutboundLink")],1)])]),t._v(" "),v("h2",{attrs:{id:"_2-抽象语法树用途"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_2-抽象语法树用途"}},[t._v("#")]),t._v(" 2. 抽象语法树用途")]),t._v(" "),v("ul",[v("li",[v("p",[t._v("代码语法的检查、代码风格的检查、代码的格式化、代码的高亮、代码错误提示、代码自动补全等等")]),t._v(" "),v("ul",[v("li",[t._v("如 JSLint、JSHint 对代码错误或风格的检查，发现一些潜在的错误")]),t._v(" "),v("li",[t._v("IDE 的错误提示、格式化、高亮、自动补全等等")])])]),t._v(" "),v("li",[v("p",[t._v("代码混淆压缩")])]),t._v(" "),v("li",[v("p",[t._v("UglifyJS2 等")])]),t._v(" "),v("li",[v("p",[t._v("优化变更代码，改变代码结构使达到想要的结构")]),t._v(" "),v("ul",[v("li",[t._v("代码打包工具 webpack、rollup 等等")]),t._v(" "),v("li",[t._v("CommonJS、AMD、CMD、UMD 等代码规范之间的转化")]),t._v(" "),v("li",[t._v("CoffeeScript、TypeScript、JSX 等转化为原生 Javascript")])])])]),t._v(" "),v("h2",{attrs:{id:"_3-抽象语法树定义"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_3-抽象语法树定义"}},[t._v("#")]),t._v(" 3. 抽象语法树定义")]),t._v(" "),v("p",[t._v("这些工具的原理都是通过 JavaScript Parser 把代码转化为一颗抽象语法树（AST），这颗树定义了代码的结构，通过操纵这颗树，我们可以精准的定位到声明语句、赋值语句、运算语句等等，实现对代码的分析、优化、变更等操作")]),t._v(" "),v("blockquote",[v("p",[t._v("在计算机科学中，抽象语法树（abstract syntax tree 或者缩写为 AST），或者语法树（syntax tree），是源代码的抽象语法结构的树状表现形式，这里特指编程语言的源代码。"),v("br"),t._v("\nJavascript 的语法是为了给开发者更好的编程而设计的，但是不适合程序的理解。所以需要转化为 AST 来使之更适合程序分析，浏览器编译器一般会把源码转化为 AST 来进行进一步的分析等其他操作。")])]),t._v(" "),v("p",[v("img",{attrs:{src:r(359),alt:"ast1"}})]),t._v(" "),v("h2",{attrs:{id:"_4-javascript-parser"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_4-javascript-parser"}},[t._v("#")]),t._v(" 4. JavaScript Parser")]),t._v(" "),v("ul",[v("li",[t._v("JavaScript Parser 是把 JavaScript 源码转化为抽象语法树的解析器。")]),t._v(" "),v("li",[t._v("浏览器会把 JavaScript 源码通过解析器转为抽象语法树,再进一步转化为字节码或直接生成机器码。")]),t._v(" "),v("li",[t._v("一般来说每个 JavaScript 引擎都会有自己的抽象语法树格式，Chrome 的 v8 引擎，firefox 的 SpiderMonkey 引擎等等，MDN 提供了详细 SpiderMonkey AST format 的详细说明，算是业界的标准。")])]),t._v(" "),v("p",[t._v("常用的 JavaScript Parser")]),t._v(" "),v("ul",[v("li",[t._v("esprima")]),t._v(" "),v("li",[t._v("traceur")]),t._v(" "),v("li",[t._v("acorn (webpack 内部解析 AST 使用的)")]),t._v(" "),v("li",[t._v("shift")])]),t._v(" "),v("h2",{attrs:{id:"ast-遍历"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#ast-遍历"}},[t._v("#")]),t._v(" AST 遍历")]),t._v(" "),v("ol",[v("li",[t._v("AST 是深度优先遍历")]),t._v(" "),v("li",[t._v("访问者模式 Visitor 对于某个对象或者一组对象，不同的访问者，产生的结果不同，执行操作也不同")]),t._v(" "),v("li",[t._v("Visitor 的对象定义了用于 AST 中获取具体节点的方法")]),t._v(" "),v("li",[t._v("Visitor 上挂载以节点 type 命名的方法，当遍历 AST 的时候，如果匹配上 type，就会执行对应的方法")])])])}),[],!1,null,null,null);a.default=_.exports}}]);