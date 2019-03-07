/* eslint-disable */
import packageJson from '../../package.json';
import components from '../../example/config';
const { version } = packageJson;

export default {
  header: {
    logo: {
      version,
      image: 'https://images2.bestjlb.com/v2jlboss4530891a9add14a2fb1ddf906b7fe37215514534330452825.png',
      title: 'jview-weapp',
      href: '#/'
    },
    nav: {
      '小程序组件': 'https://youzan.github.io/jview-weapp/',
      github: 'https://github.com/Pasoul/jview-weapp'
    }
  },
  nav: [
    {
      name: '开发指南',
      groups: [
        {
          list: [
            {
              path: '/intro',
              title: '介绍',
              md: true
            },
            {
              path: '/quickstart',
              title: '快速上手',
              md: true
            },
            {
              path: '/changelog',
              title: '更新日志',
              md: true
            },
            {
              path: '/common',
              title: '内置样式',
              md: true
            }
          ]
        }
      ]
    },
    {
      name: '组件',
      groups: components
    }
  ]
};
