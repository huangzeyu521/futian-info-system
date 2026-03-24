import request from '../index'

// 资产管理API
export const assetApi = {
  // 获取资产列表
  getList(params) {
    return request.get('/asset/list', { params })
  },
  
  // 获取资产详情
  getDetail(id) {
    return request.get(`/asset/${id}`)
  },
  
  // 新增资产
  create(data) {
    return request.post('/asset', data)
  },
  
  // 更新资产
  update(id, data) {
    return request.put(`/asset/${id}`, data)
  },
  
  // 删除资产
  delete(id) {
    return request.delete(`/asset/${id}`)
  },
  
  // 批量导入
  batchImport(file) {
    const formData = new FormData()
    formData.append('file', file)
    return request.post('/asset/import', formData)
  },
  
  // 导出数据
  export(params) {
    return request.get('/asset/export', { params, responseType: 'blob' })
  },
  
  // 获取资产统计
  getStats() {
    return request.get('/asset/stats')
  }
}

