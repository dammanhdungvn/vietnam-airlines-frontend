/**
 * @file Unit tests for item service
 * @description This file contains unit tests for the item service, mocking API calls.
 */

import { getItems, createItem, updateItem, deleteItem } from "@/services/item.service"
import api from "@/lib/api"
import { IItemData, IItemResponse, IItemPayload, IItem } from "@/types/item.type"

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

  describe("createItem", () => {
    it("should create an item successfully via the API", async () => {
      // Arrange
      const newItemPayload: IItemPayload = {
        itemName: "New Item",
        price: 100000,
        description: "A new item for testing",
      }
      const mockCreatedItem: IItem = {
        id: 100,
        ...newItemPayload,
        createdAt: "2025-09-28 10:00:00",
        updatedAt: "2025-09-28 10:00:00",
      }
      mockedApi.post.mockResolvedValue({ data: { data: mockCreatedItem } })

      // Act
      const result = await createItem(newItemPayload)

      // Assert
      expect(mockedApi.post).toHaveBeenCalled()
      const [url, body, config] = mockedApi.post.mock.calls[0]
      expect(url).toBe("/items")
      expect(body).toBeInstanceOf(FormData)
      expect(config).toEqual({ headers: { "Content-Type": "multipart/form-data" } })
      expect(result).toEqual(mockCreatedItem)
    })

    it("should throw an error if the create API call fails", async () => {
      // Arrange
      const newItemPayload: IItemPayload = {
        itemName: "New Item",
        price: 100000,
        description: "A new item for testing",
      }
      const errorMessage = "Creation Failed"
      mockedApi.post.mockRejectedValue(new Error(errorMessage))

      // Act & Assert
      await expect(createItem(newItemPayload)).rejects.toThrow(errorMessage)
      expect(mockedApi.post).toHaveBeenCalled()
    })
  })

  describe("updateItem", () => {
    it("should update an item successfully via the API", async () => {
      // Arrange
      const updatePayload: IItemPayload = {
        id: 1,
        itemName: "Updated Item",
        price: 150000,
        description: "An updated item description",
      }
      const mockUpdatedItem: IItem = {
        ...updatePayload,
        id: 1,
        createdAt: "2025-09-24 14:36:08",
        updatedAt: "2025-09-28 11:00:00",
      }
      mockedApi.post.mockResolvedValue({ data: { data: mockUpdatedItem } })

      // Act
      const result = await updateItem(updatePayload)

      // Assert
      expect(mockedApi.post).toHaveBeenCalled()
      const [url, body, config] = mockedApi.post.mock.calls[0]
      expect(url).toBe("/items")
      expect(body).toBeInstanceOf(FormData)
      expect(config).toEqual({ headers: { "Content-Type": "multipart/form-data" } })
      expect(result).toEqual(mockUpdatedItem)
    })

    it("should throw an error if the update API call fails", async () => {
      // Arrange
      const updatePayload: IItemPayload = { id: 1, itemName: "Updated Item", price: 150000, description: "" }
      const errorMessage = "Update Failed"
      mockedApi.post.mockRejectedValue(new Error(errorMessage))

      // Act & Assert
      await expect(updateItem(updatePayload)).rejects.toThrow(errorMessage)
      expect(mockedApi.post).toHaveBeenCalled()
    })
  })

  describe("deleteItem", () => {
    it("should send a delete request successfully", async () => {
      // Arrange
      const itemId = 123
      mockedApi.delete.mockResolvedValue({})

      // Act
      await deleteItem(itemId)

      // Assert
      expect(mockedApi.delete).toHaveBeenCalledWith(`/items/${itemId}`)
    })

    it("should throw an error if the delete API call fails", async () => {
      // Arrange
      const itemId = 123
      const errorMessage = "Deletion Failed"
      mockedApi.delete.mockRejectedValue(new Error(errorMessage))

      // Act & Assert
      await expect(deleteItem(itemId)).rejects.toThrow(errorMessage)
      expect(mockedApi.delete).toHaveBeenCalledWith(`/items/${itemId}`)
    })
  })
})
