<template>
  <div class="tenants-page page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">租户档案管理</h1>
        <p class="page-subtitle">管理租户信息，包括企业资料、入驻信息、合作历史等</p>
      </div>
      <div class="header-actions">
        <el-button :icon="Upload">批量导入</el-button>
        <el-button :icon="Download">导出数据</el-button>
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增租户</el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-row">
      <div class="mini-stat-card">
        <div class="mini-stat-icon primary">
          <el-icon><User /></el-icon>
        </div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">{{ stats.total }}</span>
          <span class="mini-stat-label">租户总数</span>
        </div>
      </div>
      <div class="mini-stat-card">
        <div class="mini-stat-icon success">
          <el-icon><CircleCheck /></el-icon>
        </div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">{{ stats.active }}</span>
          <span class="mini-stat-label">在租租户</span>
        </div>
      </div>
      <div class="mini-stat-card">
        <div class="mini-stat-icon warning">
          <el-icon><Timer /></el-icon>
        </div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">{{ stats.expiring }}</span>
          <span class="mini-stat-label">即将到期</span>
        </div>
      </div>
      <div class="mini-stat-card">
        <div class="mini-stat-icon info">
          <el-icon><TrendCharts /></el-icon>
        </div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">{{ stats.tech }}</span>
          <span class="mini-stat-label">科技企业</span>
        </div>
      </div>
      <div class="mini-stat-card">
        <div class="mini-stat-icon secondary">
          <el-icon><Picture /></el-icon>
        </div>
        <div class="mini-stat-info">
          <span class="mini-stat-value">{{ stats.culture }}</span>
          <span class="mini-stat-label">文化企业</span>
        </div>
      </div>
    </div>

    <!-- 搜索筛选区 -->
    <el-card class="filter-card">
      <el-form :model="filterForm" inline>
        <el-form-item label="所属园区">
          <el-select v-model="filterForm.parkId" placeholder="全部园区" clearable style="width: 160px">
            <el-option 
              v-for="park in parkOptions" 
              :key="park.value" 
              :label="park.label" 
              :value="park.value" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属行业">
          <el-select v-model="filterForm.industry" placeholder="全部行业" clearable style="width: 160px">
            <el-option label="科技产业" value="tech" />
            <el-option label="文化产业" value="culture" />
          </el-select>
        </el-form-item>
        <el-form-item label="合作状态">
          <el-select v-model="filterForm.status" placeholder="全部状态" clearable style="width: 120px">
            <el-option label="在租" value="active" />
            <el-option label="已退租" value="expired" />
            <el-option label="意向" value="potential" />
          </el-select>
        </el-form-item>
        <el-form-item label="信用评级">
          <el-select v-model="filterForm.creditLevel" placeholder="全部评级" clearable style="width: 120px">
            <el-option label="A级" value="A" />
            <el-option label="B级" value="B" />
            <el-option label="C级" value="C" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input 
            v-model="filterForm.keyword" 
            placeholder="企业名称/联系人" 
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
            <span>租户列表</span>
            <el-tag type="info" size="small">共 {{ total }} 条</el-tag>
          </div>
        </div>
      </template>

      <el-table
        :data="tenantList"
        v-loading="loading"
        stripe
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="companyName" label="企业名称" min-width="220" fixed>
          <template #default="{ row }">
            <div class="company-cell">
              <el-avatar :size="36" :src="row.logo" class="company-avatar">
                {{ row.companyName.charAt(0) }}
              </el-avatar>
              <div class="company-info">
                <span class="company-name">{{ row.companyName }}</span>
                <span class="company-code">{{ row.creditCode }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="industry" label="所属行业" width="120">
          <template #default="{ row }">
            <el-tag :type="row.industry === 'tech' ? 'primary' : 'success'" size="small">
              {{ row.industry === 'tech' ? '科技产业' : '文化产业' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="parkName" label="入驻园区" width="150" />
        <el-table-column prop="roomInfo" label="租赁房间" width="140" />
        <el-table-column prop="contact" label="联系人" width="100" />
        <el-table-column prop="phone" label="联系电话" width="130" />
        <el-table-column prop="entryDate" label="入驻时间" width="120" />
        <el-table-column prop="creditLevel" label="信用评级" width="100" align="center">
          <template #default="{ row }">
            <span class="credit-badge" :class="'level-' + row.creditLevel">
              {{ row.creditLevel }}级
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusTypeMap[row.status]" size="small">
              {{ statusMap[row.status] }}
            </el-tag>
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
                  <el-dropdown-item @click="handleContracts(row)">合同记录</el-dropdown-item>
                  <el-dropdown-item @click="handlePayments(row)">缴费记录</el-dropdown-item>
                  <el-dropdown-item @click="handleServices(row)">服务记录</el-dropdown-item>
                  <el-dropdown-item divided @click="handleDelete(row)">
                    <span class="text-danger">删除</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

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
      width="800px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="110px"
      >
        <el-divider content-position="left">基本信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="企业名称" prop="companyName">
              <el-input v-model="formData.companyName" placeholder="请输入企业名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="统一信用代码" prop="creditCode">
              <el-input v-model="formData.creditCode" placeholder="请输入统一社会信用代码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属行业" prop="industry">
              <el-select v-model="formData.industry" placeholder="请选择行业" style="width: 100%">
                <el-option label="科技产业" value="tech" />
                <el-option label="文化产业" value="culture" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业规模" prop="scale">
              <el-select v-model="formData.scale" placeholder="请选择规模" style="width: 100%">
                <el-option label="小微企业" value="micro" />
                <el-option label="中小企业" value="small" />
                <el-option label="大型企业" value="large" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-divider content-position="left">联系信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系人" prop="contact">
              <el-input v-model="formData.contact" placeholder="请输入联系人姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="formData.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="formData.email" placeholder="请输入电子邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="注册地址" prop="address">
              <el-input v-model="formData.address" placeholder="请输入注册地址" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-divider content-position="left">入驻信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="入驻园区" prop="parkId">
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
          <el-col :span="12">
            <el-form-item label="入驻时间" prop="entryDate">
              <el-date-picker
                v-model="formData.entryDate"
                type="date"
                placeholder="请选择入驻时间"
                style="width: 100%"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="信用评级" prop="creditLevel">
              <el-select v-model="formData.creditLevel" placeholder="请选择评级" style="width: 100%">
                <el-option label="A级（优秀）" value="A" />
                <el-option label="B级（良好）" value="B" />
                <el-option label="C级（一般）" value="C" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合作状态" prop="status">
              <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
                <el-option label="在租" value="active" />
                <el-option label="已退租" value="expired" />
                <el-option label="意向" value="potential" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情抽屉 -->
    <el-drawer
      v-model="detailVisible"
      title="租户详情"
      size="600px"
    >
      <div class="detail-content" v-if="currentTenant">
        <!-- 企业概况 -->
        <div class="tenant-profile">
          <el-avatar :size="64" :src="currentTenant.logo" class="tenant-avatar">
            {{ currentTenant.companyName.charAt(0) }}
          </el-avatar>
          <div class="tenant-info">
            <h2 class="tenant-name">{{ currentTenant.companyName }}</h2>
            <div class="tenant-tags">
              <el-tag :type="currentTenant.industry === 'tech' ? 'primary' : 'success'" size="small">
                {{ currentTenant.industry === 'tech' ? '科技产业' : '文化产业' }}
              </el-tag>
              <span class="credit-badge" :class="'level-' + currentTenant.creditLevel">
                {{ currentTenant.creditLevel }}级
              </span>
              <el-tag :type="statusTypeMap[currentTenant.status]" size="small">
                {{ statusMap[currentTenant.status] }}
              </el-tag>
            </div>
          </div>
        </div>

        <el-tabs v-model="activeTab">
          <el-tab-pane label="基本信息" name="basic">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="统一信用代码" :span="2">{{ currentTenant.creditCode }}</el-descriptions-item>
              <el-descriptions-item label="所属行业">{{ currentTenant.industry === 'tech' ? '科技产业' : '文化产业' }}</el-descriptions-item>
              <el-descriptions-item label="企业规模">{{ scaleMap[currentTenant.scale] }}</el-descriptions-item>
              <el-descriptions-item label="联系人">{{ currentTenant.contact }}</el-descriptions-item>
              <el-descriptions-item label="联系电话">{{ currentTenant.phone }}</el-descriptions-item>
              <el-descriptions-item label="电子邮箱" :span="2">{{ currentTenant.email }}</el-descriptions-item>
              <el-descriptions-item label="注册地址" :span="2">{{ currentTenant.address }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          
          <el-tab-pane label="入驻信息" name="entry">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="入驻园区">{{ currentTenant.parkName }}</el-descriptions-item>
              <el-descriptions-item label="租赁房间">{{ currentTenant.roomInfo }}</el-descriptions-item>
              <el-descriptions-item label="入驻时间">{{ currentTenant.entryDate }}</el-descriptions-item>
              <el-descriptions-item label="合作年限">{{ currentTenant.cooperationYears }}年</el-descriptions-item>
              <el-descriptions-item label="当前合同">{{ currentTenant.contractNo }}</el-descriptions-item>
              <el-descriptions-item label="合同到期">{{ currentTenant.contractEnd }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          
          <el-tab-pane label="缴费记录" name="payment">
            <el-timeline>
              <el-timeline-item
                v-for="payment in paymentRecords"
                :key="payment.id"
                :type="payment.type"
                :timestamp="payment.date"
                placement="top"
              >
                <div class="payment-item">
                  <span class="payment-desc">{{ payment.description }}</span>
                  <span class="payment-amount" :class="payment.amountClass">¥{{ payment.amount.toLocaleString() }}</span>
                </div>
              </el-timeline-item>
            </el-timeline>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus, Upload, Download, Search, Refresh, ArrowDown,
  User, CircleCheck, Timer, TrendCharts, Picture
} from '@element-plus/icons-vue'

// 状态映射
const statusMap = {
  active: '在租',
  expired: '已退租',
  potential: '意向'
}

const statusTypeMap = {
  active: 'success',
  expired: 'info',
  potential: 'warning'
}

const scaleMap = {
  micro: '小微企业',
  small: '中小企业',
  large: '大型企业'
}

// 统计数据
const stats = ref({
  total: 428,
  active: 386,
  expiring: 23,
  tech: 268,
  culture: 160
})

// 筛选表单
const filterForm = reactive({
  parkId: '',
  industry: '',
  status: '',
  creditLevel: '',
  keyword: ''
})

// 园区选项
const parkOptions = ref([
  { value: '1', label: '科技产业园A区' },
  { value: '2', label: '科技产业园B区' },
  { value: '3', label: '文化产业园' }
])

// 表格数据
const loading = ref(false)
const tenantList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectedRows = ref([])

// 弹窗控制
const dialogVisible = ref(false)
const dialogTitle = ref('新增租户')
const detailVisible = ref(false)
const currentTenant = ref(null)
const submitLoading = ref(false)
const formRef = ref(null)
const activeTab = ref('basic')

// 表单数据
const formData = reactive({
  companyName: '',
  creditCode: '',
  industry: '',
  scale: '',
  contact: '',
  phone: '',
  email: '',
  address: '',
  parkId: '',
  entryDate: '',
  creditLevel: 'B',
  status: 'active',
  remark: ''
})

// 表单验证规则
const formRules = {
  companyName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
  creditCode: [{ required: true, message: '请输入统一社会信用代码', trigger: 'blur' }],
  industry: [{ required: true, message: '请选择所属行业', trigger: 'change' }],
  contact: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }]
}

// 缴费记录
const paymentRecords = ref([
  { id: 1, date: '2024-12-01', description: '12月租金', amount: 85000, type: 'success', amountClass: '' },
  { id: 2, date: '2024-11-01', description: '11月租金', amount: 85000, type: 'success', amountClass: '' },
  { id: 3, date: '2024-10-01', description: '10月租金', amount: 85000, type: 'success', amountClass: '' },
  { id: 4, date: '2024-09-01', description: '9月租金', amount: 85000, type: 'success', amountClass: '' }
])

// 获取租户列表
const fetchTenantList = async () => {
  loading.value = true
  
  setTimeout(() => {
    tenantList.value = [
      { id: 1, companyName: '深圳科技创新有限公司', creditCode: '91440300MA5XXXXXX1', industry: 'tech', scale: 'small', parkName: '科技产业园A区', roomInfo: 'A栋301', contact: '张经理', phone: '13800138001', email: 'zhang@techco.com', address: '深圳市福田区xxx路xxx号', entryDate: '2024-01-15', creditLevel: 'A', status: 'active', cooperationYears: 1, contractNo: 'HT2024001', contractEnd: '2026-12-31' },
      { id: 2, companyName: '福田文化传媒集团', creditCode: '91440300MA5XXXXXX2', industry: 'culture', scale: 'large', parkName: '文化产业园', roomInfo: 'C栋502', contact: '李总监', phone: '13800138002', email: 'li@culturemedia.com', address: '深圳市福田区xxx路xxx号', entryDate: '2024-02-01', creditLevel: 'A', status: 'active', cooperationYears: 1, contractNo: 'HT2024003', contractEnd: '2025-01-31' },
      { id: 3, companyName: '智慧物联网技术公司', creditCode: '91440300MA5XXXXXX3', industry: 'tech', scale: 'small', parkName: '科技产业园B区', roomInfo: 'B栋105', contact: '王工程师', phone: '13800138003', email: 'wang@iot.com', address: '深圳市福田区xxx路xxx号', entryDate: '2024-03-01', creditLevel: 'B', status: 'active', cooperationYears: 1, contractNo: 'HT2024002', contractEnd: '2027-02-28' },
      { id: 4, companyName: '创新孵化器运营中心', creditCode: '91440300MA5XXXXXX4', industry: 'tech', scale: 'micro', parkName: '科技产业园B区', roomInfo: 'B栋201', contact: '陈主任', phone: '13800138004', email: 'chen@incubator.com', address: '深圳市福田区xxx路xxx号', entryDate: '2024-04-01', creditLevel: 'B', status: 'active', cooperationYears: 1, contractNo: 'HT2024004', contractEnd: '2026-03-31' },
      { id: 5, companyName: '创意设计工作室', creditCode: '91440300MA5XXXXXX5', industry: 'culture', scale: 'micro', parkName: '文化产业园', roomInfo: 'C栋203', contact: '刘设计师', phone: '13800138005', email: 'liu@design.com', address: '深圳市福田区xxx路xxx号', entryDate: '2023-06-01', creditLevel: 'B', status: 'active', cooperationYears: 2, contractNo: 'HT2023005', contractEnd: '2025-05-31' },
      { id: 6, companyName: '数字媒体科技公司', creditCode: '91440300MA5XXXXXX6', industry: 'tech', scale: 'small', parkName: '科技产业园A区', roomInfo: 'A栋205', contact: '赵经理', phone: '13800138006', email: 'zhao@digitalmedia.com', address: '深圳市福田区xxx路xxx号', entryDate: '2023-08-01', creditLevel: 'A', status: 'active', cooperationYears: 1, contractNo: 'HT2023006', contractEnd: '2025-07-31' }
    ]
    total.value = 428
    loading.value = false
  }, 500)
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchTenantList()
}

// 重置
const handleReset = () => {
  Object.assign(filterForm, {
    parkId: '',
    industry: '',
    status: '',
    creditLevel: '',
    keyword: ''
  })
  handleSearch()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增租户'
  Object.assign(formData, {
    companyName: '',
    creditCode: '',
    industry: '',
    scale: '',
    contact: '',
    phone: '',
    email: '',
    address: '',
    parkId: '',
    entryDate: '',
    creditLevel: 'B',
    status: 'active',
    remark: ''
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  dialogTitle.value = '编辑租户'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 查看详情
const handleView = (row) => {
  currentTenant.value = row
  activeTab.value = 'basic'
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
        ElMessage.success(dialogTitle.value === '新增租户' ? '新增成功' : '修改成功')
        fetchTenantList()
      }, 1000)
    }
  })
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除租户 "${row.companyName}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    fetchTenantList()
  })
}

// 合同记录
const handleContracts = (row) => {
  ElMessage.info('合同记录功能开发中')
}

// 缴费记录
const handlePayments = (row) => {
  ElMessage.info('缴费记录功能开发中')
}

// 服务记录
const handleServices = (row) => {
  ElMessage.info('服务记录功能开发中')
}

// 选择变化
const handleSelectionChange = (rows) => {
  selectedRows.value = rows
}

// 分页
const handleSizeChange = (size) => {
  pageSize.value = size
  fetchTenantList()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchTenantList()
}

onMounted(() => {
  fetchTenantList()
})
</script>

<style lang="scss" scoped>
.tenants-page {
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
    &.info { background: linear-gradient(135deg, #042178 0%, #0A3399 100%); }
    &.secondary { background: linear-gradient(135deg, #909399 0%, #A6A9AD 100%); }
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

// 企业单元格
.company-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  
  .company-avatar {
    background: linear-gradient(135deg, #BF933B 0%, #D4A94D 100%);
    color: white;
    font-weight: 600;
  }
  
  .company-info {
    display: flex;
    flex-direction: column;
    
    .company-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--color-text-primary);
    }
    
    .company-code {
      font-size: 12px;
      color: var(--color-text-secondary);
      font-family: 'Courier New', monospace;
    }
  }
}

// 信用评级
.credit-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 22px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  
  &.level-A {
    background: rgba(40, 102, 52, 0.1);
    color: var(--color-success);
  }
  
  &.level-B {
    background: rgba(191, 147, 59, 0.1);
    color: var(--color-primary);
  }
  
  &.level-C {
    background: rgba(230, 162, 60, 0.1);
    color: var(--color-warning);
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
  .tenant-profile {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    background: var(--bg-color);
    border-radius: var(--radius-lg);
    margin-bottom: 20px;
    
    .tenant-avatar {
      background: linear-gradient(135deg, #BF933B 0%, #D4A94D 100%);
      color: white;
      font-size: 24px;
      font-weight: 600;
    }
    
    .tenant-info {
      .tenant-name {
        font-size: 18px;
        font-weight: 600;
        color: var(--color-secondary);
        margin: 0 0 8px 0;
      }
      
      .tenant-tags {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }
  }
  
  .payment-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .payment-desc {
      font-size: 14px;
      color: var(--color-text-primary);
    }
    
    .payment-amount {
      font-size: 15px;
      font-weight: 600;
      color: var(--color-success);
    }
  }
}

// 响应式
@media (max-width: 1400px) {
  .stats-row {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1200px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

