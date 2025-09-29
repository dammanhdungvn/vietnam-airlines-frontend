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

/**
 * @function getAllSeats
 * @description Lấy toàn bộ danh sách ghế (không phân trang) phục vụ UI và unit tests.
 * @returns {Promise<ISeat[]>}
 */
export const getAllSeats = async (): Promise<ISeat[]> => {
  const data = await getSeatsInfo({ page: 0, size: 10000, sortBy: 'id', sortDir: 'asc' })
  return data.content
}

/**
 * @interface UpdateSeatPayload
 * @description Định nghĩa payload cho việc cập nhật thông tin ghế.
 */
export interface UpdateSeatPayload {
  id: number;
  seatNumber: string;
  type: string;
  basePrice: number;
  paidPrice: number;
}

/**
 * @function updateSeat
 * @description Cập nhật thông tin một ghế thông qua API.
 * @param {UpdateSeatPayload} payload - Dữ liệu ghế cần cập nhật.
 * @returns {Promise<void>}
 * @throws {Error} Ném ra lỗi nếu yêu cầu API thất bại.
 */
export const updateSeat = async (payload: UpdateSeatPayload): Promise<void> => {
  try {
    await api.post('/seats', payload);
  } catch (error) {
    console.error('Không thể cập nhật thông tin ghế:', error);
    throw error;
  }
};


/**
 * @function deleteSeat
 * @description Xóa một ghế thông qua API.
 * @param {number} id - ID của ghế cần xóa.
 * @returns {Promise<void>}
 * @throws {Error} Ném ra lỗi nếu yêu cầu API thất bại.
 */
export const deleteSeat = async (id: number): Promise<void> => {
  try {
    await api.delete(`/seats/${id}`);
  } catch (error) {
    console.error('Không thể xóa ghế:', error);
    throw error;
  }
};
