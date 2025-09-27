/**
 * @fileoverview Service để xử lý các tác vụ liên quan đến API thống kê.
 * @version 1.0.0
 * @since 2025-09-27
 * @author Dũng Đàm
 */
import api from "@/lib/api"
import { IStatisticsResponse } from "@/types/statistics.type"

/**
 * Gửi yêu cầu lấy dữ liệu thống kê từ server.
 * @returns {Promise<IStatisticsResponse>} - Promise chứa dữ liệu thống kê từ API.
 */
export const getStatistics = async (): Promise<IStatisticsResponse> => {
  const { data } = await api.get("/statistics")
  return data
}
