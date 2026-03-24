/**
 * 将《租赁台账（新）》JSON 转为统一合同列表与统计（与台账 Excel 数据源一致）
 */
export const SHEET = {
  XIN_RUZHU: '新一代产业园产业租赁台账',
  TAI_RUZHU: '泰然立城产业租赁台账'
}

export function parseMoney (s) {
  if (s === undefined || s === null || s === '' || s === '/') return 0
  const n = parseFloat(String(s).replace(/,/g, '').trim())
  return Number.isFinite(n) ? n : 0
}

export function normalizeDateDisplay (s) {
  if (!s || !String(s).trim()) return ''
  const t = String(s).trim()
  const m = t.match(/^(\d{4})\.(\d{1,2})\.(\d{1,2})$/)
  if (m) return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`
  const m3 = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  if (m3) return `${m3[1]}-${m3[2].padStart(2, '0')}-${m3[3].padStart(2, '0')}`
  return t
}

function parseEndDate (s) {
  const d = normalizeDateDisplay(s)
  if (!d) return null
  const [y, mo, day] = d.split('-').map(Number)
  return new Date(y, mo - 1, day)
}

export function contractStatusFromDates (startStr, endStr) {
  const end = parseEndDate(endStr)
  const start = parseEndDate(startStr)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  if (!end && !start) return 'pending'
  if (end) {
    const e = new Date(end)
    e.setHours(0, 0, 0, 0)
    if (e < now) return 'terminated'
    const diff = (e - now) / 86400000
    if (diff <= 90) return 'expiring'
  }
  return 'active'
}

function firstAreaNumber (propertyArea) {
  if (!propertyArea) return 0
  const s = String(propertyArea)
  const m = s.match(/[\d.]+/)
  return m ? parseFloat(m[0]) : 0
}

function pickAreaXin (r) {
  const a = parseMoney(r.propertyArea)
  if (a > 0) return a
  return firstAreaNumber(r.propertyArea)
}

function pickAreaTai (r) {
  const a = parseMoney(r.leasedArea)
  if (a > 0) return a
  return firstAreaNumber(r.leasedArea || r.propertyArea)
}

function mapXinRecord (r, idx) {
  const tenantName = (r.tenantName || '').trim()
  if (!tenantName || tenantName === '空置') return null
  const startDate = normalizeDateDisplay(r.startDate)
  const endDate = normalizeDateDisplay(r.endDate)
  const rent = parseMoney(r.year1RentAfterDiscount)
  const area = pickAreaXin(r)
  const roomInfo = [r.zone, r.buildingRoom].filter(Boolean).join(' ') || r.buildingRoom || '-'
  const id = `xin-${idx}-${tenantName.slice(0, 8)}`
  return {
    id,
    contractNo: `GY-XGY-${String(idx + 1).padStart(5, '0')}`,
    tenantName,
    parkName: '新一代产业园',
    roomInfo,
    area,
    rentAmount: rent,
    startDate: startDate || '-',
    endDate: endDate || '-',
    status: contractStatusFromDates(r.startDate, r.endDate),
    source: 'xin',
    raw: r
  }
}

function mapTaiRecord (r, idx) {
  const tenantName = (r.tenantName || '').trim()
  if (!tenantName || tenantName === '空置') return null
  const startDate = normalizeDateDisplay(r.startDate)
  const endDate = normalizeDateDisplay(r.endDate)
  const rent = parseMoney(r.year1RentAfterDiscount)
  const area = pickAreaTai(r)
  const roomInfo = [r.zone, r.buildingRoom].filter(Boolean).join(' ') || r.buildingRoom || '-'
  const id = `tai-${idx}-${tenantName.slice(0, 8)}`
  return {
    id,
    contractNo: `GY-TRC-${String(idx + 1).padStart(5, '0')}`,
    tenantName,
    parkName: '泰然立城',
    roomInfo,
    area,
    rentAmount: rent,
    startDate: startDate || '-',
    endDate: endDate || '-',
    status: contractStatusFromDates(r.startDate, r.endDate),
    source: 'tai',
    raw: r
  }
}

export function buildUnifiedContracts (ledgerJson) {
  const sheets = ledgerJson?.sheets || {}
  const xin = sheets[SHEET.XIN_RUZHU]?.records || []
  const tai = sheets[SHEET.TAI_RUZHU]?.records || []
  const list = []
  xin.forEach((r, i) => {
    const row = mapXinRecord(r, i)
    if (row) list.push(row)
  })
  tai.forEach((r, i) => {
    const row = mapTaiRecord(r, i)
    if (row) list.push(row)
  })
  return list
}

export function computeContractStats (list) {
  const total = list.length
  let active = 0
  let expiring = 0
  let pending = 0
  let terminated = 0
  for (const row of list) {
    if (row.status === 'active') active++
    else if (row.status === 'expiring') expiring++
    else if (row.status === 'pending') pending++
    else if (row.status === 'terminated') terminated++
  }
  return { total, active, expiring, pending, terminated }
}
