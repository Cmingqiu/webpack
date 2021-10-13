const webpack = require('./webpack')
// const webpack = require('webpack')
const config = require('./webpack.config')

const compiler = webpack(config)
compiler.run()
//4. 执行compiler的run方法，开始编译
/*  compiler.run((err, stats) => {
  console.log(err);
   console.log(stats.toJson(
     {
       assets: true,
       chunks: true,
       modules: true,
       entries: true,
     }
   ));
}) */