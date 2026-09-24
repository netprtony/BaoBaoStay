import { describe, it, expect } from "vitest"

/**
 * Mô phỏng logic hàm PostgreSQL can_delete_room, can_delete_tenant, can_delete_property (Phase 2A)
 * Được kiểm tra để đảm bảo logic client/server action luôn đồng nhất với database RPC functions
 */

export type RoomDeletionCheck = {
  roomExists: boolean
  isOrgOwner: boolean
  activeLeasesCount: number
  historyLeasesCount: number
}

export function evaluateCanDeleteRoom(check: RoomDeletionCheck) {
  if (!check.roomExists || !check.isOrgOwner) {
    return { allowed: false, reason: "Không tìm thấy phòng hoặc không có quyền." }
  }

  if (check.activeLeasesCount > 0) {
    return {
      allowed: false,
      reason: "Phòng đang có hợp đồng hoạt động.",
      blocking_count: { active_leases: check.activeLeasesCount, history_leases: check.historyLeasesCount },
    }
  }

  return {
    allowed: true,
    reason: "OK",
    blocking_count: { active_leases: 0, history_leases: check.historyLeasesCount },
  }
}

export type TenantDeletionCheck = {
  tenantExists: boolean
  isOrgOwner: boolean
  leasesCount: number
}

export function evaluateCanDeleteTenant(check: TenantDeletionCheck) {
  if (!check.tenantExists || !check.isOrgOwner) {
    return { allowed: false, reason: "Không tìm thấy khách thuê hoặc không có quyền." }
  }

  if (check.leasesCount > 0) {
    return {
      allowed: false,
      reason: "Khách thuê đã có hợp đồng, chỉ có thể vô hiệu hóa.",
    }
  }

  return { allowed: true, reason: "OK" }
}

export type PropertyDeletionCheck = {
  propertyExists: boolean
  isOrgOwner: boolean
  roomsCount: number
}

export function evaluateCanDeleteProperty(check: PropertyDeletionCheck) {
  if (!check.propertyExists || !check.isOrgOwner) {
    return { allowed: false, reason: "Không tìm thấy khu trọ hoặc không có quyền." }
  }

  if (check.roomsCount > 0) {
    return {
      allowed: false,
      reason: "Khu trọ đang có phòng, vui lòng xóa hết phòng trước.",
      blocking_count: { rooms: check.roomsCount },
    }
  }

  return { allowed: true, reason: "OK", blocking_count: { rooms: 0 } }
}

describe("Room deletion constraints (Phase 2A)", () => {
  it("chặn xóa phòng đang có lease status = active", () => {
    const result = evaluateCanDeleteRoom({
      roomExists: true,
      isOrgOwner: true,
      activeLeasesCount: 1,
      historyLeasesCount: 2,
    })

    expect(result.allowed).toBe(false)
    expect(result.reason).toContain("đang có hợp đồng hoạt động")
  })

  it("cho phép xóa phòng chỉ có lease đã terminated, cảnh báo có lịch sử", () => {
    const result = evaluateCanDeleteRoom({
      roomExists: true,
      isOrgOwner: true,
      activeLeasesCount: 0,
      historyLeasesCount: 3,
    })

    expect(result.allowed).toBe(true)
    expect(result.reason).toBe("OK")
    expect(result.blocking_count?.history_leases).toBe(3)
  })

  it("chặn xóa phòng khi không đúng quyền org", () => {
    const result = evaluateCanDeleteRoom({
      roomExists: true,
      isOrgOwner: false,
      activeLeasesCount: 0,
      historyLeasesCount: 0,
    })

    expect(result.allowed).toBe(false)
    expect(result.reason).toContain("không có quyền")
  })
})

describe("Tenant deletion constraints (Phase 2A)", () => {
  it("chặn xóa tenant có bất kỳ lease nào, kể cả đã kết thúc", () => {
    const result = evaluateCanDeleteTenant({
      tenantExists: true,
      isOrgOwner: true,
      leasesCount: 1, // Dù chỉ có 1 hợp đồng cũ trong lịch sử
    })

    expect(result.allowed).toBe(false)
    expect(result.reason).toContain("đã có hợp đồng, chỉ có thể vô hiệu hóa")
  })

  it("cho phép xóa tenant mới tạo chưa từng ký bất kỳ hợp đồng nào", () => {
    const result = evaluateCanDeleteTenant({
      tenantExists: true,
      isOrgOwner: true,
      leasesCount: 0,
    })

    expect(result.allowed).toBe(true)
    expect(result.reason).toBe("OK")
  })
})

describe("Property deletion constraints (Phase 2A)", () => {
  it("chặn xóa property còn room, kể cả khi tất cả room status = available", () => {
    const result = evaluateCanDeleteProperty({
      propertyExists: true,
      isOrgOwner: true,
      roomsCount: 4, // Còn 4 phòng chưa xóa
    })

    expect(result.allowed).toBe(false)
    expect(result.reason).toContain("đang có phòng, vui lòng xóa hết phòng trước")
  })

  it("cho phép xóa property khi tất cả room đã được xóa sạch", () => {
    const result = evaluateCanDeleteProperty({
      propertyExists: true,
      isOrgOwner: true,
      roomsCount: 0,
    })

    expect(result.allowed).toBe(true)
    expect(result.reason).toBe("OK")
  })
})
