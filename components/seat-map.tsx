"use client"

import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Star, X } from "lucide-react"
import { ISeat, SeatStatus, SeatType } from "@/types/seat.type"

/**
 * @interface SeatMapProps
 * @description Props cho component SeatMap.
 */
interface SeatMapProps {
  /**
   * @property {ISeat[]} seats - Mảng danh sách ghế từ API.
   */
  seats: ISeat[];
}

/**
 * Component sơ đồ chỗ ngồi máy bay
 * Hiển thị các ghế với trạng thái khác nhau: VIP, Thường, Free, Đã đặt, Đang chọn
 * @param {SeatMapProps} props - Props của component.
 */
export function SeatMap({ seats }: SeatMapProps) {
  const [selectedSeat, setSelectedSeat] = useState<ISeat | null>(null)

  // Gom nhóm ghế theo hàng từ dữ liệu API
  const seatRows = useMemo(() => {
    const rows: { [key: string]: ISeat[] } = {}
    seats.forEach((seat) => {
      const rowChar = seat.seatNumber.charAt(0)
      if (!rows[rowChar]) {
        rows[rowChar] = []
      }
      rows[rowChar].push(seat)
    })
    return Object.entries(rows).map(([row, seats]) => ({ row, seats }))
  }, [seats])

  /**
   * @function getSeatStyle
   * @description Xác định style CSS cho ghế dựa trên trạng thái và loại.
   * @param {ISeat} seat - Đối tượng ghế.
   * @returns {string} Class CSS tương ứng.
   */
  const getSeatStyle = (seat: ISeat) => {
    if (selectedSeat?.id === seat.id) {
      return "bg-yellow-500 text-white border-yellow-600"
    }
    if (seat.status === SeatStatus.TAKEN) {
      return "bg-gray-300 text-gray-500 cursor-not-allowed"
    }
    switch (seat.type) {
      case SeatType.VIP:
        return "bg-yellow-100 border-yellow-300 hover:bg-yellow-200"
      case SeatType.NORMAL:
        return "bg-teal-100 border-teal-300 hover:bg-teal-200"
      case SeatType.FREE:
        return "bg-green-100 border-green-300 hover:bg-green-200"
      case SeatType.BLOCK:
        return "bg-gray-100 border-gray-300 cursor-not-allowed"
      default:
        return "bg-gray-100 border-gray-300"
    }
  }

  /**
   * @function getSeatIcon
   * @description Xác định icon hiển thị cho ghế.
   * @param {ISeat} seat - Đối tượng ghế.
   * @returns {JSX.Element | null} Icon component hoặc null.
   */
  const getSeatIcon = (seat: ISeat) => {
    if (seat.status === SeatStatus.TAKEN) {
      return <X className="w-3 h-3" />
    }
    if (seat.type === SeatType.VIP) {
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
          {seatRows.map(({ row, seats }) => (
            <div key={row} className="flex items-center justify-center space-x-2">
              <div className="w-8 text-center font-medium text-gray-700">{row}</div>
              <div className="flex flex-wrap gap-1">
                {seats.map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => {
                      if (seat.status !== SeatStatus.TAKEN && seat.type !== SeatType.BLOCK) {
                        setSelectedSeat(seat)
                      }
                    }}
                    className={cn(
                      "w-8 h-8 border rounded flex items-center justify-center text-xs font-medium transition-colors",
                      getSeatStyle(seat),
                    )}
                    disabled={seat.status === SeatStatus.TAKEN || seat.type === SeatType.BLOCK}
                    title={seat.seatNumber}
                  >
                    {getSeatIcon(seat) || seat.seatNumber}
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
            <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
            <span>Bị khóa</span>
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
              <p className="font-medium">Ghế: {selectedSeat.seatNumber}</p>
              <p className="text-sm text-gray-600">
                Loại: {selectedSeat.type} | Trạng thái: {selectedSeat.status === SeatStatus.AVAILABLE ? 'Trống' : 'Đã đặt'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                {selectedSeat.basePrice ? `${selectedSeat.basePrice.toLocaleString('vi-VN')}đ` : 'Miễn phí'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
