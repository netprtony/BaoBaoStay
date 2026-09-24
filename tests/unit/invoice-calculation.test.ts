import { describe, it, expect } from "vitest"
import {
  calculateElectricityAmount,
  calculateWaterAmount,
  calculateInvoiceTotal,
  InvalidMeterReadingError,
} from "@/lib/invoices/calculations"

describe("Invoice Calculation - calculateElectricityAmount", () => {
  it("tính đúng tiền điện khi số mới > số cũ bình thường", () => {
    const result = calculateElectricityAmount({
      oldVal: 100,
      newVal: 150,
      unitPrice: 3500,
    })

    expect(result.oldValue).toBe(100)
    expect(result.newValue).toBe(150)
    expect(result.consumption).toBe(50) // 150 - 100 = 50 kWh
    expect(result.amount).toBe(175000) // 50 * 3500 = 175,000 VND
  })

  it("tính đúng khi đổi công tơ (checkbox reset, số mới < số cũ)", () => {
    // Ví dụ công tơ cũ đạt 9999 hoặc hỏng, thay công tơ mới bắt đầu từ 0 đến 25
    const result = calculateElectricityAmount({
      oldVal: 850,
      newVal: 25,
      unitPrice: 3500,
      isReset: true,
    })

    expect(result.consumption).toBe(25) // Tiêu thụ tính từ 0 đến 25
    expect(result.amount).toBe(87500) // 25 * 3500 = 87,500 VND
  })

  it("làm tròn tiền đúng quy tắc chuẩn tiền tệ (không lệch đồng lẻ thập phân)", () => {
    const result = calculateElectricityAmount({
      oldVal: 10,
      newVal: 23,
      unitPrice: 3567.89, // Đơn giá lẻ
    })

    // 13 * 3567.89 = 46382.57 -> làm tròn 46383
    expect(result.consumption).toBe(13)
    expect(result.amount).toBe(46383)
  })

  it("throw error khi electricity_new < electricity_old mà không đánh dấu đổi công tơ", () => {
    expect(() =>
      calculateElectricityAmount({
        oldVal: 200,
        newVal: 180,
        unitPrice: 3500,
        isReset: false,
      })
    ).toThrow(InvalidMeterReadingError)
  })

  it("throw error khi chỉ số hoặc đơn giá điện là số âm", () => {
    expect(() =>
      calculateElectricityAmount({
        oldVal: -10,
        newVal: 50,
        unitPrice: 3500,
      })
    ).toThrow(InvalidMeterReadingError)
  })
})

describe("Invoice Calculation - calculateWaterAmount", () => {
  it("tính đúng tiền nước khi số mới > số cũ", () => {
    const result = calculateWaterAmount({
      oldVal: 40,
      newVal: 48,
      unitPrice: 15000,
    })

    expect(result.consumption).toBe(8) // 48 - 40 = 8 m3
    expect(result.amount).toBe(120000) // 8 * 15,000 = 120,000 VND
  })

  it("tính đúng khi đổi đồng hồ nước (isReset: true)", () => {
    const result = calculateWaterAmount({
      oldVal: 120,
      newVal: 5,
      unitPrice: 15000,
      isReset: true,
    })

    expect(result.consumption).toBe(5)
    expect(result.amount).toBe(75000)
  })

  it("throw error khi số nước mới nhỏ hơn số cũ mà không có reset", () => {
    expect(() =>
      calculateWaterAmount({
        oldVal: 50,
        newVal: 30,
        unitPrice: 15000,
      })
    ).toThrow(InvalidMeterReadingError)
  })
})

describe("Invoice Calculation - calculateInvoiceTotal", () => {
  it("cộng đúng rent, electricity, water và other_fees vào total_amount", () => {
    const result = calculateInvoiceTotal({
      rentAmount: 3500000,
      electricityAmount: 175000,
      waterAmount: 120000,
      otherFees: 150000,
    })

    expect(result.rentAmount).toBe(3500000)
    expect(result.electricityAmount).toBe(175000)
    expect(result.waterAmount).toBe(120000)
    expect(result.itemsTotal).toBe(150000)
    expect(result.totalAmount).toBe(3945000)
  })

  it("tính đúng tổng khi cung cấp danh sách dynamic invoice items (wifi, rác, giữ xe)", () => {
    const result = calculateInvoiceTotal({
      rentAmount: 3000000,
      electricityAmount: 200000,
      waterAmount: 80000,
      items: [
        { label: "Tiền Wifi", amount: 100000 },
        { label: "Tiền rác", amount: 30000 },
        { label: "Tiền gửi xe", amount: 120000 },
      ],
    })

    expect(result.itemsTotal).toBe(250000) // 100k + 30k + 120k
    expect(result.totalAmount).toBe(3530000) // 3000k + 200k + 80k + 250k
  })

  it("xử lý an toàn khi các giá trị bị khuyết hoặc số thập phân", () => {
    const result = calculateInvoiceTotal({
      rentAmount: 3500000.4,
      electricityAmount: 150000.6,
    })

    expect(result.rentAmount).toBe(3500000)
    expect(result.electricityAmount).toBe(150001)
    expect(result.waterAmount).toBe(0)
    expect(result.itemsTotal).toBe(0)
    expect(result.totalAmount).toBe(3650001)
  })
})
