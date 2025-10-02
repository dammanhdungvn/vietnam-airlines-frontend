/**
 * @fileoverview Unit tests cho person service
 * @description File này chứa các unit tests cho person service, mock các API calls để test logic.
 * Kiểm tra các chức năng: lấy danh sách, thêm, sửa, xóa khách mời, và xác thực khuôn mặt.
 * @version 2.0.0
 * @since 2025-10-03
 * @author Dũng Đàm
 */

import {
  getPersonsPaginated,
  getPersonByEmail,
  deletePerson,
  importPersons,
  registerOrUpdatePerson,
  addPerson,
  validateAndUploadFace,
} from "@/services/person.service";
import api from "@/lib/api";
import { Person, RegistrationPayload, AddPersonPayload, FaceValidationResponseData } from "@/types/person.type";
import { StreamApiResponse } from "@/types/stream.type";
import { PaginatedApiResponse } from "@/types/person.type";

// Mock module api
jest.mock("@/lib/api");
const mockedApi = api as jest.Mocked<typeof api>;

describe("Person Service", () => {
  /**
   * Dọn dẹp tất cả mocks sau mỗi test
   */
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockPerson: Person = {
    personId: "111",
    fullName: "Dũng tô",
    email: "dungtoooo@gmail.com",
    phone: "0912345678",
    position: "Nhan vien",
    avatarUrl: "base64string",
    status: true,
    isVip: "VIP",
    gender: "MALE",
    createdAt: "2025-09-24 14:37:12",
    updatedAt: "2025-09-27 03:13:17",
    seatInfo: {
      seatNumber: "A1",
      paidPrice: 100000,
    },
    items: [],
  };

  const mockPaginatedResponse: PaginatedApiResponse<Person> = {
    content: [mockPerson],
    page: 0,
    size: 1,
    totalElements: 1,
    totalPages: 1,
    first: true,
    last: true,
  };

  describe("getPersonsPaginated", () => {
    /**
     * @test Lấy danh sách phân trang với params mặc định
     */
    it("should fetch paginated persons successfully with default params", async () => {
      const mockApiResponse: { data: StreamApiResponse<PaginatedApiResponse<Person>> } = {
        data: {
          code: 200,
          message: "OK",
          data: mockPaginatedResponse,
        },
      };
      mockedApi.get.mockResolvedValue(mockApiResponse);

      const result = await getPersonsPaginated();

      expect(mockedApi.get).toHaveBeenCalledWith("/core/persons/paginated", {
        params: {
          page: 0,
          size: 10,
          sortBy: "personId",
          sortDir: "asc",
        },
      });
      expect(result).toEqual(mockPaginatedResponse);
    });

    /**
     * @test Lấy danh sách phân trang với params tùy chỉnh
     */
    it("should fetch paginated persons successfully with custom params", async () => {
      const mockApiResponse: { data: StreamApiResponse<PaginatedApiResponse<Person>> } = {
        data: {
          code: 200,
          message: "OK",
          data: { ...mockPaginatedResponse, page: 1, size: 5 },
        },
      };
      mockedApi.get.mockResolvedValue(mockApiResponse);

      const params = { page: 1, size: 5, sortBy: "fullName", sortDir: "desc" as const };
      const result = await getPersonsPaginated(params);

      expect(mockedApi.get).toHaveBeenCalledWith("/core/persons/paginated", {
        params,
      });
      expect(result).toEqual({ ...mockPaginatedResponse, page: 1, size: 5 });
    });

    /**
     * @test Xử lý lỗi khi lấy danh sách thất bại
     */
    it("should throw an error if fetching fails", async () => {
      mockedApi.get.mockRejectedValue(new Error("API Error"));
      await expect(getPersonsPaginated()).rejects.toThrow("API Error");
    });
  });

  describe("getPersonByEmail", () => {
    it("should fetch a single person successfully", async () => {
      const mockApiResponse: { data: StreamApiResponse<Person> } = {
        data: {
          code: 200,
          message: "OK",
          data: mockPerson,
        },
      };
      mockedApi.get.mockResolvedValue(mockApiResponse);

      const result = await getPersonByEmail("dungtoooo@gmail.com");

      expect(mockedApi.get).toHaveBeenCalledWith("/core/persons/registration/dungtoooo@gmail.com");
      expect(result).toEqual(mockPerson);
    });

    it("should throw an error if fetching a single person fails", async () => {
      mockedApi.get.mockRejectedValue(new Error("API Error"));
      await expect(getPersonByEmail("dungtoooo@gmail.com")).rejects.toThrow("API Error");
    });
  });

  describe("deletePerson", () => {
    it("should delete a person successfully", async () => {
      mockedApi.delete.mockResolvedValue({});

      await deletePerson("111");

      expect(mockedApi.delete).toHaveBeenCalledWith("/core/persons/111");
    });

    it("should throw an error if deleting a person fails", async () => {
      mockedApi.delete.mockRejectedValue(new Error("API Error"));
      await expect(deletePerson("111")).rejects.toThrow("API Error");
    });
  });

  describe("importPersons", () => {
    it("should import persons from an excel file successfully", async () => {
      const mockFile = new File(["excel data"], "persons.xlsx", { type: "application/vnd.ms-excel" });
      const mockResponse = { data: { message: "Import successful" } };
      mockedApi.post.mockResolvedValue(mockResponse);

      const result = await importPersons(mockFile);

      const formData = new FormData();
      formData.append("file", mockFile);

      expect(mockedApi.post).toHaveBeenCalledWith("/core/persons/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw an error if importing persons fails", async () => {
      const mockFile = new File(["excel data"], "persons.xlsx", { type: "application/vnd.ms-excel" });
      mockedApi.post.mockRejectedValue(new Error("API Error"));

      await expect(importPersons(mockFile)).rejects.toThrow("API Error");
    });
  });

  describe("registerOrUpdatePerson", () => {
    it("should register or update a person successfully", async () => {
      const payload: RegistrationPayload = {
        fullName: "New Person",
        email: "new@example.com",
        phone: "1234567890",
        position: "Developer",
        gender: "MALE",
        status: true,
        seatInfo: null,
        items: [],
      };
      const mockResponse = { data: { ...payload, personId: "123" } };
      mockedApi.post.mockResolvedValue(mockResponse);

      const result = await registerOrUpdatePerson(payload);

      expect(mockedApi.post).toHaveBeenCalledWith("/core/persons/registration", payload);
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw an error if registering/updating a person fails", async () => {
      const payload: RegistrationPayload = {
        fullName: "New Person",
        email: "new@example.com",
        phone: "1234567890",
        position: "Developer",
        gender: "MALE",
        status: true,
        seatInfo: null,
        items: [],
      };
      mockedApi.post.mockRejectedValue(new Error("API Error"));

      await expect(registerOrUpdatePerson(payload)).rejects.toThrow("API Error");
    });
  });

  describe("addPerson", () => {
    it("should add a new person successfully", async () => {
      const payload: AddPersonPayload = {
        email: "new@example.com",
        fullName: "New Person",
        phone: "1234567890",
        position: "Developer",
        avatarUrl: "base64string",
        status: "TRUE",
        isVip: "NORMAL",
        gender: "MALE",
      };
      const mockResponse = { data: { ...payload, personId: "123" } };
      mockedApi.post.mockResolvedValue(mockResponse);

      const result = await addPerson(payload);

      expect(mockedApi.post).toHaveBeenCalledWith("/core/persons", payload);
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw an error if adding a person fails", async () => {
      const payload: AddPersonPayload = {
        email: "new@example.com",
        fullName: "New Person",
        phone: "1234567890",
        position: "Developer",
        avatarUrl: "base64string",
        status: "TRUE",
        isVip: "NORMAL",
        gender: "MALE",
      };
      mockedApi.post.mockRejectedValue(new Error("API Error"));

      await expect(addPerson(payload)).rejects.toThrow("API Error");
    });
  });

  describe("validateAndUploadFace", () => {
    it("should validate and upload face successfully", async () => {
      const mockFile = new File(["image data"], "face.jpg", { type: "image/jpeg" });
      const mockResponse: { data: StreamApiResponse<FaceValidationResponseData> } = {
        data: {
          code: 200,
          message: "OK",
          data: {
            personId: "111",
            message: "Face validated successfully",
            isValid: true,
            isUploaded: true,
            imageUrl: "base64string",
          },
        },
      };
      mockedApi.post.mockResolvedValue(mockResponse);

      const result = await validateAndUploadFace("111", mockFile);

      const formData = new FormData();
      formData.append("faceImage", mockFile);

      expect(mockedApi.post).toHaveBeenCalledWith("/core/persons/valid-upload-face", formData, {
        params: {
          personId: "111",
          acsDevIndexCode: 90,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw an error if face validation fails", async () => {
      const mockFile = new File(["image data"], "face.jpg", { type: "image/jpeg" });
      mockedApi.post.mockRejectedValue(new Error("API Error"));

      await expect(validateAndUploadFace("111", mockFile)).rejects.toThrow("API Error");
    });
  });
});
