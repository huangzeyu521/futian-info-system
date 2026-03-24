<template>
  <div class="dashboard-page page-container">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1 class="welcome-title">欢迎回来，管理员</h1>
        <p class="welcome-subtitle">{{ currentTime }}，祝您工作顺利！</p>
      </div>
      <div class="welcome-actions">
        <el-button type="primary" :icon="Plus">新增合同</el-button>
        <el-button :icon="Download">导出报表</el-button>
      </div>
    </div>

    <!-- 核心指标卡片 -->
    <div class="stats-grid">
      <div class="stat-card" v-for="(stat, index) in statsData" :key="index">
        <div class="stat-icon" :class="stat.iconClass">
          <el-icon><component :is="stat.icon" /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
        <div class="stat-trend" :class="stat.trend > 0 ? 'up' : 'down'">
          <el-icon v-if="stat.trend > 0"><Top /></el-icon>
          <el-icon v-else><Bottom /></el-icon>
          {{ Math.abs(stat.trend) }}%
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <!-- 租金收入趋势 -->
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">租金收入趋势</span>
            <el-radio-group v-model="rentChartType" size="small">
              <el-radio-button label="month">月度</el-radio-button>
              <el-radio-button label="quarter">季度</el-radio-button>
              <el-radio-button label="year">年度</el-radio-button>
            </el-radio-group>
          </div>
        </template>
        <div ref="rentChartRef" class="chart-container"></div>
      </el-card>

      <!-- 园区出租率 -->
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">园区出租率</span>
            <el-select v-model="selectedPark" size="small" style="width: 140px">
              <el-option label="全部园区" value="all" />
              <el-option label="科技产业园A区" value="tech-a" />
              <el-option label="科技产业园B区" value="tech-b" />
              <el-option label="文化产业园" value="culture" />
            </el-select>
          </div>
        </template>
        <div ref="occupancyChartRef" class="chart-container"></div>
      </el-card>
    </div>

    <!-- 数据面板区域 -->
    <div class="panels-section">
      <!-- 合同到期预警 -->
      <el-card class="panel-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">
              <el-icon class="warning-icon"><Warning /></el-icon>
              合同到期预警
            </span>
            <el-link type="primary" :underline="false">查看全部</el-link>
          </div>
        </template>
        <div class="warning-list">
          <div 
            class="warning-item" 
            v-for="item in contractWarnings" 
            :key="item.id"
          >
            <div class="warning-info">
              <span class="warning-tenant">{{ item.tenant }}</span>
              <span class="warning-park">{{ item.park }}</span>
            </div>
            <div class="warning-detail">
              <span class="warning-days" :class="item.daysClass">
                {{ item.days }}天后到期
              </span>
              <el-button type="primary" size="small" text>处理</el-button>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 租金待收 -->
      <el-card class="panel-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">
              <el-icon class="money-icon"><Money /></el-icon>
              租金待收
            </span>
            <el-link type="primary" :underline="false">查看全部</el-link>
          </div>
        </template>
        <div class="rent-list">
          <div 
            class="rent-item" 
            v-for="item in pendingRents" 
            :key="item.id"
          >
            <div class="rent-info">
              <span class="rent-tenant">{{ item.tenant }}</span>
              <span class="rent-period">{{ item.period }}</span>
            </div>
            <div class="rent-amount">
              <span class="amount">¥{{ item.amount.toLocaleString() }}</span>
              <el-tag :type="item.statusType" size="small">{{ item.status }}</el-tag>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 最新动态 -->
      <el-card class="panel-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">
              <el-icon class="activity-icon"><Bell /></el-icon>
              最新动态
            </span>
            <el-link type="primary" :underline="false">查看全部</el-link>
          </div>
        </template>
        <el-timeline class="activity-timeline">
          <el-timeline-item
            v-for="activity in recentActivities"
            :key="activity.id"
            :type="activity.type"
            :timestamp="activity.time"
            placement="top"
          >
            <div class="activity-content">
              <span class="activity-title">{{ activity.title }}</span>
              <span class="activity-desc">{{ activity.description }}</span>
            </div>
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </div>

    <!-- 快捷入口 -->
    <el-card class="quick-entry-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">快捷入口</span>
        </div>
      </template>
      <div class="quick-entry-grid">
        <div 
          class="quick-entry-item" 
          v-for="entry in quickEntries" 
          :key="entry.name"
          @click="navigateTo(entry.path)"
        >
          <div class="entry-icon" :style="{ background: entry.bgColor }">
            <el-icon><component :is="entry.icon" /></el-icon>
          </div>
          <span class="entry-name">{{ entry.name }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import {
  Plus, Download, Top, Bottom, Warning, Money, Bell,
  OfficeBuilding, Document, DataAnalysis, User, Setting,
  TrendCharts, FolderOpened, Tickets
} from '@element-plus/icons-vue'

const router = useRouter()
const rentChartRef = ref(null)
const occupancyChartRef = ref(null)
const rentChartType = ref('month')
const selectedPark = ref('all')

let rentChart = null
let occupancyChart = null

// 当前时间问候语
const currentTime = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return '上午好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

// 核心指标数据
const statsData = ref([
  {
    icon: 'OfficeBuilding',
    iconClass: 'primary',
    label: '资产总数',
    value: '1,286',
    trend: 5.2
  },
  {
    icon: 'Document',
    iconClass: 'secondary',
    label: '有效合同',
    value: '428',
    trend: 12.5
  },
  {
    icon: 'Money',
    iconClass: 'success',
    label: '本月收入',
    value: '¥368.5万',
    trend: 8.3
  },
  {
    icon: 'TrendCharts',
    iconClass: 'danger',
    label: '出租率',
    value: '92.6%',
    trend: -2.1
  }
])

// 合同到期预警
const contractWarnings = ref([
  { id: 1, tenant: '深圳科技创新有限公司', park: '科技产业园A区-301', days: 7, daysClass: 'urgent' },
  { id: 2, tenant: '福田文化传媒集团', park: '文化产业园-502', days: 15, daysClass: 'warning' },
  { id: 3, tenant: '智慧物联网技术公司', park: '科技产业园B区-108', days: 25, daysClass: 'normal' },
  { id: 4, tenant: '创意设计工作室', park: '文化产业园-203', days: 30, daysClass: 'normal' }
])

// 租金待收
const pendingRents = ref([
  { id: 1, tenant: '深圳科技创新有限公司', period: '2024年12月', amount: 85000, status: '待收', statusType: 'warning' },
  { id: 2, tenant: '福田文化传媒集团', period: '2024年12月', amount: 120000, status: '逾期', statusType: 'danger' },
  { id: 3, tenant: '智慧物联网技术公司', period: '2024年12月', amount: 65000, status: '待收', statusType: 'warning' },
  { id: 4, tenant: '创新孵化器运营中心', period: '2024年12月', amount: 95000, status: '部分收', statusType: 'info' }
])

// 最新动态
const recentActivities = ref([
  { id: 1, type: 'primary', title: '新合同签订', description: '深圳智能科技有限公司签订3年期租赁合同', time: '10分钟前' },
  { id: 2, type: 'success', title: '租金到账', description: '福田文化传媒集团12月租金已到账', time: '30分钟前' },
  { id: 3, type: 'warning', title: '报修工单', description: '科技产业园A区-205空调故障报修', time: '1小时前' },
  { id: 4, type: 'info', title: '企业入驻', description: '创新科技孵化企业通过入驻审核', time: '2小时前' }
])

// 快捷入口
const quickEntries = ref([
  { name: '资产管理', icon: 'OfficeBuilding', path: '/basic/assets', bgColor: 'linear-gradient(135deg, #BF933B 0%, #D4A94D 100%)' },
  { name: '合同管理', icon: 'Document', path: '/lease/contracts', bgColor: 'linear-gradient(135deg, #042178 0%, #0A3399 100%)' },
  { name: '租金收缴', icon: 'Money', path: '/lease/rent', bgColor: 'linear-gradient(135deg, #286634 0%, #3D8A4D 100%)' },
  { name: '报修管理', icon: 'Tickets', path: '/park/repair', bgColor: 'linear-gradient(135deg, #E6A23C 0%, #F0B452 100%)' },
  { name: '租户档案', icon: 'User', path: '/basic/tenants', bgColor: 'linear-gradient(135deg, #909399 0%, #A6A9AD 100%)' },
  { name: '数据报表', icon: 'DataAnalysis', path: '/analysis/reports', bgColor: 'linear-gradient(135deg, #D52A1E 0%, #E84D42 100%)' },
  { name: '孵化服务', icon: 'TrendCharts', path: '/incubation/service', bgColor: 'linear-gradient(135deg, #67C23A 0%, #85CE61 100%)' },
  { name: '系统设置', icon: 'Setting', path: '/system/users', bgColor: 'linear-gradient(135deg, #606266 0%, #909399 100%)' }
])

// 初始化租金趋势图表
const initRentChart = () => {
  if (!rentChartRef.value) return
  
  rentChart = echarts.init(rentChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E4E7ED',
      borderWidth: 1,
      textStyle: { color: '#1F2937' },
      formatter: (params) => {
        let result = `<div style="font-weight: 600; margin-bottom: 8px">${params[0].name}</div>`
        params.forEach(item => {
          result += `<div style="display: flex; align-items: center; gap: 8px; margin: 4px 0">
            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${item.color}"></span>
            <span>${item.seriesName}：</span>
            <span style="font-weight: 600">¥${(item.value / 10000).toFixed(1)}万</span>
          </div>`
        })
        return result
      }
    },
    legend: {
      data: ['租金收入', '物业费', '其他收入'],
      bottom: 0,
      textStyle: { color: '#6B7280' }
    },
    grid: {
      top: 20,
      left: 50,
      right: 20,
      bottom: 50
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      axisLine: { lineStyle: { color: '#E4E7ED' } },
      axisLabel: { color: '#6B7280' }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#F2F6FC' } },
      axisLabel: { 
        color: '#6B7280',
        formatter: (value) => `${value / 10000}万`
      }
    },
    series: [
      {
        name: '租金收入',
        type: 'bar',
        data: [3200000, 3100000, 3500000, 3400000, 3600000, 3550000, 3700000, 3650000, 3800000, 3750000, 3850000, 3680000],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#BF933B' },
            { offset: 1, color: '#D4A94D' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        barWidth: 20
      },
      {
        name: '物业费',
        type: 'bar',
        data: [450000, 420000, 480000, 460000, 490000, 475000, 510000, 495000, 520000, 505000, 530000, 515000],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#042178' },
            { offset: 1, color: '#0A3399' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        barWidth: 20
      },
      {
        name: '其他收入',
        type: 'line',
        data: [120000, 135000, 145000, 128000, 155000, 142000, 168000, 152000, 175000, 162000, 180000, 170000],
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: { color: '#286634' },
        lineStyle: { width: 3 }
      }
    ]
  }
  
  rentChart.setOption(option)
}

// 初始化出租率图表
const initOccupancyChart = () => {
  if (!occupancyChartRef.value) return
  
  occupancyChart = echarts.init(occupancyChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E4E7ED',
      borderWidth: 1,
      textStyle: { color: '#1F2937' }
    },
    legend: {
      orient: 'vertical',
      right: 20,
      top: 'center',
      textStyle: { color: '#6B7280' }
    },
    series: [
      {
        name: '资产状态',
        type: 'pie',
        radius: ['50%', '75%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 3
        },
        label: {
          show: true,
          position: 'center',
          formatter: () => '92.6%',
          fontSize: 28,
          fontWeight: 'bold',
          color: '#042178'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 32,
            fontWeight: 'bold'
          }
        },
        labelLine: { show: false },
        data: [
          { value: 1190, name: '已出租', itemStyle: { color: '#BF933B' } },
          { value: 56, name: '空置', itemStyle: { color: '#E4E7ED' } },
          { value: 28, name: '维修中', itemStyle: { color: '#E6A23C' } },
          { value: 12, name: '预留', itemStyle: { color: '#042178' } }
        ]
      }
    ]
  }
  
  occupancyChart.setOption(option)
}

// 导航跳转
const navigateTo = (path) => {
  router.push(path)
}

// 窗口大小变化时重绘图表
const handleResize = () => {
  rentChart?.resize()
  occupancyChart?.resize()
}

onMounted(() => {
  initRentChart()
  initOccupancyChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  rentChart?.dispose()
  occupancyChart?.dispose()
})
</script>

<style lang="scss" scoped>
.dashboard-page {
  padding: 24px;
  background: var(--bg-color-page);
  min-height: 100%;
}

// 欢迎区域
.welcome-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 24px 32px;
  background: linear-gradient(135deg, #042178 0%, #0A3399 100%);
  border-radius: var(--radius-lg);
  color: white;
  
  .welcome-title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 4px;
  }
  
  .welcome-subtitle {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .welcome-actions {
    display: flex;
    gap: 12px;
    
    :deep(.el-button) {
      border-radius: 8px;
      
      &.el-button--primary {
        background: linear-gradient(135deg, #BF933B 0%, #A67D2E 100%);
        border: none;
      }
      
      &:not(.el-button--primary) {
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
        
        &:hover {
          background: rgba(255, 255, 255, 0.25);
        }
      }
    }
  }
}

// 统计卡片网格
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  background: white;
  padding: 20px 24px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }
}

// 图表区域
.charts-section {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.chart-card {
  :deep(.el-card__header) {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-color-light);
  }
  
  :deep(.el-card__body) {
    padding: 20px;
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .card-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-secondary);
    display: flex;
    align-items: center;
    gap: 8px;
    
    .warning-icon {
      color: var(--color-warning);
    }
    
    .money-icon {
      color: var(--color-success);
    }
    
    .activity-icon {
      color: var(--color-primary);
    }
  }
}

.chart-container {
  height: 320px;
}

// 数据面板区域
.panels-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.panel-card {
  :deep(.el-card__header) {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-color-light);
  }
  
  :deep(.el-card__body) {
    padding: 0;
    max-height: 320px;
    overflow-y: auto;
  }
}

// 合同预警列表
.warning-list {
  .warning-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    border-bottom: 1px solid var(--border-color-lighter);
    transition: background 0.2s ease;
    
    &:hover {
      background: var(--bg-color);
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .warning-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    
    .warning-tenant {
      font-size: 14px;
      font-weight: 500;
      color: var(--color-text-primary);
    }
    
    .warning-park {
      font-size: 12px;
      color: var(--color-text-secondary);
    }
  }
  
  .warning-detail {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .warning-days {
      font-size: 13px;
      font-weight: 500;
      padding: 4px 10px;
      border-radius: 20px;
      
      &.urgent {
        background: rgba(213, 42, 30, 0.1);
        color: var(--color-danger);
      }
      
      &.warning {
        background: rgba(230, 162, 60, 0.1);
        color: var(--color-warning);
      }
      
      &.normal {
        background: rgba(40, 102, 52, 0.1);
        color: var(--color-success);
      }
    }
  }
}

// 租金待收列表
.rent-list {
  .rent-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    border-bottom: 1px solid var(--border-color-lighter);
    transition: background 0.2s ease;
    
    &:hover {
      background: var(--bg-color);
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .rent-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    
    .rent-tenant {
      font-size: 14px;
      font-weight: 500;
      color: var(--color-text-primary);
    }
    
    .rent-period {
      font-size: 12px;
      color: var(--color-text-secondary);
    }
  }
  
  .rent-amount {
    display: flex;
    align-items: center;
    gap: 10px;
    
    .amount {
      font-size: 15px;
      font-weight: 600;
      color: var(--color-secondary);
    }
  }
}

// 活动时间线
.activity-timeline {
  padding: 16px 20px;
  
  :deep(.el-timeline-item) {
    padding-bottom: 16px;
    
    &:last-child {
      padding-bottom: 0;
    }
  }
  
  .activity-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
    
    .activity-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--color-text-primary);
    }
    
    .activity-desc {
      font-size: 13px;
      color: var(--color-text-secondary);
    }
  }
}

// 快捷入口
.quick-entry-card {
  :deep(.el-card__header) {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-color-light);
  }
  
  :deep(.el-card__body) {
    padding: 20px;
  }
}

.quick-entry-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 16px;
}

.quick-entry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 16px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--bg-color);
    transform: translateY(-2px);
    
    .entry-icon {
      transform: scale(1.1);
    }
  }
  
  .entry-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
    
    .el-icon {
      font-size: 24px;
      color: white;
    }
  }
  
  .entry-name {
    font-size: 13px;
    color: var(--color-text-regular);
    font-weight: 500;
  }
}

// 响应式适配
@media (max-width: 1400px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .panels-section {
    grid-template-columns: 1fr;
  }
  
  .quick-entry-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>

