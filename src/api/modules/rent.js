import request from '../index'

// 租金管理API
export const rentApi = {
  // 获取账单列表
  getBillList(params) {
    return request.get('/rent/bills', { params })
  },
  
  // 生成账单
  generateBill(data) {
    return request.post('/rent/bills/generate', data)
  },
  
  // 确认收款
  confirmPayment(billId, data) {
    return request.post(`/rent/bills/${billId}/confirm`, data)
  },
  
  // 获取收款记录
  getPaymentList(params) {
    return request.get('/rent/payments', { params })
  },
  
  // 录入收款
  createPayment(data) {
    return request.post('/rent/payments', data)
  },
  
  // 获取押金列表
  getDepositList(params) {
    return request.get('/rent/deposits', { params })
  },
  
  // 退还押金
  refundDeposit(depositId, data) {
    return request.post(`/rent/deposits/${depositId}/refund`, data)
  },
  
  // 获取租金统计
  getStats() {
    return request.get('/rent/stats')
  },
  
  // 发送催缴通知
  sendReminder(billId) {
    return request.post(`/rent/bills/${billId}/remind`)
  }
}

