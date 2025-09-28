/**
 * @file Unit tests for person service
 * @description This file contains unit tests for the person service, mocking API calls.
 * @author Dammand DUNG
 * @version 1.0
 * @since 28/09/2025
 */

import { getPersonsPaginated } from "@/services/person.service";
import api from "@/lib/api";
import { PaginatedApiResponse, Person } from "@/types/person.type";
import { StreamApiResponse } from "@/types/stream.type";

// Mock the api module
jest.mock("@/lib/api");
const mockedApi = api as jest.Mocked<typeof api>;

describe("Person Service", () => {
  // Clear all mocks after each test
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
    isVip: false,
    gender: "MALE",
    createdAt: "2025-09-24 14:37:12",
    updatedAt: "2025-09-27 03:13:27",
    seatInfo: null,
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

    it("should throw an error if fetching fails", async () => {
      mockedApi.get.mockRejectedValue(new Error("API Error"));
      await expect(getPersonsPaginated()).rejects.toThrow("API Error");
    });
  });
});
