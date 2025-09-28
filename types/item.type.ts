/**
 * @file Kiểu dữ liệu cho sản phẩm (item).
 * @description Định nghĩa các interface cho đối tượng sản phẩm và phản hồi từ API.
 */

/**
 * @interface IItem
 * @description Đại diện cho một sản phẩm trong hệ thống.
 */
export interface IItem {
  id: number
  itemName: string
  price: number
  description: string | null
  createdAt: string
  updatedAt: string
}

/**
 * @interface IItemData
 * @description Cấu trúc dữ liệu trả về từ API cho danh sách sản phẩm, bao gồm thông tin phân trang.
 */
export interface IItemData {
  content: IItem[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

/**
 * @interface IItemResponse
 * @description Cấu trúc phản hồi chung từ API khi lấy danh sách sản phẩm.
 */
export interface IItemResponse {
  code: number
  message: string
  data: IItemData
}

/**
 * @interface IGetItemsParams
 * @description Các tham số tùy chọn để truy vấn danh sách sản phẩm.
 */
export interface IGetItemsParams {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: "asc" | "desc"
  itemName?: string
  minPrice?: number
  maxPrice?: number
}
