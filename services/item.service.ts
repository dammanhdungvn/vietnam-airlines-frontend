/**
 * @file Dịch vụ quản lý sản phẩm.
 * @description File này chứa các hàm để tương tác với API quản lý sản phẩm,
 * bao gồm lấy danh sách sản phẩm với các tham số truy vấn.
 */

import api from "@/lib/api"
import { IGetItemsParams, IItemData, IItemResponse } from "@/types/item.type"

/**
 * @function getItems
 * @description Lấy danh sách sản phẩm từ API với các tham số tùy chọn.
 * @param {IGetItemsParams} params - Các tham số để lọc và sắp xếp danh sách sản phẩm.
 * @returns {Promise<IItemData>} Một promise giải quyết với dữ liệu danh sách sản phẩm và thông tin phân trang.
 * @throws {Error} Ném ra lỗi nếu yêu cầu API thất bại.
 */
export const getItems = async (params: IGetItemsParams): Promise<IItemData> => {
  try {
    const response = await api.get<IItemResponse>("/items", {
      params,
    })
    return response.data.data
  } catch (error) {
    console.error("Không thể lấy danh sách sản phẩm:", error)
    throw error
  }
}
