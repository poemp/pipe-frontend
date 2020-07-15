import UserLayout from '@/layouts/UserLayout';
import Login from '@/pages/Login';
import BasicLayout from '@/layouts/BasicLayout';
import Analysis from '@/pages/Analysis';
import Advanced from '@/pages/Advanced';
import DataSourceList from '@/pages/Datasource/DataSourceList';
import DataSourceAdd from '@/pages/Datasource/DataSourceAdd';
import DataSourceDetail from '@/pages/Datasource/DataSourceDetail';
import TaskEdit from '@/pages/TaskDetail/TaskDetailAdd';
import TaskList from '@/pages/TaskDetail/TaskDetailList';
import TaskDetailHistoryList from '@/pages/TaskDetail/TaskDetailHistoryList';

const routerConfig = [
  {
    path: '/user',
    component: UserLayout,
    children: [
      {
        path: '/login',
        component: Login,
      },
      {
        path: '/',
        redirect: '/user/login',
      },
    ],
  },
  {
    path: '/',
    component: BasicLayout,
    children: [
      {
        path: '/dashboard/analysis',
        component: Analysis,
      },
      {
        path: '/detail/advanced',
        component: Advanced,
      },
      {
        path: '/datasource/datasource-list',
        component: DataSourceList,
      },
      {
        path: '/datasource/dataSourceAdd',
        component: DataSourceAdd,
      },
      {
        path: '/datasource/dataSourceDetail',
        component: DataSourceDetail,
      },
      {
        path: '/task/task-list',
        component: TaskList,
      },
      {
        path: '/task/task-add',
        component: TaskEdit,
      },
      {
        path: '/task/task-history',
        component: TaskDetailHistoryList,
      },
      {
        path: '/',
        redirect: '/dashboard/analysis',
      },
    ],
  },
];
export default routerConfig;
