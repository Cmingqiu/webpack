const { SyncHook } = require('tapable');
const types = require('babel-types');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const path = require('path');
const fs = require('fs');

const toUnixPath = p => p.replace(/\\/g, path.posix.sep);
const baseDir = toUnixPath(process.cwd());

class Compiler {
  constructor(options) {
    this.options = options;
    this.hooks = {
      //钩子
      run: new SyncHook(),
      emit: new SyncHook(),
      done: new SyncHook()
    };
    this.modules = []; //所有模块集合  webpack5改为Set数据结构，之前是数组
    this.chunks = [];
    this.assets = {};
    this.files = [];
  }
  run() {
    this.hooks.run.call();
    // 编译阶段

    // 5.从配置文件中找到entry入口文件
    // 6.调用所有配置的loader进行编译
    // entry格式化成一个对象，如果配置的是但入口（字符串）就是属性为main的对象
    let entries = {},
      entry = this.options.entry;
    if (typeof entry === 'string') entries['main'] = entry;
    else entries = entry;
    for (let entryName in entries) {
      //entryName :main / page1 / page2
      // 将入口路径entryPath转成绝对路径
      let entryPath = entries[entryName];
      entryPath = path.posix.join(baseDir, entryPath);
      const entryModule = this.buildModule(entryName, entryPath);
      // 8.根据入口和依赖模块的关系，组成一个个包含多个模块的chunk
      const chunk = {
        name: entryName,
        entryModule,
        modules: this.modules.filter(module => module.entryName === entryName)
      };
      this.chunks.push(chunk);
    }
    // 9.把每个chunk转换成一个单独文件，加入资源列表assets中
    const { path: outputPath, filename } = this.options.output;
    this.chunks.forEach(chunk => {
      const ouputDir = (outputPath + '/' + filename).replace(
        '[name]',
        chunk.name
      );
      this.assets[ouputDir] = getSource(chunk);
    });
    this.files = Object.keys(this.assets);
    //写入文件之前触发emit钩子
    this.hooks.emit.call();
    // 10.确定输出内容后，根据配置的文件路径和文件名，把内容写入文件系统
    this.files.forEach(file => {
      fs.writeFileSync(file, this.assets[file]);
    });
    this.hooks.done.call();
  }

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

    let moduleId = getModuleID(modulePath);
    let module = { moduleId, dependencies: [], entryName };

    // 7.找到该模块的依赖模块，递归编译，直到所有模块编译完成
    // 遍历抽象语法树
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
    return module;
  }
}

function tryExtension(depModulePath, extensions, depModuleName, dirPath) {
  for (let i = 0; i < extensions.length; i++) {
    let filePath = depModulePath + extensions[i];
    if (fs.existsSync(filePath)) return filePath;
  }
  throw new Error(` Can't resolve '${depModuleName}' in '${dirPath}'`);
}

// 获取模块id 是相对于根目录的相对路径
function getModuleID(filePath) {
  return './' + path.posix.relative(baseDir, filePath);
}

//chunk:{name,entryModule,modules}
function getSource(chunk) {
  return `
  (() => {
    var modules = ({
      ${chunk.modules
        .map(
          module =>
            `'${module.moduleId}': (module, exports, require) => {
              ${module._source}
            }`
        )
        .join(',\n')}
    });
    var cache = {};
    function require(moduleId) {
      var cachedModule = cache[moduleId];
      if (cachedModule !== undefined) {
        return cachedModule.exports;
      }
      var module = cache[moduleId] = {
        exports: {}
      };
      modules[moduleId](module, module.exports, require);
      return module.exports;
    }

    
    (()=>{
      ${chunk.entryModule._source}
    })()
  })()
 ;
  `;
}

module.exports = Compiler;
