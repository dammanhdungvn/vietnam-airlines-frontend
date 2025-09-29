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


/**
 * @function validateAndUploadFace
 * @description Gửi ảnh khuôn mặt để xác thực và tải lên.
 * @param {string} personId - ID của khách hàng.
 * @param {File} faceImage - File ảnh khuôn mặt.
 * @returns {Promise<StreamApiResponse<FaceValidationResponseData>>} Phản hồi từ API xác thực.
 */
export const validateAndUploadFace = async (
  personId: string,
  faceImage: File
): Promise<StreamApiResponse<FaceValidationResponseData>> => {
  const formData = new FormData();
  formData.append("faceImage", faceImage);

  try {
    const response = await api.post<StreamApiResponse<FaceValidationResponseData>>(
      `/core/persons/valid-upload-face`,
      formData,
      {
        params: {
          personId,
          acsDevIndexCode: 90,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi xác thực khuôn mặt:", error);
    throw error;
  }
};


/**
 * @function registerPerson
 * @description Gửi thông tin đăng ký hoàn chỉnh cho một khách hàng.
 * @param {RegistrationPayload} payload - Dữ liệu đăng ký.
 * @returns {Promise<any>} Phản hồi từ API đăng ký.
 */
export const registerPerson = async (payload: RegistrationPayload): Promise<any> => {
  try {
    const response = await api.post("/core/persons/registration", payload);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
    throw error;
  }
};
