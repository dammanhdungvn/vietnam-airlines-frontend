/**
 * @file Dịch vụ quản lý sản phẩm.
 * @description File này chứa các hàm để tương tác với API quản lý sản phẩm,
 * bao gồm lấy danh sách sản phẩm với các tham số truy vấn.
 */

import api from "@/lib/api"
import { IGetItemsParams, IItemData, IItemResponse, IItemPayload, IItem } from "@/types/item.type"

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

/**
 * @function createItem
 * @description Gửi yêu cầu tạo sản phẩm mới lên API.
 * @param {IItemPayload} itemData - Dữ liệu của sản phẩm mới.
 * @returns {Promise<IItem>} Một promise giải quyết với dữ liệu sản phẩm vừa được tạo.
 * @throws {Error} Ném ra lỗi nếu yêu cầu API thất bại.
 */
export const createItem = async (itemData: IItemPayload): Promise<IItem> => {
  const formData = new FormData()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { image, ...itemInfo } = itemData
  formData.append("item", JSON.stringify(itemInfo))
  if (itemData.image) {
    formData.append("file", itemData.image)
  }

  try {
    const response = await api.post("/items", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data.data
  } catch (error) {
    console.error("Không thể tạo sản phẩm:", error)
    throw error
  }
}

/**
 * @function updateItem
 * @description Gửi yêu cầu cập nhật thông tin sản phẩm lên API.
 * @param {IItemPayload} itemData - Dữ liệu cần cập nhật của sản phẩm. ID của sản phẩm là bắt buộc.
 * @returns {Promise<IItem>} Một promise giải quyết với dữ liệu sản phẩm vừa được cập nhật.
 * @throws {Error} Ném ra lỗi nếu yêu cầu API thất bại.
 */
export const updateItem = async (itemData: IItemPayload): Promise<IItem> => {
  const formData = new FormData()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { image, ...itemInfo } = itemData
  formData.append("item", JSON.stringify(itemInfo))
  if (itemData.image) {
    formData.append("file", itemData.image)
  }

  try {
    // API chỉnh sửa dùng POST theo yêu cầu
    const response = await api.post(`/items`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data.data
  } catch (error) {
    console.error(`Không thể cập nhật sản phẩm có ID ${itemData.id}:`, error)
    throw error
  }
}

/**
 * @function deleteItem
 * @description Gửi yêu cầu xóa một sản phẩm khỏi hệ thống.
 * @param {number} id - ID của sản phẩm cần xóa.
 * @returns {Promise<void>} Một promise giải quyết khi sản phẩm được xóa thành công.
 * @throws {Error} Ném ra lỗi nếu yêu cầu API thất bại.
 */
export const deleteItem = async (id: number): Promise<void> => {
  try {
    await api.delete(`/items/${id}`)
  } catch (error) {
    console.error(`Không thể xóa sản phẩm có ID ${id}:`, error)
    throw error
  }
}
