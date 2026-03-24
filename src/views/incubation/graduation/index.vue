<template>
  <div class="graduation-page page-container">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">毕业与退出管理</h1>
        <p class="page-subtitle">管理孵化企业毕业审核、退出流程及档案归档</p>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-row">
      <div class="mini-stat-card">
        <div class="mini-stat-icon success"><el-icon><Trophy /></el-icon></div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">86</span>
          <span class="mini-stat-label">累计毕业</span>
        </div>
      </div>
      <div class="mini-stat-card">
        <div class="mini-stat-icon primary"><el-icon><Timer /></el-icon></div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">5</span>
          <span class="mini-stat-label">待毕业审核</span>
        </div>
      </div>
      <div class="mini-stat-card">
        <div class="mini-stat-icon warning"><el-icon><SwitchButton /></el-icon></div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">3</span>
          <span class="mini-stat-label">退出申请</span>
        </div>
      </div>
      <div class="mini-stat-card">
        <div class="mini-stat-icon info"><el-icon><TrendCharts /></el-icon></div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">67%</span>
          <span class="mini-stat-label">毕业率</span>
        </div>
      </div>
    </div>

    <!-- 标签页 -->
    <el-card class="main-card">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="毕业审核" name="graduation">
          <el-table :data="graduationList" stripe>
            <el-table-column prop="companyName" label="企业名称" min-width="180" />
            <el-table-column prop="entryDate" label="入孵日期" width="110" />
            <el-table-column prop="incubationPeriod" label="孵化时长" width="100" />
            <el-table-column prop="revenue" label="年营收" width="120">
              <template #default="{ row }">{{ row.revenue }}万元</template>
            </el-table-column>
            <el-table-column prop="employees" label="员工数" width="80" align="center" />
            <el-table-column prop="patents" label="专利数" width="80" align="center" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'pending' ? 'warning' : 'success'" size="small">
                  {{ row.status === 'pending' ? '待审核' : '已通过' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleView(row)">查看</el-button>
                <el-button type="success" link v-if="row.status === 'pending'" @click="handleAudit(row)">审核</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="退出管理" name="exit">
          <el-table :data="exitList" stripe>
            <el-table-column prop="companyName" label="企业名称" min-width="180" />
            <el-table-column prop="exitType" label="退出类型" width="100">
              <template #default="{ row }">
                <el-tag :type="row.exitType === 'voluntary' ? 'info' : 'warning'" size="small">
                  {{ row.exitType === 'voluntary' ? '主动退出' : '终止孵化' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="reason" label="退出原因" min-width="200" show-overflow-tooltip />
            <el-table-column prop="applyDate" label="申请日期" width="110" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'pending' ? 'warning' : 'success'" size="small">
                  {{ row.status === 'pending' ? '待审批' : '已完成' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleViewExit(row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="毕业企业" name="graduated">
          <el-table :data="graduatedList" stripe>
            <el-table-column prop="companyName" label="企业名称" min-width="180" />
            <el-table-column prop="graduationDate" label="毕业日期" width="110" />
            <el-table-column prop="currentStatus" label="当前状态" width="120">
              <template #default="{ row }">
                <el-tag type="success" size="small">{{ row.currentStatus }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="currentRevenue" label="当前营收" width="120">
              <template #default="{ row }">{{ row.currentRevenue }}万元</template>
            </el-table-column>
            <el-table-column prop="achievement" label="主要成就" min-width="200" show-overflow-tooltip />
            <el-table-column label="操作" width="100">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleViewGraduated(row)">档案</el-button>
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
import { Trophy, Timer, SwitchButton, TrendCharts } from '@element-plus/icons-vue'

const activeTab = ref('graduation')

const graduationList = ref([
  { companyName: '智能算法科技有限公司', entryDate: '2022-03-01', incubationPeriod: '2年9月', revenue: 1200, employees: 45, patents: 8, status: 'pending' },
  { companyName: '云计算服务公司', entryDate: '2022-06-15', incubationPeriod: '2年6月', revenue: 800, employees: 32, patents: 5, status: 'pending' }
])

const exitList = ref([
  { companyName: '某初创公司', exitType: 'voluntary', reason: '业务方向调整，需迁移至其他城市', applyDate: '2024-12-25', status: 'pending' },
  { companyName: '某科技工作室', exitType: 'terminate', reason: '未达到孵化阶段目标', applyDate: '2024-12-20', status: 'completed' }
])

const graduatedList = ref([
  { companyName: '创新科技集团', graduationDate: '2024-06-30', currentStatus: '高新企业', currentRevenue: 5000, achievement: '获得B轮融资2000万，员工超100人' },
  { companyName: '数字媒体公司', graduationDate: '2024-03-15', currentStatus: '规上企业', currentRevenue: 3200, achievement: '成功上市新三板' }
])

const handleView = (row) => { ElMessage.info('查看毕业审核详情') }
const handleAudit = (row) => { ElMessage.info('进行毕业审核') }
const handleViewExit = (row) => { ElMessage.info('查看退出详情') }
const handleViewGraduated = (row) => { ElMessage.info('查看毕业企业档案') }
</script>

<style lang="scss" scoped>
.graduation-page {
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

.main-card { :deep(.el-card__body) { padding: 20px; } }
</style>

