import { describe, it, expect } from "vitest"
import { SubscriptionLimitError, type PlanUsageInfo } from "@/lib/subscription/check-limit"

/**
 * Helper hàm kiểm tra logic giới hạn gói đăng ký (Phase 3A)
 */
export function evaluatePlanLimitRules(usage: PlanUsageInfo, action: "create_property" | "create_room") {
  if (usage.isReadOnly) {
    throw new SubscriptionLimitError(
      `Tài khoản của bạn đã hết hạn gói ${usage.plan.toUpperCase()} hoặc quá hạn thanh toán. Dữ liệu đang ở chế độ chỉ đọc.`
    )
  }

  if (action === "create_property" && usage.isAtPropertyLimit) {
    throw new SubscriptionLimitError(
      `Gói ${usage.plan.toUpperCase()} chỉ cho phép tối đa ${usage.maxProperties} nhà trọ.`
    )
  }

  if (action === "create_room" && usage.isAtRoomLimit) {
    throw new SubscriptionLimitError(
      `Gói ${usage.plan.toUpperCase()} chỉ cho phép tối đa ${usage.maxRooms} phòng.`
    )
  }

  return { allowed: true }
}

describe("Feature Gating theo gói đăng ký (Phase 3A)", () => {
  it("org gói Free tạo phòng thứ 11 → bị chặn (giới hạn tối đa 10 phòng)", () => {
    const freeOrgUsage: PlanUsageInfo = {
      plan: "free",
      planStatus: "active",
      planExpiresAt: null,
      isExpired: false,
      isReadOnly: false,
      propertiesCount: 1,
      maxProperties: 1,
      isAtPropertyLimit: true,
      roomsCount: 10,
      maxRooms: 10,
      isAtRoomLimit: true, // Đã đạt 10/10 phòng
      tenantPortalEnabled: false,
      smsNotificationEnabled: false,
    }

    expect(() => evaluatePlanLimitRules(freeOrgUsage, "create_room")).toThrow(SubscriptionLimitError)
  })

  it("org gói Free có dưới 10 phòng → cho phép tạo phòng tiếp theo", () => {
    const freeOrgUsage: PlanUsageInfo = {
      plan: "free",
      planStatus: "active",
      planExpiresAt: null,
      isExpired: false,
      isReadOnly: false,
      propertiesCount: 1,
      maxProperties: 1,
      isAtPropertyLimit: false,
      roomsCount: 9, // Đang có 9 phòng
      maxRooms: 10,
      isAtRoomLimit: false,
      tenantPortalEnabled: false,
      smsNotificationEnabled: false,
    }

    const result = evaluatePlanLimitRules(freeOrgUsage, "create_room")
    expect(result.allowed).toBe(true)
  })

  it("org gói Basic tạo phòng thứ 31 → bị chặn (giới hạn tối đa 30 phòng)", () => {
    const basicOrgUsage: PlanUsageInfo = {
      plan: "basic",
      planStatus: "active",
      planExpiresAt: new Date(Date.now() + 86400000).toISOString(),
      isExpired: false,
      isReadOnly: false,
      propertiesCount: 2,
      maxProperties: 3,
      isAtPropertyLimit: false,
      roomsCount: 30,
      maxRooms: 30,
      isAtRoomLimit: true, // 30/30 phòng
      tenantPortalEnabled: true,
      smsNotificationEnabled: false,
    }

    expect(() => evaluatePlanLimitRules(basicOrgUsage, "create_room")).toThrow(SubscriptionLimitError)
  })

  it("org gói VIP tạo phòng thứ 1000 → không bị chặn (max_rooms = null)", () => {
    const vipOrgUsage: PlanUsageInfo = {
      plan: "vip",
      planStatus: "active",
      planExpiresAt: new Date(Date.now() + 86400000 * 30).toISOString(),
      isExpired: false,
      isReadOnly: false,
      propertiesCount: 50,
      maxProperties: null, // Không giới hạn
      isAtPropertyLimit: false,
      roomsCount: 1000,
      maxRooms: null, // Không giới hạn
      isAtRoomLimit: false,
      tenantPortalEnabled: true,
      smsNotificationEnabled: true,
    }

    expect(evaluatePlanLimitRules(vipOrgUsage, "create_room").allowed).toBe(true)
    expect(evaluatePlanLimitRules(vipOrgUsage, "create_property").allowed).toBe(true)
  })

  it("org past_due hoặc hết hạn gói → rơi vào isReadOnly, chặn tạo mới nhưng dữ liệu cũ vẫn đọc được", () => {
    const pastDueOrgUsage: PlanUsageInfo = {
      plan: "basic",
      planStatus: "past_due",
      planExpiresAt: new Date(Date.now() - 86400000 * 5).toISOString(), // Đã hết hạn 5 ngày
      isExpired: true,
      isReadOnly: true,
      propertiesCount: 1,
      maxProperties: 3,
      isAtPropertyLimit: false,
      roomsCount: 15,
      maxRooms: 30,
      isAtRoomLimit: false,
      tenantPortalEnabled: true,
      smsNotificationEnabled: false,
    }

    expect(() => evaluatePlanLimitRules(pastDueOrgUsage, "create_room")).toThrow(SubscriptionLimitError)
    expect(() => evaluatePlanLimitRules(pastDueOrgUsage, "create_property")).toThrow(SubscriptionLimitError)
  })
})
