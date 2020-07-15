const headerMenuConfig = [];
const asideMenuConfig = [
  {
    name: '数据页面',
    path: '/',
    icon: 'chart-pie',
    children: [
      {
        name: '分析页面',
        path: '/dashboard/analysis',
      }
    ],
  },

  {
    name: '任务管理',
    path: '/task',
    icon: 'chart-pie',
    children: [
      {
        name: '任务列表',
        path: '/task/task-list',
      }
    ],
  },
  {
    name: '数据管理',
    path: '/datasource',
    icon: 'chart-pie',
    children: [
      {
        name: '数据列表',
        path: '/datasource/datasource-list',
      }
    ],
  },
  {
    name: '登录&注册',
    path: '/',
    icon: 'account',
    children: [
      {
        name: '登录',
        path: '/user/login',
      },
      {
        name: '注册',
        path: '/user/register',
      },
    ],
  },
];
export { headerMenuConfig, asideMenuConfig };
