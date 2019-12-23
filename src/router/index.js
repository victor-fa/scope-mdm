import Router from 'vue-router'
// const _import = require('./_import_' + process.env.NODE_ENV)

/**
* hidden: true                   if `hidden:true` will not show in the mean(default is false)
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    meanimg 'img'                 the img show in the mean
    bgcolor  'background-color'   the bgcolor show in the meanButtom div background-color
    roles:[1]  'roles'            the must []
    1：公有云系统管理员
    2：私有云系统管理员
    3：学生
    4：老师
    5：家长
    6：市场专员
    7：内容专员
    8：管控专员
    9: 校长
    10:审核员
  }
**/
export const constantRouterMap = [
  {
    path: '/',
    redirect: '/login',
    hidden: true
  },
  {
    path: '/login',
    name: 'Login',
    hidden: true,
    component: () => import('@/views/login/Login.vue')
    // component: resolve => require(['../components/common/Home.vue'], resolve)
    // component: resolve => require(['../views/ParentsManagement/ParentsBindStudents.vue'], resolve)
    // component: resolve => require(['../components/HelloWorld.vue'], resolve)
    // component: resolve => require(['../views/PublicCloud/HeadMastersManagement.vue'], resolve)
  },
  {
    path: '/lock',
    hidden: true,
    name: 'Lockscreen',
    component: resolve => require(['../views/common/lock/index.vue'], resolve)
  },
  {
    path: '/resetPassword/:token',
    name: 'FindPassword',
    hidden: true,
    component: resolve => require(['../views/login/RetrievePassword.vue'], resolve)
  },
  {
    path: '/ParentsBindStudents/:token',
    name: 'ConnectChildren',
    hidden: true,
    component: resolve => require(['../views/ParentsManagement/ParentsBindStudents.vue'], resolve)
  },
  {
    path: '/headMastersManagement',
    name: 'President',
    hidden: true,
    component: resolve => require(['../views/HeadMastersManagement/HeadMastersManagement.vue'], resolve)

  },
  {
    path: '/home',
    meta: {
      title: 'home',
      roles: [1]
    },
    hidden: true,
    component: resolve => require(['../components/common/Home.vue'], resolve)
  }
]
export default new Router({
  // mode: 'history',
  routes: constantRouterMap
})
// 异步挂载的路由
// 动态需要根据权限加载的路由表
export const asyncRouterMap = [
  // 公有云路由
  {
    path: '/device-management',
    meta: {
      title: 'Devices',
      roles: [1, 8],
      bgcolor: 'bg-device',
      meanimg: require('@/assets/images/home/mean-device.png')
    },
    component: resolve => require(['../components/common/Home.vue'], resolve),
    children: [
      {
        name: 'Devices',
        path: '/device-management',
        meta: {
          title: 'device-management', roles: [1, 8]
        },
        component: () => import('@/views/PublicCloud/DeviceManagement')
      }
    ]
  },

  {
    path: '/content-management',
    meta: {
      title: 'FilesApps',
      roles: [1, 2, 7],
      bgcolor: 'bg-content',
      meanimg: require('@/assets/images/home/mean-content.png')
    },
    component: resolve => require(['../components/common/Home.vue'], resolve),
    children: [
      {
        name: 'FilesApps',
        path: '/content-management',
        meta: {
          title: 'content-management', roles: [1, 2, 7]
        },
        component: () => import('@/views/PublicCloud/ContentManagement')
        // component: _import('PublicCloud/ContentManagement')
      }
    ]
  },

  {
    path: '/behavior-management',
    meta: {
      title: 'Control',
      roles: [1, 8],
      bgcolor: 'bg-behavior',
      meanimg: require('@/assets/images/home/mean-behavior.png')
    },
    component: resolve => require(['../components/common/Home.vue'], resolve),
    children: [
      {
        name: 'Control',
        path: '/behavior-management',
        meta: {
          title: 'behavior-management', roles: [1, 2, 4, 5, 8]
        },
        component: () => import('@/views/PublicCloud/BehaviorManagement')
        // component: _import('PublicCloud/BehaviorManagement')
      }
    ]
  },

  {
    path: '/behavior-privatemanagement',
    meta: {
      title: 'Control',
      roles: [2],
      bgcolor: 'bg-behavior',
      meanimg: require('@/assets/images/home/mean-behavior.png')
    },
    component: resolve => require(['../components/common/Home.vue'], resolve),
    children: [
      {
        name: 'Control',
        path: '/behavior-privatemanagement',
        meta: {
          title: 'behavior-privatemanagement', roles: [1, 2, 4, 5]
        },
        component: () => import('@/views/PublicCloud/BehaviorPrivateManagement')
        // component: _import('PublicCloud/BehaviorPrivateManagement')
      }
    ]
  },

  {
    path: '/push-management',
    meta: {
      title: 'PushFile',
      roles: [1, 2, 4],
      bgcolor: 'bg-push',
      meanimg: require('@/assets/images/home/mean-push.png')
    },
    component: resolve => require(['../components/common/Home.vue'], resolve),
    children: [
      {
        name: 'PushFile',
        path: '/push-management',
        meta: {
          title: 'push-management', roles: [1, 2, 4]
        },
        component: () => import('@/views/PublicCloud/PushManagement')
        // component: _import('PublicCloud/PushManagement')
      }
    ]
  },

  {
    path: '/user-management',
    meta: {
      title: 'Users',
      roles: [1, 2, 6],
      bgcolor: 'bg-user',
      meanimg: require('@/assets/images/home/mean-user.png')
    },
    component: resolve => require(['../components/common/Home.vue'], resolve),
    children: [
      {
        name: 'Users',
        path: '/user-management',
        meta: {
          title: 'user-management', roles: [1, 2, 6]
        },
        component: () => import('@/views/PublicCloud/UserManagement')
        // component: _import('PublicCloud/UserManagement')
      }
    ]
  },
  {
    path: '/client-management',
    meta: {
      title: 'Subsidiaries',
      roles: [1, 6],
      bgcolor: 'bg-client',
      meanimg: require('@/assets/images/home/mean-client.png')
    },
    component: resolve => require(['../components/common/Home.vue'], resolve),
    children: [
      {
        name: 'Subsidiaries',
        path: '/',
        meta: {
          title: 'client-management', roles: [1, 6, 10]
        },
        component: () => import('@/views/PublicCloud/ClientManagement')
        // component: _import('PublicCloud/ClientManagement')
      }
    ]
  },

  {
    path: '/Tbehavior-management',
    meta: {
      title: 'Control',
      roles: [4],
      bgcolor: 'bg-behavior',
      meanimg: require('@/assets/images/home/mean-behavior.png')
    },
    component: resolve => require(['../components/common/Home.vue'], resolve),
    children: [
      {
        name: 'Control',
        path: '/Tbehavior-management',
        meta: {
          title: 'Tbehavior-management', roles: [4]
        },
        component: () => import('@/views/Teacher/TbehaviorManagement')
        // component: _import('Teacher/TbehaviorManagement')
      }
    ]
  },

  {
    path: '/check-management',
    meta: {
      title: 'Authorize',
      roles: [1, 2, 10],
      bgcolor: 'bg-check',
      meanimg: require('@/assets/images/home/mean-check.png')
    },
    component: resolve => require(['../components/common/Home.vue'], resolve),
    children: [
      {
        name: 'Authorize',
        path: '/check-management',
        meta: {
          title: 'check-management', roles: [1, 2, 10]
        },
        component: () => import('@/views/PublicCloud/CheckManagement')
        // component: _import('PublicCloud/CheckManagement')
      }
    ]
  },

  {
    path: '/system-management',
    meta: {
      title: 'System',
      roles: [1, 2],
      bgcolor: 'bg-system',
      meanimg: require('@/assets/images/home/mean-system.png')
    },
    component: resolve => require(['../components/common/Home.vue'], resolve),
    children: [
      {
        name: 'System',
        path: '/system-management',
        meta: {
          title: 'system-management', roles: [1, 2]
        },
        component: () => import('@/views/PublicCloud/SystemManagement')
        // component: _import('PublicCloud/SystemManagement')
      }
    ]
  },
  // 导入老师页面
  {
    path: '/uploadExcelTeacher',
    hidden: true,
    component: resolve => require(['../components/common/Home.vue'], resolve),
    children: [
      {
        name: 'uploadExcelTeacher',
        path: '/uploadExcelTeacher',
        component: () => import('@/views/PublicCloud/Item-System/uploadExcelTeacher')
        // component: _import('PublicCloud/Item-System/uploadExcelTeacher')
      }
    ]
  },
  // 家长
  // {
  //   path: '/report-failed',
  //   meta: {
  //     title: 'Reports',
  //     roles: [5],
  //     bgcolor: 'bg-content',
  //     meanimg: require('@/assets/images/home/mean-home-report.png')
  //   },
  //   component: resolve => require(['../components/common/Home.vue'], resolve),
  //   children: [
  //     {
  //       name: 'Reports',
  //       path: '/Report-Failed',
  //       meta: {
  //         title: '/report-management', roles: []
  //       },
  //       component: () => import('@/views/ParentsManagement/ReportFailed')
  //       // component: _import('ParentsManagement/ReportFailed')
  //     }
  //   ]
  // },
  // 统计报表
  // {
  //   path: '/Statistics-Failed',
  //   meta: {
  //     title: 'Statistics',
  //     roles: [5],
  //     bgcolor: 'bg-content',
  //     meanimg: require('@/assets/images/home/mean-home-report.png')
  //   },
  //   component: resolve => require(['../components/common/Home.vue'], resolve),
  //   children: [
  //     {
  //       name: '/Statistics-Failed',
  //       path: '/Statistics-Failed',
  //       meta: {
  //         title: '/report-management', roles: [5]
  //       },
  //       component: _import('ParentsManagement/StatisticsFailed')
  //     }
  //   ]
  // },

  {
    path: '/Parents-BehaviorManagement',
    meta: {
      title: 'Control',
      roles: [5],
      bgcolor: 'bg-behavior',
      meanimg: require('@/assets/images/home/mean-behavior.png')
    },
    component: resolve => require(['../components/common/Home.vue'], resolve),
    children: [
      {
        name: 'Control',
        path: '/Parents-BehaviorManagement',
        meta: {
          title: '/report-management', roles: [5]
        },
        component: () => import('@/views/ParentsManagement/ParentsBehaviorManagement')
        // component: _import('ParentsManagement/ParentsBehaviorManagement')
      }
    ]
  },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '*', redirect: '/404', hidden: true }
]
