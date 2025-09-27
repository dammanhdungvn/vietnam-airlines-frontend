/**
 * @fileoverview Unit tests cho statistics.service.
 * Tập trung vào việc kiểm tra logic gọi API thống kê mà không thực hiện lời gọi mạng thực tế.
 */
import api from "@/lib/api"
import { getStatistics } from "@/services/statistics.service"

// Mock axios instance (api)
jest.mock("@/lib/api", () => ({
  get: jest.fn(),
}))

describe("Statistics Service", () => {
  
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("hàm getStatistics phải gọi api.get với đúng endpoint", async () => {
    // Arrange
    const mockResponse = { 
      data: { 
        code: 200, 
        message: "OK", 
        data: { totalCustomers: 5 } 
      } 
    }
    ;(api.get as jest.Mock).mockResolvedValue(mockResponse)
    
    // Act
    await getStatistics()

    // Assert
    expect(api.get).toHaveBeenCalledWith("/statistics")
  })

  it("hàm getStatistics phải trả về đúng dữ liệu từ response của API", async () => {
    // Arrange
    const mockResponseData = {
      code: 200,
      message: "OK",
      data: {
        totalCustomers: 5,
        registeredCustomers: 4,
        seatBookedCustomers: 1,
        revenue: {
          seatRevenue: 400000,
          foodRevenue: 600000,
          totalRevenue: 1000000
        }
      }
    }
    ;(api.get as jest.Mock).mockResolvedValue({ data: mockResponseData })
    
    // Act
    const result = await getStatistics()
    
    // Assert
    expect(result).toEqual(mockResponseData)
  })

  it("hàm getStatistics phải ném ra lỗi nếu api.get thất bại", async () => {
    // Arrange
    const errorMessage = "Network Error"
    ;(api.get as jest.Mock).mockRejectedValue(new Error(errorMessage))

    // Act & Assert
    // Chúng ta kiểm tra xem lời gọi hàm getStatistics có ném ra một lỗi hay không.
    await expect(getStatistics()).rejects.toThrow(errorMessage)
  })
})
