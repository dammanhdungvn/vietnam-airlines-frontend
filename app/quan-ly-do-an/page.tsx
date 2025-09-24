"use client"

import { useState, useMemo } from "react"
import { Search, Filter, Download, Plus, Trash2, Edit, ChevronDown } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

interface DoAnData {
  id: number
  tenMon: string
  gia: string
  chiTiet: string
  ngayTao: string
  ngaySua: string
  isFree: boolean
  category: string
}

/**
 * Trang Quản lý đồ ăn
 * Hiển thị danh sách thực đơn với giá cả và mô tả
 */
export default function QuanLyDoAnPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("Tên món")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedDoAn, setSelectedDoAn] = useState<DoAnData | null>(null)
  const [editFormData, setEditFormData] = useState({
    tenMon: "",
    gia: "",
    chiTiet: "",
    category: "",
    isFree: false,
  })

  const [danhSachDoAn, setDanhSachDoAn] = useState<DoAnData[]>([
    {
      id: 1,
      tenMon: "Cà phê",
      gia: "100.000đ",
      chiTiet: "Lorem ipsum triska blogg, lament. Vänat dedorad för lavis. Egorat nigt.",
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
      isFree: false,
      category: "Đồ uống",
    },
    {
      id: 2,
      tenMon: "Coca",
      gia: "100.000đ",
      chiTiet: "Lorem ipsum triska blogg, lament. Vänat dedorad för lavis. Egorat nigt.",
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
      isFree: false,
      category: "Đồ uống",
    },
    {
      id: 3,
      tenMon: "Sữa",
      gia: "100.000đ",
      chiTiet: "Lorem ipsum triska blogg, lament. Vänat dedorad för lavis. Egorat nigt.",
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
      isFree: false,
      category: "Đồ uống",
    },
    {
      id: 4,
      tenMon: "Bim Bim",
      gia: "100.000đ",
      chiTiet: "Lorem ipsum triska blogg, lament. Vänat dedorad för lavis. Egorat nigt.",
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
      isFree: false,
      category: "Đồ ăn vặt",
    },
    {
      id: 5,
      tenMon: "Bò khô",
      gia: "0đ",
      chiTiet: "Lorem ipsum triska blogg, lament. Vänat dedorad för lavis. Egorat nigt.",
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
      isFree: true,
      category: "Đồ ăn vặt",
    },
    {
      id: 6,
      tenMon: "Kem",
      gia: "0đ",
      chiTiet: "Lorem ipsum triska blogg, lament. Vänat dedorad för lavis. Egorat nigt.",
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
      isFree: true,
      category: "Tráng miệng",
    },
    {
      id: 7,
      tenMon: "Bóng ngô",
      gia: "100.000đ",
      chiTiet: "Lorem ipsum triska blogg, lament. Vänat dedorad för lavis. Egorat nigt.",
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
      isFree: false,
      category: "Đồ ăn vặt",
    },
    {
      id: 8,
      tenMon: "Pepsi",
      gia: "100.000đ",
      chiTiet: "Lorem ipsum triska blogg, lament. Vänat dedorad för lavis. Egorat nigt.",
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
      isFree: false,
      category: "Đồ uống",
    },
    {
      id: 9,
      tenMon: "Fanta",
      gia: "100.000đ",
      chiTiet: "Lorem ipsum triska blogg, lament. Vänat dedorad för lavis. Egorat nigt.",
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
      isFree: false,
      category: "Đồ uống",
    },
  ])

  const filteredDanhSachDoAn = useMemo(() => {
    let filtered = danhSachDoAn

    // Filter theo search term
    if (searchTerm) {
      filtered = filtered.filter(
        (mon) =>
          mon.tenMon.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mon.chiTiet.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedFilters.includes("Đồ uống")) {
      filtered = filtered.filter((mon) => mon.category === "Đồ uống")
    }
    if (selectedFilters.includes("Đồ ăn vặt")) {
      filtered = filtered.filter((mon) => mon.category === "Đồ ăn vặt")
    }
    if (selectedFilters.includes("Tráng miệng")) {
      filtered = filtered.filter((mon) => mon.category === "Tráng miệng")
    }
    if (selectedFilters.includes("Miễn phí")) {
      filtered = filtered.filter((mon) => mon.isFree)
    }
    if (selectedFilters.includes("Có phí")) {
      filtered = filtered.filter((mon) => !mon.isFree)
    }

    // Sort theo tiêu chí được chọn
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "Tên món":
          return a.tenMon.localeCompare(b.tenMon)
        case "Giá":
          const giaA = Number.parseInt(a.gia.replace(/[^\d]/g, "")) || 0
          const giaB = Number.parseInt(b.gia.replace(/[^\d]/g, "")) || 0
          return giaA - giaB
        case "Ngày tạo":
          return (
            new Date(a.ngayTao.split("/").reverse().join("-")).getTime() -
            new Date(b.ngayTao.split("/").reverse().join("-")).getTime()
          )
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, selectedFilters, sortBy, danhSachDoAn])

  const totalPages = Math.ceil(filteredDanhSachDoAn.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredDanhSachDoAn.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
    setCurrentPage(1)
  }

  const removeFilter = (filter: string) => {
    setSelectedFilters(selectedFilters.filter((f) => f !== filter))
    setCurrentPage(1)
  }

  const handleEdit = (doAn: DoAnData) => {
    setSelectedDoAn(doAn)
    setEditFormData({
      tenMon: doAn.tenMon,
      gia: doAn.gia,
      chiTiet: doAn.chiTiet,
      category: doAn.category,
      isFree: doAn.isFree,
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (doAn: DoAnData) => {
    setSelectedDoAn(doAn)
    setIsDeleteDialogOpen(true)
  }

  const confirmEdit = () => {
    if (!selectedDoAn) return

    const updatedDanhSach = danhSachDoAn.map((doAn) =>
      doAn.id === selectedDoAn.id
        ? {
            ...doAn,
            tenMon: editFormData.tenMon,
            gia: editFormData.isFree ? "0đ" : editFormData.gia,
            chiTiet: editFormData.chiTiet,
            category: editFormData.category,
            isFree: editFormData.isFree,
            ngaySua: new Date().toLocaleDateString("vi-VN"),
          }
        : doAn,
    )

    setDanhSachDoAn(updatedDanhSach)
    setIsEditDialogOpen(false)
    setSelectedDoAn(null)

    toast({
      title: "Cập nhật thành công",
      description: `Đã cập nhật thông tin món ${editFormData.tenMon}`,
    })
  }

  const confirmDelete = () => {
    if (!selectedDoAn) return

    const updatedDanhSach = danhSachDoAn.filter((doAn) => doAn.id !== selectedDoAn.id)
    setDanhSachDoAn(updatedDanhSach)
    setIsDeleteDialogOpen(false)
    setSelectedDoAn(null)

    toast({
      title: "Xóa thành công",
      description: `Đã xóa món ${selectedDoAn.tenMon}`,
      variant: "destructive",
    })
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đồ ăn</h1>
        </div>
        <div className="flex items-center space-x-3">
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

      {/* Search and Filter */}
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
              checked={selectedFilters.includes("Đồ uống")}
              onCheckedChange={() => toggleFilter("Đồ uống")}
            >
              Đồ uống
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedFilters.includes("Đồ ăn vặt")}
              onCheckedChange={() => toggleFilter("Đồ ăn vặt")}
            >
              Đồ ăn vặt
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedFilters.includes("Tráng miệng")}
              onCheckedChange={() => toggleFilter("Tráng miệng")}
            >
              Tráng miệng
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedFilters.includes("Miễn phí")}
              onCheckedChange={() => toggleFilter("Miễn phí")}
            >
              Miễn phí
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedFilters.includes("Có phí")}
              onCheckedChange={() => toggleFilter("Có phí")}
            >
              Có phí
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center space-x-2 ml-auto">
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="Tên món">Tên món</option>
            <option value="Giá">Giá</option>
            <option value="Ngày tạo">Ngày tạo</option>
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
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
                  Tên món
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chi tiết
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
              {currentItems.map((mon, index) => (
                <tr key={mon.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="mr-4 text-sm text-gray-500">{startIndex + index + 1}</span>
                      <span className="text-sm font-medium text-gray-900">{mon.tenMon}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mon.gia}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    <div className="truncate">{mon.chiTiet}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mon.ngayTao}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mon.ngaySua}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(mon)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(mon)}
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
          <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            ← Previous
          </Button>
          <div className="flex items-center space-x-2">
            {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
              const page = i + 1
              if (totalPages <= 10) {
                return (
                  <Button
                    key={page}
                    variant="outline"
                    size="sm"
                    className={currentPage === page ? "bg-orange-500 text-white" : ""}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </Button>
                )
              }

              // Logic cho nhiều trang
              if (page <= 3 || page > totalPages - 3 || Math.abs(page - currentPage) <= 1) {
                return (
                  <Button
                    key={page}
                    variant="outline"
                    size="sm"
                    className={currentPage === page ? "bg-orange-500 text-white" : ""}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </Button>
                )
              } else if (page === 4 && currentPage > 5) {
                return (
                  <span key="dots1" className="text-sm text-gray-500">
                    ...
                  </span>
                )
              } else if (page === totalPages - 3 && currentPage < totalPages - 4) {
                return (
                  <span key="dots2" className="text-sm text-gray-500">
                    ...
                  </span>
                )
              }
              return null
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next →
          </Button>
        </div>
      </div>

      {/* Dialog sửa thông tin đồ ăn */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Sửa thông tin đồ ăn</DialogTitle>
            <DialogDescription>Cập nhật thông tin món {selectedDoAn?.tenMon}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tenMon" className="text-right">
                Tên món
              </Label>
              <Input
                id="tenMon"
                value={editFormData.tenMon}
                onChange={(e) => setEditFormData({ ...editFormData, tenMon: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Danh mục
              </Label>
              <Select
                value={editFormData.category}
                onValueChange={(value) => setEditFormData({ ...editFormData, category: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Đồ uống">Đồ uống</SelectItem>
                  <SelectItem value="Đồ ăn vặt">Đồ ăn vặt</SelectItem>
                  <SelectItem value="Tráng miệng">Tráng miệng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Loại</Label>
              <div className="col-span-3 flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="isFree"
                    checked={!editFormData.isFree}
                    onChange={() => setEditFormData({ ...editFormData, isFree: false })}
                  />
                  <span>Có phí</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="isFree"
                    checked={editFormData.isFree}
                    onChange={() => setEditFormData({ ...editFormData, isFree: true, gia: "0đ" })}
                  />
                  <span>Miễn phí</span>
                </label>
              </div>
            </div>
            {!editFormData.isFree && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="gia" className="text-right">
                  Giá
                </Label>
                <Input
                  id="gia"
                  value={editFormData.gia}
                  onChange={(e) => setEditFormData({ ...editFormData, gia: e.target.value })}
                  className="col-span-3"
                  placeholder="VD: 100.000đ"
                />
              </div>
            )}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="chiTiet" className="text-right mt-2">
                Chi tiết
              </Label>
              <Textarea
                id="chiTiet"
                value={editFormData.chiTiet}
                onChange={(e) => setEditFormData({ ...editFormData, chiTiet: e.target.value })}
                className="col-span-3"
                rows={3}
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

      {/* Dialog xác nhận xóa */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa món {selectedDoAn?.tenMon}? Hành động này không thể hoàn tác.
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
