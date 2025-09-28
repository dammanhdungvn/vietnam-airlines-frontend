/**
 * @file Định nghĩa kiểu dữ liệu cho Stream.
 * @author Dammand DUNG
 * @version 1.0
 * @since 27/09/2025
 */

// Định nghĩa cấu trúc dữ liệu cho một Stream
export interface Stream {
  id: number;
  streamName: string;
  streamUrl: string;
}

/**
 * @interface StreamApiResponse
 * @description Định nghĩa cấu trúc response chuẩn từ API cho Stream.
 * @template T - Kiểu dữ liệu của payload trong 'data'.
 */
export interface StreamApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

