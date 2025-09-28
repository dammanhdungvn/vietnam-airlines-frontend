/**
 * @file Unit tests for item service
 * @description This file contains unit tests for the item service, mocking API calls.
 */

import { getItems } from "@/services/item.service"
import api from "@/lib/api"
import { IItemData, IItemResponse } from "@/types/item.type"

// Mock the api module
jest.mock("@/lib/api")

const mockedApi = api as jest.Mocked<typeof api>

describe("Item Service", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("getItems", () => {
    it("should fetch items successfully from the API", async () => {
      // Arrange
      const mockData: IItemData = {
        content: [
          {
            id: 1,
            itemName: "Tàu hũ lạnh",
            price: 50000,
            description: null,
            createdAt: "2025-09-24 14:36:08",
            updatedAt: "2025-09-24 14:36:08",
          },
        ],
        page: 0,
        size: 10,
        totalElements: 1,
        totalPages: 1,
        first: true,
        last: true,
      }
      const mockResponse: { data: IItemResponse } = {
        data: {
          code: 200,
          message: "OK",
          data: mockData,
        },
      }
      mockedApi.get.mockResolvedValue(mockResponse)
      const params = { page: 0, size: 10 }

      // Act
      const result = await getItems(params)

      // Assert
      expect(mockedApi.get).toHaveBeenCalledWith("/items", { params })
      expect(result).toEqual(mockData)
    })

    it("should throw an error if the API call fails", async () => {
      // Arrange
      const errorMessage = "Network Error"
      mockedApi.get.mockRejectedValue(new Error(errorMessage))
      const params = { page: 0, size: 10 }

      // Act & Assert
      await expect(getItems(params)).rejects.toThrow(errorMessage)
      expect(mockedApi.get).toHaveBeenCalledWith("/items", { params })
    })

    it("should pass query parameters to the API call", async () => {
      // Arrange
      const mockData: IItemData = {
        content: [],
        page: 1,
        size: 5,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
      }
      const mockResponse: { data: IItemResponse } = {
        data: {
          code: 200,
          message: "OK",
          data: mockData,
        },
      }
      mockedApi.get.mockResolvedValue(mockResponse)
      const params = {
        page: 1,
        size: 5,
        sortBy: "price",
        sortDir: "desc",
        itemName: "coke",
      }

      // Act
      await getItems(params)

      // Assert
      expect(mockedApi.get).toHaveBeenCalledWith("/items", { params })
    })
  })
})
