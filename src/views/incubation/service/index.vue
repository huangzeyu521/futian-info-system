<template>
  <div class="incubation-service-page page-container">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">孵化服务管理</h1>
        <p class="page-subtitle">为孵化企业提供政策申报、知识产权、财税咨询等定制化服务</p>
      </div>
    </div>

    <!-- 服务类型卡片 -->
    <div class="service-type-grid">
      <div class="service-type-card" v-for="service in serviceTypes" :key="service.type">
        <div class="service-icon" :style="{ background: service.bgColor }">
          <el-icon><component :is="service.icon" /></el-icon>
        </div>
        <div class="service-info">
          <h3>{{ service.name }}</h3>
          <p>{{ service.desc }}</p>
        </div>
        <div class="service-stats">
          <span class="stat-value">{{ service.count }}</span>
          <span class="stat-label">服务次数</span>
        </div>
      </div>
    </div>

    <!-- 服务记录 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">服务记录</span>
          <el-button type="primary" size="small" :icon="Plus" @click="handleAddService">新增服务</el-button>
        </div>
      </template>
      <el-table :data="serviceList" stripe>
        <el-table-column prop="serviceNo" label="服务编号" width="140" />
        <el-table-column prop="companyName" label="企业名称" min-width="180" />
        <el-table-column prop="serviceType" label="服务类型" width="120">
          <template #default="{ row }">
            <el-tag size="small">{{ row.serviceType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="服务内容" min-width="200" show-overflow-tooltip />
        <el-table-column prop="startDate" label="开始日期" width="110" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'completed' ? 'success' : 'primary'" size="small">
              {{ row.status === 'completed' ? '已完成' : '进行中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="handler" label="服务专员" width="100" />
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
import { Plus, Document, Stamp, Coin, UserFilled, Connection, Promotion } from '@element-plus/icons-vue'

const serviceTypes = ref([
  { type: 'policy', name: '政策申报', desc: '高新认定、项目申报', icon: 'Document', bgColor: 'linear-gradient(135deg, #BF933B 0%, #D4A94D 100%)', count: 156 },
  { type: 'ip', name: '知识产权', desc: '专利、商标、版权', icon: 'Stamp', bgColor: 'linear-gradient(135deg, #042178 0%, #0A3399 100%)', count: 89 },
  { type: 'finance', name: '财税咨询', desc: '财务规划、税务筹划', icon: 'Coin', bgColor: 'linear-gradient(135deg, #286634 0%, #3D8A4D 100%)', count: 124 },
  { type: 'hr', name: '人才招聘', desc: '人才对接、招聘服务', icon: 'UserFilled', bgColor: 'linear-gradient(135deg, #E6A23C 0%, #F0B452 100%)', count: 67 },
  { type: 'resource', name: '资源对接', desc: '投融资、合作伙伴', icon: 'Connection', bgColor: 'linear-gradient(135deg, #D52A1E 0%, #E84D42 100%)', count: 45 },
  { type: 'market', name: '市场推广', desc: '品牌宣传、活动策划', icon: 'Promotion', bgColor: 'linear-gradient(135deg, #909399 0%, #A6A9AD 100%)', count: 38 }
])

const serviceList = ref([
  { serviceNo: 'FH202412001', companyName: '智能算法科技有限公司', serviceType: '政策申报', content: '高新技术企业认定申报辅导', startDate: '2024-12-20', status: 'processing', handler: '张专员' },
  { serviceNo: 'FH202412002', companyName: '云计算服务公司', serviceType: '知识产权', content: '发明专利申请代理', startDate: '2024-12-18', status: 'processing', handler: '李专员' },
  { serviceNo: 'FH202412003', companyName: '创意动画工作室', serviceType: '财税咨询', content: '年度财务规划咨询', startDate: '2024-12-15', status: 'completed', handler: '王专员' },
  { serviceNo: 'FH202412004', companyName: '数字媒体科技', serviceType: '资源对接', content: 'A轮融资对接服务', startDate: '2024-12-10', status: 'completed', handler: '赵专员' }
])

const handleAddService = () => { ElMessage.info('新增服务') }
const handleView = (row) => { ElMessage.info('查看服务详情') }
</script>

<style lang="scss" scoped>
.incubation-service-page {
  .page-header {
    display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px;
    .page-title { font-size: 22px; font-weight: 600; color: var(--color-secondary); margin: 0 0 4px 0; }
    .page-subtitle { font-size: 14px; color: var(--color-text-secondary); margin: 0; }
  }
}

.service-type-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; }

.service-type-card {
  display: flex; align-items: center; gap: 16px; padding: 20px;
  background: white; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm);
  transition: all 0.3s ease; cursor: pointer;
  
  &:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
  
  .service-icon {
    width: 52px; height: 52px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    .el-icon { font-size: 26px; color: white; }
  }
  
  .service-info {
    flex: 1;
    h3 { font-size: 15px; font-weight: 600; color: var(--color-secondary); margin: 0 0 4px 0; }
    p { font-size: 13px; color: var(--color-text-secondary); margin: 0; }
  }
  
  .service-stats {
    text-align: center;
    .stat-value { display: block; font-size: 22px; font-weight: 700; color: var(--color-primary); }
    .stat-label { font-size: 12px; color: var(--color-text-secondary); }
  }
}

.table-card { :deep(.el-card__header) { padding: 14px 20px; } :deep(.el-card__body) { padding: 0; } }
.card-header { display: flex; align-items: center; justify-content: space-between; .card-title { font-size: 15px; font-weight: 600; color: var(--color-secondary); } }
</style>

