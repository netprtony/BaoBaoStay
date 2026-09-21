-- Migration: 20260502000000_superadmin_rls.sql
-- Description: Cho phép Platform Admins (Superadmin) xem và quản lý tất cả Tổ chức, Chủ trọ, Phòng trọ, Khách thuê, Hợp đồng, Hóa đơn

-- 1. Helper function: Kiểm tra người dùng hiện tại có phải là platform_admin không
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.platform_admins WHERE id = auth.uid()
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_platform_admin() TO authenticated;

-- 2. Organizations: Cho phép Superadmin xem và cập nhật tất cả tổ chức
DROP POLICY IF EXISTS "Platform admins can view all organizations" ON public.organizations;
CREATE POLICY "Platform admins can view all organizations"
  ON public.organizations FOR SELECT
  TO authenticated
  USING (public.is_platform_admin());

DROP POLICY IF EXISTS "Platform admins can update all organizations" ON public.organizations;
CREATE POLICY "Platform admins can update all organizations"
  ON public.organizations FOR UPDATE
  TO authenticated
  USING (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());

-- 3. Profiles: Cho phép Superadmin xem và cập nhật tất cả hồ sơ chủ trọ / nhân viên
DROP POLICY IF EXISTS "Platform admins can view all profiles" ON public.profiles;
CREATE POLICY "Platform admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.is_platform_admin());

DROP POLICY IF EXISTS "Platform admins can update all profiles" ON public.profiles;
CREATE POLICY "Platform admins can update all profiles"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());

-- 4. Properties: Cho phép Superadmin xem tất cả nhà trọ trên hệ thống
DROP POLICY IF EXISTS "Platform admins can view all properties" ON public.properties;
CREATE POLICY "Platform admins can view all properties"
  ON public.properties FOR SELECT
  TO authenticated
  USING (public.is_platform_admin());

-- 5. Rooms: Cho phép Superadmin xem tất cả phòng trọ trên hệ thống
DROP POLICY IF EXISTS "Platform admins can view all rooms" ON public.rooms;
CREATE POLICY "Platform admins can view all rooms"
  ON public.rooms FOR SELECT
  TO authenticated
  USING (public.is_platform_admin());

-- 6. Tenants: Cho phép Superadmin xem tất cả khách thuê
DROP POLICY IF EXISTS "Platform admins can view all tenants" ON public.tenants;
CREATE POLICY "Platform admins can view all tenants"
  ON public.tenants FOR SELECT
  TO authenticated
  USING (public.is_platform_admin());

-- 7. Leases: Cho phép Superadmin xem tất cả hợp đồng thuê
DROP POLICY IF EXISTS "Platform admins can view all leases" ON public.leases;
CREATE POLICY "Platform admins can view all leases"
  ON public.leases FOR SELECT
  TO authenticated
  USING (public.is_platform_admin());

-- 8. Invoices: Cho phép Superadmin xem tất cả hóa đơn
DROP POLICY IF EXISTS "Platform admins can view all invoices" ON public.invoices;
CREATE POLICY "Platform admins can view all invoices"
  ON public.invoices FOR SELECT
  TO authenticated
  USING (public.is_platform_admin());

-- 9. Invoice Items: Cho phép Superadmin xem chi tiết tất cả hóa đơn
DROP POLICY IF EXISTS "Platform admins can view all invoice items" ON public.invoice_items;
CREATE POLICY "Platform admins can view all invoice items"
  ON public.invoice_items FOR SELECT
  TO authenticated
  USING (public.is_platform_admin());

-- 10. Meter Readings: Cho phép Superadmin xem tất cả chỉ số điện nước
DROP POLICY IF EXISTS "Platform admins can view all meter readings" ON public.meter_readings;
CREATE POLICY "Platform admins can view all meter readings"
  ON public.meter_readings FOR SELECT
  TO authenticated
  USING (public.is_platform_admin());

-- 11. Subscription Payments: Cho phép Superadmin xem và duyệt giao dịch thanh toán
DROP POLICY IF EXISTS "Platform admins can view all subscription payments" ON public.subscription_payments;
CREATE POLICY "Platform admins can view all subscription payments"
  ON public.subscription_payments FOR SELECT
  TO authenticated
  USING (public.is_platform_admin());

DROP POLICY IF EXISTS "Platform admins can update all subscription payments" ON public.subscription_payments;
CREATE POLICY "Platform admins can update all subscription payments"
  ON public.subscription_payments FOR UPDATE
  TO authenticated
  USING (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());
