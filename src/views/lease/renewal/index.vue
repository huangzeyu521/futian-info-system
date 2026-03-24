<template>
  <div class="renewal-page page-container">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">续约与退租管理</h1>
        <p class="page-subtitle">管理合同续约、退租流程及相关审批</p>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-row">
      <div class="mini-stat-card">
        <div class="mini-stat-icon warning"><el-icon><Timer /></el-icon></div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">23</span>
          <span class="mini-stat-label">即将到期</span>
        </div>
      </div>
      <div class="mini-stat-card">
        <div class="mini-stat-icon primary"><el-icon><Refresh /></el-icon></div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">8</span>
          <span class="mini-stat-label">续约申请</span>
        </div>
      </div>
      <div class="mini-stat-card">
        <div class="mini-stat-icon danger"><el-icon><CircleClose /></el-icon></div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">3</span>
          <span class="mini-stat-label">退租申请</span>
        </div>
      </div>
      <div class="mini-stat-card">
        <div class="mini-stat-icon success"><el-icon><CircleCheck /></el-icon></div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">156</span>
          <span class="mini-stat-label">本年续约</span>
        </div>
      </div>
    </div>

    <!-- 标签页 -->
    <el-card class="main-card">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="到期预警" name="expiring">
          <el-table :data="expiringList" stripe>
            <el-table-column prop="contractNo" label="合同编号" width="140" />
            <el-table-column prop="tenantName" label="租户名称" min-width="180" />
            <el-table-column prop="parkName" label="所属园区" width="140" />
            <el-table-column prop="endDate" label="到期日期" width="110" />
            <el-table-column prop="daysLeft" label="剩余天数" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="row.daysLeft <= 7 ? 'danger' : row.daysLeft <= 30 ? 'warning' : 'info'" size="small">
                  {{ row.daysLeft }}天
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleRenewal(row)">发起续约</el-button>
                <el-button type="warning" link @click="handleNotify(row)">提醒</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="续约申请" name="renewal">
          <el-table :data="renewalList" stripe>
            <el-table-column prop="applyNo" label="申请编号" width="140" />
            <el-table-column prop="tenantName" label="租户名称" min-width="180" />
            <el-table-column prop="originalEnd" label="原到期日" width="110" />
            <el-table-column prop="newEnd" label="续约至" width="110" />
            <el-table-column prop="applyDate" label="申请日期" width="110" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'pending' ? 'warning' : row.status === 'approved' ? 'success' : 'danger'" size="small">
                  {{ row.status === 'pending' ? '待审批' : row.status === 'approved' ? '已通过' : '已拒绝' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleViewRenewal(row)">查看</el-button>
                <el-button type="success" link v-if="row.status === 'pending'" @click="handleApprove(row)">审批</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="退租申请" name="checkout">
          <el-table :data="checkoutList" stripe>
            <el-table-column prop="applyNo" label="申请编号" width="140" />
            <el-table-column prop="tenantName" label="租户名称" min-width="180" />
            <el-table-column prop="roomInfo" label="退租房间" width="120" />
            <el-table-column prop="checkoutDate" label="预计退租日" width="110" />
            <el-table-column prop="reason" label="退租原因" min-width="150" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'pending' ? 'warning' : row.status === 'approved' ? 'success' : 'info'" size="small">
                  {{ row.status === 'pending' ? '待审批' : row.status === 'approved' ? '待验收' : '已完成' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleViewCheckout(row)">查看</el-button>
                <el-button type="success" link v-if="row.status === 'approved'" @click="handleInspection(row)">验收</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Timer, Refresh, CircleClose, CircleCheck } from '@element-plus/icons-vue'

const activeTab = ref('expiring')

const expiringList = ref([
  { contractNo: 'HT2024003', tenantName: '福田文化传媒集团', parkName: '文化产业园', endDate: '2025-01-31', daysLeft: 32 },
  { contractNo: 'HT2023005', tenantName: '创意设计工作室', parkName: '文化产业园', endDate: '2025-01-15', daysLeft: 16 },
  { contractNo: 'HT2023008', tenantName: '数字营销公司', parkName: '科技产业园A区', endDate: '2025-01-07', daysLeft: 8 }
])

const renewalList = ref([
  { applyNo: 'XY202412001', tenantName: '深圳科技创新有限公司', originalEnd: '2026-12-31', newEnd: '2029-12-31', applyDate: '2024-12-15', status: 'pending' },
  { applyNo: 'XY202412002', tenantName: '智慧物联网技术公司', originalEnd: '2027-02-28', newEnd: '2030-02-28', applyDate: '2024-12-10', status: 'approved' }
])

const checkoutList = ref([
  { applyNo: 'TZ202412001', tenantName: '某科技公司', roomInfo: 'A栋205', checkoutDate: '2025-01-31', reason: '业务调整', status: 'pending' },
  { applyNo: 'TZ202412002', tenantName: '某设计工作室', roomInfo: 'C栋108', checkoutDate: '2025-02-15', reason: '合同到期不续', status: 'approved' }
])

const handleRenewal = (row) => { ElMessage.info('发起续约流程') }
const handleNotify = (row) => { ElMessage.success('提醒通知已发送') }
const handleViewRenewal = (row) => { ElMessage.info('查看续约详情') }
const handleApprove = (row) => { ElMessage.success('审批通过') }
const handleViewCheckout = (row) => { ElMessage.info('查看退租详情') }
const handleInspection = (row) => { ElMessage.info('开始房屋验收') }
</script>

<style lang="scss" scoped>
.renewal-page {
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
    &.danger { background: linear-gradient(135deg, #D52A1E 0%, #E84D42 100%); }
  }
  
  .mini-stat-info {
    display: flex; flex-direction: column;
    .mini-stat-value { font-size: 20px; font-weight: 700; color: var(--color-secondary); }
    .mini-stat-label { font-size: 13px; color: var(--color-text-secondary); margin-top: 2px; }
  }
}

.main-card { :deep(.el-card__body) { padding: 20px; } }
</style>

