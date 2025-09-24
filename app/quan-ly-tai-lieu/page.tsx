"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Search, Filter, Download, Plus, Trash2, Edit, FileText, File, X, Upload, Eye, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { toast } from "@/hooks/use-toast"

interface TaiLieuData {
  id: number
  tenTaiLieu: string
  tacGia: string
  link: string
  ngayTao: string
  ngaySua: string
  loaiFile: string
}

/**
 * Trang Quản lý tài liệu
 * Hiển thị danh sách tài liệu với các loại file khác nhau
 */
export default function QuanLyTaiLieuPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("tenTaiLieu")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<TaiLieuData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const [formData, setFormData] = useState({
    documentName: "",
    author: "",
    file: null as File | null,
  })

  const [danhSachTaiLieu, setDanhSachTaiLieu] = useState<TaiLieuData[]>([
    {
      id: 1,
      tenTaiLieu: "Tài liệu 1",
      tacGia: "Nguyen Van A",
      link: "Preview",
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
      loaiFile: "PDF",
    },
    {
      id: 2,
      tenTaiLieu: "Tài liệu 2",
      tacGia: "Nguyen Van B",
      link: "Preview",
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
      loaiFile: "DOC",
    },
    {
      id: 3,
      tenTaiLieu: "Tài liệu 1",
      tacGia: "Nguyen Van C",
      link: "Preview",
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
      loaiFile: "PDF",
    },
    {
      id: 4,
      tenTaiLieu: "Tài liệu 2",
      tacGia: "Nguyen Van D",
      link: "Preview",
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
      loaiFile: "DOC",
    },
    {
      id: 5,
      tenTaiLieu: "Tài liệu 3",
      tacGia: "Nguyen Van E",
      link: "Preview",
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
      loaiFile: "EXCEL",
    },
    {
      id: 6,
      tenTaiLieu: "Tài liệu 1",
      tacGia: "Nguyen Van F",
      link: "Preview",
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
      loaiFile: "PDF",
    },
    {
      id: 7,
      tenTaiLieu: "Tài liệu 3",
      tacGia: "Nguyen Van I",
      link: "Preview",
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
      loaiFile: "EXCEL",
    },
    {
      id: 8,
      tenTaiLieu: "Tài liệu 3",
      tacGia: "Nguyen Van K",
      link: "Preview",
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
      loaiFile: "EXCEL",
    },
    {
      id: 9,
      tenTaiLieu: "Tài liệu 2",
      tacGia: "Nguyen Van L",
      link: "Preview",
      ngayTao: "30/10/2025",
      ngaySua: "30/10/2025",
      loaiFile: "DOC",
    },
  ])

  const filteredData = useMemo(() => {
    let filtered = danhSachTaiLieu

    // Lọc theo search term
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.tenTaiLieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tacGia.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.loaiFile.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Lọc theo active filters
    if (selectedFilters.length > 0) {
      filtered = filtered.filter((item) => selectedFilters.includes(item.loaiFile))
    }

    // Sắp xếp theo sortBy
    filtered.sort((a, b) => {
      if (sortBy === "tenTaiLieu") return a.tenTaiLieu.localeCompare(b.tenTaiLieu)
      if (sortBy === "tacGia") return a.tacGia.localeCompare(b.tacGia)
      if (sortBy === "loaiFile") return a.loaiFile.localeCompare(b.loaiFile)
      return 0
    })

    return filtered
  }, [searchTerm, selectedFilters, sortBy, danhSachTaiLieu])

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

  const getFileIcon = (loaiFile: string) => {
    switch (loaiFile) {
      case "PDF":
        return (
          <div className="w-6 h-6 bg-red-500 text-white text-xs font-bold rounded flex items-center justify-center">
            PDF
          </div>
        )
      case "DOC":
        return <File className="w-6 h-6 text-blue-500" />
      case "EXCEL":
        return (
          <div className="w-6 h-6 bg-green-500 text-white text-xs font-bold rounded flex items-center justify-center">
            XLS
          </div>
        )
      default:
        return <FileText className="w-6 h-6 text-gray-500" />
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, file }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newDocument: TaiLieuData = {
      id: Math.max(...danhSachTaiLieu.map((d) => d.id)) + 1,
      tenTaiLieu: formData.documentName,
      tacGia: formData.author,
      link: "Preview",
      ngayTao: new Date().toLocaleDateString("vi-VN"),
      ngaySua: new Date().toLocaleDateString("vi-VN"),
      loaiFile: formData.file ? getFileType(formData.file.name) : "PDF",
    }

    setDanhSachTaiLieu((prev) => [...prev, newDocument])

    toast({
      title: "Thêm thành công",
      description: `Đã thêm tài liệu "${formData.documentName}"`,
    })

    // Reset form và đóng modal
    setFormData({ documentName: "", author: "", file: null })
    setIsAddModalOpen(false)
  }

  const getFileType = (fileName: string): string => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    switch (extension) {
      case "pdf":
        return "PDF"
      case "doc":
      case "docx":
        return "DOC"
      case "xls":
      case "xlsx":
        return "EXCEL"
      default:
        return "PDF"
    }
  }

  const handleEdit = (document: TaiLieuData) => {
    setSelectedDocument(document)
    setFormData({
      documentName: document.tenTaiLieu,
      author: document.tacGia,
      file: null,
    })
    setIsEditModalOpen(true)
  }

  const handlePreview = (document: TaiLieuData) => {
    setSelectedDocument(document)
    setIsPreviewModalOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDocument) return

    const updatedDanhSach = danhSachTaiLieu.map((doc) =>
      doc.id === selectedDocument.id
        ? {
            ...doc,
            tenTaiLieu: formData.documentName,
            tacGia: formData.author,
            loaiFile: formData.file ? getFileType(formData.file.name) : doc.loaiFile,
            ngaySua: new Date().toLocaleDateString("vi-VN"),
          }
        : doc,
    )

    setDanhSachTaiLieu(updatedDanhSach)

    toast({
      title: "Cập nhật thành công",
      description: `Đã cập nhật tài liệu "${formData.documentName}"`,
    })

    setFormData({ documentName: "", author: "", file: null })
    setIsEditModalOpen(false)
    setSelectedDocument(null)
  }

  const handleDelete = (document: TaiLieuData) => {
    const updatedDanhSach = danhSachTaiLieu.filter((doc) => doc.id !== document.id)
    setDanhSachTaiLieu(updatedDanhSach)

    toast({
      title: "Xóa thành công",
      description: `Đã xóa tài liệu "${document.tenTaiLieu}"`,
      variant: "destructive",
    })
  }

  const resetForm = () => {
    setFormData({ documentName: "", author: "", file: null })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý tài liệu</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Thêm tài liệu
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-gray-900">Thêm tài liệu mới</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  {/* Tên tài liệu */}
                  <div className="space-y-2">
                    <Label htmlFor="documentName" className="text-sm font-medium text-gray-700">
                      Tên tài liệu <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="documentName"
                      type="text"
                      placeholder="Nhập tên tài liệu"
                      value={formData.documentName}
                      onChange={(e) => handleInputChange("documentName", e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>

                  {/* Tên tác giả */}
                  <div className="space-y-2">
                    <Label htmlFor="author" className="text-sm font-medium text-gray-700">
                      Tên tác giả <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="author"
                      type="text"
                      placeholder="Nhập tên tác giả"
                      value={formData.author}
                      onChange={(e) => handleInputChange("author", e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>

                  {/* Upload file */}
                  <div className="space-y-2">
                    <Label htmlFor="file" className="text-sm font-medium text-gray-700">
                      Tài liệu đính kèm <span className="text-red-500">*</span>
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <input
                        id="file"
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                        required
                      />
                      <label htmlFor="file" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">
                          {formData.file ? formData.file.name : "Chọn file để tải lên"}
                        </p>
                        <p className="text-xs text-gray-500">Hỗ trợ: PDF, DOC, DOCX, XLS, XLSX (Tối đa 10MB)</p>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Form actions */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm()
                      setIsAddModalOpen(false)
                    }}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                    Thêm tài liệu
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        {selectedFilters.map((filter) => (
          <span
            key={filter}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {filter}
            <button
              onClick={() => removeFilter(filter)}
              className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
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
              checked={selectedFilters.includes("PDF")}
              onCheckedChange={() => toggleFilter("PDF")}
            >
              PDF
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedFilters.includes("DOC")}
              onCheckedChange={() => toggleFilter("DOC")}
            >
              DOC
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedFilters.includes("EXCEL")}
              onCheckedChange={() => toggleFilter("EXCEL")}
            >
              EXCEL
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center space-x-2 ml-auto">
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="tenTaiLieu">Tên tài liệu</option>
            <option value="tacGia">Tác giả</option>
            <option value="loaiFile">Loại file</option>
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
                  Tên tài liệu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tác giả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
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
              {currentItems.map((taiLieu, index) => (
                <tr key={taiLieu.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="mr-4 text-sm text-gray-500">{startIndex + index + 1}</span>
                      {getFileIcon(taiLieu.loaiFile)}
                      <span className="ml-3 text-sm font-medium text-gray-900">{taiLieu.tenTaiLieu}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{taiLieu.tacGia}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      variant="link"
                      className="text-blue-600 hover:text-blue-800 p-0"
                      onClick={() => handlePreview(taiLieu)}
                    >
                      {taiLieu.link}
                    </Button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{taiLieu.ngayTao}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{taiLieu.ngaySua}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xác nhận xóa tài liệu</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc chắn muốn xóa tài liệu "{taiLieu.tenTaiLieu}"? Hành động này không thể hoàn
                              tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(taiLieu)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Xóa
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(taiLieu)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePreview(taiLieu)}
                        className="text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Sửa tài liệu</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editDocumentName" className="text-sm font-medium text-gray-700">
                  Tên tài liệu <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="editDocumentName"
                  type="text"
                  placeholder="Nhập tên tài liệu"
                  value={formData.documentName}
                  onChange={(e) => handleInputChange("documentName", e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editAuthor" className="text-sm font-medium text-gray-700">
                  Tên tác giả <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="editAuthor"
                  type="text"
                  placeholder="Nhập tên tác giả"
                  value={formData.author}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editFile" className="text-sm font-medium text-gray-700">
                  Tài liệu đính kèm (tùy chọn)
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    id="editFile"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                  />
                  <label htmlFor="editFile" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">
                      {formData.file ? formData.file.name : "Chọn file mới (tùy chọn)"}
                    </p>
                    <p className="text-xs text-gray-500">Hỗ trợ: PDF, DOC, DOCX, XLS, XLSX (Tối đa 10MB)</p>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm()
                  setIsEditModalOpen(false)
                  setSelectedDocument(null)
                }}
              >
                Hủy
              </Button>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                Cập nhật
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Chi tiết tài liệu</DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Tên tài liệu</Label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-900">{selectedDocument.tenTaiLieu}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Tác giả</Label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-900">{selectedDocument.tacGia}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Loại file</Label>
                  <div className="p-3 bg-gray-50 rounded-lg flex items-center">
                    {getFileIcon(selectedDocument.loaiFile)}
                    <span className="ml-2 text-sm text-gray-900">{selectedDocument.loaiFile}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Ngày tạo</Label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-900">{selectedDocument.ngayTao}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Ngày sửa đổi</Label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-900">{selectedDocument.ngaySua}</p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsPreviewModalOpen(false)
                    setSelectedDocument(null)
                  }}
                >
                  Đóng
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    // Logic tải xuống file
                    console.log("Tải xuống:", selectedDocument)
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Tải xuống
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
