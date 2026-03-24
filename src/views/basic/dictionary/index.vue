<template>
  <div class="dictionary-page page-container">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">基础字典管理</h1>
        <p class="page-subtitle">维护系统核心基础数据，如租金类型、付款周期、产业分类等</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus" @click="handleAddDict">新增字典</el-button>
      </div>
    </div>

    <div class="dict-layout">
      <!-- 字典分类 -->
      <el-card class="dict-category-card">
        <template #header>
          <span class="card-title">字典分类</span>
        </template>
        <el-menu :default-active="activeDict" @select="handleSelectDict">
          <el-menu-item v-for="dict in dictCategories" :key="dict.code" :index="dict.code">
            <el-icon><component :is="dict.icon" /></el-icon>
            <span>{{ dict.name }}</span>
            <el-badge :value="dict.count" class="dict-badge" />
          </el-menu-item>
        </el-menu>
      </el-card>

      <!-- 字典项列表 -->
      <el-card class="dict-items-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">{{ currentDictName }} - 字典项</span>
            <el-button type="primary" size="small" :icon="Plus" @click="handleAddItem">新增项</el-button>
          </div>
        </template>
        <el-table :data="dictItems" v-loading="loading" stripe>
          <el-table-column prop="label" label="显示名称" width="180" />
          <el-table-column prop="value" label="字典值" width="140" />
          <el-table-column prop="sort" label="排序" width="80" align="center" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(row)" />
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="200" />
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link @click="handleEditItem(row)">编辑</el-button>
              <el-button type="danger" link @click="handleDeleteItem(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 字典项弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" destroy-on-close>
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="显示名称" prop="label">
          <el-input v-model="formData.label" placeholder="请输入显示名称" />
        </el-form-item>
        <el-form-item label="字典值" prop="value">
          <el-input v-model="formData.value" placeholder="请输入字典值" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Money, Calendar, List, Setting, Document, OfficeBuilding } from '@element-plus/icons-vue'

const loading = ref(false)
const activeDict = ref('rent_type')
const dialogVisible = ref(false)
const dialogTitle = ref('新增字典项')
const formRef = ref(null)

const dictCategories = ref([
  { code: 'rent_type', name: '租金类型', icon: 'Money', count: 4 },
  { code: 'payment_cycle', name: '付款周期', icon: 'Calendar', count: 3 },
  { code: 'industry_type', name: '产业分类', icon: 'OfficeBuilding', count: 6 },
  { code: 'contract_status', name: '合同状态', icon: 'Document', count: 5 },
  { code: 'service_type', name: '服务类型', icon: 'Setting', count: 8 },
  { code: 'asset_status', name: '资产状态', icon: 'List', count: 4 }
])

const currentDictName = computed(() => {
  const dict = dictCategories.value.find(d => d.code === activeDict.value)
  return dict ? dict.name : ''
})

const dictItems = ref([
  { id: 1, label: '基础租金', value: 'basic', sort: 1, status: 1, remark: '按面积计算的基础租金' },
  { id: 2, label: '物业费', value: 'property', sort: 2, status: 1, remark: '物业管理服务费用' },
  { id: 3, label: '水电费', value: 'utility', sort: 3, status: 1, remark: '水电公摊费用' },
  { id: 4, label: '停车费', value: 'parking', sort: 4, status: 1, remark: '停车位租赁费用' }
])

const formData = reactive({
  label: '',
  value: '',
  sort: 0,
  status: 1,
  remark: ''
})

const formRules = {
  label: [{ required: true, message: '请输入显示名称', trigger: 'blur' }],
  value: [{ required: true, message: '请输入字典值', trigger: 'blur' }]
}

const handleSelectDict = (code) => {
  activeDict.value = code
  fetchDictItems()
}

const fetchDictItems = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 300)
}

const handleAddDict = () => {
  ElMessage.info('新增字典分类功能开发中')
}

const handleAddItem = () => {
  dialogTitle.value = '新增字典项'
  Object.assign(formData, { label: '', value: '', sort: 0, status: 1, remark: '' })
  dialogVisible.value = true
}

const handleEditItem = (row) => {
  dialogTitle.value = '编辑字典项'
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleDeleteItem = (row) => {
  ElMessageBox.confirm(`确定要删除 "${row.label}" 吗？`, '提示', {
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
  })
}

const handleStatusChange = (row) => {
  ElMessage.success('状态更新成功')
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      dialogVisible.value = false
      ElMessage.success('保存成功')
    }
  })
}

onMounted(() => {
  fetchDictItems()
})
</script>

<style lang="scss" scoped>
.dictionary-page {
  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 20px;
    
    .page-title {
      font-size: 22px;
      font-weight: 600;
      color: var(--color-secondary);
      margin: 0 0 4px 0;
    }
    
    .page-subtitle {
      font-size: 14px;
      color: var(--color-text-secondary);
      margin: 0;
    }
  }
}

.dict-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;
}

.dict-category-card {
  height: fit-content;
  
  :deep(.el-card__header) {
    padding: 14px 20px;
    border-bottom: 1px solid var(--border-color-light);
  }
  
  :deep(.el-card__body) {
    padding: 0;
  }
  
  :deep(.el-menu) {
    border: none;
    
    .el-menu-item {
      height: 50px;
      line-height: 50px;
      margin: 4px 8px;
      border-radius: 8px;
      
      &.is-active {
        background: rgba(191, 147, 59, 0.1);
        color: var(--color-primary);
      }
      
      .dict-badge {
        margin-left: auto;
        
        :deep(.el-badge__content) {
          background: var(--color-primary);
        }
      }
    }
  }
}

.dict-items-card {
  :deep(.el-card__header) {
    padding: 14px 20px;
    border-bottom: 1px solid var(--border-color-light);
  }
  
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-secondary);
}
</style>

