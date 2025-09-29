"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { Star, User, RefreshCw } from "lucide-react"
import { ISeat, SeatType } from "@/types/seat.type"

/**
 * @interface SeatMapInteractiveProps
 * @description Props for the interactive SeatMap component.
 */
interface SeatMapInteractiveProps {
  seats: ISeat[];
  selectedSeat: ISeat | null;
  onSelectSeat: (seat: ISeat | null) => void;
  isLoading: boolean;
}

/**
 * An interactive seat map component for the registration process.
 * Allows users to select an available seat.
 */
export function SeatMapInteractive({ seats, selectedSeat, onSelectSeat, isLoading }: SeatMapInteractiveProps) {

  const seatRows = useMemo(() => {
    const rows: { [key: string]: ISeat[] } = {}
    seats.forEach((seat) => {
      const rowChar = seat.seatNumber.charAt(0)
      if (!rows[rowChar]) rows[rowChar] = []
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

  const getSeatStyle = (seat: ISeat) => {
    if (selectedSeat?.id === seat.id) {
      return "bg-orange-500 text-white border-orange-600 ring-2 ring-orange-500"
    }
    if (seat.isBooked) {
      return "bg-slate-700 text-white cursor-not-allowed"
    }
    switch (seat.type) {
      case SeatType.VIP:
        return "bg-yellow-100 border-yellow-300 hover:bg-yellow-200"
      case SeatType.NORMAL:
        return "bg-teal-100 border-teal-300 hover:bg-teal-200"
      case SeatType.FREE:
        return "bg-green-100 border-green-300 hover:bg-green-200"
      default:
        return "bg-gray-100 border-gray-300"
    }
  }

  const getSeatIcon = (seat: ISeat) => {
    if (seat.isBooked) {
      return <User className="w-4 h-4" />
    }
    if (seat.type === SeatType.VIP) {
      return <Star className="w-3 h-3 text-yellow-600" />
    }
    return null
  }

  const handleSeatClick = (seat: ISeat) => {
    if (seat.isBooked) return;
    
    if (selectedSeat?.id === seat.id) {
      onSelectSeat(null); // Deselect if clicked again
    } else {
      onSelectSeat(seat);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center" role="status">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-gray-600">Đang tải sơ đồ ghế...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-2 rounded-full mb-4">
          <span className="font-medium tracking-wider">SÂN KHẤU</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="space-y-3">
          {seatRows.map(({ row, seats }) => (
            <div key={row} className="flex items-center justify-center space-x-2">
              <div className="w-8 text-center font-medium text-gray-700">{row}</div>
              <div className="flex flex-wrap gap-1">
                {seats.map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => handleSeatClick(seat)}
                    disabled={seat.isBooked}
                    className={cn(
                      "w-8 h-8 border rounded flex items-center justify-center text-xs font-medium transition-colors",
                      getSeatStyle(seat),
                    )}
                    title={seat.seatNumber}
                  >
                    {getSeatIcon(seat) || seat.seatNumber.substring(1)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

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
            <div className="w-4 h-4 bg-slate-700 rounded flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
            </div>
            <span>Đã đặt</span>
          </div>
           <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 border border-orange-600 rounded"></div>
            <span>Đang chọn</span>
          </div>
        </div>
      </div>
      
      {selectedSeat && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4 shadow-sm border">
          <h3 className="font-semibold mb-2 text-center text-gray-800">Thông tin ghế đã chọn</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">Số ghế: <span className="font-bold text-lg">{selectedSeat.seatNumber}</span></p>
              <p className="text-sm text-gray-600">Loại ghế: {selectedSeat.type}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-xl text-orange-600">
                {selectedSeat.basePrice > 0 ? `${selectedSeat.basePrice.toLocaleString('vi-VN')}đ` : 'Miễn phí'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
