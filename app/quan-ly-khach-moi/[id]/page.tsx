"use client"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Star, Mail, Phone, User, Briefcase, Calendar, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

/**
 * Trang chi tiết khách mời
 * Hiển thị thông tin chi tiết của một khách mời cụ thể
 */
export default function ChiTietKhachMoiPage() {
  const router = useRouter()
  const params = useParams()
  const khachId = params.id

  // Dữ liệu mẫu khách mời (trong thực tế sẽ fetch từ API)
  const khachMoi = {
    id: 1,
    ten: "Tran Phuong Thao",
    email: "tpt@gmail.com",
    soDienThoai: "0323 448 448",
    chucVu: "Giám đốc chi nhánh",
    gioiTinh: "Nam",
    trangThai: "Đã đăng ký",
    isVIP: true,
    avatar: "/woman-avatar.png",
    ngayDangKy: "15/12/2024",
    diaChi: "123 Đường ABC, Quận 1, TP.HCM",
    congTy: "Vietnam Airlines",
    ghiChu: "Khách VIP, cần hỗ trợ đặc biệt",
    lichSuHoatDong: [
      { ngay: "15/12/2024", hoatDong: "Đăng ký tham gia sự kiện" },
      { ngay: "14/12/2024", hoatDong: "Nhận thông tin mời" },
      { ngay: "13/12/2024", hoatDong: "Được thêm vào danh sách khách mời" },
    ],
  }

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={handleGoBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chi tiết khách mời</h1>
            <p className="text-sm text-gray-500">Thông tin chi tiết của {khachMoi.ten}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
            <Trash2 className="w-4 h-4 mr-2" />
            Xóa
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Thông tin cơ bản */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Thông tin cá nhân</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={khachMoi.avatar || "/placeholder.svg"} alt={khachMoi.ten} />
                  <AvatarFallback className="text-lg">
                    {khachMoi.ten
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                      <span>{khachMoi.ten}</span>
                      {khachMoi.isVIP && <Star className="w-5 h-5 text-yellow-400 fill-current" />}
                    </h3>
                    <Badge
                      variant={khachMoi.trangThai === "Đã đăng ký" ? "default" : "secondary"}
                      className={
                        khachMoi.trangThai === "Đã đăng ký"
                          ? "bg-green-100 text-green-800 mt-2"
                          : "bg-gray-100 text-gray-800 mt-2"
                      }
                    >
                      {khachMoi.trangThai}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-sm font-medium">{khachMoi.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Số điện thoại</p>
                        <p className="text-sm font-medium">{khachMoi.soDienThoai}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Chức vụ</p>
                        <p className="text-sm font-medium">{khachMoi.chucVu}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Giới tính</p>
                        <p className="text-sm font-medium">{khachMoi.gioiTinh}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thông tin bổ sung */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin bổ sung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Công ty</p>
                <p className="text-sm font-medium">{khachMoi.congTy}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Địa chỉ</p>
                <p className="text-sm font-medium">{khachMoi.diaChi}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Ghi chú</p>
                <p className="text-sm font-medium">{khachMoi.ghiChu}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Thông tin đăng ký */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Thông tin đăng ký</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Ngày đăng ký</p>
                  <p className="text-sm font-medium">{khachMoi.ngayDangKy}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Loại khách</p>
                  <p className="text-sm font-medium">{khachMoi.isVIP ? "VIP" : "Thường"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lịch sử hoạt động */}
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử hoạt động</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {khachMoi.lichSuHoatDong.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium">{item.hoatDong}</p>
                      <p className="text-xs text-gray-500">{item.ngay}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
