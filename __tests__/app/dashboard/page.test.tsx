/**
 * @fileoverview Unit tests cho trang Dashboard.
 * Sử dụng React Testing Library để render component và mô phỏng tương tác người dùng.
 * Các hàm API được mock để cô lập component và kiểm tra logic của nó.
 */
import "@testing-library/jest-dom"
import { render, screen, waitFor, act } from "@testing-library/react"
import DashboardPage from "@/app/dashboard/page"
import * as statisticsService from "@/services/statistics.service"
import { toast } from "sonner"

// Mock dependencies
jest.mock("@/services/statistics.service")
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
  },
}))

// Mock StatsChart component to avoid recharts errors in tests
jest.mock("@/components/stats-chart", () => ({
  StatsChart: () => <div data-testid="stats-chart">Mocked Chart</div>,
}))

describe("Trang Dashboard - Component Test", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("phải hiển thị skeleton loading khi đang tải dữ liệu", () => {
    // Arrange: Mock API để không resolve ngay lập tức
    ;(statisticsService.getStatistics as jest.Mock).mockReturnValue(new Promise(() => {}))

    // Act
    render(<DashboardPage />)

    // Assert: Kiểm tra có hiển thị loading spinner
    const loaders = screen.getAllByText("", { selector: "svg[data-testid], .animate-spin" })
    expect(loaders.length).toBeGreaterThan(0) // Có ít nhất 1 loader
  })

  it("phải hiển thị dữ liệu thống kê khi API trả về thành công", async () => {
    // Arrange
    const mockStatisticsData = {
      code: 200,
      message: "OK", 
      data: {
        totalCustomers: 10,
        registeredCustomers: 8,
        seatBookedCustomers: 5,
        revenue: {
          seatRevenue: 1000000,
          foodRevenue: 500000,
          totalRevenue: 1500000
        }
      }
    }
    ;(statisticsService.getStatistics as jest.Mock).mockResolvedValue(mockStatisticsData)

    // Act
    await act(async () => {
      render(<DashboardPage />)
    })

    // Assert: Chờ và kiểm tra dữ liệu được hiển thị
    await waitFor(() => {
      expect(screen.getByText("10")).toBeInTheDocument() // Total customers
      expect(screen.getByText("8")).toBeInTheDocument() // Registered customers  
      expect(screen.getByText("5")).toBeInTheDocument() // Seat booked customers
      expect(screen.getByText("1.000.000đ")).toBeInTheDocument() // Seat revenue
      expect(screen.getByText("500.000đ")).toBeInTheDocument() // Food revenue
      expect(screen.getByText("1.500.000đ")).toBeInTheDocument() // Total revenue
    })
  })

  it("phải hiển thị thông báo lỗi khi API trả về lỗi", async () => {
    // Arrange
    const mockErrorResponse = {
      code: 401,
      message: "Unauthorized",
      data: null
    }
    ;(statisticsService.getStatistics as jest.Mock).mockResolvedValue(mockErrorResponse)

    // Act
    await act(async () => {
      render(<DashboardPage />)
    })

    // Assert: Kiểm tra thông báo lỗi được gọi
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Unauthorized")
    })
  })

  it("phải hiển thị thông báo lỗi khi có lỗi mạng", async () => {
    // Arrange
    ;(statisticsService.getStatistics as jest.Mock).mockRejectedValue(new Error("Network Error"))

    // Act
    await act(async () => {
      render(<DashboardPage />)
    })

    // Assert: Kiểm tra thông báo lỗi mạng được gọi
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Đã có lỗi xảy ra khi tải dữ liệu thống kê")
    })
  })

  it("phải hiển thị các thao tác nhanh", () => {
    // Arrange
    ;(statisticsService.getStatistics as jest.Mock).mockResolvedValue({
      code: 200,
      data: { totalCustomers: 0, registeredCustomers: 0, seatBookedCustomers: 0, revenue: { seatRevenue: 0, foodRevenue: 0, totalRevenue: 0 } }
    })

    // Act  
    render(<DashboardPage />)

    // Assert: Kiểm tra các link thao tác nhanh
    expect(screen.getByText("Quản lý khách mời")).toBeInTheDocument()
    expect(screen.getByText("Quản lý ghế")).toBeInTheDocument()
    expect(screen.getByText("Quản lý đồ ăn")).toBeInTheDocument()
    expect(screen.getByText("Quản lý tài liệu")).toBeInTheDocument()
    expect(screen.getByText("Link trực tuyến")).toBeInTheDocument()
    expect(screen.getByText("Đăng ký hộ")).toBeInTheDocument()
  })
})
