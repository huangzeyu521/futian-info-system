<template>
  <div class="roles-page page-container">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">角色权限管理</h1>
        <p class="page-subtitle">管理系统角色及权限配置</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增角色</el-button>
      </div>
    </div>

    <div class="role-layout">
      <!-- 角色列表 -->
      <el-card class="role-list-card">
        <template #header>
          <span class="card-title">角色列表</span>
        </template>
        <div class="role-list">
          <div class="role-item" :class="{ active: activeRole === role.id }" v-for="role in roleList" :key="role.id" @click="handleSelectRole(role)">
            <div class="role-info">
              <span class="role-name">{{ role.name }}</span>
              <span class="role-desc">{{ role.description }}</span>
            </div>
            <el-tag :type="role.status === 1 ? 'success' : 'info'" size="small">
              {{ role.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </div>
        </div>
      </el-card>

      <!-- 权限配置 -->
      <el-card class="permission-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">权限配置 - {{ currentRole?.name || '请选择角色' }}</span>
            <el-button type="primary" size="small" @click="handleSavePermission" :disabled="!currentRole">保存配置</el-button>
          </div>
        </template>
        <el-tree ref="treeRef" :data="permissionTree" show-checkbox node-key="id" default-expand-all :props="{ label: 'name', children: 'children' }" />
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const activeRole = ref(1)
const currentRole = ref(null)
const treeRef = ref(null)

const roleList = ref([
  { id: 1, name: '超级管理员', description: '拥有所有权限', status: 1 },
  { id: 2, name: '招商专员', description: '负责招商相关业务', status: 1 },
  { id: 3, name: '运营专员', description: '负责园区运营管理', status: 1 },
  { id: 4, name: '财务专员', description: '负责财务相关业务', status: 1 },
  { id: 5, name: '孵化服务专员', description: '负责孵化服务', status: 1 }
])

const permissionTree = ref([
  { id: 1, name: '基础数据管理', children: [
    { id: 11, name: '资产台账管理' },
    { id: 12, name: '租户档案管理' },
    { id: 13, name: '基础字典管理' }
  ]},
  { id: 2, name: '资产租赁管理', children: [
    { id: 21, name: '租赁合同管理' },
    { id: 22, name: '租金收缴管理' },
    { id: 23, name: '续约与退租管理' }
  ]},
  { id: 3, name: '园区运营管理', children: [
    { id: 31, name: '园区日常管理' },
    { id: 32, name: '设施报修管理' },
    { id: 33, name: '园区巡检管理' },
    { id: 34, name: '租户服务管理' }
  ]},
  { id: 4, name: '企业孵化平台', children: [
    { id: 41, name: '入驻管理' },
    { id: 42, name: '孵化服务管理' },
    { id: 43, name: '毕业与退出管理' }
  ]},
  { id: 5, name: '数据分析', children: [
    { id: 51, name: '数据概览' },
    { id: 52, name: '报表中心' }
  ]},
  { id: 6, name: '系统管理', children: [
    { id: 61, name: '用户管理' },
    { id: 62, name: '角色权限管理' },
    { id: 63, name: '操作日志' },
    { id: 64, name: '数据备份' }
  ]}
])

const handleSelectRole = (role) => { activeRole.value = role.id; currentRole.value = role }
const handleAdd = () => { ElMessage.info('新增角色') }
const handleSavePermission = () => { ElMessage.success('权限配置保存成功') }
</script>

<style lang="scss" scoped>
.roles-page {
  .page-header {
    display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px;
    .page-title { font-size: 22px; font-weight: 600; color: var(--color-secondary); margin: 0 0 4px 0; }
    .page-subtitle { font-size: 14px; color: var(--color-text-secondary); margin: 0; }
  }
}

.role-layout { display: grid; grid-template-columns: 320px 1fr; gap: 20px; }

.role-list-card {
  :deep(.el-card__header) { padding: 14px 20px; }
  :deep(.el-card__body) { padding: 0; }
}

.card-title { font-size: 15px; font-weight: 600; color: var(--color-secondary); }
.card-header { display: flex; align-items: center; justify-content: space-between; }

.role-list {
  .role-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 20px; cursor: pointer; border-bottom: 1px solid var(--border-color-lighter);
    transition: all 0.2s ease;
    
    &:hover { background: var(--bg-color); }
    &.active { background: rgba(191, 147, 59, 0.1); border-left: 3px solid var(--color-primary); }
    &:last-child { border-bottom: none; }
    
    .role-info {
      display: flex; flex-direction: column;
      .role-name { font-size: 14px; font-weight: 500; color: var(--color-text-primary); }
      .role-desc { font-size: 12px; color: var(--color-text-secondary); margin-top: 4px; }
    }
  }
}

.permission-card {
  :deep(.el-card__header) { padding: 14px 20px; }
  :deep(.el-card__body) { padding: 20px; }
}
</style>

