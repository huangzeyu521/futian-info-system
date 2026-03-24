<template>
  <div class="contracts-page page-container">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">租赁合同管理</h1>
        <p class="page-subtitle">管理租赁合同全生命周期，包括签订、变更、归档等</p>
      </div>
      <div class="header-actions">
        <el-button :icon="Upload">批量导入</el-button>
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增合同</el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-row">
      <div class="mini-stat-card" v-for="stat in statsData" :key="stat.label">
        <div class="mini-stat-icon" :class="stat.iconClass">
          <el-icon><component :is="stat.icon" /></el-icon>
        </div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">{{ stat.value }}</span>
          <span class="mini-stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>

    <!-- 筛选区 -->
    <el-card class="filter-card">
      <el-form :model="filterForm" inline>
        <el-form-item label="合同状态">
          <el-select v-model="filterForm.status" placeholder="全部状态" clearable style="width: 130px">
            <el-option label="执行中" value="active" />
            <el-option label="待签署" value="pending" />
            <el-option label="即将到期" value="expiring" />
            <el-option label="已终止" value="terminated" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属园区">
          <el-select v-model="filterForm.parkId" placeholder="全部园区" clearable style="width: 170px">
            <el-option label="新一代产业园" value="xin" />
            <el-option label="泰然立城" value="tai" />
          </el-select>
        </el-form-item>
        <el-form-item label="签订时间">
          <el-date-picker v-model="filterForm.dateRange" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 240px" />
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="filterForm.keyword" placeholder="合同编号/租户名称" clearable style="width: 180px" prefix-icon="Search" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-card class="table-card">
      <template #header>
        <div class="table-header">
          <div class="table-title">
            <span>合同列表</span>
            <el-tag type="info" size="small">共 {{ total }} 条</el-tag>
          </div>
        </div>
      </template>

      <el-table :data="contractList" v-loading="loading" stripe>
        <el-table-column prop="contractNo" label="合同编号" width="140" fixed>
          <template #default="{ row }">
            <span class="contract-no">{{ row.contractNo }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tenantName" label="租户名称" min-width="200" />
        <el-table-column prop="parkName" label="所属园区" width="140" />
        <el-table-column prop="roomInfo" label="租赁房间" width="120" />
        <el-table-column prop="area" label="面积(㎡)" width="100" align="right">
          <template #default="{ row }">
            {{ row.area > 0 ? row.area : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="rentAmount" label="月租金(元)" width="120" align="right">
          <template #default="{ row }">
            <span v-if="row.rentAmount > 0">¥{{ Number(row.rentAmount).toLocaleString() }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="startDate" label="开始日期" width="110" />
        <el-table-column prop="endDate" label="结束日期" width="110" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusTypeMap[row.status]" size="small">{{ statusMap[row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">查看</el-button>
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-dropdown trigger="click">
              <el-button type="primary" link>更多<el-icon class="el-icon--right"><ArrowDown /></el-icon></el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleRenew(row)">续签</el-dropdown-item>
                  <el-dropdown-item @click="handleChange(row)">变更</el-dropdown-item>
                  <el-dropdown-item @click="handleTerminate(row)">终止</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50]" :total="total" layout="total, sizes, prev, pager, next, jumper" />
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="800px" destroy-on-close>
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="合同编号" prop="contractNo">
              <el-input v-model="formData.contractNo" placeholder="系统自动生成" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="租户" prop="tenantId">
              <el-select v-model="formData.tenantId" placeholder="请选择租户" style="width: 100%">
                <el-option label="深圳科技创新有限公司" value="1" />
                <el-option label="福田文化传媒集团" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属园区" prop="parkId">
              <el-select v-model="formData.parkId" placeholder="请选择园区" style="width: 100%">
                <el-option label="科技产业园A区" value="1" />
                <el-option label="科技产业园B区" value="2" />
                <el-option label="文化产业园" value="3" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="租赁房间" prop="roomId">
              <el-select v-model="formData.roomId" placeholder="请选择房间" style="width: 100%">
                <el-option label="A栋301 (150.5㎡)" value="1" />
                <el-option label="A栋302 (120㎡)" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="租赁期限" prop="dateRange">
              <el-date-picker v-model="formData.dateRange" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="月租金" prop="rentAmount">
              <el-input-number v-model="formData.rentAmount" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="押金" prop="deposit">
              <el-input-number v-model="formData.deposit" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="付款周期" prop="paymentCycle">
              <el-select v-model="formData.paymentCycle" placeholder="请选择付款周期" style="width: 100%">
                <el-option label="月付" value="monthly" />
                <el-option label="季付" value="quarterly" />
                <el-option label="年付" value="yearly" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Upload, Search, Refresh, ArrowDown, Document, CircleCheck, Warning, Timer } from '@element-plus/icons-vue'
import { leaseLedgerApi } from '@/api/modules/leaseLedger'

const statusMap = { active: '执行中', pending: '待签署', expiring: '即将到期', terminated: '已终止' }
const statusTypeMap = { active: 'success', pending: 'warning', expiring: 'danger', terminated: 'info' }

const statsRes = ref({ total: 0, active: 0, expiring: 0, pending: 0, terminated: 0 })
const statsData = computed(() => [
  { icon: Document, iconClass: 'primary', label: '合同总数', value: String(statsRes.value.total) },
  { icon: CircleCheck, iconClass: 'success', label: '执行中', value: String(statsRes.value.active) },
  { icon: Warning, iconClass: 'danger', label: '即将到期', value: String(statsRes.value.expiring) },
  { icon: Timer, iconClass: 'warning', label: '待签署', value: String(statsRes.value.pending) }
])

const filterForm = reactive({ status: '', parkId: '', dateRange: null, keyword: '' })
const loading = ref(false)
const allContracts = ref([])
const currentPage = ref(1)
const pageSize = ref(10)

const parkNameByFilter = { xin: '新一代产业园', tai: '泰然立城' }

const filteredList = computed(() => {
  let list = allContracts.value
  if (filterForm.keyword) {
    const k = filterForm.keyword.trim()
    list = list.filter(
      (r) =>
        (r.tenantName && r.tenantName.includes(k)) ||
        (r.contractNo && r.contractNo.includes(k))
    )
  }
  if (filterForm.status) list = list.filter((r) => r.status === filterForm.status)
  if (filterForm.parkId && parkNameByFilter[filterForm.parkId]) {
    const name = parkNameByFilter[filterForm.parkId]
    list = list.filter((r) => r.parkName === name)
  }
  return list
})

const total = computed(() => filteredList.value.length)

const contractList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredList.value.slice(start, start + pageSize.value)
})

watch([() => filterForm.status, () => filterForm.parkId, () => filterForm.keyword], () => {
  currentPage.value = 1
})

const dialogVisible = ref(false)
const dialogTitle = ref('新增合同')
const formRef = ref(null)
const formData = reactive({
  contractNo: '',
  tenantId: '',
  parkId: '',
  roomId: '',
  dateRange: null,
  rentAmount: 0,
  deposit: 0,
  paymentCycle: 'monthly',
  remark: ''
})

const formRules = {
  tenantId: [{ required: true, message: '请选择租户', trigger: 'change' }],
  parkId: [{ required: true, message: '请选择园区', trigger: 'change' }],
  roomId: [{ required: true, message: '请选择房间', trigger: 'change' }],
  dateRange: [{ required: true, message: '请选择租赁期限', trigger: 'change' }],
  rentAmount: [{ required: true, message: '请输入月租金', trigger: 'blur' }]
}

const fetchContractList = async () => {
  loading.value = true
  try {
    const res = await leaseLedgerApi.getUnifiedContracts()
    if (res.code === 200 && res.data) {
      allContracts.value = res.data.list || []
      const s = res.data.stats || {}
      statsRes.value = {
        total: s.total ?? 0,
        active: s.active ?? 0,
        expiring: s.expiring ?? 0,
        pending: s.pending ?? 0,
        terminated: s.terminated ?? 0
      }
    }
  } catch (e) {
    ElMessage.error(e.message || '加载租赁合同失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
}
const handleReset = () => {
  Object.assign(filterForm, { status: '', parkId: '', dateRange: null, keyword: '' })
  currentPage.value = 1
}
const handleAdd = () => { dialogTitle.value = '新增合同'; formData.contractNo = `HT${Date.now()}`; dialogVisible.value = true }
const handleEdit = (row) => { dialogTitle.value = '编辑合同'; Object.assign(formData, row); dialogVisible.value = true }
const handleView = (row) => { ElMessage.info('查看合同详情功能开发中') }
const handleRenew = (row) => { ElMessage.info('续签功能开发中') }
const handleChange = (row) => { ElMessage.info('变更功能开发中') }
const handleTerminate = (row) => { ElMessageBox.confirm('确定要终止该合同吗？', '提示', { type: 'warning' }).then(() => { ElMessage.success('合同已终止') }) }

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) { dialogVisible.value = false; ElMessage.success('保存成功'); fetchContractList() }
  })
}

onMounted(() => { fetchContractList() })
</script>

<style lang="scss" scoped>
.contracts-page {
  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 20px;
    
    .page-title { font-size: 22px; font-weight: 600; color: var(--color-secondary); margin: 0 0 4px 0; }
    .page-subtitle { font-size: 14px; color: var(--color-text-secondary); margin: 0; }
    .header-actions { display: flex; gap: 12px; }
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
    &.danger { background: linear-gradient(135deg, #D52A1E 0%, #E84D42 100%); }
    &.warning { background: linear-gradient(135deg, #E6A23C 0%, #F0B452 100%); }
  }
  
  .mini-stat-info {
    display: flex; flex-direction: column;
    .mini-stat-value { font-size: 20px; font-weight: 700; color: var(--color-secondary); }
    .mini-stat-label { font-size: 13px; color: var(--color-text-secondary); margin-top: 2px; }
  }
}

.filter-card { margin-bottom: 20px; :deep(.el-card__body) { padding: 16px 20px; } :deep(.el-form-item) { margin-bottom: 0; margin-right: 16px; } }

.table-card {
  :deep(.el-card__header) { padding: 14px 20px; border-bottom: 1px solid var(--border-color-light); }
  :deep(.el-card__body) { padding: 0; }
}

.table-header { display: flex; align-items: center; justify-content: space-between;
  .table-title { display: flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 600; color: var(--color-secondary); }
}

.contract-no { font-family: 'Courier New', monospace; font-weight: 600; color: var(--color-primary); }

.pagination-wrapper { display: flex; justify-content: flex-end; padding: 16px 20px; border-top: 1px solid var(--border-color-lighter); }
</style>

