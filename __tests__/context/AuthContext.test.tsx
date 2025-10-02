/**
 * @fileoverview Unit tests cho AuthContext và useAuth hook.
 * @description Sử dụng React Testing Library `renderHook` để test logic của hook một cách độc lập.
 * Test xác thực authentication flow sử dụng cookies thay vì localStorage.
 * @version 2.0.0
 * @since 2025-10-03
 * @author Dũng Đàm
 */
import "@testing-library/jest-dom"
import { renderHook, act } from "@testing-library/react"
import { AuthProvider, useAuth } from "@/context/AuthContext"
import * as cookieUtils from "@/lib/cookies"

// Mock Next.js router
const mockRouterPush = jest.fn()
const mockRouterReplace = jest.fn()
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockRouterPush,
    replace: mockRouterReplace,
  }),
}))

// Mock cookie utilities
jest.mock("@/lib/cookies", () => ({
  setCookie: jest.fn(),
  getCookie: jest.fn(),
  deleteCookie: jest.fn(),
  hasCookie: jest.fn(),
}))

// Wrapper component để cung cấp Provider cho hook
const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>

describe("useAuth Hook & AuthContext", () => {

  /**
   * Dọn dẹp mocks sau mỗi test
   */
  afterEach(() => {
    jest.clearAllMocks()
  })

  /**
   * @test Trạng thái khởi tạo
   * @description Kiểm tra trạng thái ban đầu khi không có cookie
   */
  it("trạng thái ban đầu phải là chưa xác thực khi không có cookie", () => {
    // Arrange: Mock getCookie trả về null
    ;(cookieUtils.getCookie as jest.Mock).mockReturnValue(null)

    // Act: Render hook
    const { result } = renderHook(() => useAuth(), { wrapper })

    // Assert: Kiểm tra trạng thái ban đầu
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  /**
   * @test Chức năng login
   * @description Kiểm tra hàm login lưu thông tin vào cookies và cập nhật state
   */
  it("hàm login phải lưu thông tin vào cookies và cập nhật state", () => {
    // Arrange
    const { result } = renderHook(() => useAuth(), { wrapper })
    const loginData = {
      accessToken: "test-access-token",
      refreshToken: "test-refresh-token",
      username: "testuser",
      role: "USER",
    }

    // Act: Gọi hàm login
    act(() => {
      result.current.login(loginData)
    })

    // Assert: Kiểm tra state và cookies
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual({ username: "testuser", role: "USER" })
    expect(cookieUtils.setCookie).toHaveBeenCalledWith("accessToken", loginData.accessToken, 7)
    expect(cookieUtils.setCookie).toHaveBeenCalledWith("refreshToken", loginData.refreshToken, 7)
    expect(cookieUtils.setCookie).toHaveBeenCalledWith("user", JSON.stringify({ username: "testuser", role: "USER" }), 7)
  })
  
  /**
   * @test Chức năng logout
   * @description Kiểm tra hàm logout xóa cookies, reset state và điều hướng về login
   */
  it("hàm logout phải dọn dẹp cookies, reset state và điều hướng", () => {
    // Arrange: Giả lập trạng thái đã đăng nhập
    const loginData = {
      accessToken: "test-access-token",
      refreshToken: "test-refresh-token",
      username: "testuser",
      role: "USER",
    }
    
    // Mock getCookie để trả về dữ liệu đăng nhập
    ;(cookieUtils.getCookie as jest.Mock).mockImplementation((name: string) => {
      if (name === "accessToken") return loginData.accessToken
      if (name === "refreshToken") return loginData.refreshToken
      if (name === "user") return JSON.stringify({ username: loginData.username, role: loginData.role })
      return null
    })
    
    const { result } = renderHook(() => useAuth(), { wrapper })

    // Đảm bảo trạng thái ban đầu là đã đăng nhập
    expect(result.current.isAuthenticated).toBe(true)

    // Act: Gọi hàm logout
    act(() => {
      result.current.logout()
    })

    // Assert: Kiểm tra state, cookies và router
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
    expect(cookieUtils.deleteCookie).toHaveBeenCalledWith("accessToken")
    expect(cookieUtils.deleteCookie).toHaveBeenCalledWith("refreshToken")
    expect(cookieUtils.deleteCookie).toHaveBeenCalledWith("user")
    expect(mockRouterPush).toHaveBeenCalledWith("/login")
  })

  /**
   * @test Persistence với cookies
   * @description Kiểm tra việc đọc thông tin người dùng từ cookies khi khởi tạo
   */
  it("phải đọc thông tin người dùng từ cookies khi khởi tạo", () => {
    // Arrange: Giả lập trạng thái đã đăng nhập trong cookies
    const loginData = {
      accessToken: "test-access-token",
      user: { username: "storedUser", role: "ADMIN" }
    }
    
    ;(cookieUtils.getCookie as jest.Mock).mockImplementation((name: string) => {
      if (name === "accessToken") return loginData.accessToken
      if (name === "user") return JSON.stringify(loginData.user)
      return null
    })

    // Act: Render hook
    const { result } = renderHook(() => useAuth(), { wrapper })

    // Assert: Kiểm tra state đã được cập nhật từ cookies
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual(loginData.user)
  })
})
