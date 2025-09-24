"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Star, X } from "lucide-react"

/**
 * Component sơ đồ chỗ ngồi máy bay
 * Hiển thị các ghế với trạng thái khác nhau: VIP, Thường, Free, Đã đặt, Đang chọn
 */
export function SeatMap() {
  const [selectedSeat, setSelectedSeat] = useState<string | null>("A1")

  // Cấu hình ghế theo hàng
  const seatRows = [
    { row: "A", seats: Array.from({ length: 12 }, (_, i) => ({ id: `A${i + 1}`, type: "vip" })) },
    { row: "B", seats: Array.from({ length: 12 }, (_, i) => ({ id: `B${i + 1}`, type: "vip" })) },
    { row: "C", seats: Array.from({ length: 12 }, (_, i) => ({ id: `C${i + 1}`, type: "vip" })) },
    {
      row: "D",
      seats: [
        ...Array.from({ length: 2 }, (_, i) => ({ id: `D${i + 1}`, type: "unavailable" })),
        ...Array.from({ length: 10 }, (_, i) => ({ id: `D${i + 3}`, type: "regular" })),
      ],
    },
    { row: "E", seats: Array.from({ length: 12 }, (_, i) => ({ id: `E${i + 1}`, type: "regular" })) },
    { row: "F", seats: Array.from({ length: 12 }, (_, i) => ({ id: `F${i + 1}`, type: "regular" })) },
    { row: "G", seats: Array.from({ length: 12 }, (_, i) => ({ id: `G${i + 1}`, type: "regular" })) },
    { row: "H", seats: Array.from({ length: 12 }, (_, i) => ({ id: `H${i + 1}`, type: "regular" })) },
    { row: "I", seats: Array.from({ length: 12 }, (_, i) => ({ id: `I${i + 1}`, type: "regular" })) },
  ]

  // Một số ghế đã được đặt (mẫu)
  const bookedSeats = ["D1", "D2", "E9", "F8", "G8", "H8", "I8"]
  const selectedSeats = ["D1", "D2"] // Ghế đang được chọn

  const getSeatStyle = (seatId: string, seatType: string) => {
    if (selectedSeat === seatId) {
      return "bg-yellow-500 text-white border-yellow-600"
    }
    if (bookedSeats.includes(seatId)) {
      return "bg-gray-300 text-gray-500 cursor-not-allowed"
    }
    if (seatType === "vip") {
      return "bg-yellow-100 border-yellow-300 hover:bg-yellow-200"
    }
    if (seatType === "unavailable") {
      return "bg-gray-100 border-gray-300 cursor-not-allowed"
    }
    return "bg-teal-100 border-teal-300 hover:bg-teal-200"
  }

  const getSeatIcon = (seatId: string, seatType: string) => {
    if (bookedSeats.includes(seatId)) {
      return <X className="w-3 h-3" />
    }
    if (seatType === "vip") {
      return <Star className="w-3 h-3 text-yellow-600" />
    }
    return null
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-2 rounded-full mb-4">
          <span className="font-medium tracking-wider">SÂN KHẤU</span>
        </div>
      </div>

      {/* Sơ đồ ghế */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="space-y-3">
          {seatRows.map((row) => (
            <div key={row.row} className="flex items-center justify-center space-x-2">
              <div className="w-8 text-center font-medium text-gray-700">{row.row}</div>
              <div className="flex space-x-1">
                {row.seats.map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => {
                      if (!bookedSeats.includes(seat.id) && seat.type !== "unavailable") {
                        setSelectedSeat(seat.id)
                      }
                    }}
                    className={cn(
                      "w-8 h-8 border rounded flex items-center justify-center text-xs font-medium transition-colors",
                      getSeatStyle(seat.id, seat.type),
                    )}
                    disabled={bookedSeats.includes(seat.id) || seat.type === "unavailable"}
                  >
                    {getSeatIcon(seat.id, seat.type)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Chú thích */}
        <div className="flex items-center justify-center space-x-6 mt-8 text-sm">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-600" />
            <span>VIP</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-teal-200 border border-teal-300 rounded"></div>
            <span>Thường</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-200 border border-green-300 rounded"></div>
            <span>Free</span>
          </div>
          <div className="flex items-center space-x-2">
            <X className="w-4 h-4 text-gray-500" />
            <span>Đã đặt</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 border border-yellow-600 rounded"></div>
            <span>Đang chọn</span>
          </div>
        </div>
      </div>

      {/* Thông tin ghế đã chọn */}
      {selectedSeat && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Ghế: {selectedSeat}</p>
              <p className="text-sm text-gray-600">17-18/ | 8:00AM - 6:00PM</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">100.000đ</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
