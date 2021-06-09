```js
const { merge } = require('webpack-merge'); //合并
const baseConfig = require('./webpack.base.js');

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader', // style-loader 再把css插入head标签中,内部样式<style>..</style>
          'css-loader',
          'postcss-loader' //兼容css3写法，添加浏览器前缀
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader', //兼容css3写法，添加浏览器前缀
          'less-loader' //处理less
        ]
      },
      {
        test: /\.s(a|c)ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader', //兼容css3写法，添加浏览器前缀
          'sass-loader'
        ]
      }
    ]
  },

  devServer: {
    //默认开启项目目录的服务 webpack-dev-server配置好可以自动刷新，不过是整个页面刷新。
    //指定额外的运行服务(静态资源)的路径，可以配置其他的静态文件目录
    //不写contentBase也是运行内存中的/dist/index.html
    contentBase: './dist',
    //contentBase:path.join(__dirname, 'public'),
    host: '127.0.0.1',
    port: 8080,
    progress: true, //进度条 无效
    compress: true, //压缩
    //热更新（页面不刷新的状态下替换代码）前提是 new HotModuleReplacementPlugin()
    hot: true,
    hotOnly: true, //只是用热更新
    open: true, //启动时默认打开浏览器
    proxy: {
      //代理  2种写法
      '/api': 'http://10.20.18.155:8088',
      '/api2': {
        target: 'http://10.20.18.155:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api2': '/'
        },
        onProxyReq: function(proxyReq, req, res) {
          // 实在不知道代理后的路径，可以在这里打印出出来看看
          console.log('原路径：' + req.originalUrl, '代理路径：' + req.path);
        }
      }
    }
  }
});
```
