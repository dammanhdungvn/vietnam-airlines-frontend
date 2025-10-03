"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { login } from "@/services/auth.service"
import { ILoginPayload } from "@/types/auth.type"
import { useAuth } from "@/context/AuthContext"
import planeImage from "../../public/image/plane.jpg";
import logoImage from "../../public/image/logo.jpg";
/**
 * @fileoverview Trang Đăng nhập của hệ thống.
 * Chịu trách nhiệm hiển thị form, thu thập thông tin, xác thực đầu vào
 * và gọi API để thực hiện đăng nhập.
 * @version 1.0.0
 * @since 2025-09-27
 * @author Dũng Đàm
 */

// Định nghĩa schema validation sử dụng Zod
const loginSchema = z.object({
  username: z.string().min(1, { message: "Tên đăng nhập không được để trống" }),
  password: z.string().min(1, { message: "Mật khẩu không được để trống" }),
})

/**
 * Component trang đăng nhập.
 * Sử dụng `react-hook-form` để quản lý form và `zod` để validation.
 * Tích hợp `AuthContext` để xử lý logic đăng nhập.
 */
export default function LoginPage() {
  const router = useRouter()

  const { login: authLogin } = useAuth() // Lấy hàm login từ AuthContext và đổi tên thành authLogin

  // Khởi tạo react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }, // Lấy các trạng thái của form
  } = useForm<ILoginPayload>({
    resolver: zodResolver(loginSchema), // Tích hợp Zod resolver    
  })

  /**
   * Hàm được gọi khi người dùng submit form.
   * @param {ILoginPayload} data - Dữ liệu từ form đã được validate.
   */
  const onSubmit = async (data: ILoginPayload) => {
    try {
      const responseData = await login(data) // Gọi API đăng nhập và lấy thẳng data
      // Kiểm tra đăng nhập thành công
      if (responseData.code === 200 && responseData.data.accessToken) {
        authLogin(responseData.data) // Gọi hàm login từ AuthContext để lưu thông tin
        toast.success("Đăng nhập thành công!")
        router.push("/dashboard") // Điều hướng đến trang dashboard
      } else {
        // Hiển thị thông báo lỗi từ API
        toast.error(responseData.message)
      }
    } catch (error: any) {
      // Xử lý các lỗi khác (ví dụ: lỗi mạng)
      toast.error(error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.")
    }
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row">
      {/* Form Section - Full width on mobile, half on desktop */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-white">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          {/* Logo */}
          <div className="flex items-center justify-center lg:justify-start mb-6 sm:mb-8">
            <div className="w-48 sm:w-56 md:w-64 lg:w-70">
              <img src={logoImage.src} alt="Vietnam Airlines Logo" className="w-full h-auto" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Đăng nhập</h2>
            <p className="text-sm sm:text-base text-gray-600">Vui lòng điền thông tin của bạn</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Nhập tên đăng nhập"
                {...register("username")}
                className="h-10 sm:h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="h-10 sm:h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 sm:h-12 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium rounded-md text-sm sm:text-base"
            >
              {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>
        </div>
      </div>

      {/* Image Section - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:flex lg:flex-1 h-64 lg:h-auto w-full bg-gradient-to-br items-center justify-center relative overflow-hidden">
        <img 
          src={planeImage.src} 
          alt="Vietnam Airlines Plane" 
          className="w-full h-full object-cover" 
        />
      </div>
    </div>
  )
}
