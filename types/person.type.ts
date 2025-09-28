/**
 * @file Định nghĩa kiểu dữ liệu cho Person (Khách hàng).
 * @author Dammand DUNG
 * @version 1.0
 * @since 28/09/2025
 */

// Định nghĩa cấu trúc cho thông tin ghế ngồi của khách hàng
export interface SeatInfo {
  seatNumber: string;
  paidPrice: number;
}

// Định nghĩa cấu trúc dữ liệu cho một khách hàng (Person)
export interface Person {
  personId: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  avatarUrl: string; // Base64 encoded string
  status: boolean;
  isVip: boolean;
  gender: "MALE" | "FEMALE" | "OTHER";
  createdAt: string;
  updatedAt: string;
  seatInfo: SeatInfo | null;
  items: any[]; // Cần định nghĩa rõ hơn nếu có thông tin về items
}

/**
 * @interface PaginatedApiResponse
 * @description Định nghĩa cấu trúc response phân trang chuẩn từ API.
 * @template T - Kiểu dữ liệu của các phần tử trong 'content'.
 */
export interface PaginatedApiResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
