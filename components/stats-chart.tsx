"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts"

/**
 * Component biểu đồ thống kê doanh thu
 * Hiển thị dữ liệu bán ghế và đồ ăn theo tuần
 */
export function StatsChart() {
  // Dữ liệu mẫu cho biểu đồ
  const data = [
    { name: "Thứ 2", "Tiền bán ghế": 1, "Tiền bán đồ ăn": 3 },
    { name: "Thứ 3", "Tiền bán ghế": 3.5, "Tiền bán đồ ăn": 2 },
    { name: "Thứ 4", "Tiền bán ghế": 1, "Tiền bán đồ ăn": 0.5 },
    { name: "Thứ 5", "Tiền bán ghế": 1, "Tiền bán đồ ăn": 4.5 },
    { name: "Thứ 6", "Tiền bán ghế": 3.5, "Tiền bán đồ ăn": 5 },
    { name: "Thứ 7", "Tiền bán ghế": 2.5, "Tiền bán đồ ăn": 1 },
    { name: "Chủ nhật", "Tiền bán ghế": 4.5, "Tiền bán đồ ăn": 4.5 },
  ]

  // Custom tooltip để hiển thị số tiền chi tiết
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {new Intl.NumberFormat('vi-VN').format(entry.value * 1000000)}đ
            </p>
          ))}
          <p className="text-sm font-semibold text-gray-900 mt-2 pt-2 border-t">
            Tổng: {new Intl.NumberFormat('vi-VN').format(
              payload.reduce((sum: number, entry: any) => sum + entry.value, 0) * 1000000
            )}đ
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            label={{ value: "Số tiền (triệu)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(249, 158, 11, 0.1)' }} />
          <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
          <Bar dataKey="Tiền bán ghế" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Tiền bán ghế" />
          <Bar dataKey="Tiền bán đồ ăn" fill="#fbbf24" radius={[4, 4, 0, 0]} name="Tiền bán đồ ăn" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
