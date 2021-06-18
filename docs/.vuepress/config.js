const path = require('path')
module.exports = {
  base: '/webpack/',
  dest: 'dist',
  title: 'Cmq Webpack',
  description: "Cmq's Webpack",
  markdown: {
    lineNumbers: true
  },
  //额外的需要被注入到当前页面的 HTML <head> 中的标签, 例如 favicon
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/icons/icon.svg'
      }
    ]
  ],
  themeConfig: {
    logo: '/logo.jpg', //导航logo
    repo: 'Cmingqiu/webpack', //导航上的github链接
    docsDir: 'docs',
    // docsRepo: '',
    lastUpdated: '上次更新:',
    editLinks: true,
    editLinkText: '在 GitHub 上编辑此页',
    smoothScroll: true,
    sidebarDepth: 2, // 默认值是 1   最大值是2：同时提取 h2 和 h3 标题
    // displayAllHeaders: true, //显示所有页面的标题链接,不建议设置true  默认值：false
    //导航链接
    nav: [
      { text: 'Node', link: 'https://cmingqiu.github.io/node/start/', target: '_self' },
      { text: 'Blog', link: 'https://cmingqiu.github.io/blog/start/', target: '_self' },
      // { text: 'Guide', link: '/guide/' },
      // { text: 'Google', link: 'https://google.com' },
      {
        text: '语言',
        items: [
          {
            text: '中文',
            link: 'https://www.baidu.com'
          },
          {
            text: 'English',
            link: 'https://google.com'
          }
        ]
      }
    ],
    //简单例子
    //sidebar: ['/', 'basic/button', ['form/input', '表单']]
    sidebar: [
      ['start/', '起步'],
      {
        title: '基础配置(使用)',
        children: [
          ['baseConfig/webpack.base.js', 'webpack.base.js'],
          ['baseConfig/webpack.dev.js', 'webpack.dev.js'],
          ['baseConfig/webpack.prod.js', 'webpack.prod.js'],
        ]
      },
      ['module-compatible/', '模块兼容'],
      {
        title: 'AST抽象语法树',
        children: [
          ['AST/start', '基础知识'],
          ['AST/esprima', 'esprima'],
          ['AST/babel插件', 'babel插件'],
        ]
      },
      ['webpack-flow/', 'webpack工作流']
      // ['loader/', 'loader']
      // ['plugin/', 'plugin']
    ]
  },
  /*  scss: {
     includePaths: ["./styles/index.scss"]
   }, */
  configureWebpack: {
    resolve: {
      alias: {
        '@public': path.resolve(__dirname, './public')
      }
    }
  },
  /* chainWebpack: (config, isServer) => {
    config.resolveLoader
      .modules
      .add(path.resolve(__dirname, './node_modules'))
  } */
};
