/**
 * @file Dịch vụ quản lý ghế.
 * @description File này chứa các hàm để tương tác với API quản lý ghế,
 * bao gồm lấy danh sách tất cả các ghế.
 */

import api from '@/lib/api';
import { ISeat, ISeatResponse } from '@/types/seat.type';

/**
 * @function getAllSeats
 * @description Lấy danh sách tất cả các ghế từ API.
 * @returns {Promise<ISeat[]>} Một promise giải quyết với một mảng các đối tượng ghế.
 * @throws {Error} Ném ra lỗi nếu yêu cầu API thất bại.
 */
export const getAllSeats = async (): Promise<ISeat[]> => {
  try {
    const response = await api.get<ISeatResponse>('/seats');
    return response.data.data;
  } catch (error) {
    console.error('Không thể lấy danh sách ghế:', error);
    throw error;
  }
};
