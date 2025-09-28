/**
 * @file Dịch vụ quản lý link stream trực tuyến.
 * @description Chứa các hàm để tương tác với API quản lý stream.
 * @author Dammand DUNG
 * @version 1.0
 * @since 27/09/2025
 */

import api from "@/lib/api";
import { Stream, StreamApiResponse } from "@/types/stream.type";

/**
 * @function getStreams
 * @description Lấy danh sách tất cả các stream từ API.
 * @returns {Promise<Stream[]>} Một promise giải quyết với một mảng các đối tượng stream.
 */
export const getStreams = async (): Promise<Stream[]> => {
  try {
    const response = await api.get<StreamApiResponse<Stream[]>>("/streams");
    return response.data.data || [];
  } catch (error) {
    console.error("Không thể lấy danh sách stream:", error);
    throw error;
  }
};

/**
 * @function createOrUpdateStream
 * @description Tạo mới hoặc cập nhật một stream.
 * @param {Omit<Stream, 'id'> | Stream} streamData - Dữ liệu của stream.
 * @returns {Promise<Stream>} Một promise giải quyết với đối tượng stream đã được tạo/cập nhật.
 */
export const createOrUpdateStream = async (streamData: Omit<Stream, "id"> | Stream): Promise<Stream> => {
  try {
    const response = await api.post<StreamApiResponse<Stream>>("/streams", streamData);
    return response.data.data;
  } catch (error) {
    console.error("Không thể tạo hoặc cập nhật stream:", error);
    throw error;
  }
};

/**
 * @function getStreamById
 * @description Lấy thông tin chi tiết của một stream theo ID.
 * @param {number} id - ID của stream cần lấy.
 * @returns {Promise<Stream>} Một promise giải quyết với đối tượng stream.
 */
export const getStreamById = async (id: number): Promise<Stream> => {
  try {
    const response = await api.get<StreamApiResponse<Stream>>(`/streams/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Không thể lấy chi tiết stream có ID ${id}:`, error);
    throw error;
  }
};

/**
 * @function deleteStream
 * @description Xóa một stream khỏi hệ thống.
 * @param {number} id - ID của stream cần xóa.
 * @returns {Promise<void>}
 */
export const deleteStream = async (id: number): Promise<void> => {
  try {
    await api.delete(`/streams/${id}`);
  } catch (error) {
    console.error(`Không thể xóa stream có ID ${id}:`, error);
    throw error;
  }
};

