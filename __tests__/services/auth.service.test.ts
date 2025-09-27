/**
 * @fileoverview Unit tests cho auth.service.
 * Tập trung vào việc kiểm tra logic gọi API mà không thực hiện lời gọi mạng thực tế.
 */
import api from "@/lib/api"
import { login } from "@/services/auth.service"
import { ILoginPayload } from "@/types/auth.type"

// Mock axios instance (api)
jest.mock("@/lib/api", () => ({
  post: jest.fn(),
}))

describe("Auth Service", () => {
  
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("hàm login phải gọi api.post với đúng endpoint và payload", async () => {
    // Arrange
    const loginPayload: ILoginPayload = {
      username: "testuser",
      password: "password123",
    }
    const mockResponse = { data: { accessToken: "some-token" } }
    ;(api.post as jest.Mock).mockResolvedValue(mockResponse)
    
    // Act
    await login(loginPayload)

    // Assert
    expect(api.post).toHaveBeenCalledWith("/auth/login", loginPayload)
  })

  it("hàm login phải trả về đúng dữ liệu từ response của API", async () => {
    // Arrange
    const loginPayload: ILoginPayload = {
      username: "testuser",
      password: "password123",
    }
    const mockResponseData = { accessToken: "some-token" }
    ;(api.post as jest.Mock).mockResolvedValue({ data: mockResponseData })
    
    // Act
    const result = await login(loginPayload)
    
    // Assert
    expect(result).toEqual(mockResponseData)
  })

  it("hàm login phải ném ra lỗi nếu api.post thất bại", async () => {
    // Arrange
    const loginPayload: ILoginPayload = {
      username: "testuser",
      password: "password123",
    }
    const errorMessage = "Network Error"
    ;(api.post as jest.Mock).mockRejectedValue(new Error(errorMessage))

    // Act & Assert
    // Chúng ta kiểm tra xem lời gọi hàm login có ném ra một lỗi hay không.
    await expect(login(loginPayload)).rejects.toThrow(errorMessage)
  })
})
