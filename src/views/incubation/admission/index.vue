<template>
  <div class="admission-page page-container">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">入驻管理</h1>
        <p class="page-subtitle">管理孵化企业入驻申请、审核、入驻手续办理</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus" @click="handleAddApplication">新增申请</el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-row">
      <div class="mini-stat-card">
        <div class="mini-stat-icon warning"><el-icon><Document /></el-icon></div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">18</span>
          <span class="mini-stat-label">待审核</span>
        </div>
      </div>
      <div class="mini-stat-card">
        <div class="mini-stat-icon primary"><el-icon><Timer /></el-icon></div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">6</span>
          <span class="mini-stat-label">待面试</span>
        </div>
      </div>
      <div class="mini-stat-card">
        <div class="mini-stat-icon success"><el-icon><CircleCheck /></el-icon></div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">45</span>
          <span class="mini-stat-label">已通过</span>
        </div>
      </div>
      <div class="mini-stat-card">
        <div class="mini-stat-icon info"><el-icon><OfficeBuilding /></el-icon></div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">128</span>
          <span class="mini-stat-label">在孵企业</span>
        </div>
      </div>
    </div>

    <!-- 申请列表 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">入驻申请</span>
          <el-radio-group v-model="filterStatus" size="small">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="pending">待审核</el-radio-button>
            <el-radio-button label="interview">待面试</el-radio-button>
            <el-radio-button label="approved">已通过</el-radio-button>
            <el-radio-button label="rejected">已拒绝</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <el-table :data="applicationList" stripe>
        <el-table-column prop="applyNo" label="申请编号" width="140" />
        <el-table-column prop="companyName" label="企业名称" min-width="180" />
        <el-table-column prop="industry" label="所属行业" width="120">
          <template #default="{ row }">
            <el-tag :type="row.industry === 'tech' ? 'primary' : 'success'" size="small">
              {{ row.industry === 'tech' ? '科技' : '文化' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="contact" label="联系人" width="100" />
        <el-table-column prop="phone" label="联系电话" width="130" />
        <el-table-column prop="applyDate" label="申请日期" width="110" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType[row.status]" size="small">{{ statusMap[row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">查看</el-button>
            <el-button type="success" link v-if="row.status === 'pending'" @click="handleAudit(row)">审核</el-button>
            <el-button type="warning" link v-if="row.status === 'interview'" @click="handleInterview(row)">面试</el-button>
            <el-button type="primary" link v-if="row.status === 'approved'" @click="handleEntry(row)">办理入驻</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Document, Timer, CircleCheck, OfficeBuilding } from '@element-plus/icons-vue'

const statusMap = { pending: '待审核', interview: '待面试', approved: '已通过', rejected: '已拒绝', entered: '已入驻' }
const statusType = { pending: 'warning', interview: 'primary', approved: 'success', rejected: 'danger', entered: 'info' }

const filterStatus = ref('')

const applicationList = ref([
  { applyNo: 'RZ202412001', companyName: '智能算法科技有限公司', industry: 'tech', contact: '张总', phone: '13800138001', applyDate: '2024-12-28', status: 'pending' },
  { applyNo: 'RZ202412002', companyName: '创意动画工作室', industry: 'culture', contact: '李导演', phone: '13800138002', applyDate: '2024-12-27', status: 'interview' },
  { applyNo: 'RZ202412003', companyName: '云计算服务公司', industry: 'tech', contact: '王经理', phone: '13800138003', applyDate: '2024-12-26', status: 'approved' },
  { applyNo: 'RZ202412004', companyName: '数字媒体科技', industry: 'tech', contact: '赵总', phone: '13800138004', applyDate: '2024-12-25', status: 'entered' }
])

const handleAddApplication = () => { ElMessage.info('新增申请') }
const handleView = (row) => { ElMessage.info('查看申请详情') }
const handleAudit = (row) => { ElMessage.info('审核申请') }
const handleInterview = (row) => { ElMessage.info('安排面试') }
const handleEntry = (row) => { ElMessage.info('办理入驻手续') }
</script>

<style lang="scss" scoped>
.admission-page {
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

