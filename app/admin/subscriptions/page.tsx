import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { AdminSubscriptionsClient } from "@/components/admin/admin-subscriptions-client"
import { CreditCard, Receipt, Building2 } from "lucide-react"

export const metadata = {
  title: "Quản lý Subscription - SuperAdmin BaoBao Stay",
}

export default async function AdminSubscriptionsPage() {
  const supabase = await createClient()

  // Fetch all organizations with owner profile and payment records
  const { data: organizations } = await supabase
    .from("organizations")
    .select("*, profiles(*), subscription_payments(*)")
    .order("created_at", { ascending: false })

  const orgList = organizations || []

  // Calculate MRR, Total Revenue & Pending Payments Count
  let mrr = 0
  let totalRevenue = 0
  let paidCount = 0
  let expiringSoonCount = 0
  let pendingCount = 0

  const now = new Date()
  const sevenDaysLater = new Date(now)
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7)

  orgList.forEach((org) => {
    const isPaid = org.plan === "basic" || org.plan === "vip"
    if (isPaid && org.plan_status === "active") {
      paidCount++
      if (org.plan === "basic") mrr += 99000
      if (org.plan === "vip") mrr += 249000
    }

    if (org.plan_expires_at) {
      const exp = new Date(org.plan_expires_at)
      if (exp >= now && exp <= sevenDaysLater) {
        expiringSoonCount++
      }
    }

    if (org.subscription_payments) {
      org.subscription_payments.forEach((p: Record<string, unknown>) => {
        if (p.status === "success") {
          totalRevenue += (p.amount as number) || 0
        }
        if (p.status === "pending") {
          pendingCount++
        }
      })
    }
  })

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-violet-400" />
            Quản lý Đăng ký Gói (Subscriptions)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Theo dõi danh sách khách hàng, tình trạng gói cước, gia hạn thủ công và doanh thu nền tảng.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <Link
            href="/admin/subscriptions/payments"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Receipt className="h-3.5 w-3.5" />
            <span>Duyệt Thanh toán</span>
            {pendingCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold animate-pulse">
                {pendingCount}
              </span>
            )}
          </Link>

          <Link
            href="/admin/subscriptions"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 text-white font-bold shadow"
          >
            <CreditCard className="h-3.5 w-3.5" />
            <span>Tổ chức & Gói cước</span>
          </Link>

          <Link
            href="/admin/organizations"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>Danh sách Tổ chức</span>
          </Link>
        </div>
      </div>

      <AdminSubscriptionsClient
        organizations={orgList}
        mrr={mrr}
        totalRevenue={totalRevenue}
        paidCount={paidCount}
        expiringSoonCount={expiringSoonCount}
      />
    </div>
  )
}
