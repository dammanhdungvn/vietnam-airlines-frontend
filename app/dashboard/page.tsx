"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsChart } from "@/components/stats-chart"
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
} from "lucide-react"

/**
 * Trang dashboard chính - hiển thị thống kê tổng quan hệ thống
 */
export default function DashboardPage() {
  const customerStats = [
    {
      title: "Tổng số khách đã up lên hệ thống",
      value: "300",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Tổng số khách đã đăng ký tham gia hội nghị",
      value: "125",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Tổng số khách đã đăng ký mua ghế",
      value: "100",
      icon: Plane,
      color: "text-orange-600",
    },
  ]

  const revenueStats = [
    {
      title: "Tiền bán ghế",
      value: "5.000.000đ",
      change: "+7.2%",
      changeType: "positive",
      icon: Plane,
      color: "text-blue-600",
    },
    {
      title: "Tiền bán đồ ăn",
      value: "5.000.000đ",
      change: "-0.2%",
      changeType: "negative",
      icon: UtensilsCrossed,
      color: "text-orange-600",
    },
    {
      title: "Tổng tiền",
      value: "10.000.000đ",
      change: "+10.8%",
      changeType: "positive",
      icon: DollarSign,
      color: "text-green-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Thống kê</h1>
        <p className="text-gray-600">Thể hiện tổng số khách và số tiền</p>
      </div>

      {/* Customer Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {customerStats.map((stat, index) => {
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
        })}
      </div>

      {/* Revenue Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Tổng số tiền</h2>
        <p className="text-gray-600 mb-4">Thống qua việc bán ghế và bán đồ ăn</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {revenueStats.map((stat, index) => {
            const Icon = stat.icon
            const TrendIcon = stat.changeType === "positive" ? TrendingUp : TrendingDown
            return (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div
                    className={`flex items-center text-sm ${
                      stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <TrendIcon className="h-4 w-4 mr-1" />
                    {stat.change}
                  </div>
                </CardContent>
              </Card>
            )
          })}
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
