"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsChart } from "@/components/stats-chart"
import { useToast } from "@/hooks/use-toast"
import { getStatistics } from "@/services/statistics.service"
import { IStatisticsData } from "@/types/statistics.type"
import {
  Users,
  Plane,
  UtensilsCrossed,
  FileText,
  Link,
  UserPlus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Loader2,
} from "lucide-react"

/**
 * @fileoverview Trang dashboard chính - hiển thị thống kê tổng quan hệ thống.
 * Tích hợp API thống kê để hiển thị dữ liệu thời gian thực.
 * @version 1.0.0
 * @since 2025-09-27
 * @author Dũng Đàm
 */

/**
 * Helper function để format số thành định dạng tiền tệ Việt Nam.
 * @param {number} amount - Số tiền cần format
 * @returns {string} - Chuỗi đã được format (ví dụ: "1.000.000đ")
 */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ'
}

/**
 * Component trang Dashboard chính.
 * Hiển thị thống kê khách hàng, doanh thu và các thao tác nhanh.
 */
export default function DashboardPage() {
  // State quản lý dữ liệu thống kê và trạng thái loading
  const [statisticsData, setStatisticsData] = useState<IStatisticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  /**
   * Hàm tải dữ liệu thống kê từ API.
   * Xử lý trạng thái loading và error.
   */
  const fetchStatistics = async () => {
    try {
      setIsLoading(true)
      const response = await getStatistics()
      
      if (response.code === 200 && response.data) {
        setStatisticsData(response.data)
      } else {
        toast({
          title: "Lỗi",
          description: response.message || "Không thể tải dữ liệu thống kê",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Đã có lỗi xảy ra khi tải dữ liệu thống kê",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Tải dữ liệu khi component được mount
  useEffect(() => {
    fetchStatistics()
  }, [])

  // Tạo dữ liệu cho các thẻ thống kê khách hàng từ API
  const customerStats = statisticsData ? [
    {
      title: "Tổng số khách đã up lên hệ thống",
      value: statisticsData.totalCustomers.toString(),
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Tổng số khách đã đăng ký tham gia hội nghị", 
      value: statisticsData.registeredCustomers.toString(),
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Tổng số khách đã đăng ký mua ghế",
      value: statisticsData.seatBookedCustomers.toString(),
      icon: Plane,
      color: "text-orange-600",
    },
  ] : []

  // Tạo dữ liệu cho các thẻ thống kê doanh thu từ API
  const revenueStats = statisticsData ? [
    {
      title: "Tiền bán ghế",
      value: formatCurrency(statisticsData.revenue.seatRevenue),
      icon: Plane,
      color: "text-blue-600",
    },
    {
      title: "Tiền bán đồ ăn", 
      value: formatCurrency(statisticsData.revenue.foodRevenue),
      icon: UtensilsCrossed,
      color: "text-orange-600",
    },
    {
      title: "Tổng tiền",
      value: formatCurrency(statisticsData.revenue.totalRevenue),
      icon: DollarSign,
      color: "text-green-600",
    },
  ] : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Thống kê</h1>
        <p className="text-gray-600">Thể hiện tổng số khách và số tiền</p>
      </div>

      {/* Customer Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          // Hiển thị skeleton loading cho 3 cards
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          customerStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Revenue Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Tổng số tiền</h2>
        <p className="text-gray-600 mb-4">Thống qua việc bán ghế và bán đồ ăn</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            // Hiển thị skeleton loading cho 3 cards doanh thu
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            revenueStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>

      {/* Chart */}
      <Card className="transition-all duration-500 hover:shadow-lg hover:scale-[1.02] animate-in fade-in-50 slide-in-from-bottom-4">
        <CardContent className="pt-6">
          <StatsChart />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <a
              href="/quan-ly-khach-moi"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium">Quản lý khách mời</span>
            </a>
            <a
              href="/quan-ly-ghe"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plane className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-sm font-medium">Quản lý ghế</span>
            </a>
            <a
              href="/quan-ly-do-an"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <UtensilsCrossed className="h-8 w-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium">Quản lý đồ ăn</span>
            </a>
            <a
              href="/quan-ly-tai-lieu"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="h-8 w-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium">Quản lý tài liệu</span>
            </a>
            <a
              href="/quan-ly-link-truc-tuyen"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Link className="h-8 w-8 text-indigo-600 mb-2" />
              <span className="text-sm font-medium">Link trực tuyến</span>
            </a>
            <a
              href="/dang-ky-ho"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <UserPlus className="h-8 w-8 text-red-600 mb-2" />
              <span className="text-sm font-medium">Đăng ký hộ</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
