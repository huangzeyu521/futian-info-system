<template>
  <div class="backup-page page-container">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">数据备份</h1>
        <p class="page-subtitle">定期备份系统数据，支持手动备份和数据恢复</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="Upload" @click="handleBackup">立即备份</el-button>
      </div>
    </div>

    <!-- 备份状态 -->
    <div class="status-cards">
      <el-card class="status-card">
        <div class="status-icon success"><el-icon><CircleCheck /></el-icon></div>
        <div class="status-info">
          <span class="status-label">最近备份</span>
          <span class="status-value">2024-12-28 03:00</span>
        </div>
      </el-card>
      <el-card class="status-card">
        <div class="status-icon primary"><el-icon><Timer /></el-icon></div>
        <div class="status-info">
          <span class="status-label">下次备份</span>
          <span class="status-value">2024-12-29 03:00</span>
        </div>
      </el-card>
      <el-card class="status-card">
        <div class="status-icon warning"><el-icon><FolderOpened /></el-icon></div>
        <div class="status-info">
          <span class="status-label">备份文件数</span>
          <span class="status-value">30 个</span>
        </div>
      </el-card>
      <el-card class="status-card">
        <div class="status-icon info"><el-icon><Coin /></el-icon></div>
        <div class="status-info">
          <span class="status-label">占用空间</span>
          <span class="status-value">12.5 GB</span>
        </div>
      </el-card>
    </div>

    <!-- 备份设置 -->
    <el-card class="setting-card">
      <template #header>
        <span class="card-title">备份设置</span>
      </template>
      <el-form label-width="120px">
        <el-form-item label="自动备份">
          <el-switch v-model="autoBackup" />
        </el-form-item>
        <el-form-item label="备份频率">
          <el-select v-model="backupFrequency" style="width: 200px">
            <el-option label="每天" value="daily" />
            <el-option label="每周" value="weekly" />
            <el-option label="每月" value="monthly" />
          </el-select>
        </el-form-item>
        <el-form-item label="备份时间">
          <el-time-picker v-model="backupTime" placeholder="选择时间" />
        </el-form-item>
        <el-form-item label="保留天数">
          <el-input-number v-model="retentionDays" :min="7" :max="90" />
          <span style="margin-left: 10px; color: var(--color-text-secondary)">天</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSaveSetting">保存设置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 备份记录 -->
    <el-card class="table-card">
      <template #header>
        <span class="card-title">备份记录</span>
      </template>
      <el-table :data="backupList" stripe>
        <el-table-column prop="fileName" label="文件名" min-width="250" />
        <el-table-column prop="size" label="文件大小" width="120" />
        <el-table-column prop="type" label="备份类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'auto' ? 'success' : 'primary'" size="small">
              {{ row.type === 'auto' ? '自动' : '手动' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="备份时间" width="170" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag type="success" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleDownload(row)">下载</el-button>
            <el-button type="warning" link @click="handleRestore(row)">恢复</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload, CircleCheck, Timer, FolderOpened, Coin } from '@element-plus/icons-vue'

const autoBackup = ref(true)
const backupFrequency = ref('daily')
const backupTime = ref('03:00')
const retentionDays = ref(30)

const backupList = ref([
  { id: 1, fileName: 'backup_2024-12-28_030000.sql.gz', size: '425 MB', type: 'auto', createTime: '2024-12-28 03:00:00', status: '成功' },
  { id: 2, fileName: 'backup_2024-12-27_030000.sql.gz', size: '420 MB', type: 'auto', createTime: '2024-12-27 03:00:00', status: '成功' },
  { id: 3, fileName: 'backup_2024-12-26_150000.sql.gz', size: '418 MB', type: 'manual', createTime: '2024-12-26 15:00:00', status: '成功' },
  { id: 4, fileName: 'backup_2024-12-26_030000.sql.gz', size: '415 MB', type: 'auto', createTime: '2024-12-26 03:00:00', status: '成功' }
])

const handleBackup = () => { ElMessage.success('备份任务已启动') }
const handleSaveSetting = () => { ElMessage.success('设置保存成功') }
const handleDownload = (row) => { ElMessage.success('开始下载') }
const handleRestore = (row) => { ElMessageBox.confirm('确定要恢复到该备份吗？此操作将覆盖当前数据！', '警告', { type: 'warning' }).then(() => { ElMessage.success('数据恢复中...') }) }
const handleDelete = (row) => { ElMessageBox.confirm('确定要删除该备份文件吗？', '提示', { type: 'warning' }).then(() => { ElMessage.success('删除成功') }) }
</script>

<style lang="scss" scoped>
.backup-page {
  .page-header {
    display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px;
    .page-title { font-size: 22px; font-weight: 600; color: var(--color-secondary); margin: 0 0 4px 0; }
    .page-subtitle { font-size: 14px; color: var(--color-text-secondary); margin: 0; }
  }
}

.status-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }

.status-card {
  :deep(.el-card__body) { display: flex; align-items: center; gap: 16px; padding: 20px; }
  
  .status-icon {
    width: 48px; height: 48px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    .el-icon { font-size: 24px; color: white; }
    &.success { background: linear-gradient(135deg, #286634 0%, #3D8A4D 100%); }
    &.primary { background: linear-gradient(135deg, #BF933B 0%, #D4A94D 100%); }
    &.warning { background: linear-gradient(135deg, #E6A23C 0%, #F0B452 100%); }
    &.info { background: linear-gradient(135deg, #042178 0%, #0A3399 100%); }
  }
  
  .status-info {
    display: flex; flex-direction: column;
    .status-label { font-size: 13px; color: var(--color-text-secondary); }
    .status-value { font-size: 18px; font-weight: 600; color: var(--color-secondary); margin-top: 4px; }
  }
}

.setting-card { margin-bottom: 20px; :deep(.el-card__header) { padding: 14px 20px; } :deep(.el-card__body) { padding: 20px; } }
.table-card { :deep(.el-card__header) { padding: 14px 20px; } :deep(.el-card__body) { padding: 0; } }
.card-title { font-size: 15px; font-weight: 600; color: var(--color-secondary); }
</style>

