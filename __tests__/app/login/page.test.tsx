/**
 * @fileoverview Unit tests cho trang Đăng nhập.
 * Sử dụng React Testing Library và user-event để mô phỏng tương tác người dùng.
 * Các hàm API, router, context và hooks được mock để cô lập component và kiểm tra logic của nó.
 */
import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import LoginPage from "@/app/login/page"
import { useAuth } from "@/context/AuthContext"
import * as authService from "@/services/auth.service"

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))
jest.mock("@/context/AuthContext")
jest.mock("@/services/auth.service")
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

describe("Trang Đăng Nhập - Component Test", () => {
  let mockAuthLogin: jest.Mock
  let mockToast: jest.Mock
  const mockRouterPush = jest.fn()

  // Setup trước mỗi bài test
  beforeEach(() => {
    // Reset tất cả các mock
    jest.clearAllMocks()

    // Cung cấp giá trị mock cho useAuth
    mockAuthLogin = jest.fn()
    ;(useAuth as jest.Mock).mockReturnValue({
      login: mockAuthLogin,
    })

    // Cung cấp giá trị mock cho useRouter
    jest.spyOn(require("next/navigation"), "useRouter").mockReturnValue({ push: mockRouterPush })
    
    // Cung cấp giá trị mock cho useToast
    mockToast = jest.fn()
    jest.spyOn(require("@/hooks/use-toast"), "useToast").mockReturnValue({ toast: mockToast })
  })

  // Sắp xếp (Arrange)
  const setup = () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    return {
      user,
      usernameInput: screen.getByLabelText(/username/i),
      passwordInput: screen.getByLabelText(/password/i),
      submitButton: screen.getByRole("button", { name: /sign in/i }),
    }
  }

  it("phải hiển thị form đăng nhập với đầy đủ các trường", () => {
    // Hành động (Act)
    const { usernameInput, passwordInput, submitButton } = setup()

    // Khẳng định (Assert)
    expect(usernameInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })

  it("phải hiển thị lỗi validation khi submit form rỗng", async () => {
    // Arrange
    const { user, submitButton } = setup()
    
    // Act
    await user.click(submitButton)

    // Assert
    expect(await screen.findByText("Tên đăng nhập không được để trống")).toBeInTheDocument()
    expect(await screen.findByText("Mật khẩu không được để trống")).toBeInTheDocument()
  })
  
  it("phải vô hiệu hóa nút submit và hiển thị 'Đang đăng nhập...' khi đang gửi form", async () => {
    // Arrange
    const { user, usernameInput, passwordInput, submitButton } = setup()
    
    // Mock API để nó không resolve ngay lập tức
    ;(authService.login as jest.Mock).mockReturnValue(new Promise(() => {}))

    // Act
    await user.type(usernameInput, "testuser")
    await user.type(passwordInput, "password")
    await user.click(submitButton)

    // Assert
    await waitFor(() => {
      expect(submitButton).toBeDisabled()
      expect(screen.getByText("Đang đăng nhập...")).toBeInTheDocument()
    })
  });


  it("phải gọi hàm login và điều hướng khi đăng nhập thành công", async () => {
    // Arrange
    const { user, usernameInput, passwordInput, submitButton } = setup()
    const mockLoginResponse = {
      code: 200,
      data: { accessToken: "fake-token", username: "admin", role: "ADMIN" },
    }
    ;(authService.login as jest.Mock).mockResolvedValue(mockLoginResponse)

    // Act
    await user.type(usernameInput, "admin")
    await user.type(passwordInput, "password")
    await user.click(submitButton)

    // Assert
    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({ username: "admin", password: "password" })
      expect(mockAuthLogin).toHaveBeenCalledWith(mockLoginResponse.data)
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: "Thành công" }))
      expect(mockRouterPush).toHaveBeenCalledWith("/dashboard")
    })
  })

  it("phải hiển thị thông báo lỗi khi API trả về lỗi", async () => {
    // Arrange
    const { user, usernameInput, passwordInput, submitButton } = setup()
    const mockErrorResponse = {
      code: 400,
      message: "Thông tin đăng nhập không hợp lệ",
    }
    ;(authService.login as jest.Mock).mockResolvedValue(mockErrorResponse)

    // Act
    await user.type(usernameInput, "wronguser")
    await user.type(passwordInput, "wrongpass")
    await user.click(submitButton)

    // Assert
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Lỗi",
        description: mockErrorResponse.message,
        variant: "destructive",
      }))
    })
  })
})
