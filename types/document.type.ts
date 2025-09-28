/**
 * @file Kiểu dữ liệu cho tài liệu (document).
 * @description Định nghĩa các interface cho đối tượng tài liệu và các yêu cầu, phản hồi từ API.
 */

/**
 * @interface IDocument
 * @description Đại diện cho một đối tượng tài liệu trong hệ thống.
 */
export interface IDocument {
  id: number
  documentName: string
  author: string
  filePath: string
  fileUrl: string // URL có thể có chữ ký và thời gian hết hạn
  createdAt: string
  updatedAt: string
}

/**
 * @interface IDocumentApiResponse
 * @description Cấu trúc phản hồi chung từ API cho các thao tác với tài liệu.
 */
export interface IDocumentApiResponse<T> {
  code: number
  message: string
  data: T
}

/**
 * @interface IDocumentPayload
 * @description Dữ liệu JSON cần gửi đi khi tạo hoặc cập nhật một tài liệu.
 * Dữ liệu này sẽ được gửi dưới dạng chuỗi JSON trong một trường của FormData.
 */
export interface IDocumentPayload {
  id?: number // Bắt buộc khi cập nhật, có thể bỏ qua khi tạo mới
  documentName: string
  author: string
}
