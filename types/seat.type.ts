/**
 * @file Định nghĩa các kiểu dữ liệu cho chức năng quản lý ghế.
 * @description File này chứa các định nghĩa TypeScript cho các đối tượng liên quan đến ghế,
 * bao gồm trạng thái, loại ghế và thông tin chi tiết của ghế.
 */

/**
 * @enum {string}
 * @description Đại diện cho các trạng thái có thể có của một ghế.
 * - `AVAILABLE`: Ghế đang trống và có thể đặt.
 * - `TAKEN`: Ghế đã có người ngồi.
 */
export enum SeatStatus {
  AVAILABLE = 'AVAILABLE',
  TAKEN = 'TAKEN',
}

/**
 * @enum {string}
 * @description Đại diện cho các loại ghế khác nhau trên máy bay.
 * - `VIP`: Ghế hạng thương gia.
 * - `NORMAL`: Ghế hạng phổ thông.
 * - `BLOCK`: Ghế bị khóa (không thể chọn).
 * - `FREE`: Ghế miễn phí.
 */
export enum SeatType {
  VIP = 'VIP',
  NORMAL = 'NORMAL',
  BLOCK = 'BLOCK',
  FREE = 'FREE',
}

/**
 * @interface ISeat
 * @description Định nghĩa cấu trúc của một đối tượng ghế.
 */
export interface ISeat {
  /**
   * @property {number} id - ID duy nhất của ghế.
   */
  id: number;

  /**
   * @property {string} seatNumber - Số hiệu của ghế (ví dụ: 'A1', 'B12').
   */
  seatNumber: string;

  /**
   * @property {SeatType} type - Loại ghế.
   */
  type: SeatType;

  /**
   * @property {number | null} basePrice - Giá gốc của ghế. Có thể là `null` nếu không áp dụng.
   */
  basePrice: number | null;

  /**
   * @property {SeatStatus} status - Trạng thái hiện tại của ghế.
   */
  status: SeatStatus;
}

/**
 * @interface ISeatResponse
 * @description Định nghĩa cấu trúc response từ API ghế.
 */
export interface ISeatResponse {
  /**
   * @property {number} code - Mã trạng thái HTTP.
   */
  code: number;

  /**
   * @property {string} message - Thông báo từ server.
   */
  message: string;

  /**
   * @property {ISeat[]} data - Mảng danh sách ghế.
   */
  data: ISeat[];
}
