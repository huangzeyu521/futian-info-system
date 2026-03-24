<template>
  <div class="daily-page page-container">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">园区日常管理</h1>
        <p class="page-subtitle">园区公告发布、公共资源管理、日常运营概览</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus" @click="handleAddNotice">发布公告</el-button>
      </div>
    </div>

    <!-- 园区概览 -->
    <div class="overview-section">
      <el-card class="overview-card" v-for="park in parkOverview" :key="park.id">
        <div class="park-header">
          <div class="park-icon" :style="{ background: park.bgColor }">
            <el-icon><OfficeBuilding /></el-icon>
          </div>
          <div class="park-info">
            <h3>{{ park.name }}</h3>
            <span class="park-type">{{ park.type }}</span>
          </div>
        </div>
        <div class="park-stats">
          <div class="park-stat">
            <span class="stat-value">{{ park.totalAssets }}</span>
            <span class="stat-label">资产总数</span>
          </div>
          <div class="park-stat">
            <span class="stat-value">{{ park.occupancyRate }}%</span>
            <span class="stat-label">出租率</span>
          </div>
          <div class="park-stat">
            <span class="stat-value">{{ park.tenantCount }}</span>
            <span class="stat-label">入驻企业</span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 公告列表 -->
    <el-card class="notice-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">园区公告</span>
          <el-link type="primary" :underline="false">查看全部</el-link>
        </div>
      </template>
      <div class="notice-list">
        <div class="notice-item" v-for="notice in noticeList" :key="notice.id">
          <el-tag :type="notice.tagType" size="small">{{ notice.tag }}</el-tag>
          <span class="notice-title">{{ notice.title }}</span>
          <span class="notice-date">{{ notice.date }}</span>
        </div>
      </div>
    </el-card>

    <!-- 公共资源 -->
    <el-card class="resource-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">公共资源预约</span>
        </div>
      </template>
      <el-table :data="resourceList" stripe>
        <el-table-column prop="resourceName" label="资源名称" width="150" />
        <el-table-column prop="location" label="位置" width="140" />
        <el-table-column prop="capacity" label="容量" width="100" />
        <el-table-column prop="todayBookings" label="今日预约" width="100" align="center" />
        <el-table-column prop="status" label="当前状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'available' ? 'success' : 'warning'" size="small">
              {{ row.status === 'available' ? '空闲' : '使用中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleBooking(row)">预约管理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, OfficeBuilding } from '@element-plus/icons-vue'

const parkOverview = ref([
  { id: 1, name: '科技产业园A区', type: '科技产业', bgColor: 'linear-gradient(135deg, #BF933B 0%, #D4A94D 100%)', totalAssets: 486, occupancyRate: 94.2, tenantCount: 156 },
  { id: 2, name: '科技产业园B区', type: '科技产业', bgColor: 'linear-gradient(135deg, #042178 0%, #0A3399 100%)', totalAssets: 420, occupancyRate: 91.5, tenantCount: 132 },
  { id: 3, name: '文化产业园', type: '文化产业', bgColor: 'linear-gradient(135deg, #286634 0%, #3D8A4D 100%)', totalAssets: 380, occupancyRate: 88.7, tenantCount: 98 }
])

const noticeList = ref([
  { id: 1, tag: '重要', tagType: 'danger', title: '关于2025年元旦假期园区安排的通知', date: '2024-12-28' },
  { id: 2, tag: '通知', tagType: 'primary', title: '园区消防演练活动通知', date: '2024-12-25' },
  { id: 3, tag: '活动', tagType: 'success', title: '科技创新交流会报名开始', date: '2024-12-22' },
  { id: 4, tag: '通知', tagType: 'primary', title: '园区停车场系统升级公告', date: '2024-12-20' }
])

const resourceList = ref([
  { resourceName: '大会议室A', location: 'A栋1楼', capacity: '50人', todayBookings: 3, status: 'occupied' },
  { resourceName: '小会议室B', location: 'B栋2楼', capacity: '15人', todayBookings: 5, status: 'available' },
  { resourceName: '多功能厅', location: 'C栋1楼', capacity: '200人', todayBookings: 1, status: 'available' },
  { resourceName: '路演中心', location: 'A栋负1楼', capacity: '100人', todayBookings: 2, status: 'occupied' }
])

const handleAddNotice = () => { ElMessage.info('发布公告功能') }
const handleBooking = (row) => { ElMessage.info('预约管理功能') }
</script>

<style lang="scss" scoped>
.daily-page {
  .page-header {
    display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px;
    .page-title { font-size: 22px; font-weight: 600; color: var(--color-secondary); margin: 0 0 4px 0; }
    .page-subtitle { font-size: 14px; color: var(--color-text-secondary); margin: 0; }
  }
}

.overview-section { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 20px; }

.overview-card {
  :deep(.el-card__body) { padding: 20px; }
  
  .park-header {
    display: flex; align-items: center; gap: 14px; margin-bottom: 20px;
    
    .park-icon {
      width: 48px; height: 48px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      .el-icon { font-size: 24px; color: white; }
    }
    
    .park-info {
      h3 { font-size: 16px; font-weight: 600; color: var(--color-secondary); margin: 0 0 4px 0; }
      .park-type { font-size: 13px; color: var(--color-text-secondary); }
    }
  }
  
  .park-stats {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
    padding-top: 16px; border-top: 1px solid var(--border-color-light);
    
    .park-stat {
      text-align: center;
      .stat-value { display: block; font-size: 20px; font-weight: 700; color: var(--color-primary); }
      .stat-label { font-size: 12px; color: var(--color-text-secondary); }
    }
  }
}

.notice-card, .resource-card { margin-bottom: 20px; }

.card-header {
  display: flex; align-items: center; justify-content: space-between;
  .card-title { font-size: 15px; font-weight: 600; color: var(--color-secondary); }
}

.notice-list {
  .notice-item {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 0; border-bottom: 1px solid var(--border-color-lighter);
    
    &:last-child { border-bottom: none; }
    
    .notice-title { flex: 1; font-size: 14px; color: var(--color-text-primary); }
    .notice-date { font-size: 13px; color: var(--color-text-secondary); }
  }
}
</style>

