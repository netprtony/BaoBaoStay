import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { AdminPaymentApprovalsClient } from "@/components/admin/admin-payment-approvals-client"
import { Receipt, Building2, CreditCard } from "lucide-react"

export const metadata = {
  title: "Duyệt Thanh toán Gói - SuperAdmin BaoBao Stay",
}

export default async function AdminSubscriptionPaymentsPage() {
  const supabase = await createClient()

  // Fetch all subscription payments with organization details & owner profile
  const { data: payments } = await supabase
    .from("subscription_payments")
    .select("*, organizations(*, profiles(*))")
    .order("created_at", { ascending: false })

  const paymentList = payments || []
  const pendingCount = paymentList.filter((p) => p.status === "pending").length

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <Receipt className="h-6 w-6 text-emerald-400" />
            Duyệt & Quản lý Đơn Thanh toán Gói (Subscription Payments)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Kiểm tra thông tin chuyển khoản từ chủ trọ, duyệt đơn và tự động kích hoạt thời hạn gói cước.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <Link
            href="/admin/subscriptions/payments"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold shadow"
          >
            <Receipt className="h-3.5 w-3.5" />
            <span>Duyệt Thanh toán</span>
            {pendingCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold">
                {pendingCount}
              </span>
            )}
          </Link>

          <Link
            href="/admin/subscriptions"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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

      <AdminPaymentApprovalsClient payments={paymentList} />
    </div>
  )
}
