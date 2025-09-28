/**
 * @file Dịch vụ quản lý khách hàng (Person).
 * @description Chứa các hàm để tương tác với API quản lý khách hàng.
 * @author Dammand DUNG
 * @version 1.0
 * @since 28/09/2025
 */

import api from "@/lib/api";
import { PaginatedApiResponse, Person } from "@/types/person.type";
import { StreamApiResponse } from "@/types/stream.type";

/**
 * @interface GetPersonsParams
 * @description Định nghĩa các tham số cho việc lấy danh sách khách hàng có phân trang.
 */
export interface GetPersonsParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

/**
 * @function getPersonsPaginated
 * @description Lấy danh sách khách hàng có phân trang từ API.
 * @param {GetPersonsParams} params - Các tham số phân trang và sắp xếp.
 * @returns {Promise<PaginatedApiResponse<Person>>} Một promise giải quyết với dữ liệu khách hàng đã được phân trang.
 */
export const getPersonsPaginated = async (
  params: GetPersonsParams = {},
): Promise<PaginatedApiResponse<Person>> => {
  // Gán giá trị mặc định
  const { page = 0, size = 10, sortBy = "personId", sortDir = "asc" } = params;

  try {
    const response = await api.get<StreamApiResponse<PaginatedApiResponse<Person>>>(
      "/core/persons/paginated",
      {
        params: {
          page,
          size,
          sortBy,
          sortDir,
        },
      },
    );
    return response.data.data;
  } catch (error) {
    console.error("Không thể lấy danh sách khách hàng:", error);
    throw error;
  }
};
