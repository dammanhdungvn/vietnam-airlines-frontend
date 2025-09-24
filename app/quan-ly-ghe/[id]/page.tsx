"use client"
import { ArrowLeft, Mail, Phone, Calendar, MapPin, User, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

export default function ChiTietGhePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const gheId = Number.parseInt(params.id)

  // Dữ liệu mẫu ghế (trong thực tế sẽ fetch từ API)
  const gheData = {
    id: gheId,
    so: gheId,
    loaiGhe: "1A",
    badge: "VIP",
    giaDuRa: "100.000đ",
    giaKhachTra: "100.000đ",
    nguoiDatCho: {
      ten: "Tran Phuong Thao",
      email: "tpt@gmail.com",
      sdt: "+84 123 456 789",
      avatar: "/woman-avatar.png",
      diaChi: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
      cccd: "123456789012",
      ngaySinh: "15/03/1990",
    },
    thongTinChuyenBay: {
      maChuyenBay: "VN123",
      tuyen: "HCM → HAN",
      ngayBay: "15/12/2024",
      gioBay: "14:30",
      gioHaCanh: "16:45",
    },
    ngayTao: "30/10/2025",
    ngaySua: "30/10/2025",
    trangThai: "Đã xác nhận",
  }

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "VIP":
        return "bg-yellow-100 text-yellow-800"
      case "Thường":
        return "bg-teal-100 text-teal-800"
      case "Free":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chi tiết ghế {gheData.loaiGhe}</h1>
            <p className="text-gray-600">Thông tin chi tiết về ghế và người đặt chỗ</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            Chỉnh sửa
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
            Hủy đặt chỗ
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Thông tin khách hàng */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Thông tin khách hàng</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={gheData.nguoiDatCho.avatar || "/placeholder.svg"} alt={gheData.nguoiDatCho.ten} />
                  <AvatarFallback>{gheData.nguoiDatCho.ten.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{gheData.nguoiDatCho.ten}</h3>
                    <p className="text-gray-600">CCCD: {gheData.nguoiDatCho.cccd}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{gheData.nguoiDatCho.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{gheData.nguoiDatCho.sdt}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Sinh: {gheData.nguoiDatCho.ngaySinh}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{gheData.nguoiDatCho.diaChi}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thông tin chuyến bay */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plane className="w-5 h-5" />
                <span>Thông tin chuyến bay</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Mã chuyến bay</label>
                  <p className="text-lg font-semibold text-gray-900">{gheData.thongTinChuyenBay.maChuyenBay}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tuyến bay</label>
                  <p className="text-lg font-semibold text-gray-900">{gheData.thongTinChuyenBay.tuyen}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Ngày bay</label>
                  <p className="text-lg font-semibold text-gray-900">{gheData.thongTinChuyenBay.ngayBay}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Giờ bay</label>
                  <p className="text-lg font-semibold text-gray-900">
                    {gheData.thongTinChuyenBay.gioBay} - {gheData.thongTinChuyenBay.gioHaCanh}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Thông tin ghế */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin ghế</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Số ghế</label>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-2xl font-bold text-gray-900">{gheData.loaiGhe}</p>
                  <Badge className={getBadgeColor(gheData.badge)}>{gheData.badge}</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Trạng thái</label>
                <p className="text-lg font-semibold text-green-600">{gheData.trangThai}</p>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Giá dự ra:</span>
                  <span className="font-medium">{gheData.giaDuRa}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Giá khách trả:</span>
                  <span className="font-bold text-lg text-green-600">{gheData.giaKhachTra}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lịch sử</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Ngày tạo</label>
                <p className="text-sm text-gray-900">{gheData.ngayTao}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Ngày sửa cuối</label>
                <p className="text-sm text-gray-900">{gheData.ngaySua}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
