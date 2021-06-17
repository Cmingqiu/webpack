:::tip 目录结构

    ├── config
    │ ├── webpack.base.js
    │ ├── webpack.dev.js
    │ └── webpack.prod.js
    ├── public
    │ ├── index.html
    │ └── favicon.ico
    ├── src
    │ └── index.js
    └── package.json

:::

通过 merge 合并配置项
webpack 打包配置文件

- webpack.config.js 通用配置文件
- webpack.dev.js 开发使用的配置文件
- webpack.prod.js 打包上线使用的配置文件

### 安装

```js
cnpm install
  webpack webpack-cli webpack-dev-server
  html-webpack-plugin clean-webpack-plugin

  babel-loader @babel/core @babel/preset-env
  style-loader css-loader sass-loader node-sass mini-css-extract-plugin optimize-css-assets-webpack-plugin postcss-loader
  vue-loader vue-template-compiler //vue2.x ; vue3.x : @vue/compiler-sfc
  file-loader url-loader
  eslint eslint-loader babel-eslint
  html-loader
-D

```

```js
const path = require('path');
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin'); //vue-laoder需要配合VueLoaderPlugin
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); //在每次构建前清理构建文件夹 dist

const resolve = (pathname) => path.resolve(__dirname, pathname);

module.exports = {
  entry: '../src/index.js',
  output: {
    path: resolve('../dist'),
    filename: '[name]_[chunkhash:5].js'
  },
  resolve: {
    alias: {
      '@': resolve('../src')
    },
    //配置了extensions就可以不用写文件后缀
    //当找不到模块时， 优先查找.js文件，没有在查找.vue模块
    //如果不合理配置，就会影响到打包速度,配置过多就会导致扫描多次数增加，进而影响打包速度。
    extensions: ['.js', '.json', '.vue', 'scss'],
    modules: [resolve('../node_modules')]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: '../src/public/index.html', //指定模板文件
      filename: 'index.html', //模板文件的名称
      title: 'html title信息内容,可配合htmlWebpackPlugin.options.title使用',
      hash: true, //根据文件生成hash码  防止浏览器缓存文件
      minify: {
        //压缩html
        removeAttributeQuotes: true, //去除属性的双引号
        collapseWhitespace: true, //去除空格、换行
        collapseBooleanAttributes: true,
        removeComments: true // 去掉注释
      }
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*']
    }),
    new VueLoaderPlugin() //和vue-loader配合使用
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        loader: 'eslint-loader',
        enforce: 'pre', //区分loader，默认normal
        options: {
          fix: true
        },
        exclude: /node_modules/
      },
      {
        test: /\.jsx?$/,
        //exclude的优先级比include的高
        exclude: /node_modules/,
        include: path.resolve(__dirname, '../src'),
        use: {
          loader: 'babel-loader', //处理es6语法
          options: {
            //ES5语法很多，避免写多个插件，配置预设
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'usage' //无需手工引入@babel/polyfill，按需多次局部引入
                  // 'entry' 需手工引入一次@babglobalel/polyfill，挂载到上,污染全局变量
                  // false  全量引入@babel/polyfill 默认值
                }
              ],
              {
                targets: { chrome: '67' },
                useBuiltIns: 'usage'
              }
            ]
          }
        }
      },
      //  用file-loader url-loader来处理图片  url-loader依赖file-loader
      //  base64编码小图片(大图片不适合base64编码，会使图片变大原来的1/3)
      //  name 输出的文件名,打包文件名
      //  publicPath 打包的公共路径(ps:默认是在output.path下面)
      //  outputPath 表示输出文件路径前缀,打包的文件放在img文件夹内。
      // 比如默认打包出来是在 dist/1.img。设置outputPath就是dist/img/1.jpg
      //其中limit 属性可以指定需要被base64编码的图片，单位为byte，
      // 此例中表示大小不大于10kb的图片将会被base64编码，并返回一个DataURL
      //当你图片大小小于这个限制的时候，会自动启用base64编码图片
      //   # 路径：build / webpack.base.conf.js
      //     # url - loader加载器定义
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 1024 * 10, //设为0表示不用base64编码图片
          name: 'img/[name].[ext]',
          //outputPath和publicPath一起使用；或者name配置'/images/[name].[ext]'
          outputPath: 'images', //指定输出目录 /dist/img
          //解决css中的背景图片路径问题
          // "/"是url地址的根路径
          publicPath: '/images',
          //关闭url-loader默认的es6模块化
          //(因为解析时出现[object Module]问题)，使用commonJs解析
          esModule: false //是否包装成ES5模块
        }
      },
      //处理html中的img标签引入图片 使用commonJs规范
      {
        test: /\.html$/i,
        loader: 'html-loader'
      },
      {
        //处理字体
        test: /\.(woff2?|svg|eot|ttf|otf)$/i,
        include: [path.resolve(__dirname, '../src/')],
        loader: 'url-loader'
      },
      {
        test: /\.vue$/i,
        use: 'vue-loader'
      }
    ]
  }
};
```
