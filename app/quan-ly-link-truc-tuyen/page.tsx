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

interface LinkData {
  id: number
  tenLink: string
  ghiChu: string
  ngayTao: string
  ngaySua: string
  category: string
}

/**
 * Trang Quản lý link trực tuyến
 * Hiển thị danh sách các link trực tuyến với ghi chú và ngày tạo/sửa
 */
export default function QuanLyLinkTrucTuyenPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("tenLink")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedLink, setSelectedLink] = useState<LinkData | null>(null)
  const [editFormData, setEditFormData] = useState({
    tenLink: "",
    ghiChu: "",
    category: "",
  })

  const [danhSachLink, setDanhSachLink] = useState<LinkData[]>([
    {
      id: 1,
      tenLink: "Link 1",
      ghiChu: "Lorem ipsum triska blogg, lament. Vänat dedorad för lavis. Egorat nigt.",
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
      category: "Meeting",
    },
    {
      id: 2,
      tenLink: "Link 2",
      ghiChu: "Lorem ipsum triska blogg, lament. Vänat dedorad för lavis. Egorat nigt.",
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
      category: "Document",
    },
    {
      id: 3,
      tenLink: "Link 3",
      ghiChu: "Lorem ipsum triska blogg, lament. Vänat dedorad för lavis. Egorat nigt.",
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
      category: "Meeting",
    },
    {
      id: 4,
      tenLink: "Link 4",
      ghiChu: "Lorem ipsum triska blogg, lament. Vänat dedorad för lavis. Egorat nigt.",
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
      category: "Resource",
    },
    {
      id: 5,
      tenLink: "Link 5",
      ghiChu: "Lorem ipsum triska blogg, lament. Vänat dedorad för lavis. Egorat nigt.",
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
      category: "Document",
    },
    {
      id: 6,
      tenLink: "Link 6",
      ghiChu: "Lorem ipsum triska blogg, lament. Vänat dedorad för lavis. Egorat nigt.",
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
      category: "Meeting",
    },
    {
      id: 7,
      tenLink: "Link 7",
      ghiChu: "Lorem ipsum triska blogg, lament. Vänat dedorad för lavis. Egorat nigt.",
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
      category: "Resource",
    },
    {
      id: 8,
      tenLink: "Link 8",
      ghiChu: "Lorem ipsum triska blogg, lament. Vänat dedorad för lavis. Egorat nigt.",
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
      category: "Document",
    },
    {
      id: 9,
      tenLink: "Link 9",
      ghiChu: "Lorem ipsum triska blogg, lament. Vänat dedorad för lavis. Egorat nigt.",
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
      category: "Meeting",
    },
  ])

  const filteredData = useMemo(() => {
    let filtered = danhSachLink

    // Lọc theo search term
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.tenLink.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.ghiChu.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedFilters.length > 0) {
      filtered = filtered.filter((item) => selectedFilters.includes(item.category))
    }

    // Sắp xếp theo sortBy
    filtered.sort((a, b) => {
      if (sortBy === "tenLink") return a.tenLink.localeCompare(b.tenLink)
      if (sortBy === "ghiChu") return a.ghiChu.localeCompare(b.ghiChu)
      if (sortBy === "ngayTao") return a.ngayTao.localeCompare(b.ngayTao)
      if (sortBy === "category") return a.category.localeCompare(b.category)
      return 0
    })

    return filtered
  }, [searchTerm, selectedFilters, sortBy, danhSachLink])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredData.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
    setCurrentPage(1)
  }

  const removeFilter = (filter: string) => {
    setSelectedFilters((prev) => prev.filter((f) => f !== filter))
    setCurrentPage(1)
  }

  const handleEdit = (link: LinkData) => {
    setSelectedLink(link)
    setEditFormData({
      tenLink: link.tenLink,
      ghiChu: link.ghiChu,
      category: link.category,
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (link: LinkData) => {
    setSelectedLink(link)
    setIsDeleteDialogOpen(true)
  }

  const confirmEdit = () => {
    if (!selectedLink) return

    const updatedDanhSach = danhSachLink.map((link) =>
      link.id === selectedLink.id
        ? {
            ...link,
            tenLink: editFormData.tenLink,
            ghiChu: editFormData.ghiChu,
            category: editFormData.category,
            ngaySua: new Date().toLocaleDateString("vi-VN"),
          }
        : link,
    )

    setDanhSachLink(updatedDanhSach)
    setIsEditDialogOpen(false)
    setSelectedLink(null)

    toast({
      title: "Cập nhật thành công",
      description: `Đã cập nhật thông tin link ${editFormData.tenLink}`,
    })
  }

  const confirmDelete = () => {
    if (!selectedLink) return

    const updatedDanhSach = danhSachLink.filter((link) => link.id !== selectedLink.id)
    setDanhSachLink(updatedDanhSach)
    setIsDeleteDialogOpen(false)
    setSelectedLink(null)

    toast({
      title: "Xóa thành công",
      description: `Đã xóa link ${selectedLink.tenLink}`,
      variant: "destructive",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý link trực tuyến</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            Thêm link
          </Button>
        </div>
      </div>

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
              checked={selectedFilters.includes("Meeting")}
              onCheckedChange={() => toggleFilter("Meeting")}
            >
              Meeting
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedFilters.includes("Document")}
              onCheckedChange={() => toggleFilter("Document")}
            >
              Document
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedFilters.includes("Resource")}
              onCheckedChange={() => toggleFilter("Resource")}
            >
              Resource
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center space-x-2 ml-auto">
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="tenLink">Tên link</option>
            <option value="ghiChu">Ghi chú</option>
            <option value="ngayTao">Ngày tạo</option>
            <option value="category">Danh mục</option>
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
                  Tên link
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ghi chú
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
              {currentItems.map((link, index) => (
                <tr key={link.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="mr-4 text-sm text-gray-500">{startIndex + index + 1}</span>
                      <span className="text-sm font-medium text-gray-900">{link.tenLink}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                    <div className="truncate">{link.ghiChu}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{link.ngayTao}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{link.ngaySua}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(link)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(link)}
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sửa thông tin link</DialogTitle>
            <DialogDescription>Cập nhật thông tin link {selectedLink?.tenLink}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tenLink" className="text-right">
                Tên link
              </Label>
              <Input
                id="tenLink"
                value={editFormData.tenLink}
                onChange={(e) => setEditFormData({ ...editFormData, tenLink: e.target.value })}
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
                  <SelectItem value="Meeting">Meeting</SelectItem>
                  <SelectItem value="Document">Document</SelectItem>
                  <SelectItem value="Resource">Resource</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ghiChu" className="text-right">
                Ghi chú
              </Label>
              <Textarea
                id="ghiChu"
                value={editFormData.ghiChu}
                onChange={(e) => setEditFormData({ ...editFormData, ghiChu: e.target.value })}
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa link {selectedLink?.tenLink}? Hành động này không thể hoàn tác.
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
