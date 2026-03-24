import request from '../index'

// 租户管理API
export const tenantApi = {
  // 获取租户列表
  getList(params) {
    return request.get('/tenant/list', { params })
  },
  
  // 获取租户详情
  getDetail(id) {
    return request.get(`/tenant/${id}`)
  },
  
  // 新增租户
  create(data) {
    return request.post('/tenant', data)
  },
  
  // 更新租户
  update(id, data) {
    return request.put(`/tenant/${id}`, data)
  },
  
  // 删除租户
  delete(id) {
    return request.delete(`/tenant/${id}`)
  },
  
  // 获取租户统计
  getStats() {
    return request.get('/tenant/stats')
  },
  
  // 获取租户合同列表
  getContracts(tenantId) {
    return request.get(`/tenant/${tenantId}/contracts`)
  },
  
  // 获取租户缴费记录
  getPayments(tenantId) {
    return request.get(`/tenant/${tenantId}/payments`)
  }
}

