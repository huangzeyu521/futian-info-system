<template>
  <div class="main-layout">
    <!-- 侧边栏 -->
    <aside class="sidebar" :class="{ collapsed: isCollapsed }">
      <!-- Logo区域 -->
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="8" fill="url(#logoGrad)"/>
              <text x="20" y="27" font-size="18" font-weight="bold" fill="white" text-anchor="middle">福</text>
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40">
                  <stop offset="0%" stop-color="#BF933B"/>
                  <stop offset="100%" stop-color="#D4A94D"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <transition name="fade">
            <div v-if="!isCollapsed" class="logo-text">
              <span class="logo-title">福田产投</span>
              <span class="logo-subtitle">信息化系统</span>
            </div>
          </transition>
        </div>
      </div>

      <!-- 导航菜单 -->
      <el-scrollbar class="sidebar-menu">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapsed"
          :collapse-transition="false"
          background-color="#042178"
          text-color="rgba(255, 255, 255, 0.7)"
          active-text-color="#BF933B"
          router
        >
          <template v-for="menu in menuList" :key="menu.path">
            <!-- 有子菜单 -->
            <el-sub-menu v-if="menu.children && menu.children.length" :index="menu.path">
              <template #title>
                <el-icon><component :is="menu.meta.icon" /></el-icon>
                <span>{{ menu.meta.title }}</span>
              </template>
              <el-menu-item
                v-for="child in menu.children"
                :key="child.path"
                :index="`${menu.path}/${child.path}`"
              >
                {{ child.meta.title }}
              </el-menu-item>
            </el-sub-menu>
            <!-- 无子菜单 -->
            <el-menu-item v-else :index="menu.path">
              <el-icon><component :is="menu.meta.icon" /></el-icon>
              <template #title>{{ menu.meta.title }}</template>
            </el-menu-item>
          </template>
        </el-menu>
      </el-scrollbar>

      <!-- 折叠按钮 -->
      <div class="sidebar-footer">
        <div class="collapse-btn" @click="toggleCollapse">
          <el-icon :size="18">
            <Fold v-if="!isCollapsed" />
            <Expand v-else />
          </el-icon>
        </div>
      </div>
    </aside>

    <!-- 主内容区 -->
    <div class="main-container">
      <!-- 顶部导航栏 -->
      <header class="header">
        <div class="header-left">
          <!-- 面包屑导航 -->
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
              {{ item.meta.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="header-right">
          <!-- 搜索框 -->
          <div class="search-box">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索功能..."
              prefix-icon="Search"
              clearable
              size="default"
            />
          </div>
          
          <!-- 通知 -->
          <div class="header-action">
            <el-badge :value="12" :max="99">
              <el-button :icon="Bell" circle />
            </el-badge>
          </div>
          
          <!-- 全屏 -->
          <div class="header-action">
            <el-button :icon="FullScreen" circle @click="toggleFullscreen" />
          </div>
          
          <!-- 用户信息 -->
          <el-dropdown class="user-dropdown" trigger="click">
            <div class="user-info">
              <el-avatar :size="36" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
              <div class="user-detail">
                <span class="user-name">管理员</span>
                <span class="user-role">招商部</span>
              </div>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :icon="User">个人中心</el-dropdown-item>
                <el-dropdown-item :icon="Setting">系统设置</el-dropdown-item>
                <el-dropdown-item divided :icon="SwitchButton" @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- 页面内容 -->
      <main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade-slide" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { 
  Fold, Expand, Bell, FullScreen, ArrowDown, 
  User, Setting, SwitchButton 
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const isCollapsed = ref(false)
const searchKeyword = ref('')

// 菜单列表
const menuList = [
  {
    path: '/dashboard',
    meta: { title: '首页', icon: 'HomeFilled' }
  },
  {
    path: '/basic',
    meta: { title: '基础数据管理', icon: 'FolderOpened' },
    children: [
      { path: 'assets', meta: { title: '资产台账管理' } },
      { path: 'tenants', meta: { title: '租户档案管理' } },
      { path: 'dictionary', meta: { title: '基础字典管理' } }
    ]
  },
  {
    path: '/lease',
    meta: { title: '资产租赁管理', icon: 'Document' },
    children: [
      { path: 'ledger', meta: { title: '租赁台账' } },
      { path: 'contracts', meta: { title: '租赁合同管理' } },
      { path: 'rent', meta: { title: '租金收缴管理' } },
      { path: 'renewal', meta: { title: '续约与退租管理' } }
    ]
  },
  {
    path: '/park',
    meta: { title: '园区运营管理', icon: 'OfficeBuilding' },
    children: [
      { path: 'daily', meta: { title: '园区日常管理' } },
      { path: 'repair', meta: { title: '设施报修管理' } },
      { path: 'inspection', meta: { title: '园区巡检管理' } },
      { path: 'service', meta: { title: '租户服务管理' } }
    ]
  },
  {
    path: '/incubation',
    meta: { title: '企业孵化平台', icon: 'TrendCharts' },
    children: [
      { path: 'admission', meta: { title: '入驻管理' } },
      { path: 'service', meta: { title: '孵化服务管理' } },
      { path: 'graduation', meta: { title: '毕业与退出管理' } }
    ]
  },
  {
    path: '/analysis',
    meta: { title: '数据分析', icon: 'DataAnalysis' },
    children: [
      { path: 'overview', meta: { title: '数据概览' } },
      { path: 'reports', meta: { title: '报表中心' } }
    ]
  },
  {
    path: '/system',
    meta: { title: '系统管理', icon: 'Setting' },
    children: [
      { path: 'users', meta: { title: '用户管理' } },
      { path: 'roles', meta: { title: '角色权限管理' } },
      { path: 'logs', meta: { title: '操作日志' } },
      { path: 'backup', meta: { title: '数据备份' } }
    ]
  }
]

// 当前激活菜单
const activeMenu = computed(() => route.path)

// 面包屑
const breadcrumbs = computed(() => {
  const matched = route.matched.filter(item => item.meta && item.meta.title)
  return matched.slice(1) // 排除根路由
})

// 折叠侧边栏
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

// 全屏切换
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.main-layout {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

// 侧边栏
.sidebar {
  width: 260px;
  height: 100%;
  background: linear-gradient(180deg, #042178 0%, #021556 100%);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  box-shadow: 4px 0 20px rgba(4, 33, 120, 0.15);
  
  &.collapsed {
    width: 64px;
    
    .sidebar-header {
      padding: 16px 12px;
    }
    
    .logo-icon svg {
      width: 32px;
      height: 32px;
    }
  }
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  
  .logo-icon svg {
    width: 40px;
    height: 40px;
    transition: all 0.3s ease;
  }
  
  .logo-text {
    display: flex;
    flex-direction: column;
    
    .logo-title {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      letter-spacing: 2px;
    }
    
    .logo-subtitle {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.5);
      letter-spacing: 1px;
    }
  }
}

.sidebar-menu {
  flex: 1;
  overflow: hidden;
  
  :deep(.el-menu) {
    border: none;
    
    .el-menu-item,
    .el-sub-menu__title {
      height: 50px;
      line-height: 50px;
      margin: 4px 8px;
      border-radius: 8px;
      
      &:hover {
        background: rgba(191, 147, 59, 0.15) !important;
      }
      
      .el-icon {
        font-size: 18px;
      }
    }
    
    .el-menu-item.is-active {
      background: linear-gradient(90deg, rgba(191, 147, 59, 0.2) 0%, rgba(191, 147, 59, 0.05) 100%) !important;
      border-left: 3px solid #BF933B;
      
      &::before {
        content: '';
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 20px;
        background: #BF933B;
        border-radius: 2px 0 0 2px;
      }
    }
    
    .el-sub-menu.is-active > .el-sub-menu__title {
      color: #BF933B !important;
    }
    
    .el-sub-menu .el-menu-item {
      padding-left: 52px !important;
      height: 44px;
      line-height: 44px;
    }
  }
}

.sidebar-footer {
  padding: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #BF933B;
  }
}

// 主内容区
.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--bg-color-page);
}

// 顶部导航
.header {
  height: 64px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(4, 33, 120, 0.08);
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  
  :deep(.el-breadcrumb) {
    font-size: 14px;
    
    .el-breadcrumb__inner {
      color: var(--color-text-secondary);
      
      &.is-link:hover {
        color: var(--color-primary);
      }
    }
    
    .el-breadcrumb__item:last-child .el-breadcrumb__inner {
      color: var(--color-secondary);
      font-weight: 500;
    }
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  width: 240px;
  
  :deep(.el-input__wrapper) {
    border-radius: 20px;
    background: var(--bg-color);
    box-shadow: none;
    
    &:hover, &:focus-within {
      box-shadow: 0 0 0 1px var(--color-primary) inset;
    }
  }
}

.header-action {
  :deep(.el-button) {
    border: none;
    background: var(--bg-color);
    color: var(--color-text-secondary);
    
    &:hover {
      background: rgba(191, 147, 59, 0.1);
      color: var(--color-primary);
    }
  }
}

.user-dropdown {
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--bg-color);
  }
  
  .user-detail {
    display: flex;
    flex-direction: column;
    
    .user-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--color-text-primary);
      line-height: 1.3;
    }
    
    .user-role {
      font-size: 12px;
      color: var(--color-text-secondary);
    }
  }
  
  .el-icon {
    color: var(--color-text-secondary);
  }
}

// 主内容
.main-content {
  flex: 1;
  overflow: auto;
  padding: 0;
}

// 动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>

