/**
 * @file Dịch vụ quản lý ghế.
 * @description File này chứa các hàm để tương tác với API quản lý ghế,
 * bao gồm lấy danh sách tất cả các ghế.
 */

import api from '@/lib/api';
import { ISeatResponse, IPaginatedData, ISeat } from '@/types/seat.type';

/**
 * @interface GetSeatsInfoParams
 * @description Định nghĩa các tham số cho hàm lấy thông tin ghế.
 */
interface GetSeatsInfoParams {
  seatNumber?: string;
  type?: string;
  status?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

/**
 * @function getSeatsInfo
 * @description Lấy danh sách ghế có phân trang và bộ lọc từ API.
 * @param {GetSeatsInfoParams} params - Các tham số truy vấn.
 * @returns {Promise<IPaginatedData<ISeat>>} Một promise giải quyết với dữ liệu phân trang của các ghế.
 * @throws {Error} Ném ra lỗi nếu yêu cầu API thất bại.
 */
export const getSeatsInfo = async (params: GetSeatsInfoParams): Promise<IPaginatedData<ISeat>> => {
  try {
    const response = await api.get<ISeatResponse>('/seats/info', { params });
    return response.data.data;
  } catch (error) {
    console.error('Không thể lấy danh sách ghế:', error);
    throw error;
  }
};
