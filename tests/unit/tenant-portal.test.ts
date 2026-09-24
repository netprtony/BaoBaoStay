import { describe, it, expect } from "vitest"

/**
 * Các hàm helper mô phỏng quyền truy cập và ràng buộc trên Cổng Khách Thuê (Tenant Portal)
 */

export type TenantProfileUpdate = {
  currentPhone: string
  currentIdCard: string
  newFullName: string
  newPhone?: string
  newIdCard?: string
}

export function validateTenantProfileUpdate(input: TenantProfileUpdate) {
  // Tenant không được tự ý sửa số điện thoại hoặc CCCD/CMND trên portal (tránh giả mạo danh tính)
  if (input.newPhone && input.newPhone !== input.currentPhone) {
    return {
      success: false,
      error: "Không được phép tự thay đổi số điện thoại. Vui lòng liên hệ chủ nhà.",
    }
  }

  if (input.newIdCard && input.newIdCard !== input.currentIdCard) {
    return {
      success: false,
      error: "Không được phép tự thay đổi số CCCD/CMND. Vui lòng liên hệ chủ nhà.",
    }
  }

  if (!input.newFullName.trim()) {
    return { success: false, error: "Họ tên không được để trống." }
  }

  return { success: true, updatedFields: { full_name: input.newFullName.trim() } }
}

export type InvoiceFilterContext = {
  tenantId: string
  tenantLeaseIds: string[]
  invoices: Array<{
    id: string
    lease_id: string
    period: string
    total_amount: number
  }>
}

export function filterInvoicesForTenant(ctx: InvoiceFilterContext) {
  // Chỉ lọc hóa đơn thuộc về các hợp đồng của chính tenant đó
  return ctx.invoices.filter((inv) => ctx.tenantLeaseIds.includes(inv.lease_id))
}

export type MarkPaidConstraintInput = {
  status: "paid" | "pending"
  paidAt: string | null
  attemptNewStatus: "pending"
  maxDaysAllowedToRevert?: number
}

export function canRevertPaidInvoice(input: MarkPaidConstraintInput) {
  if (input.status !== "paid" || !input.paidAt) {
    return { allowed: true }
  }

  const maxDays = input.maxDaysAllowedToRevert ?? 7
  const paidDate = new Date(input.paidAt).getTime()
  const now = Date.now()
  const daysDiff = (now - paidDate) / (1000 * 3600 * 24)

  if (daysDiff > maxDays) {
    return {
      allowed: false,
      error: `Hóa đơn đã thanh toán quá ${maxDays} ngày. Không thể hoàn tác trạng thái để tránh sửa đổi lịch sử tài chính tùy tiện.`,
    }
  }

  return { allowed: true }
}

describe("Cổng khách thuê (Tenant Portal - Phase 4B.5)", () => {
  it("tenant chỉ xem được invoices của chính lease mình, không thấy invoices của tenant khác", () => {
    const tenantLeaseIds = ["lease-tenant-A1", "lease-tenant-A2"]
    const allInvoices = [
      { id: "inv-1", lease_id: "lease-tenant-A1", period: "08/2026", total_amount: 3500000 },
      { id: "inv-2", lease_id: "lease-tenant-A2", period: "09/2026", total_amount: 3200000 },
      { id: "inv-3", lease_id: "lease-tenant-B_OTHER", period: "09/2026", total_amount: 4000000 },
    ]

    const visibleInvoices = filterInvoicesForTenant({
      tenantId: "tenant-A",
      tenantLeaseIds,
      invoices: allInvoices,
    })

    expect(visibleInvoices.length).toBe(2)
    expect(visibleInvoices.map((i) => i.id)).toEqual(["inv-1", "inv-2"])
    expect(visibleInvoices.find((i) => i.id === "inv-3")).toBeUndefined()
  })

  it("tenant update profile chỉ sửa được full_name, chặn sửa phone và id_card_number", () => {
    const validUpdate = validateTenantProfileUpdate({
      currentPhone: "0901234567",
      currentIdCard: "079201001234",
      newFullName: "Nguyễn Văn An Cập Nhật",
      newPhone: "0901234567", // Không đổi
    })

    expect(validUpdate.success).toBe(true)
    expect(validUpdate.updatedFields?.full_name).toBe("Nguyễn Văn An Cập Nhật")

    const invalidPhoneUpdate = validateTenantProfileUpdate({
      currentPhone: "0901234567",
      currentIdCard: "079201001234",
      newFullName: "Nguyễn Văn An",
      newPhone: "0988888888", // Cố tình đổi số điện thoại
    })

    expect(invalidPhoneUpdate.success).toBe(false)
    expect(invalidPhoneUpdate.error).toContain("Không được phép tự thay đổi số điện thoại")
  })
})

describe("Đánh dấu thanh toán hóa đơn (Phase 4B.6)", () => {
  it("cho phép hoàn tác hóa đơn đã paid trong vòng 7 ngày", () => {
    const recentPaid = new Date(Date.now() - 2 * 86400000).toISOString() // 2 ngày trước
    const check = canRevertPaidInvoice({
      status: "paid",
      paidAt: recentPaid,
      attemptNewStatus: "pending",
      maxDaysAllowedToRevert: 7,
    })

    expect(check.allowed).toBe(true)
  })

  it("chặn hoàn tác hóa đơn đã paid quá 7 ngày để bảo đảm toàn vẹn báo cáo tài chính", () => {
    const oldPaid = new Date(Date.now() - 15 * 86400000).toISOString() // 15 ngày trước
    const check = canRevertPaidInvoice({
      status: "paid",
      paidAt: oldPaid,
      attemptNewStatus: "pending",
      maxDaysAllowedToRevert: 7,
    })

    expect(check.allowed).toBe(false)
    expect(check.error).toContain("Hóa đơn đã thanh toán quá 7 ngày")
  })
})
