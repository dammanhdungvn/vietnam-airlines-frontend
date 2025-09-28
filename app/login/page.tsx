"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { login } from "@/services/auth.service"
import { ILoginPayload } from "@/types/auth.type"
import { useAuth } from "@/context/AuthContext"

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
  const { toast } = useToast()
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
        toast({
          title: "Thành công",
          description: "Đăng nhập thành công!",
        })
        router.push("/dashboard") // Điều hướng đến trang dashboard
      } else {
        // Hiển thị thông báo lỗi từ API
        toast({
          title: "Lỗi",
          description: responseData.message,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      // Xử lý các lỗi khác (ví dụ: lỗi mạng)
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center space-x-2 mb-8">
            <div className="flex items-center">
              {/* Logo hoa sen vàng */}
              <div className="w-8 h-8 mr-2">
                <svg viewBox="0 0 24 24" className="w-full h-full text-yellow-500 fill-current">
                  <path d="M12 2C8.5 2 6 4.5 6 8c0 2.5 1.5 4.5 3 6l3 3 3-3c1.5-1.5 3-3.5 3-6 0-3.5-2.5-6-6-6zm0 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-blue-600">Vietnam Airlines</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Đăng nhập</h2>
            <p className="text-sm text-gray-600">Vui lòng điền thông tin của bạn</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Nhập"
                {...register("username")}
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium rounded-md"
            >
              {isSubmitting ? "Đang đăng nhập..." : "Sign in"}
            </Button>
          </form>
        </div>
      </div>

      <div className="flex-1 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center p-8 relative overflow-hidden">
        {/* Máy bay Vietnam Airlines */}
        <div className="absolute top-1/4 right-1/4 transform rotate-12">
          <img
            src="/vietnam-airlines-plane-flying-in-blue-sky.jpg"
            alt="Vietnam Airlines Aircraft"
            className="w-80 h-auto opacity-90"
          />
        </div>

        {/* Logo và text chính */}
        <div className="text-center text-white z-10">
          {/* Logo hoa sen lớn */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16">
              <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-400 fill-current">
                <path d="M50 10c-5 0-10 2-15 5-3 2-5 5-5 8 0 3 2 6 5 8l15 15 15-15c3-2 5-5 5-8 0-3-2-6-5-8-5-3-10-5-15-5z" />
                <path d="M35 35c-3 2-5 5-5 8 0 3 2 6 5 8l15 15 15-15c3-2 5-5 5-8 0-3-2-6-5-8l-15-15-15 15z" />
                <path d="M35 60c-3 2-5 5-5 8 0 3 2 6 5 8l15 15 15-15c3-2 5-5 5-8 0-3-2-6-5-8l-15-15-15 15z" />
              </svg>
            </div>
          </div>

          {/* Text Vietnam Airlines */}
          <h1 className="text-4xl font-bold tracking-wide">Vietnam Airlines</h1>
        </div>
      </div>
    </div>
  )
}
