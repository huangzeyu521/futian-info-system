<template>
  <div class="ledger-page page-container">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">租赁台账</h1>
        <p class="page-subtitle">
          数据来自《租赁台账（新）》台账导出（{{ sourceFile }}），与 Excel 保持一致
        </p>
      </div>
      <div class="header-actions">
        <el-button :icon="Refresh" @click="load">刷新</el-button>
      </div>
    </div>

    <el-alert
      type="info"
      show-icon
      :closable="false"
      class="ledger-tip"
      title="本页按 Excel 工作表分 Tab 展示；「租赁合同管理」中的列表由「产业入驻」两类台账融合生成。"
    />

    <el-card v-loading="loading" class="ledger-card">
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane
          v-for="(sheet, key) in sheets"
          :key="key"
          :label="tabLabel(key, sheet)"
          :name="key"
        >
          <div v-if="isKvSheet(sheet)" class="kv-wrap">
            <el-table :data="kvRows(sheet)" border stripe size="small" max-height="560">
              <el-table-column prop="label" label="项目" min-width="280" show-overflow-tooltip />
              <el-table-column prop="value" label="数值/说明" min-width="200" show-overflow-tooltip />
            </el-table>
          </div>
          <div v-else>
            <el-table :data="tableRows(sheet)" border stripe size="small" max-height="560">
              <el-table-column
                v-for="col in columnsFor(key, sheet)"
                :key="col.prop"
                :prop="col.prop"
                :label="col.label"
                :width="col.width"
                :min-width="col.minWidth"
                show-overflow-tooltip
              />
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { leaseLedgerApi } from '@/api/modules/leaseLedger'

const loading = ref(false)
const sourceFile = ref('')
const sheets = ref({})
const activeTab = ref('')

function tabLabel (key, sheet) {
  const short = key.length > 14 ? `${key.slice(0, 12)}…` : key
  return sheet.title ? `${short}` : key
}

function isKvSheet (sheet) {
  const rec = (sheet.records || []).find((r) => r && r.label !== undefined && r.value !== undefined)
  return !!rec && !(sheet.records || []).some((r) => r.tenantName || r.address)
}

function kvRows (sheet) {
  return (sheet.records || []).filter((r) => r && (r.label || r.value))
}

function tableRows (sheet) {
  return (sheet.records || []).filter((r) => r && !r._summaryRow && !r._noteRow)
}

function columnsFor (key, sheet) {
  if (key.includes('空置') || (sheet.title && sheet.title.includes('空置'))) {
    return [
      { prop: 'serialNo', label: '序号', width: 70 },
      { prop: 'address', label: '物业地址', minWidth: 140 },
      { prop: 'buildingRoom', label: '空置楼层', width: 120 },
      { prop: 'area', label: '面积(㎡)', width: 110 },
      { prop: 'floorOrNo', label: '评估价', width: 90 },
      { prop: 'rights', label: '权属', width: 100 },
      { prop: 'status', label: '状态', width: 90 },
      { prop: 'progress', label: '当前进展', minWidth: 120 },
      { prop: 'remark', label: '备注', minWidth: 160 }
    ]
  }
  if (key.includes('产业租赁台账') || (sheet.title && sheet.title.includes('入驻'))) {
    const isTai = key.includes('泰然')
    if (isTai) {
      return [
        { prop: 'zone', label: '栋数', width: 80 },
        { prop: 'buildingRoom', label: '入驻楼层', width: 160 },
        { prop: 'tenantName', label: '入驻企业名称', minWidth: 200 },
        { prop: 'purchaseBatch', label: '购置批次', width: 90 },
        { prop: 'leasedArea', label: '承租面积(㎡)', width: 120 },
        { prop: 'marketAssessPrice', label: '市场评估价', width: 100 },
        { prop: 'year1RentAfterDiscount', label: '第一年优惠月租金(元/月)', width: 160 },
        { prop: 'startDate', label: '起租日期', width: 110 },
        { prop: 'endDate', label: '终止日期', width: 110 },
        { prop: 'leaseTerm', label: '租期(年)', width: 80 },
        { prop: 'policyBasis', label: '引进部门', width: 100 },
        { prop: 'remark', label: '备注', minWidth: 140 }
      ]
    }
    return [
      { prop: 'zone', label: '栋数', width: 120 },
      { prop: 'buildingRoom', label: '入驻楼层', width: 90 },
      { prop: 'tenantName', label: '入驻企业名称', minWidth: 200 },
      { prop: 'propertyArea', label: '承租面积(㎡)', width: 110 },
      { prop: 'leaseUnitPrice', label: '租赁单价(元/㎡)', width: 120 },
      { prop: 'year1RentAfterDiscount', label: '第一年优惠月租金', width: 140 },
      { prop: 'startDate', label: '起租日期', width: 110 },
      { prop: 'endDate', label: '终止日期', width: 110 },
      { prop: 'leaseTerm', label: '租期(年)', width: 90 },
      { prop: 'policyBasis', label: '引进部门', width: 100 },
      { prop: 'rights', label: '权属', width: 120 },
      { prop: 'remark', label: '备注', minWidth: 140 }
    ]
  }
  return [
    { prop: 'label', label: '项目', minWidth: 200 },
    { prop: 'value', label: '数值', width: 140 }
  ]
}

async function load () {
  loading.value = true
  try {
    const res = await leaseLedgerApi.getLeaseLedgerRaw()
    if (res.code === 200 && res.data) {
      sourceFile.value = res.data.sourceFile || ''
      sheets.value = res.data.sheets || {}
      const keys = Object.keys(sheets.value)
      if (keys.length && !activeTab.value) activeTab.value = keys[0]
    }
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<style lang="scss" scoped>
.ledger-page {
  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 16px;
    .page-title { font-size: 22px; font-weight: 600; color: var(--color-secondary); margin: 0 0 4px 0; }
    .page-subtitle { font-size: 14px; color: var(--color-text-secondary); margin: 0; }
  }
}
.ledger-tip { margin-bottom: 16px; }
.ledger-card :deep(.el-card__body) { padding: 0; }
.kv-wrap { padding: 0; }
</style>
