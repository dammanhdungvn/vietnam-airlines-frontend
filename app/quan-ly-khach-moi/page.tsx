"use client"

import type React from "react"

import { useState, useMemo, useRef } from "react"
import { Search, Filter, Upload, Plus, Star, Trash2, Edit, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"

/**
 * Trang Quản lý khách mời
 * Hiển thị danh sách khách mời với các tính năng lọc, tìm kiếm và quản lý
 */
export default function QuanLyKhachMoiPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["Trạng thái", "VIP"])
  const [sortBy, setSortBy] = useState("Tên")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedGuest, setSelectedGuest] = useState<any>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    personId: "",
    email: "",
    fullName: "",
    phone: "",
    position: "",
    seatId: 0,
    avatarUrl: "",
    status: "TRUE",
    isVip: "TRUE",
    gender: "MALE",
  })

  const availableFilters = [
    { id: "Trạng thái", label: "Trạng thái" },
    { id: "VIP", label: "VIP" },
    { id: "Giới tính", label: "Giới tính" },
    { id: "Chức vụ", label: "Chức vụ" },
  ]

  // Dữ liệu mẫu khách mời
  const khachMoi = [
    {
      id: 1,
      ten: "Tran Phuong Thao",
      email: "tpt@gmail.com",
      soDienThoai: "0323 448 448",
      chucVu: "Giám đốc chi nhánh",
      gioiTinh: "Nam",
      trangThai: "Đã đăng ký",
      isVIP: true,
      avatar: "/woman-avatar.png",
    },
    {
      id: 2,
      ten: "Nguyen Van A",
      email: "nguyenvana@gmail.com",
      soDienThoai: "0323 448 448",
      chucVu: "Quản lý cơ sở 1",
      gioiTinh: "Nam",
      trangThai: "Hủy đăng ký",
      isVIP: true,
      avatar: "/man-avatar.png",
    },
    {
      id: 3,
      ten: "Nguyen Van B",
      email: "nguyenvanb@gmail.com",
      soDienThoai: "0323 448 448",
      chucVu: "Nhân viên phòng",
      gioiTinh: "Khác",
      trangThai: "Đã đăng ký",
      isVIP: false,
      avatar: "/diverse-person-avatar.png",
    },
    {
      id: 4,
      ten: "Nguyen Van C",
      email: "nguyenvanc@gmail.com",
      soDienThoai: "0323 448 448",
      chucVu: "Chức vụ 1",
      gioiTinh: "Nữ",
      trangThai: "Hủy đăng ký",
      isVIP: false,
      avatar: "/woman-avatar.png",
    },
    {
      id: 5,
      ten: "Nguyen Van D",
      email: "nguyenvand@gmail.com",
      soDienThoai: "0323 448 448",
      chucVu: "Chức vụ 2",
      gioiTinh: "Nữ",
      trangThai: "Hủy đăng ký",
      isVIP: true,
      avatar: "/woman-avatar.png",
    },
    {
      id: 6,
      ten: "Nguyen Van E",
      email: "nguyenvane@gmail.com",
      soDienThoai: "0323 448 448",
      chucVu: "Chức vụ 3",
      gioiTinh: "Khác",
      trangThai: "Đã đăng ký",
      isVIP: false,
      avatar: "/diverse-person-avatar.png",
    },
    {
      id: 7,
      ten: "Nguyen Van F",
      email: "nguyenvanf@gmail.com",
      soDienThoai: "0323 448 448",
      chucVu: "Chức vụ 4",
      gioiTinh: "Nữ",
      trangThai: "Hủy đăng ký",
      isVIP: true,
      avatar: "/woman-avatar.png",
    },
    {
      id: 8,
      ten: "Nguyen Van G",
      email: "nguyenvang@gmail.com",
      soDienThoai: "0323 448 448",
      chucVu: "Chức vụ 5",
      gioiTinh: "Nữ",
      trangThai: "Đã đăng ký",
      isVIP: false,
      avatar: "/woman-avatar.png",
    },
    {
      id: 9,
      ten: "Nguyen Van H",
      email: "nguyenvanh@gmail.com",
      soDienThoai: "0323 448 448",
      chucVu: "Chức vụ 6",
      gioiTinh: "Nam",
      trangThai: "Hủy đăng ký",
      isVIP: true,
      avatar: "/man-avatar.png",
    },
  ]

  const filteredKhachMoi = useMemo(() => {
    let filtered = khachMoi

    // Filter theo search term
    if (searchTerm) {
      filtered = filtered.filter(
        (khach) =>
          khach.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
          khach.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          khach.chucVu.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter theo VIP nếu được chọn
    if (selectedFilters.includes("VIP")) {
      filtered = filtered.filter((khach) => khach.isVIP)
    }

    // Filter theo trạng thái nếu được chọn
    if (selectedFilters.includes("Trạng thái")) {
      filtered = filtered.filter((khach) => khach.trangThai === "Đã đăng ký")
    }

    if (selectedFilters.includes("Giới tính")) {
      filtered = filtered.filter((khach) => khach.gioiTinh === "Nam")
    }

    if (selectedFilters.includes("Chức vụ")) {
      filtered = filtered.filter((khach) => khach.chucVu.includes("Giám đốc"))
    }

    // Sort theo tiêu chí được chọn
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "Tên":
          return a.ten.localeCompare(b.ten)
        case "Email":
          return a.email.localeCompare(b.email)
        case "Chức vụ":
          return a.chucVu.localeCompare(b.chucVu)
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, selectedFilters, sortBy])

  const removeFilter = (filter: string) => {
    setSelectedFilters(selectedFilters.filter((f) => f !== filter))
  }

  const toggleFilter = (filterId: string) => {
    setSelectedFilters((prev) => (prev.includes(filterId) ? prev.filter((f) => f !== filterId) : [...prev, filterId]))
  }

  const handleViewDetails = (khachId: number) => {
    router.push(`/quan-ly-khach-moi/${khachId}`)
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setAvatarPreview(result)
        setFormData((prev) => ({
          ...prev,
          avatarUrl: result, // Lưu base64 string vào avatarUrl
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClickUpload = () => {
    fileInputRef.current?.click()
  }

  const handleSubmitForm = () => {
    console.log("Thêm khách mời:", formData)
    console.log("Avatar file:", avatarFile)
    // Logic thêm khách mời vào database
    setShowAddModal(false)
    resetForm()
  }

  const handleEditGuest = (guest: any) => {
    setSelectedGuest(guest)
    setFormData({
      personId: `GUEST${guest.id.toString().padStart(3, "0")}`,
      email: guest.email,
      fullName: guest.ten,
      phone: guest.soDienThoai,
      position: guest.chucVu,
      seatId: guest.id,
      avatarUrl: guest.avatar,
      status: guest.trangThai === "Đã đăng ký" ? "TRUE" : "FALSE",
      isVip: guest.isVIP ? "TRUE" : "FALSE",
      gender: guest.gioiTinh === "Nam" ? "MALE" : guest.gioiTinh === "Nữ" ? "FEMALE" : "OTHER",
    })
    setAvatarPreview(guest.avatar)
    setShowEditModal(true)
  }

  const handleEditSubmit = () => {
    console.log("Sửa khách mời:", formData, selectedGuest)
    // Logic cập nhật khách mời trong database
    setShowEditModal(false)
    resetForm()
    setSelectedGuest(null)
  }

  const handleDeleteGuest = (guest: any) => {
    console.log("Xóa khách mời:", guest)
    // Logic xóa khách mời khỏi database
  }

  const resetForm = () => {
    setFormData({
      personId: "",
      email: "",
      fullName: "",
      phone: "",
      position: "",
      seatId: 0,
      avatarUrl: "",
      status: "TRUE",
      isVip: "TRUE",
      gender: "MALE",
    })
    setAvatarFile(null)
    setAvatarPreview("")
  }

  const handleImportFile = () => {
    // Tạo file mẫu CSV để download
    const csvContent = `personId,email,fullName,phone,position,seatId,avatarUrl,status,isVip,gender
GUEST001,example@email.com,Nguyen Van A,0123456789,Manager,1,/avatar.png,TRUE,TRUE,MALE
GUEST002,example2@email.com,Tran Thi B,0987654321,Staff,2,/avatar2.png,TRUE,FALSE,FEMALE`

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "import_khach_moi_template.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý khách mời</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={handleImportFile}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm mới
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 mb-6">
        {selectedFilters.map((filter) => (
          <Badge key={filter} variant="secondary" className="px-3 py-1">
            {filter}
            <button onClick={() => removeFilter(filter)} className="ml-2 text-gray-500 hover:text-gray-700">
              ×
            </button>
          </Badge>
        ))}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More filters
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {availableFilters.map((filter) => (
              <DropdownMenuCheckboxItem
                key={filter.id}
                checked={selectedFilters.includes(filter.id)}
                onCheckedChange={() => toggleFilter(filter.id)}
              >
                {filter.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center space-x-2 ml-auto">
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="Tên">Tên</option>
            <option value="Email">Email</option>
            <option value="Chức vụ">Chức vụ</option>
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên khách mời
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số điện thoại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chức vụ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giới tính
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VIP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredKhachMoi.map((khach, index) => (
                <tr key={khach.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="mr-4 text-sm text-gray-500">{index + 1}</span>
                      <div>
                        <div
                          className="text-sm font-medium text-gray-900 cursor-pointer hover:text-orange-600"
                          onClick={() => handleViewDetails(khach.id)}
                        >
                          {khach.ten}
                        </div>
                        <div className="text-sm text-gray-500">{khach.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{khach.soDienThoai}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{khach.chucVu}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{khach.gioiTinh}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={khach.trangThai === "Đã đăng ký" ? "default" : "secondary"}
                      className={
                        khach.trangThai === "Đã đăng ký" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }
                    >
                      {khach.trangThai}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {khach.isVIP && <Star className="w-5 h-5 text-yellow-400 fill-current" />}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xác nhận xóa khách mời</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc chắn muốn xóa khách mời "{khach.ten}"? Hành động này không thể hoàn tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteGuest(khach)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Xóa
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Button variant="ghost" size="sm" onClick={() => handleEditGuest(khach)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <Button variant="outline" size="sm">
            ← Previous
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="bg-orange-500 text-white">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <span className="text-sm text-gray-500">...</span>
            <Button variant="outline" size="sm">
              8
            </Button>
            <Button variant="outline" size="sm">
              9
            </Button>
            <Button variant="outline" size="sm">
              10
            </Button>
          </div>
          <Button variant="outline" size="sm">
            Next →
          </Button>
        </div>
      </div>

      {/* Modal form thêm khách mời */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thêm khách mời mới</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Person ID</label>
              <Input
                value={formData.personId}
                onChange={(e) => handleInputChange("personId", e.target.value)}
                placeholder="Nhập Person ID"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Nhập email"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Họ và tên</label>
              <Input
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Nhập họ và tên"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Số điện thoại</label>
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Chức vụ</label>
              <Input
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                placeholder="Nhập chức vụ"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Seat ID</label>
              <Input
                type="number"
                value={formData.seatId}
                onChange={(e) => handleInputChange("seatId", Number.parseInt(e.target.value) || 0)}
                placeholder="Nhập Seat ID"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Giới tính</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
              >
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Trạng thái</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
              >
                <option value="TRUE">Hoạt động</option>
                <option value="FALSE">Không hoạt động</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">VIP</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.isVip}
                onChange={(e) => handleInputChange("isVip", e.target.value)}
              >
                <option value="TRUE">VIP</option>
                <option value="FALSE">Thường</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Avatar</label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors"
                onClick={handleClickUpload}
              >
                {avatarPreview ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={avatarPreview || "/placeholder.svg"}
                      alt="Avatar preview"
                      className="w-20 h-20 rounded-full object-cover mb-2"
                    />
                    <p className="text-sm text-gray-600">Click để thay đổi ảnh</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click để chọn ảnh avatar</p>
                    <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmitForm} className="bg-orange-500 hover:bg-orange-600">
              Thêm khách mời
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal form sửa khách mời */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sửa thông tin khách mời</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Person ID</label>
              <Input
                value={formData.personId}
                onChange={(e) => handleInputChange("personId", e.target.value)}
                placeholder="Nhập Person ID"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Nhập email"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Họ và tên</label>
              <Input
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Nhập họ và tên"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Số điện thoại</label>
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Chức vụ</label>
              <Input
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                placeholder="Nhập chức vụ"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Seat ID</label>
              <Input
                type="number"
                value={formData.seatId}
                onChange={(e) => handleInputChange("seatId", Number.parseInt(e.target.value) || 0)}
                placeholder="Nhập Seat ID"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Giới tính</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
              >
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Trạng thái</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
              >
                <option value="TRUE">Hoạt động</option>
                <option value="FALSE">Không hoạt động</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">VIP</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.isVip}
                onChange={(e) => handleInputChange("isVip", e.target.value)}
              >
                <option value="TRUE">VIP</option>
                <option value="FALSE">Thường</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Avatar</label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors"
                onClick={handleClickUpload}
              >
                {avatarPreview ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={avatarPreview || "/placeholder.svg"}
                      alt="Avatar preview"
                      className="w-20 h-20 rounded-full object-cover mb-2"
                    />
                    <p className="text-sm text-gray-600">Click để thay đổi ảnh</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click để chọn ảnh avatar</p>
                    <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Hủy
            </Button>
            <Button onClick={handleEditSubmit} className="bg-orange-500 hover:bg-orange-600">
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
