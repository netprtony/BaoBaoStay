/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Building2,
  User,
  ShieldCheck,
  CreditCard,
  Trash2,
  Loader2,
  Calendar,
  Sparkles,
  Phone,
  QrCode,
  ArrowRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { formatVND } from "@/lib/payment/vnpay"
import {
  approveSubscriptionPayment,
  rejectSubscriptionPayment,
  deleteSubscriptionPayment,
} from "@/app/admin/subscriptions/actions"

interface AdminPaymentApprovalsClientProps {
  payments: any[]
}

export function AdminPaymentApprovalsClient({ payments }: AdminPaymentApprovalsClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("pending")

  // Modal approve state
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null)
  const [isApproveOpen, setIsApproveOpen] = useState(false)
  const [isRejectOpen, setIsRejectOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Calculations
  const pendingPayments = payments.filter((p) => p.status === "pending")
  const successPayments = payments.filter((p) => p.status === "success")
  const failedPayments = payments.filter((p) => p.status === "failed")

  const pendingAmount = pendingPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
  const successAmount = successPayments.reduce((sum, p) => sum + (p.amount || 0), 0)

  // Filter list
  const filteredPayments = payments.filter((p) => {
    const org = p.organizations || {}
    const profiles = org.profiles || []
    const owner = profiles[0] || {}

    const orgName = (org.name || "").toLowerCase()
    const ownerName = (owner.full_name || "").toLowerCase()
    const ownerPhone = (owner.phone || "").toLowerCase()
    const txnId = (p.payment_gateway_txn_id || "").toLowerCase()
    const s = searchTerm.toLowerCase()

    const matchesSearch =
      orgName.includes(s) || ownerName.includes(s) || ownerPhone.includes(s) || txnId.includes(s)

    if (statusFilter === "all") return matchesSearch
    return matchesSearch && p.status === statusFilter
  })

  const handleApprove = async () => {
    if (!selectedPayment) return
    setIsSubmitting(true)
    setMessage(null)
    try {
      const res = await approveSubscriptionPayment(selectedPayment.id)
      if (res.error) {
        setMessage({ type: "error", text: res.error })
      } else {
        setMessage({ type: "success", text: res.message || "Đã duyệt và kích hoạt gói thành công!" })
        setTimeout(() => {
          setIsApproveOpen(false)
          setSelectedPayment(null)
          setMessage(null)
        }, 1500)
      }
    } catch (err: unknown) {
      setMessage({ type: "error", text: (err as Error).message || "Lỗi khi duyệt đơn." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!selectedPayment) return
    setIsSubmitting(true)
    setMessage(null)
    try {
      const res = await rejectSubscriptionPayment(selectedPayment.id, rejectReason)
      if (res.error) {
        setMessage({ type: "error", text: res.error })
      } else {
        setMessage({ type: "success", text: res.message || "Đã từ chối đơn thành công!" })
        setTimeout(() => {
          setIsRejectOpen(false)
          setSelectedPayment(null)
          setMessage(null)
          setRejectReason("")
        }, 1500)
      }
    } catch (err: unknown) {
      setMessage({ type: "error", text: (err as Error).message || "Lỗi khi từ chối đơn." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (paymentId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa vĩnh viễn đơn thanh toán này?")) return
    try {
      const res = await deleteSubscriptionPayment(paymentId)
      if (res.error) alert(res.error)
    } catch (err: unknown) {
      alert((err as Error).message)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pending Card */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Đơn Chờ Kiểm Tra & Duyệt
              </CardDescription>
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <CardTitle className="text-3xl font-extrabold text-amber-300">
              {pendingPayments.length} <span className="text-xs font-normal text-slate-400">đơn</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-400">
            Tổng giá trị: <span className="font-bold text-amber-300 font-mono">{formatVND(pendingAmount)}</span>
          </CardContent>
        </Card>

        {/* Success Card */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Đã Duyệt & Kích Hoạt
              </CardDescription>
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <CardTitle className="text-3xl font-extrabold text-emerald-400">
              {successPayments.length} <span className="text-xs font-normal text-slate-400">đơn</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-400">
            Tổng doanh thu: <span className="font-bold text-emerald-400 font-mono">{formatVND(successAmount)}</span>
          </CardContent>
        </Card>

        {/* Failed / Cancelled Card */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                Đã Từ Chối / Đã Hủy
              </CardDescription>
              <div className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <XCircle className="h-4 w-4" />
              </div>
            </div>
            <CardTitle className="text-3xl font-extrabold text-rose-400">
              {failedPayments.length} <span className="text-xs font-normal text-slate-400">đơn</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-400">
            Đơn không thành công hoặc khách hủy
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xl">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Tìm theo mã GD, tên nhà trọ, chủ trọ, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Button
            size="sm"
            variant={statusFilter === "pending" ? "default" : "outline"}
            onClick={() => setStatusFilter("pending")}
            className={
              statusFilter === "pending"
                ? "bg-amber-600 hover:bg-amber-500 text-white font-bold"
                : "border-slate-800 text-slate-400 hover:text-white"
            }
          >
            🟡 Chờ duyệt ({pendingPayments.length})
          </Button>

          <Button
            size="sm"
            variant={statusFilter === "success" ? "default" : "outline"}
            onClick={() => setStatusFilter("success")}
            className={
              statusFilter === "success"
                ? "bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                : "border-slate-800 text-slate-400 hover:text-white"
            }
          >
            🟢 Đã duyệt ({successPayments.length})
          </Button>

          <Button
            size="sm"
            variant={statusFilter === "failed" ? "default" : "outline"}
            onClick={() => setStatusFilter("failed")}
            className={
              statusFilter === "failed"
                ? "bg-rose-600 hover:bg-rose-500 text-white font-bold"
                : "border-slate-800 text-slate-400 hover:text-white"
            }
          >
            🔴 Từ chối ({failedPayments.length})
          </Button>

          <Button
            size="sm"
            variant={statusFilter === "all" ? "default" : "outline"}
            onClick={() => setStatusFilter("all")}
            className={
              statusFilter === "all"
                ? "bg-violet-600 text-white font-bold"
                : "border-slate-800 text-slate-400 hover:text-white"
            }
          >
            Tất cả ({payments.length})
          </Button>
        </div>
      </div>

      {/* Payments Table */}
      <Card className="bg-slate-900 border-slate-800 text-slate-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Mã Giao dịch</th>
                <th className="py-3.5 px-4">Nhà trọ & Chủ trọ</th>
                <th className="py-3.5 px-4">Gói đăng ký</th>
                <th className="py-3.5 px-4">Số tiền</th>
                <th className="py-3.5 px-4">Thời gian tạo</th>
                <th className="py-3.5 px-4 text-center">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Thao tác Duyệt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500">
                    Không tìm thấy đơn thanh toán nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  const org = p.organizations || {}
                  const profiles = org.profiles || []
                  const owner = profiles[0] || {}

                  const isPending = p.status === "pending"
                  const isSuccess = p.status === "success"
                  const isFailed = p.status === "failed"

                  const isVip = p.plan === "vip"
                  const isYearly = p.billing_cycle === "yearly"

                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                          <span>{p.payment_gateway_txn_id || `ID: ${p.id.slice(0, 8)}`}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase">
                          {p.payment_method === "bank_transfer" ? "Chuyển khoản QR" : p.payment_method}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <Link
                            href={`/admin/organizations/${org.id}`}
                            className="font-bold text-white hover:text-violet-400 hover:underline block"
                          >
                            {org.name || "Không rõ"}
                          </Link>
                          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {owner.full_name || "Chưa có tên"}
                            </span>
                            {owner.phone && (
                              <span className="flex items-center gap-1 text-slate-500 font-mono">
                                <Phone className="h-3 w-3" />
                                {owner.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <Badge
                            className={`uppercase text-[10px] font-bold ${
                              isVip
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                            }`}
                          >
                            {isVip ? "👑 Gói VIP" : "⚡ Gói Basic"}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-400">
                            {isYearly ? "1 Năm" : "1 Tháng"}
                          </Badge>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-emerald-400 font-mono text-sm">
                          {formatVND(p.amount)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400">
                        <div>{new Date(p.created_at).toLocaleDateString("vi-VN")}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {new Date(p.created_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {isPending && (
                          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 gap-1 text-[11px] font-bold animate-pulse">
                            <Clock className="h-3 w-3" /> Chờ duyệt
                          </Badge>
                        )}
                        {isSuccess && (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 gap-1 text-[11px]">
                            <CheckCircle2 className="h-3 w-3" /> Đã kích hoạt
                          </Badge>
                        )}
                        {isFailed && (
                          <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 gap-1 text-[11px]">
                            <XCircle className="h-3 w-3" /> Đã từ chối
                          </Badge>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedPayment(p)
                                  setIsApproveOpen(true)
                                }}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8 px-3 font-bold gap-1 shadow-md shadow-emerald-600/20"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Duyệt & Kích hoạt
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedPayment(p)
                                  setIsRejectOpen(true)
                                }}
                                className="border-rose-900/60 text-rose-400 hover:bg-rose-950/40 text-xs h-8 px-2.5"
                              >
                                Từ chối
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(p.id)}
                              className="text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 h-8 w-8 p-0"
                              title="Xóa bản ghi"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Duyệt & Kích hoạt gói */}
      {selectedPayment && (
        <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
          <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2 text-white">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                Xác nhận Duyệt & Kích hoạt Gói
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Kiểm tra tài khoản ngân hàng đã nhận đủ tiền trước khi bấm kích hoạt.
              </DialogDescription>
            </DialogHeader>

            {message && (
              <div
                className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                  message.type === "success"
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                    : "bg-rose-950 text-rose-300 border border-rose-800"
                }`}
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{message.text}</span>
              </div>
            )}

            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tổ chức / Nhà trọ:</span>
                  <span className="font-bold text-white">{selectedPayment.organizations?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Gói nâng cấp:</span>
                  <span className="font-bold text-violet-400 uppercase">
                    Gói {selectedPayment.plan} ({selectedPayment.billing_cycle === "yearly" ? "1 Năm" : "1 Tháng"})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Số tiền thanh toán:</span>
                  <span className="font-extrabold text-emerald-400 font-mono text-sm">
                    {formatVND(selectedPayment.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mã giao dịch:</span>
                  <span className="font-mono text-slate-300">{selectedPayment.payment_gateway_txn_id}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-900/60 text-blue-200 text-[11px] leading-relaxed">
                ℹ️ Khi bấm <strong>"Xác nhận kích hoạt"</strong>, hệ thống sẽ tự động cập nhật gói dịch vụ của tổ chức sang trạng thái <strong>ACTIVE</strong> và tính hạn sử dụng mới cho khách hàng.
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsApproveOpen(false)}
                disabled={isSubmitting}
                className="text-xs text-slate-400 hover:text-white"
              >
                Hủy bỏ
              </Button>

              <Button
                type="button"
                onClick={handleApprove}
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 shadow-lg shadow-emerald-600/25"
              >
                {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {isSubmitting ? "Đang kích hoạt..." : "Xác nhận Kích hoạt Gói"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal Từ chối đơn */}
      {selectedPayment && (
        <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
          <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2 text-rose-400">
                <XCircle className="h-5 w-5" />
                Từ chối Đơn Thanh toán
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Chuyển trạng thái đơn sang thất bại nếu chưa nhận được tiền hoặc thông tin sai lệch.
              </DialogDescription>
            </DialogHeader>

            {message && (
              <div
                className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                  message.type === "success"
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                    : "bg-rose-950 text-rose-300 border border-rose-800"
                }`}
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{message.text}</span>
              </div>
            )}

            <div className="space-y-3 pt-2 text-xs">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Lý do từ chối (tùy chọn)</Label>
                <Input
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="VD: Chưa nhận được chuyển khoản / Sai số tiền..."
                  className="bg-slate-950 border-slate-800 text-xs text-slate-200"
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsRejectOpen(false)}
                disabled={isSubmitting}
                className="text-xs text-slate-400 hover:text-white"
              >
                Đóng
              </Button>

              <Button
                type="button"
                onClick={handleReject}
                disabled={isSubmitting}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs gap-1.5"
              >
                {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {isSubmitting ? "Đang xử lý..." : "Xác nhận Từ chối"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
