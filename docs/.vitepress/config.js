export default {
  base: '/webpack/',
  dest: 'dist',
  title: 'Cmq Webpack',
  description: "Cmq's Webpack Learn",
  appearance: true,
  markdown: {
    lineNumbers: true
  },
  //额外的需要被注入到当前页面的 HTML <head> 中的标签, 例如 favicon
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/webpack/icons/favicon.ico'
      }
    ]
  ],
  themeConfig: {
    logo: '/logo.jpg', //导航logo
    docsDir: 'docs',
    // docsRepo: '',
    // lastUpdated: '上次更新:',
    // editLink: {
    //   text:'在 GitHub 上编辑此页',
    //   pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path'
    // },
    // algolia: {
    //   apiKey: 'your_api_key',
    //   indexName: 'index_name'
    // },
    // carbonAds: {
    //   code: 'your-carbon-code',
    //   placement: 'your-carbon-placement'
    // },
    //导航链接
    nav: [
      /* {
        text: 'Node',
        link: 'https://cmingqiu.github.io/node/start/',
        target: '_self'
      }, */
      {
        text: 'Blog',
        link: 'https://cmingqiu.github.io/blog/start/',
        target: '_self'
      },
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
    sidebar: [
      { text: '开始', items: [{ text: '起步', link: '/start/' }] },
      {
        text: '基础配置(使用)',
        collapsible: true,
        collapsed: false,
        items: [
          { text: 'webpack.base.js', link: '/baseConfig/webpack.base.js' },
          { text: 'webpack.dev.js', link: '/baseConfig/webpack.dev.js' },
          { text: 'webpack.prod.js', link: '/baseConfig/webpack.prod.js' }
        ]
      },
      { items: [{ text: '模块兼容', link: 'module-compatible/' }] },
      {
        text: 'AST抽象语法树',
        collapsible: true,
        collapsed: false,
        items: [
          { text: '基础知识', link: 'AST/start' },
          { text: 'esprima', link: 'AST/esprima' },
          { text: 'babel插件', link: 'AST/babel插件' }
        ]
      },
      { items: [{ text: 'webpack工作流', link: 'webpack-flow/' }] },
      { items: [{ text: 'loader', link: 'loader/' }] },
      { items: [{ text: 'plugin', link: 'plugin/' }] }
    ],
    footer: {
      message: 'MIT Licensed',
      copyright: 'Copyright © 2021-present Chenmq'
    }
  }
  /*  scss: {
     includePaths: ["./styles/index.scss"]
   }, */
};
