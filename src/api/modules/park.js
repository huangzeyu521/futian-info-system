import request from '../index'

// 园区运营API
export const parkApi = {
  // 获取园区概览
  getOverview() {
    return request.get('/park/overview')
  },
  
  // 获取公告列表
  getNoticeList(params) {
    return request.get('/park/notices', { params })
  },
  
  // 发布公告
  createNotice(data) {
    return request.post('/park/notices', data)
  },
  
  // 获取报修工单列表
  getRepairList(params) {
    return request.get('/park/repairs', { params })
  },
  
  // 创建报修工单
  createRepair(data) {
    return request.post('/park/repairs', data)
  },
  
  // 派单
  assignRepair(repairId, handlerId) {
    return request.post(`/park/repairs/${repairId}/assign`, { handlerId })
  },
  
  // 完成维修
  completeRepair(repairId, data) {
    return request.post(`/park/repairs/${repairId}/complete`, data)
  },
  
  // 获取巡检记录
  getInspectionList(params) {
    return request.get('/park/inspections', { params })
  },
  
  // 创建巡检记录
  createInspection(data) {
    return request.post('/park/inspections', data)
  },
  
  // 获取服务需求列表
  getServiceList(params) {
    return request.get('/park/services', { params })
  },
  
  // 处理服务需求
  handleService(serviceId, data) {
    return request.post(`/park/services/${serviceId}/handle`, data)
  }
}

