<template>
  <div class="repair-page page-container">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">设施报修管理</h1>
        <p class="page-subtitle">处理租户报修申请，跟踪维修进度</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus" @click="handleAddRepair">新建工单</el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-row">
      <div class="mini-stat-card">
        <div class="mini-stat-icon warning"><el-icon><Bell /></el-icon></div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">12</span>
          <span class="mini-stat-label">待处理</span>
        </div>
      </div>
      <div class="mini-stat-card">
        <div class="mini-stat-icon primary"><el-icon><Tools /></el-icon></div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">8</span>
          <span class="mini-stat-label">处理中</span>
        </div>
      </div>
      <div class="mini-stat-card">
        <div class="mini-stat-icon success"><el-icon><CircleCheck /></el-icon></div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">156</span>
          <span class="mini-stat-label">已完成</span>
        </div>
      </div>
      <div class="mini-stat-card">
        <div class="mini-stat-icon info"><el-icon><Clock /></el-icon></div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">2.5h</span>
          <span class="mini-stat-label">平均响应</span>
        </div>
      </div>
    </div>

    <!-- 筛选区 -->
    <el-card class="filter-card">
      <el-form :model="filterForm" inline>
        <el-form-item label="工单状态">
          <el-select v-model="filterForm.status" placeholder="全部" clearable style="width: 120px">
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="processing" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-form-item>
        <el-form-item label="报修类型">
          <el-select v-model="filterForm.type" placeholder="全部" clearable style="width: 120px">
            <el-option label="空调" value="aircon" />
            <el-option label="电路" value="electric" />
            <el-option label="水管" value="water" />
            <el-option label="门窗" value="door" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属园区">
          <el-select v-model="filterForm.parkId" placeholder="全部" clearable style="width: 150px">
            <el-option label="科技产业园A区" value="1" />
            <el-option label="科技产业园B区" value="2" />
            <el-option label="文化产业园" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 工单列表 -->
    <el-card class="table-card">
      <el-table :data="repairList" stripe>
        <el-table-column prop="repairNo" label="工单编号" width="140">
          <template #default="{ row }"><span class="repair-no">{{ row.repairNo }}</span></template>
        </el-table-column>
        <el-table-column prop="tenantName" label="报修租户" min-width="160" />
        <el-table-column prop="location" label="报修位置" width="140" />
        <el-table-column prop="repairType" label="报修类型" width="100">
          <template #default="{ row }">
            <el-tag size="small">{{ typeMap[row.repairType] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="问题描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="createTime" label="报修时间" width="150" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType[row.status]" size="small">{{ statusMap[row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="handler" label="处理人" width="100" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">查看</el-button>
            <el-button type="success" link v-if="row.status === 'pending'" @click="handleAssign(row)">派单</el-button>
            <el-button type="warning" link v-if="row.status === 'processing'" @click="handleComplete(row)">完成</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Bell, Tools, CircleCheck, Clock, Search } from '@element-plus/icons-vue'

const typeMap = { aircon: '空调', electric: '电路', water: '水管', door: '门窗', other: '其他' }
const statusMap = { pending: '待处理', processing: '处理中', completed: '已完成' }
const statusType = { pending: 'warning', processing: 'primary', completed: 'success' }

const filterForm = reactive({ status: '', type: '', parkId: '' })

const repairList = ref([
  { repairNo: 'BX202412001', tenantName: '深圳科技创新有限公司', location: 'A栋301', repairType: 'aircon', description: '空调制热效果差，温度上不去', createTime: '2024-12-28 09:30', status: 'pending', handler: '-' },
  { repairNo: 'BX202412002', tenantName: '福田文化传媒集团', location: 'C栋502', repairType: 'electric', description: '办公区部分灯具不亮', createTime: '2024-12-28 10:15', status: 'processing', handler: '王师傅' },
  { repairNo: 'BX202412003', tenantName: '智慧物联网技术公司', location: 'B栋105', repairType: 'water', description: '卫生间水龙头漏水', createTime: '2024-12-27 14:20', status: 'completed', handler: '李师傅' },
  { repairNo: 'BX202412004', tenantName: '创意设计工作室', location: 'C栋203', repairType: 'door', description: '办公室门锁损坏', createTime: '2024-12-27 16:45', status: 'completed', handler: '张师傅' }
])

const handleAddRepair = () => { ElMessage.info('新建工单') }
const handleView = (row) => { ElMessage.info('查看工单详情') }
const handleAssign = (row) => { ElMessage.success('派单成功') }
const handleComplete = (row) => { ElMessage.success('工单已完成') }
</script>

<style lang="scss" scoped>
.repair-page {
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

.filter-card { margin-bottom: 20px; :deep(.el-card__body) { padding: 16px 20px; } :deep(.el-form-item) { margin-bottom: 0; margin-right: 16px; } }
.table-card { :deep(.el-card__body) { padding: 0; } }
.repair-no { font-family: 'Courier New', monospace; font-weight: 600; color: var(--color-primary); }
</style>

