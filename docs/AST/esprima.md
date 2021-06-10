```js
/* 
通过 esprima 把源码转化为AST
通过 estraverse 遍历并更新AST
通过 escodegen 将AST重新生成源码
 */
const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');
/* 修改函数名 */
const sourceCode = `var sum = function( ) {}`;

let ast = esprima.parse(sourceCode);
estraverse.traverse(ast, {
  enter(node) {
    if (node.type === 'Identifier') {
      node.name = 'newSum';
    }
  },
  leave() {}
});

let newCode = escodegen.generate(ast);
```

遍历 AST

```js
let indent = 0;
const padding = () => ' '.repeat(indent);
estraverse.traverse(ast, {
  enter(node) {
    console.log(padding() + node.type + '进入');
    if (node.type === 'FunctionDeclaration') {
      node.id.name = 'newAst';
    }
    indent += 2;
  },
  leave(node) {
    indent -= 2;
    console.log(padding() + node.type + '离开');
  }
});
```

```js
Program进入;
FunctionDeclaration进入;
Identifier进入;
Identifier离开;
BlockStatement进入;
BlockStatement离开;
FunctionDeclaration离开;
Program离开;
```
