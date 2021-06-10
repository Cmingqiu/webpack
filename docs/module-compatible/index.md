---
# 搜索标签
tags:
  - webpack
  - commonJS
  - ES Module
---

webpack 自己实现了一套 common JS 规范，也会解析 ES Module，将其转化为 common JS。

## commonJS 转 commonJS

index.js

```js
let title = require('./title');
console.log(title.name);
console.log(title.age);
```

title.js

```js
exports.name = 'title_name';
exports.age = 'title_age';
```

main.js

```js
(() => {
  var modules = {
    './src/title.js': (module, exports) => {
      exports.name = 'title_name';
      exports.age = 'title_age';
    }
  };
  var cache = {};
  function require(moduleId) {
    if (cache[moduleId]) {
      return cache[moduleId].exports;
    }
    var module = (cache[moduleId] = {
      exports: {}
    });
    modules[moduleId](module, module.exports, require);
    return module.exports;
  }
  (() => {
    let title = require('./src/title.js');
    console.log(title.name);
    console.log(title.age);
  })();
})();
```

## commonJS 转 ES Module

index.js

```js
let title = require('./title');
console.log(title);
console.log(title.age);
```

title.js

```js
export default 'title_name';
export const age = 'title_age';
```

main.js

```js
(() => {
  var modules = {
    './src/title.js': (module, exports, require) => {
      require.renderEsModule(exports);
      require.defineProperties(exports, {
        default: () => DEFAULT_EXPORT,
        age: () => age
      });
      const DEFAULT_EXPORT = 'title_name';
      const age = 'title_age';
    }
  };
  var cache = {};
  function require(moduleId) {
    if (cache[moduleId]) {
      return cache[moduleId].exports;
    }
    var module = (cache[moduleId] = {
      exports: {}
    });
    modules[moduleId](module, module.exports, require);
    return module.exports;
  }
  require.defineProperties = (exports, definition) => {
    for (var key in definition) {
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: definition[key]
      });
    }
  };
  require.renderEsModule = (exports) => {
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    Object.defineProperty(exports, '__esModule', { value: true });
  };
  (() => {
    let title = require('./src/title.js');
    console.log(title);
    console.log(title.age);
  })();
})();
```

## ES Module 转 ES Module

index.js

```js
import name, { age } from './title';
console.log(name);
console.log(age);
```

title.js

```js
export default name = 'title_name';
export const age = 'title_age';
```

main.js

```js
(() => {
  var modules = {
    './src/index.js': (module, exports, require) => {
      require.renderEsModule(exports);
      var title = require('./src/title.js');
      console.log(title.default);
      console.log(title.age);
    },
    './src/title.js': (module, exports, require) => {
      require.renderEsModule(exports);
      require.defineProperties(exports, {
        default: () => DEFAULT_EXPORT,
        age: () => age
      });
      const DEFAULT_EXPORT = (name = 'title_name');
      const age = 'title_age';
    }
  };
  var cache = {};
  function require(moduleId) {
    if (cache[moduleId]) {
      return cache[moduleId].exports;
    }
    var module = (cache[moduleId] = {
      exports: {}
    });
    modules[moduleId](module, module.exports, require);
    return module.exports;
  }
  require.defineProperties = (exports, definition) => {
    for (var key in definition) {
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: definition[key]
      });
    }
  };
  require.renderEsModule = (exports) => {
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    Object.defineProperty(exports, '__esModule', { value: true });
  };
  require('./src/index.js');
})();
```

## ES Module 转 commonJS

index.js

```js
import name, { age } from './title';
console.log(name);
console.log(age);
```

title.js

```js
module.exports = {
  name: 'title_name',
  age: 'title_age'
};
```

main.js

```js
(() => {
  var modules = {
    './src/index.js': (module, exports, require) => {
      require.renderEsModule(exports);
      var title = require('./src/title.js');
      var title_default = require.n(title);
      console.log(title_default());
      console.log(title.age);
    },
    './src/title.js': (module) => {
      module.exports = {
        name: 'title_name',
        age: 'title_age'
      };
    }
  };
  var cache = {};
  function require(moduleId) {
    if (cache[moduleId]) {
      return cache[moduleId].exports;
    }
    var module = (cache[moduleId] = {
      exports: {}
    });
    modules[moduleId](module, module.exports, require);
    return module.exports;
  }
  require.n = (module) => {
    var getter =
      module && module.__esModule ? () => module['default'] : () => module;
    return getter;
  };
  require.defineProperties = (exports, definition) => {
    for (var key in definition) {
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: definition[key]
      });
    }
  };
  require.renderEsModule = (exports) => {
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    Object.defineProperty(exports, '__esModule', { value: true });
  };
  require('./src/index.js');
})();
```

## 异步加载(动态加载)

src\index.js

```js
import(/* webpackChunkName: "hello" */ './hello').then((result) => {
  console.log(result.default);
});
```

src\hello.js

```js
export default 'hello';
```

dist\main.js

```js
(() => {
  var modules = {};
  var cache = {};
  function require(moduleId) {
    if (cache[moduleId]) {
      return cache[moduleId].exports;
    }
    var module = (cache[moduleId] = {
      exports: {}
    });
    modules[moduleId](module, module.exports, require);
    return module.exports;
  }
  require.m = modules;
  require.defineProperties = (exports, definition) => {
    for (var key in definition) {
      if (
        require.ownProperty(definition, key) &&
        !require.ownProperty(exports, key)
      ) {
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: definition[key]
        });
      }
    }
  };
  require.find = {};
  require.ensure = (chunkId) => {
    let promises = [];
    require.find.jsonp(chunkId, promises);
    return Promise.all(promises);
  };
  require.unionFileName = (chunkId) => {
    return '' + chunkId + '.main.js';
  };
  require.ownProperty = (obj, prop) =>
    Object.prototype.hasOwnProperty.call(obj, prop);
  require.load = (url) => {
    var script = document.createElement('script');
    script.src = url;
    document.head.appendChild(script);
  };
  require.renderEsModule = (exports) => {
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    }
    Object.defineProperty(exports, '__esModule', { value: true });
  };
  require.publicPath = '';
  var installedChunks = {
    main: 0
  };
  require.find.jsonp = (chunkId, promises) => {
    var promise = new Promise((resolve, reject) => {
      installedChunkData = installedChunks[chunkId] = [resolve, reject];
    });
    promises.push((installedChunkData[2] = promise));
    var url = require.publicPath + require.unionFileName(chunkId);
    require.load(url);
  };
  var webpackJsonpCallback = (data) => {
    var [chunkIds, moreModules] = data;
    var moduleId,
      chunkId,
      i = 0,
      resolves = [];
    for (; i < chunkIds.length; i++) {
      chunkId = chunkIds[i];
      resolves.push(installedChunks[chunkId][0]);
      installedChunks[chunkId] = 0;
    }
    for (moduleId in moreModules) {
      require.m[moduleId] = moreModules[moduleId];
    }
    while (resolves.length) {
      resolves.shift()();
    }
  };
  var chunkLoadingGlobal = (window['webpack5'] = window['webpack5'] || []);
  chunkLoadingGlobal.push = webpackJsonpCallback;
  require
    .ensure('hello')
    .then(require.bind(require, './src/hello.js'))
    .then((result) => {
      console.log(result.default);
    });
})();
```

hello.main.js

```js
(window['webpack5'] = window['webpack5'] || []).push([
  ['hello'],
  {
    './src/hello.js': (module, exports, __webpack_require__) => {
      'use strict';
      __webpack_require__.renderEsModule(exports);
      __webpack_require__.defineProperties(exports, {
        default: () => DEFAULT_EXPORT
      });
      const DEFAULT_EXPORT = 'hello';
    }
  }
]);
```
