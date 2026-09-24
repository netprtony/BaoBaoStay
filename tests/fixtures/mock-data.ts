/**
 * Test fixtures, factory data và mock Supabase helper
 */

export const mockOrgA = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Nhà Trọ Hoàng Gia Org A",
  slug: "nha-tro-org-a",
  plan: "free",
  plan_status: "active",
  plan_expires_at: null,
  is_suspended: false,
}

export const mockOrgB = {
  id: "22222222-2222-4222-8222-222222222222",
  name: "Ký Túc Xá Sinh Viên Org B",
  slug: "ktx-org-b",
  plan: "basic",
  plan_status: "active",
  plan_expires_at: new Date(Date.now() + 30 * 86400000).toISOString(),
  is_suspended: false,
}

export const mockOrgSuspended = {
  id: "33333333-3333-4333-8333-333333333333",
  name: "Nhà Trọ Bị Tạm Khóa",
  slug: "tam-khoa",
  plan: "free",
  plan_status: "canceled",
  plan_expires_at: null,
  is_suspended: true,
}

export const mockUserOwnerA = {
  id: "aaaa0001-0000-4000-8000-000000000001",
  email: "owner-a@baobaostay.com",
  org_id: mockOrgA.id,
  role: "owner",
}

export const mockUserOwnerB = {
  id: "bbbb0002-0000-4000-8000-000000000002",
  email: "owner-b@baobaostay.com",
  org_id: mockOrgB.id,
  role: "owner",
}

export const mockPropertyA = {
  id: "prop0001-0000-4000-8000-000000000001",
  org_id: mockOrgA.id,
  name: "Nhà Trọ Cơ Sở 1",
  address: "123 Nguyễn Văn Cừ, Q.5, TP.HCM",
  electricity_rate: 3500,
  water_rate: 15000,
  deleted_at: null,
}

export const mockRoomA1 = {
  id: "room0001-0000-4000-8000-000000000001",
  org_id: mockOrgA.id,
  property_id: mockPropertyA.id,
  room_code: "P.101",
  area: 25,
  base_price: 3500000,
  status: "occupied",
  deleted_at: null,
}

export const mockRoomA2 = {
  id: "room0002-0000-4000-8000-000000000002",
  org_id: mockOrgA.id,
  property_id: mockPropertyA.id,
  room_code: "P.102",
  area: 20,
  base_price: 3000000,
  status: "available",
  deleted_at: null,
}

export const mockTenantA1 = {
  id: "tena0001-0000-4000-8000-000000000001",
  org_id: mockOrgA.id,
  full_name: "Nguyễn Văn An",
  phone: "0901234567",
  id_card_number: "079201001234",
  email: "an.nguyen@gmail.com",
  deleted_at: null,
}

export const mockTenantA2NoLease = {
  id: "tena0002-0000-4000-8000-000000000002",
  org_id: mockOrgA.id,
  full_name: "Trần Thị Bình (Chưa ký HĐ)",
  phone: "0912345678",
  id_card_number: "079201005678",
  email: "binh.tran@gmail.com",
  deleted_at: null,
}

export const mockLeaseActive = {
  id: "leas0001-0000-4000-8000-000000000001",
  org_id: mockOrgA.id,
  room_id: mockRoomA1.id,
  tenant_id: mockTenantA1.id,
  start_date: "2026-01-01",
  end_date: "2026-12-31",
  deposit_amount: 3500000,
  monthly_rent: 3500000,
  status: "active",
}

export const mockLeaseTerminated = {
  id: "leas0002-0000-4000-8000-000000000002",
  org_id: mockOrgA.id,
  room_id: mockRoomA2.id,
  tenant_id: mockTenantA1.id,
  start_date: "2025-01-01",
  end_date: "2025-12-31",
  deposit_amount: 3000000,
  monthly_rent: 3000000,
  status: "terminated",
}

export const mockInvoicePending = {
  id: "invo0001-0000-4000-8000-000000000001",
  org_id: mockOrgA.id,
  lease_id: mockLeaseActive.id,
  period: "09/2026",
  rent_amount: 3500000,
  electricity_amount: 350000,
  water_amount: 75000,
  other_fees: 130000,
  total_amount: 4055000,
  due_date: "2026-09-30",
  status: "pending",
  paid_at: null,
}

export const mockInvoicePaid = {
  id: "invo0002-0000-4000-8000-000000000002",
  org_id: mockOrgA.id,
  lease_id: mockLeaseActive.id,
  period: "08/2026",
  rent_amount: 3500000,
  electricity_amount: 300000,
  water_amount: 60000,
  other_fees: 130000,
  total_amount: 3990000,
  due_date: "2026-08-31",
  status: "paid",
  paid_at: "2026-08-28T10:00:00Z",
}

export const mockSubscriptionPayment = {
  id: "paym0001-0000-4000-8000-000000000001",
  org_id: mockOrgA.id,
  plan: "basic",
  billing_cycle: "monthly",
  amount: 99000,
  status: "pending",
  payment_method: "bank_transfer",
  created_at: new Date().toISOString(),
  organizations: mockOrgA,
}
