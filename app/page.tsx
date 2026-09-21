import Link from "next/link";
import Image from "next/image";
import { 
  Building2, 
  Home, 
  Users, 
  Receipt, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  FileText,
  BarChart3,
  Smartphone,
  Lock,
  Clock,
  HelpCircle,
  Star
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white antialiased">
      {/* Dynamic Background Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] pointer-events-none z-0" />

      {/* Glassmorphism Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 opacity-40 blur transition group-hover:opacity-75" />
              <Image
                src="/mainlogo-removebg-preview.webp"
                alt="BaoBao Stay Logo"
                width={52}
                height={52}
                className="relative h-13 w-13 object-contain shrink-0"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  BaoBao Stay
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
                  SaaS 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Quản lý nhà trọ thông minh</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Tính năng</a>
            <a href="#pricing" className="hover:text-white transition-colors">Bảng giá</a>
            <a href="#portal" className="hover:text-white transition-colors">Cổng Khách thuê</a>
            <a href="#faq" className="hover:text-white transition-colors">Hỏi đáp</a>
          </nav>
          
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2.5 rounded-xl hover:bg-slate-900 transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/35 active:scale-95 transition-all"
            >
              <span>Bắt đầu miễn phí</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 relative z-10">
        <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 overflow-hidden">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold shadow-inner">
                <Sparkles className="h-4 w-4 text-blue-400 animate-pulse" />
                <span>Nền tảng quản lý nhà trọ & căn hộ dịch vụ thế hệ mới</span>
              </div>

              {/* Main Title */}
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl sm:leading-[1.15]">
                Quản lý nhà trọ <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">thông minh</span>, không lo thất thoát
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-slate-400 leading-relaxed font-normal max-w-2xl mx-auto">
                Tự động hóa toàn bộ quy trình: từ chốt chỉ số điện nước, lập hợp đồng, xuất hóa đơn PDF chuyên nghiệp đến cổng thông tin khách thuê trực tuyến. Tiết kiệm 90% thời gian mỗi tháng.
              </p>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-7 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <span>Dùng thử miễn phí ngay</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>

                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-7 py-4 text-base font-semibold text-slate-200 border border-slate-800 shadow-md hover:bg-slate-800 hover:text-white transition-all"
                >
                  <Sparkles className="h-4 w-4 text-blue-400" />
                  <span>Trải nghiệm tài khoản Demo</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-400">
                <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Miễn phí khởi tạo trọn đời</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
                  <ShieldCheck className="h-4 w-4 text-blue-400" />
                  <span>Bảo mật dữ liệu RLS Postgres</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
                  <Clock className="h-4 w-4 text-amber-400" />
                  <span>Cài đặt & sử dụng trong 2 phút</span>
                </div>
              </div>
            </div>

            {/* Hero Dashboard Preview Card */}
            <div className="mt-16 relative max-w-5xl mx-auto">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600/30 to-cyan-500/30 blur-2xl opacity-50" />
              <div className="relative rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-xl">
                {/* Window header */}
                <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 bg-slate-950/60">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                    <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 text-xs font-mono text-slate-400">dashboard.baobaostay.vn</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Hệ thống đang hoạt động
                  </div>
                </div>

                {/* Dashboard Stats Preview */}
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-950/30">
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-2">
                      <span>Tổng Nhà Trọ</span>
                      <Building2 className="h-4 w-4 text-blue-400" />
                    </div>
                    <p className="text-2xl font-extrabold text-white">3 Tòa nhà</p>
                    <span className="text-[11px] text-slate-500">TP.HCM & Hà Nội</span>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-2">
                      <span>Tổng Số Phòng</span>
                      <Home className="h-4 w-4 text-indigo-400" />
                    </div>
                    <p className="text-2xl font-extrabold text-white">32 Phòng</p>
                    <span className="text-[11px] text-emerald-400 font-medium">Tỷ lệ lấp đầy 94%</span>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-2">
                      <span>Chỉ Số Điện Nước</span>
                      <Zap className="h-4 w-4 text-amber-400" />
                    </div>
                    <p className="text-2xl font-extrabold text-amber-300">Đã chốt Kỳ 09</p>
                    <span className="text-[11px] text-slate-500">Tự động tính lũy tiến</span>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-2">
                      <span>Hóa Đơn Tháng Này</span>
                      <Receipt className="h-4 w-4 text-emerald-400" />
                    </div>
                    <p className="text-2xl font-extrabold text-emerald-400">86.500.000đ</p>
                    <span className="text-[11px] text-emerald-400/90 font-medium">Xuất PDF 1 click</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Key Features Grid */}
        <section id="features" className="py-24 border-t border-slate-800/60 bg-slate-900/40 relative">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-xs font-extrabold tracking-widest text-blue-400 uppercase">
                Tính năng toàn diện
              </h2>
              <p className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Mọi công cụ chủ nhà trọ cần trong 1 nền tảng
              </p>
              <p className="text-sm text-slate-400">
                Được nghiên cứu và tối ưu hóa theo đúng quy trình quản lý thực tế tại các nhà trọ Việt Nam.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Feature 1 */}
              <div className="group p-7 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10 transition-all">
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  Quản lý Đa cơ sở & Sơ đồ phòng
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Quản lý nhiều tòa nhà trọ cùng lúc. Thẻ phòng hiển thị trực quan theo 3 màu trạng thái: Trống, Đang thuê và Bảo trì.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group p-7 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10 transition-all">
                <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                  Ghi Chỉ Số Điện Nước Thông Minh
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Nhập số cũ và số mới hàng tháng cực nhanh. Hệ thống tự động tính sản lượng tiêu thụ và thành tiền chính xác.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group p-7 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/10 transition-all">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  Tự Động Tạo Hóa Đơn & Xuất PDF
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Tự động tổng hợp tiền phòng, điện, nước và phí dịch vụ. Xuất file PDF mẫu hóa đơn chuẩn gửi trực tiếp qua Zalo.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group p-7 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 transition-all">
                <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                  Hồ Sơ Khách Thuê & Hợp Đồng
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Quản lý CCCD, tiền cọc, ngày bắt đầu và ngày hết hạn hợp đồng. Cảnh báo tự động khi hợp đồng thuê sắp hết hạn.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="group p-7 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/10 transition-all">
                <div className="h-12 w-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Smartphone className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  Cổng Thông Tin Khách Thuê Trực Tuyến
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Khách thuê tự đăng nhập bằng SĐT/Email để xem hóa đơn hàng tháng, lịch sử điện nước và chi tiết hợp đồng thuê.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="group p-7 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/10 transition-all">
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  Bảo Mật Đám Mây & Sao Lưu
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Bảo mật phân quyền Row-Level Security (RLS) trên Supabase Postgres. Hỗ trợ xuất/nhập sao lưu dữ liệu an toàn.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Tenant Portal Highlight Section */}
        <section id="portal" className="py-20 border-t border-slate-800/60 relative overflow-hidden">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 p-8 sm:p-12 relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Tiện ích độc quyền</span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-white sm:text-4xl leading-tight">
                    Cổng Tra Cứu Khách Thuê Dành Cho Người Thuê Phòng
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Không còn lo ngại việc gửi hóa đơn từng phòng thủ công! Chủ trọ cấp tài khoản, khách thuê tự truy cập vào Cổng Khách thuê để kiểm tra hóa đơn tiền nhà, chỉ số điện nước minh bạch 24/7.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/portal/login"
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all"
                    >
                      <span>Xem giao diện Cổng Khách thuê</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-slate-300">Khách thuê: Nguyễn Văn A (Phòng 102)</span>
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Đã thanh toán</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Tiền phòng:</span>
                      <span className="text-white font-medium">3.500.000đ</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Tiền điện (120kWh × 3.500đ):</span>
                      <span className="text-white font-medium">420.000đ</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Tiền nước (8m³ × 15.000đ):</span>
                      <span className="text-white font-medium">120.000đ</span>
                    </div>
                    <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-2 font-bold text-sm">
                      <span className="text-white">Tổng cộng:</span>
                      <span className="text-emerald-400">4.040.000đ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Subscription Pricing Section */}
        <section id="pricing" className="py-24 border-t border-slate-800/60 bg-slate-950 relative">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-xs font-extrabold tracking-widest text-blue-400 uppercase">
                Bảng giá minh bạch
              </h2>
              <p className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Chọn gói dịch vụ phù hợp với quy mô nhà trọ
              </p>
              <p className="text-sm text-slate-400">
                Miễn phí khởi tạo. Nâng cấp linh hoạt bất cứ khi nào bạn mở rộng kinh doanh.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              
              {/* Free Plan */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 flex flex-col justify-between hover:border-slate-700 transition-all">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">🎁 Gói Free</h3>
                    <p className="text-xs text-slate-400 mt-1">Dành cho chủ nhà trọ nhỏ</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">0đ</span>
                    <span className="text-xs text-slate-400">/ trọn đời</span>
                  </div>

                  <ul className="space-y-3 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Quản lý tối đa **1** nhà trọ</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Quản lý tối đa **10** phòng</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Lưu trữ dữ liệu đám mây Supabase</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Sao lưu & Khôi phục thủ công (JSON/CSV)</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/register"
                  className="mt-8 block w-full rounded-xl bg-slate-800 hover:bg-slate-700 py-3 text-center text-xs font-semibold text-white transition-all"
                >
                  Đăng ký dùng Free
                </Link>
              </div>

              {/* Starter Plan - Most Popular */}
              <div className="rounded-3xl border-2 border-blue-500 bg-slate-900 p-8 flex flex-col justify-between shadow-2xl shadow-blue-500/20 relative">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-1 text-[11px] font-bold text-white shadow-md">
                  POPULAR — Khuyên dùng
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">⚡ Gói Starter</h3>
                    <p className="text-xs text-slate-400 mt-1">Cho quy mô 1 - 3 dãy nhà trọ</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">99.000đ</span>
                    <span className="text-xs text-slate-400">/ tháng</span>
                  </div>

                  <ul className="space-y-3 text-xs text-slate-200">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
                      <span>Quản lý tối đa **3** nhà trọ</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
                      <span>Quản lý tối đa **30** phòng</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
                      <span>Tự động xuất hóa đơn PDF chuyên nghiệp</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
                      <span>Cổng thông tin khách thuê riêng</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
                      <span>Hỗ trợ kỹ thuật 24/7</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/register"
                  className="mt-8 block w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 py-3 text-center text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition-all"
                >
                  Đăng ký Gói Starter
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 flex flex-col justify-between hover:border-slate-700 transition-all">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">👑 Gói Pro (VIP)</h3>
                    <p className="text-xs text-slate-400 mt-1">Dành cho chuỗi căn hộ & nhà trọ lớn</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">249.000đ</span>
                    <span className="text-xs text-slate-400">/ tháng</span>
                  </div>

                  <ul className="space-y-3 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                      <span>**Không giới hạn** số nhà trọ</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                      <span>**Không giới hạn** số phòng</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                      <span>Tất cả tính năng cao cấp</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                      <span>Hỗ trợ riêng 1:1 từ đội ngũ kỹ thuật</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/register"
                  className="mt-8 block w-full rounded-xl bg-slate-800 hover:bg-slate-700 py-3 text-center text-xs font-semibold text-white transition-all"
                >
                  Nâng cấp Gói VIP
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 border-t border-slate-800/60 bg-slate-900/40">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 space-y-3">
              <h2 className="text-2xl font-bold text-white">Câu hỏi thường gặp</h2>
              <p className="text-xs text-slate-400">Giải đáp nhanh các thắc mắc của chủ nhà trọ</p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80">
                <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-blue-400 shrink-0" />
                  <span>Gói Free có bị giới hạn thời gian dùng thử không?</span>
                </h3>
                <p className="text-xs text-slate-400 pl-6 leading-relaxed">
                  Không! Gói Free được sử dụng miễn phí trọn đời cho tối đa 1 nhà trọ và 10 phòng. Bạn không cần nhập thẻ tín dụng hay trả phí khi bắt đầu.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80">
                <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-blue-400 shrink-0" />
                  <span>Tôi có thể tải file PDF hóa đơn để gửi qua Zalo cho khách không?</span>
                </h3>
                <p className="text-xs text-slate-400 pl-6 leading-relaxed">
                  Có! Hệ thống hỗ trợ tạo và tải hóa đơn chuẩn file PDF chỉ với 1 click. Bạn có thể lưu về máy hoặc gửi trực tiếp cho khách qua Zalo/Facebook Messenger.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80">
                <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-blue-400 shrink-0" />
                  <span>Dữ liệu của nhà trọ tôi có được an toàn và bảo mật không?</span>
                </h3>
                <p className="text-xs text-slate-400 pl-6 leading-relaxed">
                  Bảo mật 100%! Dữ liệu được lưu trữ trên cơ sở dữ liệu PostgreSQL của Supabase với phân quyền Row Level Security (RLS). Mỗi tài khoản chủ trọ chỉ truy cập được dữ liệu của chính mình.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Bottom Banner */}
        <section className="py-20 relative overflow-hidden">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 p-8 sm:p-12 text-center text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden">
              <div className="max-w-2xl mx-auto space-y-6">
                <h2 className="text-3xl font-extrabold sm:text-4xl">
                  Sẵn sàng tối ưu quy trình quản lý nhà trọ của bạn?
                </h2>
                <p className="text-sm text-blue-100">
                  Tạo tài khoản ngay hôm nay để trải nghiệm sự tiện lợi và tiết kiệm 90% thời gian quản lý mỗi tháng.
                </p>
                <div className="pt-2">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-blue-900 shadow-lg hover:bg-blue-50 transition-all active:scale-95"
                  >
                    <span>Bắt đầu dùng thử miễn phí</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-10 relative z-10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <Image
              src="/mainlogo-removebg-preview.webp"
              alt="BaoBao Stay Logo"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <div>
              <p className="font-bold text-slate-200">BaoBao Stay — SaaS Quản Lý Nhà Trọ</p>
              <p className="text-[11px] text-slate-400">© {new Date().getFullYear()} BaoBao Stay. Bảo lưu mọi quyền.</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-white transition-colors">Tính năng</a>
            <a href="#pricing" className="hover:text-white transition-colors">Bảng giá</a>
            <Link href="/login" className="hover:text-white transition-colors">Đăng nhập</Link>
            <Link href="/portal/login" className="hover:text-white transition-colors">Cổng Khách thuê</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
