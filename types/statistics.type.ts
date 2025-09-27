/**
 * @fileoverview Định nghĩa các kiểu dữ liệu (TypeScript interfaces) cho module thống kê.
 * @version 1.0.0
 * @since 2025-09-27
 * @author Dũng Đàm
 */

/**
 * Interface cho dữ liệu doanh thu từ API thống kê.
 */
export interface IRevenue {
  /** Doanh thu từ việc bán ghế */
  seatRevenue: number
  /** Doanh thu từ việc bán đồ ăn */
  foodRevenue: number
  /** Tổng doanh thu */
  totalRevenue: number
}

/**
 * Interface cho dữ liệu thống kê chi tiết từ API.
 */
export interface IStatisticsData {
  /** Tổng số khách hàng trong hệ thống */
  totalCustomers: number
  /** Số khách hàng đã đăng ký tham gia */
  registeredCustomers: number
  /** Số khách hàng đã đặt ghế */
  seatBookedCustomers: number
  /** Thông tin chi tiết về doanh thu */
  revenue: IRevenue
}

/**
 * Interface cho phản hồi từ API thống kê.
 */
export interface IStatisticsResponse {
  code: number
  message: string
  data: IStatisticsData | null
}
