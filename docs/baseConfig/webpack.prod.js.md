```js
const { merge } = require('webpack-merge'); //合并
//通过link标签引入css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 压缩css
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const baseConfig = require('./webpack.base.js');

module.exports = merge(baseConfig, {
  mode: 'production',
  devtool: 'hidden-source-map',
  plugins: [
    new MiniCssExtractPlugin({
      //自定义命名，剥离出单独css文件的名称，通过入口文件index.js引入
      filename: 'style/[name].[contenthash:8].css',
      chunkFilename: 'style/[name].[contenthash:8].css'
    }),
    //压缩css  mini-css-extract-plugin结合optimize-css-assets-webpack-plugin使用
    new OptimizeCSSAssetsPlugin({})
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, //配合MiniCssExtractPlugin插件
          'css-loader', //先处理css语法  如@import / url() require('./index.css')
          'postcss-loader' //兼容css3写法，添加浏览器前缀
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader', //兼容css3写法，添加浏览器前缀
          'less-loader' //处理less
        ]
      },
      {
        test: /\.s(a|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader', //兼容css3写法，添加浏览器前缀
          'sass-loader'
        ]
      }
    ]
  }
});
```
