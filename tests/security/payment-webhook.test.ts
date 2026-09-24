import { describe, it, expect, vi, beforeEach } from "vitest"
import { POST } from "@/app/api/webhooks/payment/route"

// Mock createClient
const mockSupabase = {
  from: vi.fn(),
}

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(() => Promise.resolve(mockSupabase)),
}))

describe("Payment Webhook Security (Phase 4C.3)", () => {
  const SECRET = "test_webhook_secret_2026"

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.PAYMENT_WEBHOOK_SECRET = SECRET
  })

  it("từ chối request không có secret hoặc secret không hợp lệ (401)", async () => {
    const request = new Request("http://localhost/api/webhooks/payment", {
      method: "POST",
      body: JSON.stringify({
        paymentId: "pay-123",
        secret: "wrong_secret",
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toContain("Unauthorized webhook payload")
  })

  it("từ chối request thiếu paymentId (400)", async () => {
    const request = new Request("http://localhost/api/webhooks/payment", {
      method: "POST",
      body: JSON.stringify({
        secret: SECRET,
        status: "success",
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain("Missing paymentId")
  })

  it("từ chối request khi số tiền không khớp với đơn thanh toán đã tạo (400)", async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              id: "pay-123",
              amount: 99000,
              status: "pending",
              plan: "basic",
              billing_cycle: "monthly",
            },
            error: null,
          }),
        }),
      }),
    })

    const request = new Request("http://localhost/api/webhooks/payment", {
      method: "POST",
      body: JSON.stringify({
        paymentId: "pay-123",
        secret: SECRET,
        status: "success",
        amount: 50000, // Cố tình gửi số tiền khác 99000
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain("Payment amount mismatch")
  })

  it("idempotent: gọi webhook lần 2 với giao dịch đã thành công thì không cộng dồn gói", async () => {
    const updateFn = vi.fn()
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              id: "pay-123",
              amount: 99000,
              status: "success", // Đã xử lý trước đó
              plan: "basic",
              billing_cycle: "monthly",
            },
            error: null,
          }),
        }),
      }),
      update: updateFn,
    })

    const request = new Request("http://localhost/api/webhooks/payment", {
      method: "POST",
      body: JSON.stringify({
        paymentId: "pay-123",
        secret: SECRET,
        status: "success",
        txnRef: "VNPAY-12345",
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toContain("already processed")
    expect(updateFn).not.toHaveBeenCalled() // Không gọi update thêm lần nữa
  })

  it("cập nhật gói thành công khi thông tin hợp lệ", async () => {
    const updatePayment = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    })
    const updateOrg = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    })

    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "subscription_payments") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: {
                  id: "pay-123",
                  org_id: "org-1",
                  amount: 99000,
                  status: "pending",
                  plan: "basic",
                  billing_cycle: "monthly",
                  organizations: {
                    plan_expires_at: null,
                  },
                },
                error: null,
              }),
            }),
          }),
          update: updatePayment,
        }
      }
      if (table === "organizations") {
        return {
          update: updateOrg,
        }
      }
      return {}
    })

    const request = new Request("http://localhost/api/webhooks/payment", {
      method: "POST",
      body: JSON.stringify({
        paymentId: "pay-123",
        secret: SECRET,
        status: "success",
        txnRef: "VNP_TRANS_999",
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(updatePayment).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "success",
        payment_gateway_txn_id: "VNP_TRANS_999",
      })
    )
    expect(updateOrg).toHaveBeenCalledWith(
      expect.objectContaining({
        plan: "basic",
        plan_status: "active",
      })
    )
  })
})
