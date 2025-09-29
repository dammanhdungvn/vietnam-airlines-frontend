/**
 * @file Dịch vụ quản lý khách hàng (Person).
 * @description Chứa các hàm để tương tác với API quản lý khách hàng.
 * @author Dammand DUNG
 * @version 1.0
 * @since 28/09/2025
 */

import api from "@/lib/api";
import {
  PaginatedApiResponse,
  Person,
  RegistrationPayload,
  AddPersonPayload,
  FaceValidationResponseData,
} from "@/types/person.type";
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
 * @function getPersonByEmail
 * @description Lấy thông tin chi tiết của một khách hàng bằng Email.
 * @param {string} email - Email của khách hàng.
 * @returns {Promise<Person>} Một promise giải quyết với dữ liệu chi tiết của khách hàng.
 */
export const getPersonByEmail = async (email: string): Promise<Person> => {
  try {
    const response = await api.get<StreamApiResponse<Person>>(
      `/core/persons/registration/${email}`,
    );
    return response.data.data;
  } catch (error) {
    console.error(`Không thể lấy thông tin khách hàng với Email ${email}:`, error);
    throw error;
  }
};

/**
 * @function deletePerson
 * @description Xóa một khách hàng bằng ID.
 * @param {string} id - ID của khách hàng cần xóa.
 * @returns {Promise<void>} Một promise giải quyết khi khách hàng được xóa thành công.
 */
export const deletePerson = async (id: string): Promise<void> => {
  try {
    await api.delete(`/core/persons/${id}`);
  } catch (error) {
    console.error(`Lỗi khi xóa khách hàng với ID ${id}:`, error);
    throw error;
  }
};

/**
 * @function importPersons
 * @description Nhập danh sách khách hàng từ file Excel.
 * @param {File} file - File Excel chứa danh sách khách hàng.
 * @returns {Promise<any>} Phản hồi từ API.
 */
export const importPersons = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await api.post("/core/persons/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi nhập danh sách khách hàng:", error);
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

type RegisterOptions = { stripEmpty?: boolean; tolerant?: boolean }

export const registerOrUpdatePerson = async (
  payload: RegistrationPayload,
  options: RegisterOptions = {},
): Promise<any> => {
  try {
    // Tuỳ chọn strip/normalize cho runtime (mặc định giữ nguyên để tests cũ pass)
    const body: any = { ...payload }
    if (options.stripEmpty) {
      if (!payload.seatInfo) delete body.seatInfo
      if (!payload.items || payload.items.length === 0) delete body.items
      if (body.gender) body.gender = String(body.gender).toUpperCase()
      body.status = Boolean(payload.status)
    }

    const response = await api.post("/core/persons/registration", body)
    return response.data
  } catch (error: any) {
    if (options.tolerant) {
      const fallback = { code: 400, message: "Bad Request", data: null }
      if (error?.response?.data) {
        const data = error.response.data
        return typeof data === "object" && data !== null ? data : fallback
      }
      return fallback
    }
    throw error
  }
}

/**
 * @function addPerson
 * @description Thêm một khách hàng mới.
 * @param {AddPersonPayload} payload - Dữ liệu của khách hàng mới.
 * @returns {Promise<any>} Phản hồi từ API.
 */
export const addPerson = async (payload: AddPersonPayload): Promise<any> => {
  try {
    const response = await api.post("/core/persons", payload);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm khách hàng:", error);
    throw error;
  }
};
