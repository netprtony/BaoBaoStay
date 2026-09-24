/**
 * Module tính toán hóa đơn và chỉ số điện nước thuần túy (Pure Calculation Functions)
 * Dùng cho cả Client UI, Server Actions và Unit Tests
 */

export class InvalidMeterReadingError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "InvalidMeterReadingError"
  }
}

export type MeterCalculationInput = {
  oldVal: number
  newVal: number
  unitPrice: number
  isReset?: boolean // Đánh dấu đổi/thay công tơ mới
}

export type MeterCalculationResult = {
  oldValue: number
  newValue: number
  consumption: number
  unitPrice: number
  amount: number
}

/**
 * 1. Tính toán lượng tiêu thụ và tiền điện
 */
export function calculateElectricityAmount(input: MeterCalculationInput): MeterCalculationResult {
  const { oldVal, newVal, unitPrice, isReset = false } = input

  if (oldVal < 0 || newVal < 0 || unitPrice < 0) {
    throw new InvalidMeterReadingError("Chỉ số và đơn giá điện không được là số âm.")
  }

  // Trường hợp số mới nhỏ hơn số cũ mà không đánh dấu đổi công tơ
  if (newVal < oldVal && !isReset) {
    throw new InvalidMeterReadingError(
      `Chỉ số điện mới (${newVal}) nhỏ hơn chỉ số cũ (${oldVal}). Vui lòng kiểm tra lại hoặc đánh dấu "Đổi công tơ".`
    )
  }

  // Tiêu thụ: Nếu đổi công tơ thì tính từ 0 đến số mới, ngược lại lấy số mới trừ số cũ
  const consumption = isReset ? newVal : Math.max(0, newVal - oldVal)
  const amount = Math.round(consumption * unitPrice)

  return {
    oldValue: oldVal,
    newValue: newVal,
    consumption,
    unitPrice,
    amount,
  }
}

/**
 * 2. Tính toán lượng tiêu thụ và tiền nước
 */
export function calculateWaterAmount(input: MeterCalculationInput): MeterCalculationResult {
  const { oldVal, newVal, unitPrice, isReset = false } = input

  if (oldVal < 0 || newVal < 0 || unitPrice < 0) {
    throw new InvalidMeterReadingError("Chỉ số và đơn giá nước không được là số âm.")
  }

  if (newVal < oldVal && !isReset) {
    throw new InvalidMeterReadingError(
      `Chỉ số nước mới (${newVal}) nhỏ hơn chỉ số cũ (${oldVal}). Vui lòng kiểm tra lại hoặc đánh dấu "Đổi công tơ".`
    )
  }

  const consumption = isReset ? newVal : Math.max(0, newVal - oldVal)
  const amount = Math.round(consumption * unitPrice)

  return {
    oldValue: oldVal,
    newValue: newVal,
    consumption,
    unitPrice,
    amount,
  }
}

export type InvoiceItem = {
  label: string
  amount: number
}

export type InvoiceTotalCalculationInput = {
  rentAmount: number
  electricityAmount?: number
  waterAmount?: number
  items?: InvoiceItem[]
  otherFees?: number
}

export type InvoiceTotalCalculationResult = {
  rentAmount: number
  electricityAmount: number
  waterAmount: number
  itemsTotal: number
  totalAmount: number
}

/**
 * 3. Tính toán tổng tiền hóa đơn (làm tròn số nguyên chuẩn tiền VND)
 */
export function calculateInvoiceTotal(input: InvoiceTotalCalculationInput): InvoiceTotalCalculationResult {
  const rent = Math.max(0, Math.round(input.rentAmount || 0))
  const electricity = Math.max(0, Math.round(input.electricityAmount || 0))
  const water = Math.max(0, Math.round(input.waterAmount || 0))

  let itemsSum = 0
  if (input.items && input.items.length > 0) {
    itemsSum = input.items.reduce((sum, item) => {
      const amt = Number(item.amount) || 0
      return sum + Math.max(0, Math.round(amt))
    }, 0)
  } else if (input.otherFees !== undefined) {
    itemsSum = Math.max(0, Math.round(input.otherFees))
  }

  const total = rent + electricity + water + itemsSum

  return {
    rentAmount: rent,
    electricityAmount: electricity,
    waterAmount: water,
    itemsTotal: itemsSum,
    totalAmount: total,
  }
}
