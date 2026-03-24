<template>
  <div class="rent-page page-container">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">租金收缴管理</h1>
        <p class="page-subtitle">管理租金账单生成、收款记录、逾期催缴等</p>
      </div>
      <div class="header-actions">
        <el-button :icon="DocumentAdd">生成账单</el-button>
        <el-button type="primary" :icon="Plus" @click="handleAddPayment">录入收款</el-button>
      </div>
    </div>

    <!-- 统计卡片（月租金合计来自租赁台账融合数据，收缴状态为占位逻辑待对接实收） -->
    <div class="stats-row">
      <div class="mini-stat-card">
        <div class="mini-stat-icon primary"><el-icon><Money /></el-icon></div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">{{ statsLine.monthRecv }}</span>
          <span class="mini-stat-label">台账月租金参考（应收）</span>
        </div>
      </div>
      <div class="mini-stat-card">
        <div class="mini-stat-icon success"><el-icon><CircleCheck /></el-icon></div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">{{ statsLine.paid }}</span>
          <span class="mini-stat-label">已收金额（待对接）</span>
        </div>
      </div>
      <div class="mini-stat-card">
        <div class="mini-stat-icon warning"><el-icon><Clock /></el-icon></div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">{{ statsLine.pending }}</span>
          <span class="mini-stat-label">待收金额</span>
        </div>
      </div>
      <div class="mini-stat-card">
        <div class="mini-stat-icon danger"><el-icon><Warning /></el-icon></div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">{{ statsLine.overdue }}</span>
          <span class="mini-stat-label">逾期金额（待对接）</span>
        </div>
      </div>
      <div class="mini-stat-card">
        <div class="mini-stat-icon info"><el-icon><TrendCharts /></el-icon></div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">{{ statsLine.rate }}</span>
          <span class="mini-stat-label">收缴率（参考）</span>
        </div>
      </div>
    </div>

    <!-- 标签页 -->
    <el-card class="main-card">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="账单管理" name="bills">
          <div class="tab-filter">
            <el-form :model="billFilter" inline>
              <el-form-item label="账单状态">
                <el-select v-model="billFilter.status" placeholder="全部" clearable style="width: 120px">
                  <el-option label="待收" value="pending" />
                  <el-option label="已收" value="paid" />
                  <el-option label="逾期" value="overdue" />
                  <el-option label="部分收" value="partial" />
                </el-select>
              </el-form-item>
              <el-form-item label="账单月份">
                <el-date-picker v-model="billFilter.month" type="month" placeholder="选择月份" style="width: 140px" />
              </el-form-item>
              <el-form-item label="租户">
                <el-input v-model="billFilter.keyword" placeholder="租户名称" clearable style="width: 160px" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :icon="Search">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          
          <el-table :data="filteredBills" v-loading="loading" stripe>
            <el-table-column prop="billNo" label="账单编号" width="140">
              <template #default="{ row }"><span class="bill-no">{{ row.billNo }}</span></template>
            </el-table-column>
            <el-table-column prop="tenantName" label="租户名称" min-width="180" />
            <el-table-column prop="parkName" label="园区" width="140" />
            <el-table-column prop="billMonth" label="账单月份" width="100" />
            <el-table-column prop="billType" label="费用类型" width="100" />
            <el-table-column prop="amount" label="应收金额" width="120" align="right">
              <template #default="{ row }">¥{{ row.amount.toLocaleString() }}</template>
            </el-table-column>
            <el-table-column prop="paidAmount" label="已收金额" width="120" align="right">
              <template #default="{ row }">¥{{ row.paidAmount.toLocaleString() }}</template>
            </el-table-column>
            <el-table-column prop="dueDate" label="应收日期" width="110" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="billStatusType[row.status]" size="small">{{ billStatusMap[row.status] }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleViewBill(row)">查看</el-button>
                <el-button type="primary" link v-if="row.status !== 'paid'" @click="handleConfirmPayment(row)">确认收款</el-button>
                <el-button type="warning" link v-if="row.status === 'overdue'" @click="handleRemind(row)">催缴</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="收款记录" name="payments">
          <el-table :data="paymentList" stripe>
            <el-table-column prop="paymentNo" label="收款编号" width="140" />
            <el-table-column prop="tenantName" label="租户名称" min-width="180" />
            <el-table-column prop="amount" label="收款金额" width="120" align="right">
              <template #default="{ row }">¥{{ row.amount.toLocaleString() }}</template>
            </el-table-column>
            <el-table-column prop="paymentMethod" label="付款方式" width="100" />
            <el-table-column prop="paymentDate" label="收款日期" width="110" />
            <el-table-column prop="operator" label="操作人" width="100" />
            <el-table-column prop="remark" label="备注" min-width="150" />
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="押金管理" name="deposits">
          <el-table :data="depositList" stripe>
            <el-table-column prop="tenantName" label="租户名称" min-width="180" />
            <el-table-column prop="contractNo" label="合同编号" width="140" />
            <el-table-column prop="depositAmount" label="押金金额" width="120" align="right">
              <template #default="{ row }">¥{{ row.depositAmount.toLocaleString() }}</template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'holding' ? 'success' : 'info'" size="small">
                  {{ row.status === 'holding' ? '在押' : '已退' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="receiveDate" label="收取日期" width="110" />
            <el-table-column label="操作" width="120">
              <template #default="{ row }">
                <el-button type="primary" link v-if="row.status === 'holding'" @click="handleRefundDeposit(row)">退还</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 收款弹窗 -->
    <el-dialog v-model="paymentDialogVisible" title="录入收款" width="500px">
      <el-form ref="paymentFormRef" :model="paymentForm" :rules="paymentRules" label-width="100px">
        <el-form-item label="租户" prop="tenantId">
          <el-select v-model="paymentForm.tenantId" placeholder="请选择租户" style="width: 100%">
            <el-option label="深圳科技创新有限公司" value="1" />
            <el-option label="福田文化传媒集团" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="收款金额" prop="amount">
          <el-input-number v-model="paymentForm.amount" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="付款方式" prop="paymentMethod">
          <el-select v-model="paymentForm.paymentMethod" placeholder="请选择" style="width: 100%">
            <el-option label="银行转账" value="bank" />
            <el-option label="现金" value="cash" />
            <el-option label="支票" value="check" />
          </el-select>
        </el-form-item>
        <el-form-item label="收款日期" prop="paymentDate">
          <el-date-picker v-model="paymentForm.paymentDate" type="date" style="width: 100%" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="paymentForm.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="paymentDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitPayment">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Money, CircleCheck, Clock, Warning, TrendCharts, Search, DocumentAdd } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { leaseLedgerApi } from '@/api/modules/leaseLedger'

const billStatusMap = { pending: '待收', paid: '已收', overdue: '逾期', partial: '部分收' }
const billStatusType = { pending: 'warning', paid: 'success', overdue: 'danger', partial: 'info' }

const activeTab = ref('bills')
const loading = ref(false)
const billFilter = reactive({ status: '', month: null, keyword: '' })

const billList = ref([])
const paymentList = ref([])
const depositList = ref([])

function formatWan (num) {
  const n = Number(num) || 0
  if (n >= 10000) return `¥${(n / 10000).toFixed(2)}万`
  return `¥${n.toLocaleString('zh-CN')}`
}

const statsLine = computed(() => {
  const list = billList.value
  const total = list.reduce((s, r) => s + (r.amount || 0), 0)
  const paid = list.reduce((s, r) => s + (r.paidAmount || 0), 0)
  const pending = Math.max(0, total - paid)
  const overdue = list.filter((r) => r.status === 'overdue').reduce((s, r) => s + (r.amount - r.paidAmount), 0)
  const rate = total > 0 ? `${((paid / total) * 100).toFixed(1)}%` : '—'
  return {
    monthRecv: formatWan(total),
    paid: formatWan(paid),
    pending: formatWan(pending),
    overdue: formatWan(overdue),
    rate
  }
})

const filteredBills = computed(() => {
  let list = billList.value
  if (billFilter.keyword) {
    const k = billFilter.keyword.trim()
    list = list.filter((r) => r.tenantName && r.tenantName.includes(k))
  }
  if (billFilter.status) list = list.filter((r) => r.status === billFilter.status)
  return list
})

function buildBillsFromLedger (contracts) {
  const month = dayjs().format('YYYY-MM')
  return contracts
    .filter((c) => c.rentAmount > 0)
    .map((c) => {
      const amount = Math.round(c.rentAmount)
      return {
        billNo: `${c.contractNo}-${month}`,
        tenantName: c.tenantName,
        billMonth: month,
        billType: '租金',
        amount,
        paidAmount: 0,
        dueDate: `${month}-05`,
        status: 'pending',
        parkName: c.parkName,
        contractNo: c.contractNo
      }
    })
}

async function loadFromLedger () {
  loading.value = true
  try {
    const res = await leaseLedgerApi.getUnifiedContracts()
    if (res.code === 200 && res.data && res.data.list) {
      billList.value = buildBillsFromLedger(res.data.list)
    }
  } catch (e) {
    ElMessage.error(e.message || '加载租金数据失败')
  } finally {
    loading.value = false
  }
}

const paymentDialogVisible = ref(false)
const paymentFormRef = ref(null)
const paymentForm = reactive({ tenantId: '', amount: 0, paymentMethod: '', paymentDate: null, remark: '' })
const paymentRules = {
  tenantId: [{ required: true, message: '请选择租户', trigger: 'change' }],
  amount: [{ required: true, message: '请输入收款金额', trigger: 'blur' }],
  paymentMethod: [{ required: true, message: '请选择付款方式', trigger: 'change' }],
  paymentDate: [{ required: true, message: '请选择收款日期', trigger: 'change' }]
}

const handleAddPayment = () => { paymentDialogVisible.value = true }
const handleViewBill = (row) => { ElMessage.info('查看账单详情') }
const handleConfirmPayment = (row) => { ElMessage.success('收款确认成功') }
const handleRemind = (row) => { ElMessage.success('催缴通知已发送') }
const handleRefundDeposit = (row) => { ElMessage.info('押金退还流程') }
const handleSubmitPayment = async () => {
  if (!paymentFormRef.value) return
  await paymentFormRef.value.validate((valid) => {
    if (valid) { paymentDialogVisible.value = false; ElMessage.success('收款录入成功') }
  })
}

onMounted(loadFromLedger)
</script>

<style lang="scss" scoped>
.rent-page {
  .page-header {
    display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px;
    .page-title { font-size: 22px; font-weight: 600; color: var(--color-secondary); margin: 0 0 4px 0; }
    .page-subtitle { font-size: 14px; color: var(--color-text-secondary); margin: 0; }
    .header-actions { display: flex; gap: 12px; }
  }
}

.stats-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-bottom: 20px; }

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
    &.info { background: linear-gradient(135deg, #042178 0%, #0A3399 100%); }
  }
  
  .mini-stat-info {
    display: flex; flex-direction: column;
    .mini-stat-value { font-size: 20px; font-weight: 700; color: var(--color-secondary); }
    .mini-stat-label { font-size: 13px; color: var(--color-text-secondary); margin-top: 2px; }
  }
}

.main-card { :deep(.el-card__body) { padding: 20px; } }
.tab-filter { margin-bottom: 16px; :deep(.el-form-item) { margin-bottom: 0; margin-right: 16px; } }
.bill-no { font-family: 'Courier New', monospace; font-weight: 600; color: var(--color-primary); }
</style>

