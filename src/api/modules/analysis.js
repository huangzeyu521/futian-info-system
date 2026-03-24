import request from '../index'

// 数据分析API
export const analysisApi = {
  // 获取KPI指标
  getKpiData(params) {
    return request.get('/analysis/kpi', { params })
  },
  
  // 获取出租率趋势
  getOccupancyTrend(params) {
    return request.get('/analysis/occupancy-trend', { params })
  },
  
  // 获取租金收入趋势
  getRevenueTrend(params) {
    return request.get('/analysis/revenue-trend', { params })
  },
  
  // 获取资产分布
  getAssetDistribution() {
    return request.get('/analysis/asset-distribution')
  },
  
  // 获取租户产业分布
  getIndustryDistribution() {
    return request.get('/analysis/industry-distribution')
  },
  
  // 获取排行数据
  getRankingData(type) {
    return request.get('/analysis/ranking', { params: { type } })
  },
  
  // 获取报表列表
  getReportList(params) {
    return request.get('/analysis/reports', { params })
  },
  
  // 生成报表
  generateReport(data) {
    return request.post('/analysis/reports/generate', data)
  },
  
  // 导出报表
  exportReport(reportId, format) {
    return request.get(`/analysis/reports/${reportId}/export`, { 
      params: { format },
      responseType: 'blob'
    })
  }
}

