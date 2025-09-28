/**
 * @file Unit tests for document service
 * @description This file contains unit tests for the document service, mocking API calls.
 */

import {
  getAllDocuments,
  getDocumentById,
  createOrUpdateDocument,
  deleteDocument,
  getDownloadUrl,
} from "@/services/document.service"
import api from "@/lib/api"
import { IDocument, IDocumentApiResponse, IDocumentPayload } from "@/types/document.type"

jest.mock("@/lib/api")
const mockedApi = api as jest.Mocked<typeof api>

// Set up a mock for process.env
const oldEnv = process.env
beforeEach(() => {
  jest.resetModules()
  process.env = { ...oldEnv, NEXT_PUBLIC_API_URL: "http://mockapi.com/api/v1" }
})

afterEach(() => {
  process.env = oldEnv
  jest.clearAllMocks()
})

describe("Document Service", () => {
  const mockDocument: IDocument = {
    id: 1,
    documentName: "Test Doc",
    author: "Test Author",
    filePath: "test.pdf",
    fileUrl: "http://mockapi.com/api/v1/documents/1/download",
    createdAt: "2025-09-28T00:00:00Z",
    updatedAt: "2025-09-28T00:00:00Z",
  }

  describe("getAllDocuments", () => {
    it("should fetch all documents successfully", async () => {
      const mockResponse: { data: IDocumentApiResponse<IDocument[]> } = {
        data: { code: 200, message: "OK", data: [mockDocument] },
      }
      mockedApi.get.mockResolvedValue(mockResponse)

      const result = await getAllDocuments()

      expect(mockedApi.get).toHaveBeenCalledWith("/documents/all")
      expect(result).toEqual([mockDocument])
    })
  })

  describe("getDocumentById", () => {
    it("should fetch a single document by ID successfully", async () => {
      const mockResponse: { data: IDocumentApiResponse<IDocument> } = {
        data: { code: 200, message: "OK", data: mockDocument },
      }
      mockedApi.get.mockResolvedValue(mockResponse)

      const result = await getDocumentById(1)

      expect(mockedApi.get).toHaveBeenCalledWith("/documents/1")
      expect(result).toEqual(mockDocument)
    })
  })

  describe("createOrUpdateDocument", () => {
    it("should create a document with a file successfully", async () => {
      const payload: IDocumentPayload = { documentName: "New Doc", author: "New Author" }
      const file = new File(["content"], "new.pdf", { type: "application/pdf" })
      const mockResponse = { data: { code: 200, message: "OK", data: { ...mockDocument, id: 2 } } }
      mockedApi.post.mockResolvedValue(mockResponse)

      const result = await createOrUpdateDocument(payload, file)

      expect(mockedApi.post).toHaveBeenCalledWith(
        "/documents",
        expect.any(FormData),
        expect.objectContaining({ headers: { "Content-Type": "multipart/form-data" } }),
      )
      expect(result).toEqual({ ...mockDocument, id: 2 })
    })

    it("should update a document without a file successfully", async () => {
      const payload: IDocumentPayload = { id: 1, documentName: "Updated Doc", author: "Updated Author" }
      const mockResponse = { data: { code: 200, message: "OK", data: mockDocument } }
      mockedApi.post.mockResolvedValue(mockResponse)

      const result = await createOrUpdateDocument(payload, null)

      expect(mockedApi.post).toHaveBeenCalledWith(
        "/documents",
        expect.any(FormData),
        expect.objectContaining({ headers: { "Content-Type": "multipart/form-data" } }),
      )
      expect(result).toEqual(mockDocument)
    })
  })

  describe("deleteDocument", () => {
    it("should delete a document successfully", async () => {
      mockedApi.delete.mockResolvedValue({})
      await deleteDocument(1)
      expect(mockedApi.delete).toHaveBeenCalledWith("/documents/1")
    })
  })

  describe("getDownloadUrl", () => {
    it("should return the correct download URL", () => {
      const url = getDownloadUrl(1)
      expect(url).toBe("http://mockapi.com/api/v1/documents/1/download")
    })
  })
})
