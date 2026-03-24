<template>
  <div class="assets-page page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">资产台账管理</h1>
        <p class="page-subtitle">管理园区资产信息，包括楼宇、房间、配套设施等</p>
      </div>
      <div class="header-actions">
        <el-button :icon="Upload">批量导入</el-button>
        <el-button :icon="Download">导出数据</el-button>
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增资产</el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-row">
      <div class="mini-stat-card">
        <div class="mini-stat-icon primary">
          <el-icon><OfficeBuilding /></el-icon>
        </div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">{{ stats.total }}</span>
          <span class="mini-stat-label">资产总数</span>
        </div>
      </div>
      <div class="mini-stat-card">
        <div class="mini-stat-icon success">
          <el-icon><Select /></el-icon>
        </div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">{{ stats.available }}</span>
          <span class="mini-stat-label">可租资产</span>
        </div>
      </div>
      <div class="mini-stat-card">
        <div class="mini-stat-icon warning">
          <el-icon><Document /></el-icon>
        </div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">{{ stats.rented }}</span>
          <span class="mini-stat-label">已租资产</span>
        </div>
      </div>
      <div class="mini-stat-card">
        <div class="mini-stat-icon danger">
          <el-icon><Tools /></el-icon>
        </div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">{{ stats.maintenance }}</span>
          <span class="mini-stat-label">维修中</span>
        </div>
      </div>
      <div class="mini-stat-card">
        <div class="mini-stat-icon info">
          <el-icon><Histogram /></el-icon>
        </div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">{{ stats.area }}㎡</span>
          <span class="mini-stat-label">总面积</span>
        </div>
      </div>
    </div>

    <!-- 搜索筛选区 -->
    <el-card class="filter-card">
      <el-form :model="filterForm" inline>
        <el-form-item label="园区">
          <el-select v-model="filterForm.parkId" placeholder="全部园区" clearable style="width: 160px">
            <el-option 
              v-for="park in parkOptions" 
              :key="park.value" 
              :label="park.label" 
              :value="park.value" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="产业类型">
          <el-select v-model="filterForm.industryType" placeholder="全部类型" clearable style="width: 140px">
            <el-option label="科技产业" value="tech" />
            <el-option label="文化产业" value="culture" />
          </el-select>
        </el-form-item>
        <el-form-item label="资产状态">
          <el-select v-model="filterForm.status" placeholder="全部状态" clearable style="width: 120px">
            <el-option label="可租" value="available" />
            <el-option label="已租" value="rented" />
            <el-option label="维修中" value="maintenance" />
            <el-option label="空置" value="vacant" />
          </el-select>
        </el-form-item>
        <el-form-item label="楼宇">
          <el-select v-model="filterForm.buildingId" placeholder="全部楼宇" clearable style="width: 140px">
            <el-option 
              v-for="building in buildingOptions" 
              :key="building.value" 
              :label="building.label" 
              :value="building.value" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input 
            v-model="filterForm.keyword" 
            placeholder="资产编号/名称" 
            clearable 
            style="width: 180px"
            prefix-icon="Search"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <template #header>
        <div class="table-header">
          <div class="table-title">
            <span>资产列表</span>
            <el-tag type="info" size="small">共 {{ total }} 条</el-tag>
          </div>
          <div class="table-actions">
            <el-radio-group v-model="viewMode" size="small">
              <el-radio-button label="table">
                <el-icon><List /></el-icon>
              </el-radio-button>
              <el-radio-button label="card">
                <el-icon><Grid /></el-icon>
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </template>

      <!-- 表格视图 -->
      <el-table
        v-if="viewMode === 'table'"
        :data="assetList"
        v-loading="loading"
        stripe
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="assetCode" label="资产编号" width="140" fixed>
          <template #default="{ row }">
            <span class="asset-code">{{ row.assetCode }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="parkName" label="所属园区" width="160" />
        <el-table-column prop="buildingName" label="楼宇" width="120" />
        <el-table-column prop="roomNo" label="房间号" width="100" />
        <el-table-column prop="area" label="面积(㎡)" width="100" align="right">
          <template #default="{ row }">
            {{ row.area.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="industryType" label="产业类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.industryType === 'tech' ? 'primary' : 'success'" size="small">
              {{ row.industryType === 'tech' ? '科技产业' : '文化产业' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <span class="status-tag" :class="row.status">
              {{ statusMap[row.status] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="rentPrice" label="租金标准(元/㎡/月)" width="150" align="right">
          <template #default="{ row }">
            ¥{{ row.rentPrice.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="tenantName" label="当前租户" min-width="180">
          <template #default="{ row }">
            <span v-if="row.tenantName">{{ row.tenantName }}</span>
            <span v-else class="text-placeholder">-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">查看</el-button>
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-dropdown trigger="click">
              <el-button type="primary" link>
                更多<el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleStatusChange(row)">状态变更</el-dropdown-item>
                  <el-dropdown-item @click="handleHistory(row)">变更记录</el-dropdown-item>
                  <el-dropdown-item divided @click="handleDelete(row)">
                    <span class="text-danger">删除</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <!-- 卡片视图 -->
      <div v-else class="asset-card-grid">
        <div 
          v-for="asset in assetList" 
          :key="asset.id" 
          class="asset-card"
          @click="handleView(asset)"
        >
          <div class="asset-card-header">
            <span class="asset-code">{{ asset.assetCode }}</span>
            <span class="status-tag" :class="asset.status">
              {{ statusMap[asset.status] }}
            </span>
          </div>
          <div class="asset-card-body">
            <div class="asset-info-row">
              <el-icon><Location /></el-icon>
              <span>{{ asset.parkName }} - {{ asset.buildingName }} - {{ asset.roomNo }}</span>
            </div>
            <div class="asset-info-row">
              <el-icon><Histogram /></el-icon>
              <span>面积：{{ asset.area.toFixed(2) }}㎡</span>
            </div>
            <div class="asset-info-row">
              <el-icon><Money /></el-icon>
              <span>租金：¥{{ asset.rentPrice.toFixed(2) }}/㎡/月</span>
            </div>
            <div class="asset-info-row" v-if="asset.tenantName">
              <el-icon><User /></el-icon>
              <span>{{ asset.tenantName }}</span>
            </div>
          </div>
          <div class="asset-card-footer">
            <el-tag :type="asset.industryType === 'tech' ? 'primary' : 'success'" size="small">
              {{ asset.industryType === 'tech' ? '科技产业' : '文化产业' }}
            </el-tag>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="110px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="资产编号" prop="assetCode">
              <el-input v-model="formData.assetCode" placeholder="请输入资产编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属园区" prop="parkId">
              <el-select v-model="formData.parkId" placeholder="请选择园区" style="width: 100%">
                <el-option 
                  v-for="park in parkOptions" 
                  :key="park.value" 
                  :label="park.label" 
                  :value="park.value" 
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属楼宇" prop="buildingId">
              <el-select v-model="formData.buildingId" placeholder="请选择楼宇" style="width: 100%">
                <el-option 
                  v-for="building in buildingOptions" 
                  :key="building.value" 
                  :label="building.label" 
                  :value="building.value" 
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="房间号" prop="roomNo">
              <el-input v-model="formData.roomNo" placeholder="请输入房间号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="面积(㎡)" prop="area">
              <el-input-number v-model="formData.area" :min="0" :precision="2" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产业类型" prop="industryType">
              <el-select v-model="formData.industryType" placeholder="请选择产业类型" style="width: 100%">
                <el-option label="科技产业" value="tech" />
                <el-option label="文化产业" value="culture" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="租金标准" prop="rentPrice">
              <el-input-number v-model="formData.rentPrice" :min="0" :precision="2" style="width: 100%">
                <template #suffix>元/㎡/月</template>
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资产状态" prop="status">
              <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
                <el-option label="可租" value="available" />
                <el-option label="已租" value="rented" />
                <el-option label="维修中" value="maintenance" />
                <el-option label="空置" value="vacant" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="装修状态" prop="decorationStatus">
          <el-radio-group v-model="formData.decorationStatus">
            <el-radio label="blank">毛坯</el-radio>
            <el-radio label="simple">简装</el-radio>
            <el-radio label="fine">精装</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="配套设施" prop="facilities">
          <el-checkbox-group v-model="formData.facilities">
            <el-checkbox label="aircon">空调</el-checkbox>
            <el-checkbox label="elevator">电梯</el-checkbox>
            <el-checkbox label="parking">停车位</el-checkbox>
            <el-checkbox label="network">网络</el-checkbox>
            <el-checkbox label="security">安保</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-drawer
      v-model="detailVisible"
      title="资产详情"
      size="500px"
    >
      <div class="detail-content" v-if="currentAsset">
        <div class="detail-section">
          <h3 class="section-title">基本信息</h3>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="资产编号">{{ currentAsset.assetCode }}</el-descriptions-item>
            <el-descriptions-item label="所属园区">{{ currentAsset.parkName }}</el-descriptions-item>
            <el-descriptions-item label="所属楼宇">{{ currentAsset.buildingName }}</el-descriptions-item>
            <el-descriptions-item label="房间号">{{ currentAsset.roomNo }}</el-descriptions-item>
            <el-descriptions-item label="面积">{{ currentAsset.area }}㎡</el-descriptions-item>
            <el-descriptions-item label="产业类型">
              <el-tag :type="currentAsset.industryType === 'tech' ? 'primary' : 'success'" size="small">
                {{ currentAsset.industryType === 'tech' ? '科技产业' : '文化产业' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="资产状态">
              <span class="status-tag" :class="currentAsset.status">
                {{ statusMap[currentAsset.status] }}
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="租金标准">¥{{ currentAsset.rentPrice }}/㎡/月</el-descriptions-item>
          </el-descriptions>
        </div>
        
        <div class="detail-section" v-if="currentAsset.tenantName">
          <h3 class="section-title">租户信息</h3>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="租户名称">{{ currentAsset.tenantName }}</el-descriptions-item>
            <el-descriptions-item label="合同编号">{{ currentAsset.contractNo || '-' }}</el-descriptions-item>
            <el-descriptions-item label="租赁期限">{{ currentAsset.leaseStart }} 至 {{ currentAsset.leaseEnd }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus, Upload, Download, Search, Refresh, ArrowDown,
  OfficeBuilding, Select, Document, Tools, Histogram,
  List, Grid, Location, Money, User
} from '@element-plus/icons-vue'

// 状态映射
const statusMap = {
  available: '可租',
  rented: '已租',
  maintenance: '维修中',
  vacant: '空置'
}

// 统计数据
const stats = ref({
  total: 1286,
  available: 428,
  rented: 786,
  maintenance: 42,
  area: 125680
})

// 筛选表单
const filterForm = reactive({
  parkId: '',
  industryType: '',
  status: '',
  buildingId: '',
  keyword: ''
})

// 园区选项
const parkOptions = ref([
  { value: '1', label: '科技产业园A区' },
  { value: '2', label: '科技产业园B区' },
  { value: '3', label: '文化产业园' }
])

// 楼宇选项
const buildingOptions = ref([
  { value: '1', label: 'A栋' },
  { value: '2', label: 'B栋' },
  { value: '3', label: 'C栋' },
  { value: '4', label: 'D栋' }
])

// 视图模式
const viewMode = ref('table')

// 表格数据
const loading = ref(false)
const assetList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectedRows = ref([])

// 弹窗控制
const dialogVisible = ref(false)
const dialogTitle = ref('新增资产')
const detailVisible = ref(false)
const currentAsset = ref(null)
const submitLoading = ref(false)
const formRef = ref(null)

// 表单数据
const formData = reactive({
  assetCode: '',
  parkId: '',
  buildingId: '',
  roomNo: '',
  area: 0,
  industryType: '',
  rentPrice: 0,
  status: 'available',
  decorationStatus: 'blank',
  facilities: [],
  remark: ''
})

// 表单验证规则
const formRules = {
  assetCode: [{ required: true, message: '请输入资产编号', trigger: 'blur' }],
  parkId: [{ required: true, message: '请选择园区', trigger: 'change' }],
  buildingId: [{ required: true, message: '请选择楼宇', trigger: 'change' }],
  roomNo: [{ required: true, message: '请输入房间号', trigger: 'blur' }],
  area: [{ required: true, message: '请输入面积', trigger: 'blur' }],
  industryType: [{ required: true, message: '请选择产业类型', trigger: 'change' }],
  rentPrice: [{ required: true, message: '请输入租金标准', trigger: 'blur' }],
  status: [{ required: true, message: '请选择资产状态', trigger: 'change' }]
}

// 获取资产列表
const fetchAssetList = async () => {
  loading.value = true
  
  // 模拟API请求
  setTimeout(() => {
    assetList.value = [
      { id: 1, assetCode: 'FT-TK-A-301', parkName: '科技产业园A区', buildingName: 'A栋', roomNo: '301', area: 150.5, industryType: 'tech', status: 'rented', rentPrice: 85, tenantName: '深圳科技创新有限公司', contractNo: 'HT2024001', leaseStart: '2024-01-01', leaseEnd: '2026-12-31' },
      { id: 2, assetCode: 'FT-TK-A-302', parkName: '科技产业园A区', buildingName: 'A栋', roomNo: '302', area: 120.0, industryType: 'tech', status: 'available', rentPrice: 80, tenantName: '' },
      { id: 3, assetCode: 'FT-TK-B-105', parkName: '科技产业园B区', buildingName: 'B栋', roomNo: '105', area: 200.0, industryType: 'tech', status: 'rented', rentPrice: 90, tenantName: '智慧物联网技术公司', contractNo: 'HT2024002', leaseStart: '2024-03-01', leaseEnd: '2027-02-28' },
      { id: 4, assetCode: 'FT-WH-C-502', parkName: '文化产业园', buildingName: 'C栋', roomNo: '502', area: 180.0, industryType: 'culture', status: 'rented', rentPrice: 75, tenantName: '福田文化传媒集团', contractNo: 'HT2024003', leaseStart: '2024-02-01', leaseEnd: '2025-01-31' },
      { id: 5, assetCode: 'FT-WH-C-503', parkName: '文化产业园', buildingName: 'C栋', roomNo: '503', area: 95.0, industryType: 'culture', status: 'maintenance', rentPrice: 70, tenantName: '' },
      { id: 6, assetCode: 'FT-TK-A-401', parkName: '科技产业园A区', buildingName: 'A栋', roomNo: '401', area: 250.0, industryType: 'tech', status: 'available', rentPrice: 95, tenantName: '' },
      { id: 7, assetCode: 'FT-TK-B-201', parkName: '科技产业园B区', buildingName: 'B栋', roomNo: '201', area: 175.5, industryType: 'tech', status: 'rented', rentPrice: 88, tenantName: '创新孵化器运营中心', contractNo: 'HT2024004', leaseStart: '2024-04-01', leaseEnd: '2026-03-31' },
      { id: 8, assetCode: 'FT-WH-D-101', parkName: '文化产业园', buildingName: 'D栋', roomNo: '101', area: 320.0, industryType: 'culture', status: 'vacant', rentPrice: 65, tenantName: '' }
    ]
    total.value = 86
    loading.value = false
  }, 500)
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchAssetList()
}

// 重置
const handleReset = () => {
  Object.assign(filterForm, {
    parkId: '',
    industryType: '',
    status: '',
    buildingId: '',
    keyword: ''
  })
  handleSearch()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增资产'
  Object.assign(formData, {
    assetCode: '',
    parkId: '',
    buildingId: '',
    roomNo: '',
    area: 0,
    industryType: '',
    rentPrice: 0,
    status: 'available',
    decorationStatus: 'blank',
    facilities: [],
    remark: ''
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  dialogTitle.value = '编辑资产'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 查看详情
const handleView = (row) => {
  currentAsset.value = row
  detailVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      submitLoading.value = true
      setTimeout(() => {
        submitLoading.value = false
        dialogVisible.value = false
        ElMessage.success(dialogTitle.value === '新增资产' ? '新增成功' : '修改成功')
        fetchAssetList()
      }, 1000)
    }
  })
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除资产 "${row.assetCode}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    fetchAssetList()
  })
}

// 状态变更
const handleStatusChange = (row) => {
  ElMessage.info('状态变更功能开发中')
}

// 变更记录
const handleHistory = (row) => {
  ElMessage.info('变更记录功能开发中')
}

// 选择变化
const handleSelectionChange = (rows) => {
  selectedRows.value = rows
}

// 分页
const handleSizeChange = (size) => {
  pageSize.value = size
  fetchAssetList()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchAssetList()
}

onMounted(() => {
  fetchAssetList()
})
</script>

<style lang="scss" scoped>
.assets-page {
  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 20px;
    
    .header-left {
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
    
    .header-actions {
      display: flex;
      gap: 12px;
    }
  }
}

// 统计卡片行
.stats-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.mini-stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
  
  .mini-stat-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .el-icon {
      font-size: 22px;
      color: white;
    }
    
    &.primary { background: linear-gradient(135deg, #BF933B 0%, #D4A94D 100%); }
    &.success { background: linear-gradient(135deg, #286634 0%, #3D8A4D 100%); }
    &.warning { background: linear-gradient(135deg, #E6A23C 0%, #F0B452 100%); }
    &.danger { background: linear-gradient(135deg, #D52A1E 0%, #E84D42 100%); }
    &.info { background: linear-gradient(135deg, #042178 0%, #0A3399 100%); }
  }
  
  .mini-stat-info {
    display: flex;
    flex-direction: column;
    
    .mini-stat-value {
      font-size: 20px;
      font-weight: 700;
      color: var(--color-secondary);
      line-height: 1.2;
    }
    
    .mini-stat-label {
      font-size: 13px;
      color: var(--color-text-secondary);
      margin-top: 2px;
    }
  }
}

// 筛选卡片
.filter-card {
  margin-bottom: 20px;
  
  :deep(.el-card__body) {
    padding: 16px 20px;
  }
  
  :deep(.el-form-item) {
    margin-bottom: 0;
    margin-right: 16px;
  }
}

// 表格卡片
.table-card {
  :deep(.el-card__header) {
    padding: 14px 20px;
    border-bottom: 1px solid var(--border-color-light);
  }
  
  :deep(.el-card__body) {
    padding: 0;
  }
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .table-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 15px;
    font-weight: 600;
    color: var(--color-secondary);
  }
}

.asset-code {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: var(--color-primary);
}

.text-placeholder {
  color: var(--color-text-placeholder);
}

// 卡片视图
.asset-card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 20px;
}

.asset-card {
  background: white;
  border: 1px solid var(--border-color-light);
  border-radius: var(--radius-lg);
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--color-primary);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
  
  .asset-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-color-lighter);
  }
  
  .asset-card-body {
    .asset-info-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: var(--color-text-regular);
      margin-bottom: 8px;
      
      .el-icon {
        color: var(--color-text-secondary);
      }
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  
  .asset-card-footer {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--border-color-lighter);
  }
}

// 分页
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid var(--border-color-lighter);
}

// 详情内容
.detail-content {
  .detail-section {
    margin-bottom: 24px;
    
    .section-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--color-secondary);
      margin-bottom: 12px;
      padding-left: 10px;
      border-left: 3px solid var(--color-primary);
    }
  }
}

// 响应式
@media (max-width: 1400px) {
  .stats-row {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .asset-card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1200px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .asset-card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

