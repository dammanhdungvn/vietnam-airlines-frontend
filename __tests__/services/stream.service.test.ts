/**
 * @file Unit tests for stream service
 * @description This file contains unit tests for the stream service, mocking API calls.
 * @author Dammand DUNG
 * @version 1.0
 * @since 27/09/2025
 */

import {
  getStreams,
  createOrUpdateStream,
  getStreamById,
  deleteStream,
} from "@/services/stream.service";
import api from "@/lib/api";
import { Stream } from "@/types/stream.type";

// Mock the api module
jest.mock("@/lib/api");
const mockedApi = api as jest.Mocked<typeof api>;

describe("Stream Service", () => {
  // Clear all mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockStream: Stream = {
    id: 1,
    streamName: "Đen Vâu",
    streamUrl: "https://www.youtube.com/watch?v=UVbv-PJXm14",
  };

  describe("getStreams", () => {
    it("should fetch all streams successfully", async () => {
      const mockStreams: Stream[] = [mockStream];
      mockedApi.get.mockResolvedValue({ data: mockStreams });

      const result = await getStreams();

      expect(mockedApi.get).toHaveBeenCalledWith("/streams");
      expect(result).toEqual(mockStreams);
    });

    it("should throw an error if fetching fails", async () => {
      mockedApi.get.mockRejectedValue(new Error("API Error"));
      await expect(getStreams()).rejects.toThrow("API Error");
    });
  });

  describe("getStreamById", () => {
    it("should fetch a single stream by ID successfully", async () => {
      mockedApi.get.mockResolvedValue({ data: mockStream });

      const result = await getStreamById(1);

      expect(mockedApi.get).toHaveBeenCalledWith("/streams/1");
      expect(result).toEqual(mockStream);
    });

    it("should throw an error if fetching fails", async () => {
      mockedApi.get.mockRejectedValue(new Error("API Error"));
      await expect(getStreamById(1)).rejects.toThrow("API Error");
    });
  });

  describe("createOrUpdateStream", () => {
    it("should create a stream successfully", async () => {
      const newStreamData = {
        streamName: "Vũ",
        streamUrl: "https://www.youtube.com/watch?v=e5Td3zrVdX4",
      };
      const createdStream = { id: 2, ...newStreamData };

      mockedApi.post.mockResolvedValue({ data: createdStream });

      const result = await createOrUpdateStream(newStreamData);

      expect(mockedApi.post).toHaveBeenCalledWith("/streams", newStreamData);
      expect(result).toEqual(createdStream);
    });

    it("should update a stream successfully", async () => {
      mockedApi.post.mockResolvedValue({ data: mockStream });

      const result = await createOrUpdateStream(mockStream);

      expect(mockedApi.post).toHaveBeenCalledWith("/streams", mockStream);
      expect(result).toEqual(mockStream);
    });

    it("should throw an error if creation/update fails", async () => {
      mockedApi.post.mockRejectedValue(new Error("API Error"));
      await expect(createOrUpdateStream(mockStream)).rejects.toThrow(
        "API Error",
      );
    });
  });

  describe("deleteStream", () => {
    it("should delete a stream successfully", async () => {
      mockedApi.delete.mockResolvedValue({});

      await deleteStream(1);

      expect(mockedApi.delete).toHaveBeenCalledWith("/streams/1");
    });

    it("should throw an error if deletion fails", async () => {
      mockedApi.delete.mockRejectedValue(new Error("API Error"));
      await expect(deleteStream(1)).rejects.toThrow("API Error");
    });
  });
});

