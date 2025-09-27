/**
 * @fileoverview Unit tests cho AuthContext và useAuth hook.
 * Sử dụng React Testing Library `renderHook` để test logic của hook một cách độc lập.
 */
import "@testing-library/jest-dom"
import { renderHook, act } from "@testing-library/react"
import { AuthProvider, useAuth } from "@/context/AuthContext"

// Mock Next.js router
const mockRouterPush = jest.fn()
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}))

// Wrapper component để cung cấp Provider cho hook
const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>

describe("useAuth Hook & AuthContext", () => {

  // Dọn dẹp localStorage và mocks sau mỗi test
  afterEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it("trạng thái ban đầu phải là chưa xác thực và đang tải", () => {
    // Act: Render hook
    const { result } = renderHook(() => useAuth(), { wrapper })

    // Assert: Kiểm tra trạng thái ban đầu
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
    // Ban đầu isLoading là true, sau đó useEffect chạy và set về false
    expect(result.current.isLoading).toBe(false)
  })

  it("hàm login phải lưu thông tin vào localStorage và cập nhật state", () => {
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

    // Assert: Kiểm tra state và localStorage
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual({ username: "testuser", role: "USER" })
    expect(localStorage.getItem("accessToken")).toBe(loginData.accessToken)
    expect(localStorage.getItem("user")).toBe(JSON.stringify({ username: "testuser", role: "USER" }))
  })
  
  it("hàm logout phải dọn dẹp localStorage, reset state và điều hướng", () => {
    // Arrange: Giả lập trạng thái đã đăng nhập
    const loginData = {
      accessToken: "test-access-token",
      refreshToken: "test-refresh-token",
      username: "testuser",
      role: "USER",
    }
    localStorage.setItem("accessToken", loginData.accessToken)
    localStorage.setItem("user", JSON.stringify({ username: loginData.username, role: loginData.role }))
    
    const { result } = renderHook(() => useAuth(), { wrapper })

    // Đảm bảo trạng thái ban đầu là đã đăng nhập
    expect(result.current.isAuthenticated).toBe(true)

    // Act: Gọi hàm logout
    act(() => {
      result.current.logout()
    })

    // Assert: Kiểm tra state, localStorage và router
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
    expect(localStorage.getItem("accessToken")).toBeNull()
    expect(localStorage.getItem("user")).toBeNull()
    expect(mockRouterPush).toHaveBeenCalledWith("/login")
  })

  it("phải đọc thông tin người dùng từ localStorage khi khởi tạo", () => {
    // Arrange: Giả lập trạng thái đã đăng nhập trong localStorage
     const loginData = {
      accessToken: "test-access-token",
      user: { username: "storedUser", role: "ADMIN" }
    }
    localStorage.setItem("accessToken", loginData.accessToken)
    localStorage.setItem("user", JSON.stringify(loginData.user))

    // Act: Render hook
    const { result } = renderHook(() => useAuth(), { wrapper })

    // Assert: Kiểm tra state đã được cập nhật từ localStorage
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual(loginData.user)
  })
})
