"use client"

import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message?: string
}

/**
 * Modal thông báo thành công
 * Hiển thị thông báo với icon tích xanh và hiệu ứng confetti
 */
export function SuccessModal({
  isOpen,
  onClose,
  title = "Đăng ký thành công",
  message = "Cảm ơn bạn đã đăng ký!",
}: SuccessModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center">
        {/* Icon và hiệu ứng */}
        <div className="relative mb-6">
          {/* Các hình trang trí */}
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
          <div className="absolute -top-4 right-4 w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-100"></div>
          <div className="absolute top-2 -right-2 w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-200"></div>
          <div className="absolute -bottom-2 left-4 w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-300"></div>

          {/* Icon chính */}
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-12 h-12 text-yellow-600" />
          </div>
        </div>

        {/* Tiêu đề */}
        <h3 className="text-xl font-semibold mb-2">{title}</h3>

        {/* Thông điệp */}
        {message && <p className="text-gray-600 mb-6">{message}</p>}

        {/* Nút xác nhận */}
        <Button onClick={onClose} className="w-full bg-yellow-600 hover:bg-yellow-700">
          Xác nhận
        </Button>
      </div>
    </div>
  )
}
