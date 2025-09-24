"use client"

import { useState } from "react"
import { X, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FoodComboModalProps {
  isOpen: boolean
  onClose: () => void
  combo: {
    id: number
    name: string
    description: string
    price: number
    image: string
    details: string
  }
  onConfirm: (quantity: number) => void
}

/**
 * Modal hiển thị chi tiết combo đồ ăn
 * Cho phép người dùng xem thông tin chi tiết và chọn số lượng
 */
export function FoodComboModal({ isOpen, onClose, combo, onConfirm }: FoodComboModalProps) {
  const [quantity, setQuantity] = useState(0)

  if (!isOpen) return null

  // Xử lý tăng số lượng
  const handleIncrease = () => {
    setQuantity((prev) => prev + 1)
  }

  // Xử lý giảm số lượng
  const handleDecrease = () => {
    setQuantity((prev) => Math.max(0, prev - 1))
  }

  // Xử lý xác nhận
  const handleConfirm = () => {
    onConfirm(quantity)
    onClose()
    setQuantity(0)
  }

  // Xử lý hủy
  const handleCancel = () => {
    onClose()
    setQuantity(0)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        {/* Header với nút đóng */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <img src={combo.image || "/placeholder.svg"} alt={combo.name} className="w-12 h-12 rounded object-cover" />
            <div>
              <h3 className="font-semibold text-lg">{combo.name}</h3>
              <p className="text-gray-600 text-sm">{combo.description}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Mô tả chi tiết */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Mô tả</h4>
          <p className="text-gray-600 text-sm leading-relaxed">{combo.details}</p>
        </div>

        {/* Giá */}
        <div className="mb-6">
          <p className="text-2xl font-bold">{combo.price.toLocaleString()}đ</p>
        </div>

        {/* Chọn số lượng */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDecrease}
            disabled={quantity === 0}
            className="w-10 h-10 rounded-full p-0 bg-transparent"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleIncrease}
            className="w-10 h-10 rounded-full p-0 text-yellow-600 border-yellow-600 hover:bg-yellow-50 bg-transparent"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Nút hành động */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
            Hủy
          </Button>
          <Button onClick={handleConfirm} className="flex-1 bg-yellow-600 hover:bg-yellow-700">
            Xác nhận
          </Button>
        </div>
      </div>
    </div>
  )
}
