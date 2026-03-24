<template>
  <div class="users-page page-container">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">用户管理</h1>
        <p class="page-subtitle">管理系统用户账号及权限分配</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增用户</el-button>
      </div>
    </div>

    <!-- 筛选区 -->
    <el-card class="filter-card">
      <el-form :model="filterForm" inline>
        <el-form-item label="所属部门">
          <el-select v-model="filterForm.deptId" placeholder="全部部门" clearable style="width: 150px">
            <el-option label="招商部" value="1" />
            <el-option label="运营部" value="2" />
            <el-option label="财务部" value="3" />
            <el-option label="孵化服务部" value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="全部" clearable style="width: 120px">
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="filterForm.keyword" placeholder="用户名/姓名" clearable style="width: 160px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 用户列表 -->
    <el-card class="table-card">
      <el-table :data="userList" stripe>
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="realName" label="姓名" width="100" />
        <el-table-column prop="avatar" label="头像" width="80">
          <template #default="{ row }">
            <el-avatar :size="36" :src="row.avatar">{{ row.realName.charAt(0) }}</el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="deptName" label="所属部门" width="120" />
        <el-table-column prop="roleName" label="角色" width="120">
          <template #default="{ row }">
            <el-tag size="small">{{ row.roleName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="lastLogin" label="最后登录" width="150" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="warning" link @click="handleResetPwd(row)">重置密码</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="550px" destroy-on-close>
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="90px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="formData.realName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <el-select v-model="formData.deptId" placeholder="请选择部门" style="width: 100%">
            <el-option label="招商部" value="1" />
            <el-option label="运营部" value="2" />
            <el-option label="财务部" value="3" />
            <el-option label="孵化服务部" value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="formData.roleId" placeholder="请选择角色" style="width: 100%">
            <el-option label="管理员" value="1" />
            <el-option label="招商专员" value="2" />
            <el-option label="运营专员" value="3" />
            <el-option label="财务专员" value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
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
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'

const filterForm = reactive({ deptId: '', status: '', keyword: '' })
const dialogVisible = ref(false)
const dialogTitle = ref('新增用户')
const formRef = ref(null)

const userList = ref([
  { id: 1, username: 'admin', realName: '管理员', avatar: '', deptName: '系统管理', roleName: '超级管理员', phone: '13800138000', email: 'admin@futian.com', lastLogin: '2024-12-28 10:30', status: 1 },
  { id: 2, username: 'zhangsan', realName: '张三', avatar: '', deptName: '招商部', roleName: '招商专员', phone: '13800138001', email: 'zhangsan@futian.com', lastLogin: '2024-12-28 09:15', status: 1 },
  { id: 3, username: 'lisi', realName: '李四', avatar: '', deptName: '运营部', roleName: '运营专员', phone: '13800138002', email: 'lisi@futian.com', lastLogin: '2024-12-27 18:00', status: 1 },
  { id: 4, username: 'wangwu', realName: '王五', avatar: '', deptName: '财务部', roleName: '财务专员', phone: '13800138003', email: 'wangwu@futian.com', lastLogin: '2024-12-27 16:45', status: 0 }
])

const formData = reactive({ username: '', realName: '', deptId: '', roleId: '', phone: '', email: '' })
const formRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  deptId: [{ required: true, message: '请选择部门', trigger: 'change' }],
  roleId: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

const handleAdd = () => { dialogTitle.value = '新增用户'; Object.assign(formData, { username: '', realName: '', deptId: '', roleId: '', phone: '', email: '' }); dialogVisible.value = true }
const handleEdit = (row) => { dialogTitle.value = '编辑用户'; Object.assign(formData, row); dialogVisible.value = true }
const handleStatusChange = (row) => { ElMessage.success('状态更新成功') }
const handleResetPwd = (row) => { ElMessageBox.confirm('确定要重置该用户密码吗？', '提示', { type: 'warning' }).then(() => { ElMessage.success('密码已重置为默认密码') }) }
const handleDelete = (row) => { ElMessageBox.confirm('确定要删除该用户吗？', '提示', { type: 'warning' }).then(() => { ElMessage.success('删除成功') }) }
const handleSubmit = async () => { if (!formRef.value) return; await formRef.value.validate((valid) => { if (valid) { dialogVisible.value = false; ElMessage.success('保存成功') } }) }
</script>

<style lang="scss" scoped>
.users-page {
  .page-header {
    display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px;
    .page-title { font-size: 22px; font-weight: 600; color: var(--color-secondary); margin: 0 0 4px 0; }
    .page-subtitle { font-size: 14px; color: var(--color-text-secondary); margin: 0; }
  }
}

.filter-card { margin-bottom: 20px; :deep(.el-card__body) { padding: 16px 20px; } :deep(.el-form-item) { margin-bottom: 0; margin-right: 16px; } }
.table-card { :deep(.el-card__body) { padding: 0; } }
</style>

