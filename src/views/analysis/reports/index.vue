<template>
  <div class="reports-page page-container">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">报表中心</h1>
        <p class="page-subtitle">生成各类业务报表，支持导出和定制</p>
      </div>
    </div>

    <!-- 报表分类 -->
    <div class="report-categories">
      <div class="category-card" v-for="category in reportCategories" :key="category.type" @click="handleSelectCategory(category)">
        <div class="category-icon" :style="{ background: category.bgColor }">
          <el-icon><component :is="category.icon" /></el-icon>
        </div>
        <div class="category-info">
          <h3>{{ category.name }}</h3>
          <p>{{ category.desc }}</p>
        </div>
        <el-icon class="category-arrow"><ArrowRight /></el-icon>
      </div>
    </div>

    <!-- 报表列表 -->
    <el-card class="report-list-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">常用报表</span>
          <el-input v-model="searchKeyword" placeholder="搜索报表" prefix-icon="Search" style="width: 240px" clearable />
        </div>
      </template>
      <el-table :data="reportList" stripe>
        <el-table-column prop="reportName" label="报表名称" min-width="200">
          <template #default="{ row }">
            <div class="report-name-cell">
              <el-icon class="report-icon"><Document /></el-icon>
              <span>{{ row.reportName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="报表分类" width="120">
          <template #default="{ row }">
            <el-tag size="small">{{ row.category }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="150" />
        <el-table-column prop="frequency" label="更新频率" width="100" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" link @click="handlePreview(row)">预览</el-button>
            <el-button type="success" link @click="handleExport(row, 'excel')">导出Excel</el-button>
            <el-button type="warning" link @click="handleExport(row, 'pdf')">导出PDF</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 最近生成 -->
    <el-card class="recent-card">
      <template #header>
        <span class="card-title">最近生成的报表</span>
      </template>
      <div class="recent-list">
        <div class="recent-item" v-for="item in recentReports" :key="item.id">
          <div class="recent-icon">
            <el-icon><Document /></el-icon>
          </div>
          <div class="recent-info">
            <span class="recent-name">{{ item.name }}</span>
            <span class="recent-time">{{ item.time }}</span>
          </div>
          <el-button type="primary" link size="small" @click="handleDownload(item)">下载</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowRight, Document, OfficeBuilding, Money, TrendCharts, DataAnalysis } from '@element-plus/icons-vue'

const searchKeyword = ref('')

const reportCategories = ref([
  { type: 'asset', name: '资产报表', desc: '资产状况、分布、变动分析', icon: 'OfficeBuilding', bgColor: 'linear-gradient(135deg, #BF933B 0%, #D4A94D 100%)' },
  { type: 'lease', name: '租赁报表', desc: '合同、租金、出租率分析', icon: 'Document', bgColor: 'linear-gradient(135deg, #042178 0%, #0A3399 100%)' },
  { type: 'finance', name: '财务报表', desc: '收入、支出、利润分析', icon: 'Money', bgColor: 'linear-gradient(135deg, #286634 0%, #3D8A4D 100%)' },
  { type: 'incubation', name: '孵化报表', desc: '孵化企业成长、服务分析', icon: 'TrendCharts', bgColor: 'linear-gradient(135deg, #E6A23C 0%, #F0B452 100%)' }
])

const reportList = ref([
  { reportName: '月度资产状况报表', category: '资产报表', updateTime: '2024-12-28 10:00', frequency: '月度' },
  { reportName: '租金收缴情况报表', category: '租赁报表', updateTime: '2024-12-28 09:30', frequency: '月度' },
  { reportName: '园区出租率分析报表', category: '租赁报表', updateTime: '2024-12-27 18:00', frequency: '周度' },
  { reportName: '合同到期预警报表', category: '租赁报表', updateTime: '2024-12-28 08:00', frequency: '日度' },
  { reportName: '孵化企业成长报表', category: '孵化报表', updateTime: '2024-12-25 15:00', frequency: '季度' },
  { reportName: '年度收入汇总报表', category: '财务报表', updateTime: '2024-12-20 10:00', frequency: '年度' }
])

const recentReports = ref([
  { id: 1, name: '2024年12月租金收缴报表.xlsx', time: '10分钟前' },
  { id: 2, name: '科技产业园A区出租率报表.pdf', time: '1小时前' },
  { id: 3, name: '2024年Q4孵化企业成长报表.xlsx', time: '3小时前' }
])

const handleSelectCategory = (category) => { ElMessage.info(`查看${category.name}`) }
const handlePreview = (row) => { ElMessage.info('预览报表') }
const handleExport = (row, type) => { ElMessage.success(`正在导出${type.toUpperCase()}格式`) }
const handleDownload = (item) => { ElMessage.success('开始下载') }
</script>

<style lang="scss" scoped>
.reports-page {
  .page-header {
    display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px;
    .page-title { font-size: 22px; font-weight: 600; color: var(--color-secondary); margin: 0 0 4px 0; }
    .page-subtitle { font-size: 14px; color: var(--color-text-secondary); margin: 0; }
  }
}

.report-categories { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }

.category-card {
  display: flex; align-items: center; gap: 16px; padding: 20px;
  background: white; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm);
  cursor: pointer; transition: all 0.3s ease;
  
  &:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); .category-arrow { color: var(--color-primary); } }
  
  .category-icon {
    width: 52px; height: 52px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    .el-icon { font-size: 26px; color: white; }
  }
  
  .category-info {
    flex: 1;
    h3 { font-size: 15px; font-weight: 600; color: var(--color-secondary); margin: 0 0 4px 0; }
    p { font-size: 13px; color: var(--color-text-secondary); margin: 0; }
  }
  
  .category-arrow { font-size: 18px; color: var(--color-text-placeholder); transition: color 0.3s; }
}

.report-list-card { margin-bottom: 20px; :deep(.el-card__header) { padding: 14px 20px; } :deep(.el-card__body) { padding: 0; } }
.card-header { display: flex; align-items: center; justify-content: space-between; .card-title { font-size: 15px; font-weight: 600; color: var(--color-secondary); } }

.report-name-cell { display: flex; align-items: center; gap: 10px; .report-icon { color: var(--color-primary); font-size: 18px; } }

.recent-card { :deep(.el-card__header) { padding: 14px 20px; } :deep(.el-card__body) { padding: 0; } }

.recent-list {
  .recent-item {
    display: flex; align-items: center; gap: 14px; padding: 14px 20px;
    border-bottom: 1px solid var(--border-color-lighter);
    
    &:last-child { border-bottom: none; }
    
    .recent-icon {
      width: 40px; height: 40px; border-radius: 8px; background: var(--bg-color);
      display: flex; align-items: center; justify-content: center;
      .el-icon { font-size: 20px; color: var(--color-primary); }
    }
    
    .recent-info {
      flex: 1; display: flex; flex-direction: column;
      .recent-name { font-size: 14px; color: var(--color-text-primary); }
      .recent-time { font-size: 12px; color: var(--color-text-secondary); margin-top: 2px; }
    }
  }
}

@media (max-width: 1200px) { .report-categories { grid-template-columns: repeat(2, 1fr); } }
</style>

