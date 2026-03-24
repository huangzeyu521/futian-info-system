<template>
  <div class="logs-page page-container">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">操作日志</h1>
        <p class="page-subtitle">记录所有用户的系统操作，支持查询与追溯</p>
      </div>
      <div class="header-actions">
        <el-button :icon="Download" @click="handleExport">导出日志</el-button>
      </div>
    </div>

    <!-- 筛选区 -->
    <el-card class="filter-card">
      <el-form :model="filterForm" inline>
        <el-form-item label="操作人">
          <el-input v-model="filterForm.operator" placeholder="用户名" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select v-model="filterForm.type" placeholder="全部" clearable style="width: 130px">
            <el-option label="登录" value="login" />
            <el-option label="新增" value="create" />
            <el-option label="编辑" value="update" />
            <el-option label="删除" value="delete" />
            <el-option label="导出" value="export" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作模块">
          <el-select v-model="filterForm.module" placeholder="全部" clearable style="width: 140px">
            <el-option label="资产管理" value="asset" />
            <el-option label="合同管理" value="contract" />
            <el-option label="租户管理" value="tenant" />
            <el-option label="用户管理" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作时间">
          <el-date-picker v-model="filterForm.dateRange" type="daterange" start-placeholder="开始" end-placeholder="结束" style="width: 240px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 日志列表 -->
    <el-card class="table-card">
      <el-table :data="logList" stripe>
        <el-table-column prop="operator" label="操作人" width="100" />
        <el-table-column prop="type" label="操作类型" width="100">
          <template #default="{ row }">
            <el-tag :type="typeTagMap[row.type]" size="small">{{ typeMap[row.type] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="module" label="操作模块" width="120" />
        <el-table-column prop="content" label="操作内容" min-width="300" show-overflow-tooltip />
        <el-table-column prop="ip" label="IP地址" width="140" />
        <el-table-column prop="createTime" label="操作时间" width="170" />
        <el-table-column label="操作" width="80">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-wrapper">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[20, 50, 100]" :total="total" layout="total, sizes, prev, pager, next" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, Search } from '@element-plus/icons-vue'

const typeMap = { login: '登录', create: '新增', update: '编辑', delete: '删除', export: '导出' }
const typeTagMap = { login: 'info', create: 'success', update: 'primary', delete: 'danger', export: 'warning' }

const filterForm = reactive({ operator: '', type: '', module: '', dateRange: null })
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(1256)

const logList = ref([
  { id: 1, operator: 'admin', type: 'login', module: '系统登录', content: '用户登录系统', ip: '192.168.1.100', createTime: '2024-12-28 10:30:25' },
  { id: 2, operator: 'zhangsan', type: 'create', module: '合同管理', content: '新增租赁合同 HT2024010', ip: '192.168.1.101', createTime: '2024-12-28 10:15:32' },
  { id: 3, operator: 'lisi', type: 'update', module: '资产管理', content: '修改资产信息 FT-TK-A-301', ip: '192.168.1.102', createTime: '2024-12-28 09:45:18' },
  { id: 4, operator: 'admin', type: 'delete', module: '用户管理', content: '删除用户 test001', ip: '192.168.1.100', createTime: '2024-12-28 09:30:05' },
  { id: 5, operator: 'wangwu', type: 'export', module: '报表中心', content: '导出月度租金收缴报表', ip: '192.168.1.103', createTime: '2024-12-28 09:00:42' }
])

const handleExport = () => { ElMessage.success('正在导出日志') }
const handleView = (row) => { ElMessage.info('查看日志详情') }
</script>

<style lang="scss" scoped>
.logs-page {
  .page-header {
    display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px;
    .page-title { font-size: 22px; font-weight: 600; color: var(--color-secondary); margin: 0 0 4px 0; }
    .page-subtitle { font-size: 14px; color: var(--color-text-secondary); margin: 0; }
  }
}

.filter-card { margin-bottom: 20px; :deep(.el-card__body) { padding: 16px 20px; } :deep(.el-form-item) { margin-bottom: 0; margin-right: 16px; } }
.table-card { :deep(.el-card__body) { padding: 0; } }
.pagination-wrapper { display: flex; justify-content: flex-end; padding: 16px 20px; border-top: 1px solid var(--border-color-lighter); }
</style>

