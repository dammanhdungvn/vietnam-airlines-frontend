"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"

/**
 * @fileoverview AuthContext cung cấp một cơ chế quản lý trạng thái xác thực người dùng trên toàn bộ ứng dụng.
 * Bao gồm thông tin người dùng, trạng thái đăng nhập, và các hàm để login, logout.
 * Dữ liệu sẽ được lưu vào localStorage để duy trì phiên đăng nhập.
 * @version 1.0.0
 * @since 2025-09-27
 * @author Dũng Đàm
 */

/**
 * @interface User
 * Định nghĩa cấu trúc cho đối tượng người dùng.
 */
interface User {
  username: string
  role: string
}

/**
 * @interface AuthContextType
 * Định nghĩa cấu trúc cho giá trị của AuthContext.
 */
interface AuthContextType {
  user: User | null
  login: (data: { accessToken: string; refreshToken: string; username: string; role: string }) => void
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

// Tạo Context với giá trị mặc định là undefined.
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Component AuthProvider, chịu trách nhiệm cung cấp AuthContext cho các component con.
 * @param {object} props - Props của component.
 * @param {ReactNode} props.children - Các component con sẽ được bọc bởi Provider này.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  /**
   * Sử dụng useEffect để kiểm tra và lấy dữ liệu người dùng từ localStorage khi component được mount.
   * Điều này giúp duy trì trạng thái đăng nhập khi người dùng tải lại trang.
   */
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user")
      const token = localStorage.getItem("accessToken")
      if (storedUser && token) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error)
      localStorage.clear()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Hàm xử lý logic khi người dùng đăng nhập thành công.
   * Lưu trữ token và thông tin người dùng vào localStorage và cập nhật state.
   * @param {object} data - Dữ liệu trả về từ API sau khi đăng nhập thành công.
   */
  const login = (data: { accessToken: string; refreshToken: string; username: string; role: string }) => {
    const userData = { username: data.username, role: data.role }
    localStorage.setItem("accessToken", data.accessToken)
    localStorage.setItem("refreshToken", data.refreshToken)
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
  }

  /**
   * Hàm xử lý logic khi người dùng đăng xuất.
   * Xóa toàn bộ dữ liệu liên quan khỏi localStorage, reset state và điều hướng về trang đăng nhập.
   */
  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")
  }

  // Cung cấp các giá trị và hàm cho các component con thông qua Context Provider.
  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Custom hook `useAuth` để giúp các component dễ dàng truy cập vào AuthContext.
 * @returns {AuthContextType} - Giá trị của context.
 * @throws {Error} - Ném lỗi nếu hook được sử dụng bên ngoài AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

