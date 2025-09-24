"use client"

import { useState, useMemo } from "react"
import { Search, Filter, Download, Plus, Trash2, Edit, RefreshCw, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

interface GheData {
  id: number
  so: number
  loaiGhe: string
  badge: string
  giaDuRa: string
  giaKhachTra: string
  nguoiDatCho: {
    ten: string
    email: string
    avatar: string
  }
  ngayTao: string
  ngaySua: string
}

/**
 * Trang Quản lý ghế
 * Hiển thị danh sách ghế đã đặt với thông tin khách hàng và giá cả
 */
export default function QuanLyGhePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("Tên số ghế")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const router = useRouter()

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedGhe, setSelectedGhe] = useState<GheData | null>(null)
  const [editFormData, setEditFormData] = useState({
    loaiGhe: "",
    badge: "",
    giaDuRa: "",
    giaKhachTra: "",
  })

  const [danhSachGhe, setDanhSachGhe] = useState<GheData[]>([
    {
      id: 1,
      so: 1,
      loaiGhe: "1A",
      badge: "VIP",
      giaDuRa: "100.000đ",
      giaKhachTra: "100.000đ",
      nguoiDatCho: {
        ten: "Tran Phuong Thao",
        email: "tpt@gmail.com",
        avatar: "/woman-avatar.png",
      },
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
    },
    {
      id: 2,
      so: 2,
      loaiGhe: "2C",
      badge: "VIP",
      giaDuRa: "100.000đ",
      giaKhachTra: "100.000đ",
      nguoiDatCho: {
        ten: "Nguyen Van A",
        email: "nguyenvana@gmail.com",
        avatar: "/man-avatar.png",
      },
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
    },
    {
      id: 3,
      so: 3,
      loaiGhe: "4B",
      badge: "Thường",
      giaDuRa: "100.000đ",
      giaKhachTra: "100.000đ",
      nguoiDatCho: {
        ten: "Nguyen Van B",
        email: "nguyenvanb@gmail.com",
        avatar: "/diverse-person-avatar.png",
      },
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
    },
    {
      id: 4,
      so: 4,
      loaiGhe: "2A",
      badge: "VIP",
      giaDuRa: "100.000đ",
      giaKhachTra: "100.000đ",
      nguoiDatCho: {
        ten: "Nguyen Van C",
        email: "nguyenvanc@gmail.com",
        avatar: "/woman-avatar.png",
      },
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
    },
    {
      id: 5,
      so: 5,
      loaiGhe: "9M",
      badge: "Free",
      giaDuRa: "0đ",
      giaKhachTra: "0đ",
      nguoiDatCho: {
        ten: "Nguyen Van D",
        email: "nguyenvand@gmail.com",
        avatar: "/woman-avatar.png",
      },
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
    },
    {
      id: 6,
      so: 6,
      loaiGhe: "10C",
      badge: "Free",
      giaDuRa: "0đ",
      giaKhachTra: "0đ",
      nguoiDatCho: {
        ten: "Nguyen Van E",
        email: "nguyenvane@gmail.com",
        avatar: "/diverse-person-avatar.png",
      },
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
    },
    {
      id: 7,
      so: 7,
      loaiGhe: "2Q",
      badge: "VIP",
      giaDuRa: "100.000đ",
      giaKhachTra: "200.000đ",
      nguoiDatCho: {
        ten: "Nguyen Van F",
        email: "nguyenvanf@gmail.com",
        avatar: "/woman-avatar.png",
      },
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
    },
    {
      id: 8,
      so: 8,
      loaiGhe: "5C",
      badge: "Thường",
      giaDuRa: "100.000đ",
      giaKhachTra: "500.000đ",
      nguoiDatCho: {
        ten: "Nguyen Van G",
        email: "nguyenvang@gmail.com",
        avatar: "/woman-avatar.png",
      },
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
    },
    {
      id: 9,
      so: 9,
      loaiGhe: "2X",
      badge: "VIP",
      giaDuRa: "100.000đ",
      giaKhachTra: "600.000đ",
      nguoiDatCho: {
        ten: "Nguyen Van H",
        email: "nguyenvanh@gmail.com",
        avatar: "/man-avatar.png",
      },
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
    },
  ])

  const filteredDanhSachGhe = useMemo(() => {
    let filtered = danhSachGhe

    // Filter theo search term
    if (searchTerm) {
      filtered = filtered.filter(
        (ghe) =>
          ghe.loaiGhe.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ghe.nguoiDatCho.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ghe.nguoiDatCho.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedFilters.includes("VIP")) {
      filtered = filtered.filter((ghe) => ghe.badge === "VIP")
    }
    if (selectedFilters.includes("Thường")) {
      filtered = filtered.filter((ghe) => ghe.badge === "Thường")
    }
    if (selectedFilters.includes("Free")) {
      filtered = filtered.filter((ghe) => ghe.badge === "Free")
    }
    if (selectedFilters.includes("Có giá")) {
      filtered = filtered.filter((ghe) => ghe.giaDuRa !== "0đ")
    }

    // Sort theo tiêu chí được chọn
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "Tên số ghế":
          return a.loaiGhe.localeCompare(b.loaiGhe)
        case "Loại ghế":
          return a.badge.localeCompare(b.badge)
        case "Người đặt":
          return a.nguoiDatCho.ten.localeCompare(b.nguoiDatCho.ten)
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, selectedFilters, sortBy])

  const totalPages = Math.ceil(filteredDanhSachGhe.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredDanhSachGhe.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleViewDetail = (gheId: number) => {
    router.push(`/quan-ly-ghe/${gheId}`)
  }

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
  }

  const removeFilter = (filter: string) => {
    setSelectedFilters(selectedFilters.filter((f) => f !== filter))
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

  const handleEdit = (ghe: GheData) => {
    setSelectedGhe(ghe)
    setEditFormData({
      loaiGhe: ghe.loaiGhe,
      badge: ghe.badge,
      giaDuRa: ghe.giaDuRa,
      giaKhachTra: ghe.giaKhachTra,
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (ghe: GheData) => {
    setSelectedGhe(ghe)
    setIsDeleteDialogOpen(true)
  }

  const confirmEdit = () => {
    if (!selectedGhe) return

    const updatedDanhSach = danhSachGhe.map((ghe) =>
      ghe.id === selectedGhe.id
        ? {
            ...ghe,
            loaiGhe: editFormData.loaiGhe,
            badge: editFormData.badge,
            giaDuRa: editFormData.giaDuRa,
            giaKhachTra: editFormData.giaKhachTra,
            ngaySua: new Date().toLocaleDateString("vi-VN"),
          }
        : ghe,
    )

    setDanhSachGhe(updatedDanhSach)
    setIsEditDialogOpen(false)
    setSelectedGhe(null)

    toast({
      title: "Cập nhật thành công",
      description: `Đã cập nhật thông tin ghế ${editFormData.loaiGhe}`,
    })
  }

  const confirmDelete = () => {
    if (!selectedGhe) return

    const updatedDanhSach = danhSachGhe.filter((ghe) => ghe.id !== selectedGhe.id)
    setDanhSachGhe(updatedDanhSach)
    setIsDeleteDialogOpen(false)
    setSelectedGhe(null)

    toast({
      title: "Xóa thành công",
      description: `Đã xóa ghế ${selectedGhe.loaiGhe}`,
      variant: "destructive",
    })
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Ghế</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
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
        <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More filters
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuCheckboxItem
              checked={selectedFilters.includes("VIP")}
              onCheckedChange={() => toggleFilter("VIP")}
            >
              Ghế VIP
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedFilters.includes("Thường")}
              onCheckedChange={() => toggleFilter("Thường")}
            >
              Ghế Thường
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedFilters.includes("Free")}
              onCheckedChange={() => toggleFilter("Free")}
            >
              Ghế Free
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedFilters.includes("Có giá")}
              onCheckedChange={() => toggleFilter("Có giá")}
            >
              Ghế có giá
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center space-x-2 ml-auto">
          <Select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tên số ghế">Tên số ghế</SelectItem>
              <SelectItem value="Loại ghế">Loại ghế</SelectItem>
              <SelectItem value="Người đặt">Người đặt</SelectItem>
            </SelectContent>
          </Select>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại ghế
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá dự ra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá khách trả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người đặt chỗ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày sửa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((ghe) => (
                <tr key={ghe.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ghe.so}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{ghe.loaiGhe}</span>
                      <Badge className={getBadgeColor(ghe.badge)}>{ghe.badge}</Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ghe.giaDuRa}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ghe.giaKhachTra}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <button
                        onClick={() => handleViewDetail(ghe.id)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {ghe.nguoiDatCho.ten}
                      </button>
                      <div className="text-sm text-gray-500">{ghe.nguoiDatCho.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ghe.ngayTao}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ghe.ngaySua}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(ghe)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(ghe)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
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
          <Button variant="outline" size="sm" onClick={handlePrevious} disabled={currentPage === 1}>
            ← Previous
          </Button>
          <div className="flex items-center space-x-2">
            {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page)}
                className={currentPage === page ? "bg-orange-500 text-white" : ""}
              >
                {page}
              </Button>
            ))}
            {totalPages > 10 && (
              <>
                <span className="text-sm text-gray-500">...</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  className={currentPage === totalPages ? "bg-orange-500 text-white" : ""}
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={handleNext} disabled={currentPage === totalPages}>
            Next →
          </Button>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sửa thông tin ghế</DialogTitle>
            <DialogDescription>Cập nhật thông tin ghế {selectedGhe?.loaiGhe}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="loaiGhe" className="text-right">
                Loại ghế
              </Label>
              <Input
                id="loaiGhe"
                value={editFormData.loaiGhe}
                onChange={(e) => setEditFormData({ ...editFormData, loaiGhe: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="badge" className="text-right">
                Hạng ghế
              </Label>
              <Select
                value={editFormData.badge}
                onValueChange={(value) => setEditFormData({ ...editFormData, badge: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn hạng ghế" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="Thường">Thường</SelectItem>
                  <SelectItem value="Free">Free</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="giaDuRa" className="text-right">
                Giá dự ra
              </Label>
              <Input
                id="giaDuRa"
                value={editFormData.giaDuRa}
                onChange={(e) => setEditFormData({ ...editFormData, giaDuRa: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="giaKhachTra" className="text-right">
                Giá khách trả
              </Label>
              <Input
                id="giaKhachTra"
                value={editFormData.giaKhachTra}
                onChange={(e) => setEditFormData({ ...editFormData, giaKhachTra: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={confirmEdit} className="bg-orange-500 hover:bg-orange-600">
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa ghế {selectedGhe?.loaiGhe}? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
