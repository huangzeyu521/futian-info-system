import request from '../index'

// 系统管理API
export const systemApi = {
  // 用户管理
  getUserList(params) {
    return request.get('/system/users', { params })
  },
  
  createUser(data) {
    return request.post('/system/users', data)
  },
  
  updateUser(id, data) {
    return request.put(`/system/users/${id}`, data)
  },
  
  deleteUser(id) {
    return request.delete(`/system/users/${id}`)
  },
  
  resetPassword(id) {
    return request.post(`/system/users/${id}/reset-password`)
  },
  
  // 角色管理
  getRoleList() {
    return request.get('/system/roles')
  },
  
  createRole(data) {
    return request.post('/system/roles', data)
  },
  
  updateRole(id, data) {
    return request.put(`/system/roles/${id}`, data)
  },
  
  deleteRole(id) {
    return request.delete(`/system/roles/${id}`)
  },
  
  // 权限管理
  getPermissionTree() {
    return request.get('/system/permissions/tree')
  },
  
  getRolePermissions(roleId) {
    return request.get(`/system/roles/${roleId}/permissions`)
  },
  
  saveRolePermissions(roleId, permissionIds) {
    return request.post(`/system/roles/${roleId}/permissions`, { permissionIds })
  },
  
  // 操作日志
  getLogList(params) {
    return request.get('/system/logs', { params })
  },
  
  exportLogs(params) {
    return request.get('/system/logs/export', { params, responseType: 'blob' })
  },
  
  // 数据备份
  getBackupList() {
    return request.get('/system/backups')
  },
  
  createBackup() {
    return request.post('/system/backups')
  },
  
  restoreBackup(backupId) {
    return request.post(`/system/backups/${backupId}/restore`)
  },
  
  deleteBackup(backupId) {
    return request.delete(`/system/backups/${backupId}`)
  },
  
  getBackupSettings() {
    return request.get('/system/backups/settings')
  },
  
  saveBackupSettings(data) {
    return request.post('/system/backups/settings', data)
  },
  
  // 字典管理
  getDictList() {
    return request.get('/system/dicts')
  },
  
  getDictItems(dictCode) {
    return request.get(`/system/dicts/${dictCode}/items`)
  },
  
  createDictItem(dictCode, data) {
    return request.post(`/system/dicts/${dictCode}/items`, data)
  },
  
  updateDictItem(dictCode, itemId, data) {
    return request.put(`/system/dicts/${dictCode}/items/${itemId}`, data)
  },
  
  deleteDictItem(dictCode, itemId) {
    return request.delete(`/system/dicts/${dictCode}/items/${itemId}`)
  }
}

