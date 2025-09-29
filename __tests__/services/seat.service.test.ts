/**
 * @file Unit tests cho seat service.
 * @description File này chứa các unit tests cho các hàm trong seat service,
 * đảm bảo rằng việc gọi API để lấy dữ liệu ghế được xử lý đúng cách.
 */

import { getAllSeats } from '@/services/seat.service';
import api from '@/lib/api';
import { ISeat, SeatStatus, SeatType, ISeatResponse, IPaginatedData } from '@/types/seat.type';

// Mock the api module
jest.mock('@/lib/api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('Seat Service', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  /**
   * @test {getAllSeats} - Success case
   * @description Kiểm tra việc gọi API thành công và trả về dữ liệu ghế.
   */
  it('should fetch all seats successfully', async () => {
    const mockSeats: ISeat[] = [
      {
        id: 1,
        seatNumber: 'A1',
        type: SeatType.VIP,
        basePrice: 500000,
        status: SeatStatus.AVAILABLE,
      },
      {
        id: 2,
        seatNumber: 'A2',
        type: SeatType.NORMAL,
        basePrice: 200000,
        status: SeatStatus.TAKEN,
      },
    ];

    const pageData: IPaginatedData<ISeat> = {
      content: mockSeats,
      page: 0,
      size: mockSeats.length,
      totalElements: mockSeats.length,
      totalPages: 1,
      first: true,
      last: true,
    };
    const mockResponse: { data: ISeatResponse } = {
      data: { code: 200, message: 'OK', data: pageData },
    };

    mockedApi.get.mockResolvedValue(mockResponse);

    const result = await getAllSeats();

    expect(result).toEqual(mockSeats);
    expect(mockedApi.get).toHaveBeenCalledWith('/seats/info', { params: { page: 0, size: 10000, sortBy: 'id', sortDir: 'asc' } });
    expect(mockedApi.get).toHaveBeenCalledTimes(1);
  });

  /**
   * @test {getAllSeats} - Error case
   * @description Kiểm tra việc xử lý lỗi khi gọi API thất bại.
   */
  it('should throw an error when fetching seats fails', async () => {
    const errorMessage = 'Network Error';
    mockedApi.get.mockRejectedValue(new Error(errorMessage));

    await expect(getAllSeats()).rejects.toThrow(errorMessage);
    expect(mockedApi.get).toHaveBeenCalledWith('/seats/info', { params: { page: 0, size: 10000, sortBy: 'id', sortDir: 'asc' } });
    expect(mockedApi.get).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Không thể lấy danh sách ghế:', expect.any(Error));
  });

  /**
   * @test {getAllSeats} - Empty response case
   * @description Kiểm tra việc xử lý khi API trả về danh sách ghế rỗng.
   */
  it('should handle empty seats array', async () => {
    const pageData: IPaginatedData<ISeat> = {
      content: [],
      page: 0,
      size: 0,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true,
    };
    const mockResponse: { data: ISeatResponse } = {
      data: { code: 200, message: 'OK', data: pageData },
    };

    mockedApi.get.mockResolvedValue(mockResponse);

    const result = await getAllSeats();

    expect(result).toEqual([]);
    expect(mockedApi.get).toHaveBeenCalledWith('/seats/info', { params: { page: 0, size: 10000, sortBy: 'id', sortDir: 'asc' } });
    expect(mockedApi.get).toHaveBeenCalledTimes(1);
  });

  /**
   * @test {getAllSeats} - Different seat types
   * @description Kiểm tra việc xử lý các loại ghế khác nhau.
   */
  it('should handle different seat types correctly', async () => {
    const mockSeats: ISeat[] = [
      {
        id: 1,
        seatNumber: 'A1',
        type: SeatType.VIP,
        basePrice: 500000,
        status: SeatStatus.AVAILABLE,
      },
      {
        id: 2,
        seatNumber: 'B1',
        type: SeatType.NORMAL,
        basePrice: 200000,
        status: SeatStatus.AVAILABLE,
      },
      {
        id: 3,
        seatNumber: 'C1',
        type: SeatType.FREE,
        basePrice: 0,
        status: SeatStatus.AVAILABLE,
      },
      {
        id: 4,
        seatNumber: 'D1',
        type: SeatType.BLOCK,
        basePrice: 0,
        status: SeatStatus.AVAILABLE,
      },
    ];

    const pageData: IPaginatedData<ISeat> = {
      content: mockSeats,
      page: 0,
      size: mockSeats.length,
      totalElements: mockSeats.length,
      totalPages: 1,
      first: true,
      last: true,
    };
    const mockResponse: { data: ISeatResponse } = {
      data: { code: 200, message: 'OK', data: pageData },
    };

    mockedApi.get.mockResolvedValue(mockResponse);

    const result = await getAllSeats();

    expect(result).toEqual(mockSeats);
    expect(result).toHaveLength(4);
    expect(result[0].type).toBe(SeatType.VIP);
    expect(result[1].type).toBe(SeatType.NORMAL);
    expect(result[2].type).toBe(SeatType.FREE);
    expect(result[3].type).toBe(SeatType.BLOCK);
  });
});
