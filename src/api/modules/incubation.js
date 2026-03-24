import request from '../index'

// 孵化服务API
export const incubationApi = {
  // 获取入驻申请列表
  getApplicationList(params) {
    return request.get('/incubation/applications', { params })
  },
  
  // 提交入驻申请
  submitApplication(data) {
    return request.post('/incubation/applications', data)
  },
  
  // 审核入驻申请
  auditApplication(applicationId, data) {
    return request.post(`/incubation/applications/${applicationId}/audit`, data)
  },
  
  // 获取孵化企业列表
  getEnterpriseList(params) {
    return request.get('/incubation/enterprises', { params })
  },
  
  // 获取孵化服务记录
  getServiceList(params) {
    return request.get('/incubation/services', { params })
  },
  
  // 创建孵化服务
  createService(data) {
    return request.post('/incubation/services', data)
  },
  
  // 获取毕业审核列表
  getGraduationList(params) {
    return request.get('/incubation/graduations', { params })
  },
  
  // 提交毕业审核
  submitGraduation(enterpriseId, data) {
    return request.post(`/incubation/enterprises/${enterpriseId}/graduation`, data)
  },
  
  // 获取孵化统计
  getStats() {
    return request.get('/incubation/stats')
  }
}

