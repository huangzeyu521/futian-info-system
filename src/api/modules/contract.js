import request from '../index'

// 合同管理API
export const contractApi = {
  // 获取合同列表
  getList(params) {
    return request.get('/contract/list', { params })
  },
  
  // 获取合同详情
  getDetail(id) {
    return request.get(`/contract/${id}`)
  },
  
  // 新增合同
  create(data) {
    return request.post('/contract', data)
  },
  
  // 更新合同
  update(id, data) {
    return request.put(`/contract/${id}`, data)
  },
  
  // 终止合同
  terminate(id, reason) {
    return request.post(`/contract/${id}/terminate`, { reason })
  },
  
  // 续签合同
  renew(id, data) {
    return request.post(`/contract/${id}/renew`, data)
  },
  
  // 获取合同统计
  getStats() {
    return request.get('/contract/stats')
  },
  
  // 获取即将到期合同
  getExpiring(days = 30) {
    return request.get('/contract/expiring', { params: { days } })
  }
}

