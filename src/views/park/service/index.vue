<template>
  <div class="service-page page-container">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">租户服务管理</h1>
        <p class="page-subtitle">响应租户服务需求，提供政策咨询、资源对接等服务</p>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-row">
      <div class="mini-stat-card">
        <div class="mini-stat-icon warning"><el-icon><Bell /></el-icon></div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">15</span>
          <span class="mini-stat-label">待处理</span>
        </div>
      </div>
      <div class="mini-stat-card">
        <div class="mini-stat-icon primary"><el-icon><Service /></el-icon></div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">8</span>
          <span class="mini-stat-label">处理中</span>
        </div>
      </div>
      <div class="mini-stat-card">
        <div class="mini-stat-icon success"><el-icon><CircleCheck /></el-icon></div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">328</span>
          <span class="mini-stat-label">已完成</span>
        </div>
      </div>
      <div class="mini-stat-card">
        <div class="mini-stat-icon info"><el-icon><Star /></el-icon></div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">4.8</span>
          <span class="mini-stat-label">满意度</span>
        </div>
      </div>
    </div>

    <!-- 服务需求列表 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">服务需求</span>
          <el-radio-group v-model="filterStatus" size="small">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="pending">待处理</el-radio-button>
            <el-radio-button label="processing">处理中</el-radio-button>
            <el-radio-button label="completed">已完成</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <el-table :data="serviceList" stripe>
        <el-table-column prop="serviceNo" label="服务编号" width="140" />
        <el-table-column prop="tenantName" label="租户名称" min-width="160" />
        <el-table-column prop="serviceType" label="服务类型" width="120">
          <template #default="{ row }">
            <el-tag size="small">{{ row.serviceType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="服务内容" min-width="200" show-overflow-tooltip />
        <el-table-column prop="createTime" label="提交时间" width="150" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType[row.status]" size="small">{{ statusMap[row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="handler" label="处理人" width="100" />
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">查看</el-button>
            <el-button type="success" link v-if="row.status === 'pending'" @click="handleAccept(row)">接单</el-button>
            <el-button type="warning" link v-if="row.status === 'processing'" @click="handleComplete(row)">完成</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Bell, Service, CircleCheck, Star } from '@element-plus/icons-vue'

const statusMap = { pending: '待处理', processing: '处理中', completed: '已完成' }
const statusType = { pending: 'warning', processing: 'primary', completed: 'success' }

const filterStatus = ref('')

const serviceList = ref([
  { serviceNo: 'FW202412001', tenantName: '深圳科技创新有限公司', serviceType: '政策咨询', title: '咨询高新技术企业认定政策', createTime: '2024-12-28 09:00', status: 'pending', handler: '-' },
  { serviceNo: 'FW202412002', tenantName: '福田文化传媒集团', serviceType: '资源对接', title: '寻求投融资机构对接', createTime: '2024-12-27 15:30', status: 'processing', handler: '张经理' },
  { serviceNo: 'FW202412003', tenantName: '智慧物联网技术公司', serviceType: '工商代办', title: '营业执照变更代办', createTime: '2024-12-27 11:00', status: 'completed', handler: '李专员' },
  { serviceNo: 'FW202412004', tenantName: '创意设计工作室', serviceType: '政策咨询', title: '咨询创业补贴申请流程', createTime: '2024-12-26 14:20', status: 'completed', handler: '王专员' }
])

const handleView = (row) => { ElMessage.info('查看服务详情') }
const handleAccept = (row) => { ElMessage.success('接单成功') }
const handleComplete = (row) => { ElMessage.success('服务已完成') }
</script>

<style lang="scss" scoped>
.service-page {
  .page-header {
    display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px;
    .page-title { font-size: 22px; font-weight: 600; color: var(--color-secondary); margin: 0 0 4px 0; }
    .page-subtitle { font-size: 14px; color: var(--color-text-secondary); margin: 0; }
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
.card-header { display: flex; align-items: center; justify-content: space-between; .card-title { font-size: 15px; font-weight: 600; color: var(--color-secondary); } }
</style>

