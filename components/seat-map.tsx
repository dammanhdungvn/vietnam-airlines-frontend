"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"
import { Star, User } from "lucide-react"
import { ISeat, SeatType } from "@/types/seat.type"

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
 * Hiển thị các ghế với trạng thái khác nhau: VIP, Thường, Free, Đã đặt.
 * Sơ đồ này chỉ hiển thị, không có chức năng chọn ghế.
 * @param {SeatMapProps} props - Props của component.
 */
export function SeatMap({ seats }: SeatMapProps) {
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
    return Object.entries(rows).map(([row, seatsInRow]) => ({
      row,
      seats: seatsInRow.sort((a, b) => {
        const aNum = parseInt(a.seatNumber.substring(1), 10);
        const bNum = parseInt(b.seatNumber.substring(1), 10);
        return aNum - bNum;
      })
    }))
  }, [seats])

  /**
   * @function getSeatStyle
   * @description Xác định style CSS cho ghế dựa trên trạng thái và loại.
   * @param {ISeat} seat - Đối tượng ghế.
   * @returns {string} Class CSS tương ứng.
   */
  const getSeatStyle = (seat: ISeat) => {
    if (seat.isBooked) {
      return "bg-slate-700 text-white cursor-not-allowed"
    }
    switch (seat.type) {
      case SeatType.VIP:
        return "bg-yellow-100 border-yellow-300"
      case SeatType.NORMAL:
        return "bg-teal-100 border-teal-300"
      case SeatType.FREE:
        return "bg-green-100 border-green-300"
      case SeatType.BLOCK:
        return "bg-red-200 border-red-300" // Phân biệt ghế BLOCK nhưng không vô hiệu hóa
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
    if (seat.isBooked) {
      return <User className="w-4 h-4" />
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
                  <div
                    key={seat.id}
                    className={cn(
                      "w-8 h-8 border rounded flex items-center justify-center text-xs font-medium",
                      getSeatStyle(seat),
                    )}
                    title={seat.seatNumber}
                  >
                    {getSeatIcon(seat) || seat.seatNumber}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Chú thích */}
        <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-2 mt-8 text-sm">
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
            <div className="w-4 h-4 bg-red-200 border border-red-300 rounded"></div>
            <span>Block</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-slate-700 rounded flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
            </div>
            <span>Đã đặt</span>
          </div>
        </div>
      </div>
    </div>
  )
}
