<template>
  <div class="inspection-page page-container">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">园区巡检管理</h1>
        <p class="page-subtitle">制定巡检计划，记录巡检情况，跟踪问题整改</p>
      </div>
      <div class="header-actions">
        <el-button :icon="Calendar">巡检计划</el-button>
        <el-button type="primary" :icon="Plus" @click="handleAddInspection">新建巡检</el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-row">
      <div class="mini-stat-card">
        <div class="mini-stat-icon primary"><el-icon><Calendar /></el-icon></div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">5</span>
          <span class="mini-stat-label">今日计划</span>
        </div>
      </div>
      <div class="mini-stat-card">
        <div class="mini-stat-icon success"><el-icon><CircleCheck /></el-icon></div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">3</span>
          <span class="mini-stat-label">已完成</span>
        </div>
      </div>
      <div class="mini-stat-card">
        <div class="mini-stat-icon warning"><el-icon><Warning /></el-icon></div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">8</span>
          <span class="mini-stat-label">待整改</span>
        </div>
      </div>
      <div class="mini-stat-card">
        <div class="mini-stat-icon info"><el-icon><TrendCharts /></el-icon></div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">96.5%</span>
          <span class="mini-stat-label">合格率</span>
        </div>
      </div>
    </div>

    <!-- 巡检记录 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">巡检记录</span>
        </div>
      </template>
      <el-table :data="inspectionList" stripe>
        <el-table-column prop="inspectionNo" label="巡检编号" width="140" />
        <el-table-column prop="parkName" label="巡检园区" width="140" />
        <el-table-column prop="inspectionType" label="巡检类型" width="100">
          <template #default="{ row }">
            <el-tag size="small">{{ row.inspectionType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="inspector" label="巡检人" width="100" />
        <el-table-column prop="inspectionTime" label="巡检时间" width="150" />
        <el-table-column prop="issueCount" label="发现问题" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.issueCount > 0 ? 'danger' : 'success'" size="small">{{ row.issueCount }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'completed' ? 'success' : 'warning'" size="small">
              {{ row.status === 'completed' ? '已完成' : '进行中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Calendar, CircleCheck, Warning, TrendCharts } from '@element-plus/icons-vue'

const inspectionList = ref([
  { inspectionNo: 'XJ202412001', parkName: '科技产业园A区', inspectionType: '日常巡检', inspector: '张巡检', inspectionTime: '2024-12-28 08:30', issueCount: 2, status: 'completed' },
  { inspectionNo: 'XJ202412002', parkName: '科技产业园B区', inspectionType: '消防检查', inspector: '李巡检', inspectionTime: '2024-12-28 09:00', issueCount: 0, status: 'completed' },
  { inspectionNo: 'XJ202412003', parkName: '文化产业园', inspectionType: '日常巡检', inspector: '王巡检', inspectionTime: '2024-12-28 10:30', issueCount: 1, status: 'processing' },
  { inspectionNo: 'XJ202412004', parkName: '科技产业园A区', inspectionType: '设备检查', inspector: '张巡检', inspectionTime: '2024-12-27 14:00', issueCount: 3, status: 'completed' }
])

const handleAddInspection = () => { ElMessage.info('新建巡检') }
const handleView = (row) => { ElMessage.info('查看巡检详情') }
</script>

<style lang="scss" scoped>
.inspection-page {
  .page-header {
    display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px;
    .page-title { font-size: 22px; font-weight: 600; color: var(--color-secondary); margin: 0 0 4px 0; }
    .page-subtitle { font-size: 14px; color: var(--color-text-secondary); margin: 0; }
    .header-actions { display: flex; gap: 12px; }
  }
}

.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }

.mini-stat-card {
  display: flex; align-items: center; gap: 14px; padding: 16px 20px;
  background: white; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm);
  
  .mini-stat-icon {
    width: 44px; height: 44px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    .el-icon { font-size: 22px; color: white; }
    &.primary { background: linear-gradient(135deg, #BF933B 0%, #D4A94D 100%); }
    &.success { background: linear-gradient(135deg, #286634 0%, #3D8A4D 100%); }
    &.warning { background: linear-gradient(135deg, #E6A23C 0%, #F0B452 100%); }
    &.info { background: linear-gradient(135deg, #042178 0%, #0A3399 100%); }
  }
  
  .mini-stat-info {
    display: flex; flex-direction: column;
    .mini-stat-value { font-size: 20px; font-weight: 700; color: var(--color-secondary); }
    .mini-stat-label { font-size: 13px; color: var(--color-text-secondary); margin-top: 2px; }
  }
}

.table-card { :deep(.el-card__header) { padding: 14px 20px; } :deep(.el-card__body) { padding: 0; } }
.card-header { .card-title { font-size: 15px; font-weight: 600; color: var(--color-secondary); } }
</style>

