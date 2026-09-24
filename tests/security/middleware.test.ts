import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

/**
 * Helper mô phỏng luồng kiểm tra bảo mật của middleware
 * (Tương ứng với logic trong lib/supabase/middleware.ts)
 */
export type MiddlewareUserContext = {
  user: { id: string; email: string } | null
  isPlatformAdmin?: boolean
  isOrgSuspended?: boolean
}

export function evaluateMiddlewareRouteProtection(pathname: string, ctx: MiddlewareUserContext) {
  // 1. Bảo vệ route /admin (chỉ Superadmin / platform_admins)
  if (pathname.startsWith("/admin")) {
    if (!ctx.user) {
      return { redirect: `/login?redirectTo=${encodeURIComponent(pathname)}` }
    }
    if (!ctx.isPlatformAdmin) {
      return { redirect: "/dashboard" }
    }
  }

  // 2. Bảo vệ route /dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!ctx.user) {
      return { redirect: `/login?redirectTo=${encodeURIComponent(pathname)}` }
    }
    if (ctx.isOrgSuspended) {
      return { redirect: "/suspended" }
    }
  }

  // 3. Bảo vệ route /portal (Cổng khách thuê)
  if (pathname.startsWith("/portal") && pathname !== "/portal/login") {
    if (!ctx.user) {
      return { redirect: `/portal/login?redirectTo=${encodeURIComponent(pathname)}` }
    }
  }

  // 4. Nếu đã đăng nhập, chuyển hướng khỏi các trang auth
  if (ctx.user) {
    if (pathname === "/login" || pathname === "/register") {
      return { redirect: "/dashboard" }
    }
    if (pathname === "/portal/login") {
      return { redirect: "/portal/dashboard" }
    }
  }

  return { next: true }
}

describe("Middleware Route Protection & Auth (Phase 4C.4)", () => {
  it("chặn truy cập /dashboard khi chưa đăng nhập (redirect về /login)", () => {
    const result = evaluateMiddlewareRouteProtection("/dashboard", { user: null })
    expect(result.redirect).toBe("/login?redirectTo=%2Fdashboard")
  })

  it("chặn truy cập /admin khi user không có quyền platform admin (redirect về /dashboard)", () => {
    const result = evaluateMiddlewareRouteProtection("/admin/organizations", {
      user: { id: "user-1", email: "owner@test.com" },
      isPlatformAdmin: false,
    })
    expect(result.redirect).toBe("/dashboard")
  })

  it("cho phép Superadmin truy cập /admin", () => {
    const result = evaluateMiddlewareRouteProtection("/admin/subscriptions", {
      user: { id: "admin-1", email: "superadmin@baobaostay.com" },
      isPlatformAdmin: true,
    })
    expect(result.next).toBe(true)
  })

  it("tự động chuyển hướng về /suspended khi tổ chức bị khóa (is_suspended = true)", () => {
    const result = evaluateMiddlewareRouteProtection("/dashboard/invoices", {
      user: { id: "user-2", email: "owner2@test.com" },
      isOrgSuspended: true,
    })
    expect(result.redirect).toBe("/suspended")
  })

  it("chặn truy cập /portal khi chưa đăng nhập portal khách thuê", () => {
    const result = evaluateMiddlewareRouteProtection("/portal/invoices", { user: null })
    expect(result.redirect).toBe("/portal/login?redirectTo=%2Fportal%2Finvoices")
  })

  it("người dùng đã đăng nhập vào /login sẽ tự động chuyển hướng về /dashboard", () => {
    const result = evaluateMiddlewareRouteProtection("/login", {
      user: { id: "user-3", email: "user@test.com" },
    })
    expect(result.redirect).toBe("/dashboard")
  })
})
