<template>
  <div class="analysis-overview-page page-container">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">数据概览</h1>
        <p class="page-subtitle">核心业务指标实时监控与趋势分析</p>
      </div>
      <div class="header-actions">
        <el-date-picker v-model="dateRange" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 260px" />
        <el-button :icon="Refresh" @click="handleRefresh">刷新</el-button>
      </div>
    </div>

    <!-- KPI指标卡片 -->
    <div class="kpi-grid">
      <div class="kpi-card" v-for="kpi in kpiData" :key="kpi.label">
        <div class="kpi-header">
          <span class="kpi-label">{{ kpi.label }}</span>
          <el-tag :type="kpi.trend > 0 ? 'success' : 'danger'" size="small">
            {{ kpi.trend > 0 ? '+' : '' }}{{ kpi.trend }}%
          </el-tag>
        </div>
        <div class="kpi-value">{{ kpi.value }}</div>
        <div class="kpi-compare">较上期 {{ kpi.compare }}</div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-grid">
      <!-- 出租率趋势 -->
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">出租率趋势</span>
            <el-radio-group v-model="occupancyPeriod" size="small">
              <el-radio-button label="month">月度</el-radio-button>
              <el-radio-button label="quarter">季度</el-radio-button>
            </el-radio-group>
          </div>
        </template>
        <div ref="occupancyChartRef" class="chart-container"></div>
      </el-card>

      <!-- 租金收入分析 -->
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">租金收入分析</span>
          </div>
        </template>
        <div ref="revenueChartRef" class="chart-container"></div>
      </el-card>

      <!-- 园区资产分布 -->
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">园区资产分布</span>
          </div>
        </template>
        <div ref="assetChartRef" class="chart-container"></div>
      </el-card>

      <!-- 租户产业分布 -->
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">租户产业分布</span>
          </div>
        </template>
        <div ref="industryChartRef" class="chart-container"></div>
      </el-card>
    </div>

    <!-- 数据排行 -->
    <div class="ranking-section">
      <el-card class="ranking-card">
        <template #header>
          <span class="card-title">园区出租率排行</span>
        </template>
        <div class="ranking-list">
          <div class="ranking-item" v-for="(item, index) in occupancyRanking" :key="item.name">
            <span class="rank-num" :class="'rank-' + (index + 1)">{{ index + 1 }}</span>
            <span class="rank-name">{{ item.name }}</span>
            <el-progress :percentage="item.rate" :stroke-width="8" :show-text="false" />
            <span class="rank-value">{{ item.rate }}%</span>
          </div>
        </div>
      </el-card>

      <el-card class="ranking-card">
        <template #header>
          <span class="card-title">租金收入排行</span>
        </template>
        <div class="ranking-list">
          <div class="ranking-item" v-for="(item, index) in revenueRanking" :key="item.name">
            <span class="rank-num" :class="'rank-' + (index + 1)">{{ index + 1 }}</span>
            <span class="rank-name">{{ item.name }}</span>
            <span class="rank-value">¥{{ item.amount }}万</span>
          </div>
        </div>
      </el-card>

      <el-card class="ranking-card">
        <template #header>
          <span class="card-title">孵化企业成长排行</span>
        </template>
        <div class="ranking-list">
          <div class="ranking-item" v-for="(item, index) in growthRanking" :key="item.name">
            <span class="rank-num" :class="'rank-' + (index + 1)">{{ index + 1 }}</span>
            <span class="rank-name">{{ item.name }}</span>
            <span class="rank-value text-success">+{{ item.growth }}%</span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { Refresh } from '@element-plus/icons-vue'

const dateRange = ref(null)
const occupancyPeriod = ref('month')

const occupancyChartRef = ref(null)
const revenueChartRef = ref(null)
const assetChartRef = ref(null)
const industryChartRef = ref(null)

let occupancyChart = null
let revenueChart = null
let assetChart = null
let industryChart = null

const kpiData = ref([
  { label: '资产总数', value: '1,286', trend: 5.2, compare: '增加64项' },
  { label: '出租率', value: '92.6%', trend: -1.2, compare: '下降1.2%' },
  { label: '本月收入', value: '¥368.5万', trend: 8.3, compare: '增加28.2万' },
  { label: '在孵企业', value: '128', trend: 12.5, compare: '增加14家' },
  { label: '收缴率', value: '84.9%', trend: 3.6, compare: '提升3.6%' },
  { label: '服务满意度', value: '4.8', trend: 2.1, compare: '提升0.1分' }
])

const occupancyRanking = ref([
  { name: '科技产业园A区', rate: 94.2 },
  { name: '科技产业园B区', rate: 91.5 },
  { name: '文化产业园', rate: 88.7 }
])

const revenueRanking = ref([
  { name: '科技产业园A区', amount: 156.8 },
  { name: '科技产业园B区', amount: 128.5 },
  { name: '文化产业园', amount: 83.2 }
])

const growthRanking = ref([
  { name: '智能算法科技', growth: 156 },
  { name: '云计算服务公司', growth: 128 },
  { name: '创意动画工作室', growth: 95 },
  { name: '数字媒体科技', growth: 82 }
])

const initCharts = () => {
  // 出租率趋势图
  if (occupancyChartRef.value) {
    occupancyChart = echarts.init(occupancyChartRef.value)
    occupancyChart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['科技产业园A区', '科技产业园B区', '文化产业园'], bottom: 0 },
      grid: { top: 20, left: 50, right: 20, bottom: 50 },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'] },
      yAxis: { type: 'value', min: 80, max: 100, axisLabel: { formatter: '{value}%' } },
      series: [
        { name: '科技产业园A区', type: 'line', smooth: true, data: [92, 93, 94, 93, 94, 95, 94, 95, 94, 95, 94, 94], itemStyle: { color: '#BF933B' } },
        { name: '科技产业园B区', type: 'line', smooth: true, data: [90, 91, 90, 91, 92, 91, 92, 91, 92, 91, 92, 91], itemStyle: { color: '#042178' } },
        { name: '文化产业园', type: 'line', smooth: true, data: [86, 87, 88, 87, 88, 89, 88, 89, 88, 89, 88, 89], itemStyle: { color: '#286634' } }
      ]
    })
  }

  // 租金收入分析
  if (revenueChartRef.value) {
    revenueChart = echarts.init(revenueChartRef.value)
    revenueChart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['应收', '实收'], bottom: 0 },
      grid: { top: 20, left: 50, right: 20, bottom: 50 },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'] },
      yAxis: { type: 'value', axisLabel: { formatter: '{value}万' } },
      series: [
        { name: '应收', type: 'bar', data: [320, 310, 350, 340, 360, 355, 370, 365, 380, 375, 385, 368], itemStyle: { color: '#BF933B' } },
        { name: '实收', type: 'bar', data: [280, 290, 320, 310, 340, 330, 350, 345, 360, 355, 365, 312], itemStyle: { color: '#042178' } }
      ]
    })
  }

  // 园区资产分布
  if (assetChartRef.value) {
    assetChart = echarts.init(assetChartRef.value)
    assetChart.setOption({
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', right: 20, top: 'center' },
      series: [{
        type: 'pie', radius: ['45%', '70%'], center: ['35%', '50%'],
        itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 3 },
        label: { show: false },
        data: [
          { value: 486, name: '科技产业园A区', itemStyle: { color: '#BF933B' } },
          { value: 420, name: '科技产业园B区', itemStyle: { color: '#042178' } },
          { value: 380, name: '文化产业园', itemStyle: { color: '#286634' } }
        ]
      }]
    })
  }

  // 租户产业分布
  if (industryChartRef.value) {
    industryChart = echarts.init(industryChartRef.value)
    industryChart.setOption({
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', right: 20, top: 'center' },
      series: [{
        type: 'pie', radius: ['45%', '70%'], center: ['35%', '50%'],
        itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 3 },
        label: { show: false },
        data: [
          { value: 268, name: '科技产业', itemStyle: { color: '#042178' } },
          { value: 160, name: '文化产业', itemStyle: { color: '#BF933B' } }
        ]
      }]
    })
  }
}

const handleResize = () => {
  occupancyChart?.resize()
  revenueChart?.resize()
  assetChart?.resize()
  industryChart?.resize()
}

const handleRefresh = () => {
  initCharts()
}

onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  occupancyChart?.dispose()
  revenueChart?.dispose()
  assetChart?.dispose()
  industryChart?.dispose()
})
</script>

<style lang="scss" scoped>
.analysis-overview-page {
  .page-header {
    display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px;
    .page-title { font-size: 22px; font-weight: 600; color: var(--color-secondary); margin: 0 0 4px 0; }
    .page-subtitle { font-size: 14px; color: var(--color-text-secondary); margin: 0; }
    .header-actions { display: flex; gap: 12px; }
  }
}

.kpi-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; margin-bottom: 20px; }

.kpi-card {
  background: white; border-radius: var(--radius-lg); padding: 20px;
  box-shadow: var(--shadow-sm); transition: all 0.3s ease;
  
  &:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
  
  .kpi-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .kpi-label { font-size: 13px; color: var(--color-text-secondary); }
  .kpi-value { font-size: 26px; font-weight: 700; color: var(--color-secondary); margin-bottom: 8px; }
  .kpi-compare { font-size: 12px; color: var(--color-text-placeholder); }
}

.charts-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px; }

.chart-card {
  :deep(.el-card__header) { padding: 14px 20px; border-bottom: 1px solid var(--border-color-light); }
  :deep(.el-card__body) { padding: 20px; }
}

.card-header { display: flex; align-items: center; justify-content: space-between; .card-title { font-size: 15px; font-weight: 600; color: var(--color-secondary); } }

.chart-container { height: 280px; }

.ranking-section { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }

.ranking-card {
  :deep(.el-card__header) { padding: 14px 20px; border-bottom: 1px solid var(--border-color-light); }
  :deep(.el-card__body) { padding: 16px 20px; }
}

.ranking-list {
  .ranking-item {
    display: flex; align-items: center; gap: 12px; padding: 10px 0;
    border-bottom: 1px solid var(--border-color-lighter);
    
    &:last-child { border-bottom: none; }
    
    .rank-num {
      width: 24px; height: 24px; border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 600; background: var(--bg-color); color: var(--color-text-secondary);
      
      &.rank-1 { background: linear-gradient(135deg, #BF933B 0%, #D4A94D 100%); color: white; }
      &.rank-2 { background: linear-gradient(135deg, #042178 0%, #0A3399 100%); color: white; }
      &.rank-3 { background: linear-gradient(135deg, #286634 0%, #3D8A4D 100%); color: white; }
    }
    
    .rank-name { flex: 1; font-size: 14px; color: var(--color-text-primary); }
    .rank-value { font-size: 14px; font-weight: 600; color: var(--color-secondary); min-width: 70px; text-align: right; }
    
    :deep(.el-progress) { flex: 1; }
  }
}

.text-success { color: var(--color-success) !important; }

@media (max-width: 1400px) {
  .kpi-grid { grid-template-columns: repeat(3, 1fr); }
  .charts-grid { grid-template-columns: 1fr; }
  .ranking-section { grid-template-columns: 1fr; }
}
</style>

