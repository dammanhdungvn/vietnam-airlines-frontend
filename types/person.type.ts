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

// Định nghĩa cấu trúc cho một sản phẩm (Item) mà khách hàng đã mua
export interface Item {
  id: number;
  itemName: string;
  price: number;
  description: string | null;
  quantity: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
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
  isVip: "SUPER_VIP" | "VIP" | "NORMAL"; // Cấp độ VIP
  gender: "MALE" | "FEMALE" | "OTHER";
  createdAt: string;
  updatedAt: string;
  seatInfo: SeatInfo | null;
  items: Item[]; // Sử dụng kiểu Item đã định nghĩa
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

/**
 * @interface FaceValidationResponseData
 * @description Cấu trúc dữ liệu trả về khi xác thực khuôn mặt thành công.
 */
export interface FaceValidationResponseData {
  personId: string;
  message: string;
  isValid: boolean;
  isUploaded: boolean;
  imageUrl: string; // base64
}

/**
 * @interface RegistrationItem
 * @description Cấu trúc của một sản phẩm trong payload đăng ký.
 */
export interface RegistrationItem {
  itemId: number;
  quantity: number;
  paidAmount: number;
}

/**
 * @interface RegistrationPayload
 * @description Cấu trúc payload để gửi đi khi đăng ký hoặc cập nhật khách hàng.
 *              API sẽ sử dụng email để xác định và cập nhật khách hàng.
 */
export interface RegistrationPayload {
  email: string;
  fullName: string;
  position: string;
  phone: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  status: boolean;
  seatInfo: {
    seatNumber: string;
    paidPrice: number;
  } | null;
  items: RegistrationItem[];
}

/**
 * @interface AddPersonPayload
 * @description Cấu trúc payload để gửi đi khi thêm mới một khách hàng.
 * @note API mới: không cần personId và seatId; isVip: SUPER_VIP|VIP|NORMAL; status: "TRUE"|"FALSE".
 */
export interface AddPersonPayload {
  email: string;
  fullName: string;
  phone: string;
  position: string; // Chức vụ (nhân viên, v.v.)
  avatarUrl: string;
  status: "TRUE" | "FALSE";
  isVip: "SUPER_VIP" | "VIP" | "NORMAL";
  gender: "MALE" | "FEMALE" | "OTHER";
}
