/**
 * @file Dịch vụ quản lý tài liệu.
 * @description Chứa các hàm để tương tác với API quản lý tài liệu.
 */

import api from "@/lib/api"
import { IDocument, IDocumentApiResponse, IDocumentPayload } from "@/types/document.type"

/**
 * @function getAllDocuments
 * @description Lấy danh sách tất cả các tài liệu từ API.
 * @returns {Promise<IDocument[]>} Một promise giải quyết với một mảng các đối tượng tài liệu.
 */
export const getAllDocuments = async (): Promise<IDocument[]> => {
  try {
    const response = await api.get<IDocumentApiResponse<IDocument[]>>("/documents/all")
    return response.data.data
  } catch (error) {
    console.error("Không thể lấy danh sách tài liệu:", error)
    throw error
  }
}

/**
 * @function getDocumentById
 * @description Lấy thông tin chi tiết của một tài liệu theo ID.
 * @param {number} id - ID của tài liệu cần lấy.
 * @returns {Promise<IDocument>} Một promise giải quyết với đối tượng tài liệu.
 */
export const getDocumentById = async (id: number): Promise<IDocument> => {
  try {
    const response = await api.get<IDocumentApiResponse<IDocument>>(`/documents/${id}`)
    return response.data.data
  } catch (error) {
    console.error(`Không thể lấy chi tiết tài liệu có ID ${id}:`, error)
    throw error
  }
}

/**
 * @function createOrUpdateDocument
 * @description Tạo mới hoặc cập nhật một tài liệu. API yêu cầu gửi dưới dạng multipart/form-data.
 * @param {IDocumentPayload} documentData - Dữ liệu JSON của tài liệu.
 * @param {File | null} file - File tài liệu cần tải lên. Bắt buộc khi tạo mới.
 * @returns {Promise<IDocument>} Một promise giải quyết với đối tượng tài liệu đã được tạo/cập nhật.
 */
export const createOrUpdateDocument = async (documentData: IDocumentPayload, file: File | null): Promise<IDocument> => {
  const formData = new FormData()
  // formData.append("document", JSON.stringify(documentData))
  formData.append("documentName", documentData.documentName)
  formData.append("author", documentData.author)
  if (documentData.id) {
    formData.append("id", String(documentData.id))
  }
  if (file) {
    formData.append("file", file)
  }

  try {
    const response = await api.post<IDocumentApiResponse<IDocument>>("/documents", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data.data
  } catch (error) {
    console.error("Không thể tạo hoặc cập nhật tài liệu:", error)
    throw error
  }
}

/**
 * @function deleteDocument
 * @description Xóa một tài liệu khỏi hệ thống.
 * @param {number} id - ID của tài liệu cần xóa.
 * @returns {Promise<void>}
 */
export const deleteDocument = async (id: number): Promise<void> => {
  try {
    await api.delete(`/documents/${id}`)
  } catch (error) {
    console.error(`Không thể xóa tài liệu có ID ${id}:`, error)
    throw error
  }
}

/**
 * @function getDownloadUrl
 * @description Lấy URL để tải xuống một tài liệu.
 * @param {number} id - ID của tài liệu.
 * @returns {string} URL đầy đủ để tải xuống file.
 */
export const getDownloadUrl = (id: number): string => {
  return `${process.env.NEXT_PUBLIC_API_URL}/documents/${id}/download`
}
