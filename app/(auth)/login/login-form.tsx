"use client"

import { useState } from "react"
import Link from "next/link"
import { PasswordInput } from "@/components/ui/password-input"
import { SubmitButton } from "@/components/submit-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, CheckCircle2 } from "lucide-react"

interface LoginFormProps {
  action: (formData: FormData) => void
}

export function LoginForm({ action }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isDemoFilled, setIsDemoFilled] = useState(false)

  const handleFillDemo = () => {
    setEmail("demo@mail.com")
    setPassword("123456")
    setIsDemoFilled(true)
  }

  return (
    <div className="space-y-4">
      {/* Demo Account Banner */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 text-xs text-blue-900 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-blue-800">
              <Sparkles className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span>Tài khoản trải nghiệm Demo nhanh</span>
            </div>
            <p className="text-blue-700/90 leading-relaxed">
              Tài khoản: <code className="font-mono bg-blue-100 px-1.5 py-0.5 rounded text-blue-900 font-bold">demo@mail.com</code>
              <br />
              Mật khẩu: <code className="font-mono bg-blue-100 px-1.5 py-0.5 rounded text-blue-900 font-bold">123456</code>
            </p>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
          >
            {isDemoFilled ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                <span>Đã điền</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Điền nhanh</span>
              </>
            )}
          </button>
        </div>
      </div>

      <form action={action} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email tài khoản</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tk: demo@mail.com"
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Mật khẩu</Label>
            <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
              Quên mật khẩu?
            </Link>
          </div>
          <PasswordInput
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="mk: 123456"
            required
          />
        </div>
        <SubmitButton className="w-full font-semibold shadow-md shadow-blue-500/20">
          Đăng nhập
        </SubmitButton>
      </form>
    </div>
  )
}
