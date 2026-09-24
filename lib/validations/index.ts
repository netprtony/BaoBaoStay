import { z } from "zod"

// 1. Property validation schema
export const propertySchema = z.object({
  name: z.string().trim().min(1, "Tên nhà trọ không được để trống").max(100, "Tên nhà trọ tối đa 100 ký tự"),
  address: z.string().trim().min(1, "Địa chỉ không được để trống").max(255, "Địa chỉ tối đa 255 ký tự"),
  city: z.string().trim().max(100).optional().default(""),
  electricityRate: z.coerce.number().min(0, "Giá điện không được là số âm").default(3500),
  waterRate: z.coerce.number().min(0, "Giá nước không được là số âm").default(15000),
  amenities: z.array(z.string()).optional().default([]),
})

export type PropertyInput = z.infer<typeof propertySchema>

// 2. Room validation schema
export const roomSchema = z.object({
  propertyId: z.string().uuid("ID nhà trọ không hợp lệ"),
  roomCode: z.string().trim().min(1, "Mã phòng không được để trống").max(50, "Mã phòng tối đa 50 ký tự"),
  area: z.coerce.number().positive("Diện tích phòng phải lớn hơn 0"),
  basePrice: z.coerce.number().min(0, "Giá thuê không được là số âm"),
  maxTenants: z.coerce.number().int().min(1, "Số khách tối đa ít nhất là 1").default(2),
  status: z.enum(["available", "occupied", "maintenance"]).default("available"),
  amenities: z.array(z.string()).optional().default([]),
})

export type RoomInput = z.infer<typeof roomSchema>

// 3. Tenant validation schema
// Regex kiểm tra số điện thoại Việt Nam chuẩn (10 chữ số, bắt đầu bằng 0)
const VN_PHONE_REGEX = /^(0[3|5|7|8|9])[0-9]{8}$/
// CCCD/CMND: 9 chữ số hoặc 12 chữ số
const ID_CARD_REGEX = /^([0-9]{9}|[0-9]{12})$/

export const tenantSchema = z.object({
  fullName: z.string().trim().min(1, "Họ tên không được để trống").max(100, "Họ tên tối đa 100 ký tự"),
  phone: z.string().trim().regex(VN_PHONE_REGEX, "Số điện thoại không đúng định dạng (10 số, bắt đầu bằng 03, 05, 07, 08, 09)"),
  idCardNumber: z
    .string()
    .trim()
    .refine((val) => !val || ID_CARD_REGEX.test(val), {
      message: "CCCD/CMND phải gồm 9 hoặc 12 chữ số",
    })
    .optional()
    .nullable(),
  email: z
    .string()
    .trim()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: "Email không đúng định dạng",
    })
    .optional()
    .nullable(),
  hometown: z.string().trim().max(200).optional().nullable(),
})

export type TenantInput = z.infer<typeof tenantSchema>

// 4. Lease validation schema
export const leaseSchema = z
  .object({
    roomId: z.string().uuid("ID phòng không hợp lệ"),
    tenantId: z.string().uuid("ID khách thuê không hợp lệ"),
    startDate: z.string().min(1, "Ngày bắt đầu không được để trống"),
    endDate: z.string().optional().nullable(),
    depositAmount: z.coerce.number().min(0, "Tiền cọc không được âm").default(0),
    monthlyRent: z.coerce.number().min(0, "Tiền thuê tháng không được âm"),
    status: z.enum(["active", "expired", "terminated"]).default("active"),
  })
  .refine(
    (data) => {
      if (data.endDate && data.startDate) {
        return new Date(data.endDate) >= new Date(data.startDate)
      }
      return true
    },
    {
      message: "Ngày kết thúc hợp đồng phải sau hoặc bằng ngày bắt đầu",
      path: ["endDate"],
    }
  )

export type LeaseInput = z.infer<typeof leaseSchema>

// 5. Invoice validation schema
export const invoiceItemSchema = z.object({
  id: z.string().optional(),
  label: z.string().trim().min(1, "Tên dịch vụ không được để trống"),
  amount: z.coerce.number().min(0, "Số tiền không được âm"),
})

export const invoiceSchema = z.object({
  leaseId: z.string().uuid("ID hợp đồng không hợp lệ"),
  period: z.string().trim().min(1, "Kỳ thu tiền không được để trống"),
  rentAmount: z.coerce.number().min(0, "Tiền phòng không được âm"),
  electricityAmount: z.coerce.number().min(0, "Tiền điện không được âm").default(0),
  waterAmount: z.coerce.number().min(0, "Tiền nước không được âm").default(0),
  otherFees: z.coerce.number().min(0, "Phụ phí không được âm").default(0),
  totalAmount: z.coerce.number().min(0, "Tổng tiền không được âm"),
  dueDate: z.string().min(1, "Hạn nộp không được để trống"),
  status: z.enum(["pending", "paid", "partially_paid", "cancelled", "overdue"]).default("pending"),
  items: z.array(invoiceItemSchema).default([]),
})

export type InvoiceInput = z.infer<typeof invoiceSchema>
