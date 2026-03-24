import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      // 首页仪表盘
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'HomeFilled' }
      },
      // 基础数据管理
      {
        path: 'basic',
        name: 'Basic',
        redirect: '/basic/assets',
        meta: { title: '基础数据管理', icon: 'FolderOpened' },
        children: [
          {
            path: 'assets',
            name: 'AssetManagement',
            component: () => import('@/views/basic/assets/index.vue'),
            meta: { title: '资产台账管理' }
          },
          {
            path: 'tenants',
            name: 'TenantManagement',
            component: () => import('@/views/basic/tenants/index.vue'),
            meta: { title: '租户档案管理' }
          },
          {
            path: 'dictionary',
            name: 'Dictionary',
            component: () => import('@/views/basic/dictionary/index.vue'),
            meta: { title: '基础字典管理' }
          }
        ]
      },
      // 资产租赁管理
      {
        path: 'lease',
        name: 'Lease',
        redirect: '/lease/contracts',
        meta: { title: '资产租赁管理', icon: 'Document' },
        children: [
          {
            path: 'ledger',
            name: 'LeaseLedger',
            component: () => import('@/views/lease/ledger/index.vue'),
            meta: { title: '租赁台账' }
          },
          {
            path: 'contracts',
            name: 'ContractManagement',
            component: () => import('@/views/lease/contracts/index.vue'),
            meta: { title: '租赁合同管理' }
          },
          {
            path: 'rent',
            name: 'RentManagement',
            component: () => import('@/views/lease/rent/index.vue'),
            meta: { title: '租金收缴管理' }
          },
          {
            path: 'renewal',
            name: 'RenewalManagement',
            component: () => import('@/views/lease/renewal/index.vue'),
            meta: { title: '续约与退租管理' }
          }
        ]
      },
      // 园区运营管理
      {
        path: 'park',
        name: 'Park',
        redirect: '/park/daily',
        meta: { title: '园区运营管理', icon: 'OfficeBuilding' },
        children: [
          {
            path: 'daily',
            name: 'DailyManagement',
            component: () => import('@/views/park/daily/index.vue'),
            meta: { title: '园区日常管理' }
          },
          {
            path: 'repair',
            name: 'RepairManagement',
            component: () => import('@/views/park/repair/index.vue'),
            meta: { title: '设施报修管理' }
          },
          {
            path: 'inspection',
            name: 'InspectionManagement',
            component: () => import('@/views/park/inspection/index.vue'),
            meta: { title: '园区巡检管理' }
          },
          {
            path: 'service',
            name: 'ServiceManagement',
            component: () => import('@/views/park/service/index.vue'),
            meta: { title: '租户服务管理' }
          }
        ]
      },
      // 企业孵化平台
      {
        path: 'incubation',
        name: 'Incubation',
        redirect: '/incubation/admission',
        meta: { title: '企业孵化平台', icon: 'TrendCharts' },
        children: [
          {
            path: 'admission',
            name: 'AdmissionManagement',
            component: () => import('@/views/incubation/admission/index.vue'),
            meta: { title: '入驻管理' }
          },
          {
            path: 'service',
            name: 'IncubationService',
            component: () => import('@/views/incubation/service/index.vue'),
            meta: { title: '孵化服务管理' }
          },
          {
            path: 'graduation',
            name: 'GraduationManagement',
            component: () => import('@/views/incubation/graduation/index.vue'),
            meta: { title: '毕业与退出管理' }
          }
        ]
      },
      // 数据分析
      {
        path: 'analysis',
        name: 'Analysis',
        redirect: '/analysis/overview',
        meta: { title: '数据分析', icon: 'DataAnalysis' },
        children: [
          {
            path: 'overview',
            name: 'AnalysisOverview',
            component: () => import('@/views/analysis/overview/index.vue'),
            meta: { title: '数据概览' }
          },
          {
            path: 'reports',
            name: 'Reports',
            component: () => import('@/views/analysis/reports/index.vue'),
            meta: { title: '报表中心' }
          }
        ]
      },
      // 系统管理
      {
        path: 'system',
        name: 'System',
        redirect: '/system/users',
        meta: { title: '系统管理', icon: 'Setting' },
        children: [
          {
            path: 'users',
            name: 'UserManagement',
            component: () => import('@/views/system/users/index.vue'),
            meta: { title: '用户管理' }
          },
          {
            path: 'roles',
            name: 'RoleManagement',
            component: () => import('@/views/system/roles/index.vue'),
            meta: { title: '角色权限管理' }
          },
          {
            path: 'logs',
            name: 'LogManagement',
            component: () => import('@/views/system/logs/index.vue'),
            meta: { title: '操作日志' }
          },
          {
            path: 'backup',
            name: 'BackupManagement',
            component: () => import('@/views/system/backup/index.vue'),
            meta: { title: '数据备份' }
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

const LOGIN_PATH = '/login'

// 路由守卫：未登录仅可访问登录页
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 福田产投信息化系统` : '福田产投信息化系统'
  const token = localStorage.getItem('token')
  if (to.path === LOGIN_PATH) {
    if (token) {
      next({ path: '/dashboard', replace: true })
    } else {
      next()
    }
    return
  }
  if (!token) {
    next({ path: LOGIN_PATH, query: { redirect: to.fullPath }, replace: true })
    return
  }
  next()
})

export default router

