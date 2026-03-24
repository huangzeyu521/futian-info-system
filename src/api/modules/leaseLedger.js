import { buildUnifiedContracts, computeContractStats } from '@/utils/leaseLedgerTransform'

const jsonUrl = () => {
  const base = import.meta.env.BASE_URL || '/'
  const b = base.endsWith('/') ? base : `${base}/`
  return `${b}data/lease-ledger.json`
}

async function fetchLedgerJson () {
  const res = await fetch(jsonUrl(), { cache: 'no-store' })
  if (!res.ok) throw new Error(`加载租赁台账失败: ${res.status}`)
  return res.json()
}

/**
 * 原始台账 JSON（与 materials/租赁台账（新）.xlsx 导出一致）
 */
export async function getLeaseLedgerRaw () {
  const data = await fetchLedgerJson()
  return { code: 200, data, message: 'ok' }
}

/**
 * 统一合同行（产业入驻两表融合），供租赁合同管理等模块使用
 */
export async function getUnifiedContracts () {
  const data = await fetchLedgerJson()
  const list = buildUnifiedContracts(data)
  const stats = computeContractStats(list)
  return {
    code: 200,
    data: { list, stats, sourceFile: data.sourceFile },
    message: 'ok'
  }
}

export const leaseLedgerApi = {
  getLeaseLedgerRaw,
  getUnifiedContracts
}
