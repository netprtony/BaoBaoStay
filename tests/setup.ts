import "@testing-library/jest-dom/vitest"
import { vi } from "vitest"

// Mock environment variables for testing
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://mock-supabase.baobaostay.com"
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "mock-anon-key-12345"
process.env.PAYMENT_WEBHOOK_SECRET = "test_webhook_secret_2026"

// Suppress repetitive server action revalidatePath warnings in tests if not in Next environment
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}))
