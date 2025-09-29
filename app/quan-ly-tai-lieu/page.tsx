"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import {
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  Edit,
  FileText,
  X,
  Upload,
  Eye,
  ChevronDown,
  Paperclip,
  Trash,
} from "lucide-react"
import { FileIcon, defaultStyles } from "react-file-icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
import { toast } from "sonner"
import { IDocument } from "@/types/document.type"
import {
  getAllDocuments,
  createOrUpdateDocument,
  deleteDocument,
  getDownloadUrl,
} from "@/services/document.service"

/**
 * Trang Quản lý tài liệu
 * Hiển thị danh sách tài liệu, cho phép thêm, sửa, xóa, xem và tải xuống.
 */
export default function QuanLyTaiLieuPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [documents, setDocuments] = useState<IDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)

  const [selectedDocument, setSelectedDocument] = useState<IDocument | null>(null)
  const [formData, setFormData] = useState({
    documentName: "",
    author: "",
    file: null as File | null,
  })
  const [filePreview, setFilePreview] = useState<string | null>(null)

  const fetchDocuments = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getAllDocuments()
      setDocuments(data)
    } catch (err) {
      setError("Không thể tải danh sách tài liệu.")
      toast.error("Không thể tải danh sách tài liệu từ máy chủ.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const filteredData = useMemo(() => {
    return documents.filter(
      (doc) =>
        doc.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.author.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [searchTerm, documents])

  const getFileExtension = (filePath: string): string => {
    return filePath.split(".").pop()?.toUpperCase() || "FILE"
  }

  const getFileIcon = (filePath: string) => {
    const extension = getFileExtension(filePath)
    return (
      <div className="w-8 h-8">
        <FileIcon extension={extension} {...defaultStyles[extension as any]} />
      </div>
    )
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, file }))
    if (file) {
      setFilePreview(URL.createObjectURL(file))
    } else {
      setFilePreview(null)
    }
  }

  const resetForm = () => {
    setFormData({ documentName: "", author: "", file: null })
    setSelectedDocument(null)
    setFilePreview(null)
  }

  const handleAdd = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const handleEdit = (document: IDocument) => {
    setSelectedDocument(document)
    setFormData({
      documentName: document.documentName,
      author: document.author,
      file: null, // File không được điền sẵn, người dùng phải chọn lại nếu muốn thay đổi
    })
    setIsModalOpen(true)
  }

  const handlePreview = (document: IDocument) => {
    window.open(document.fileUrl, "_blank")
  }

  const handleDownload = (id: number) => {
    window.open(getDownloadUrl(id), "_blank")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.documentName || !formData.author) {
      toast.error("Vui lòng điền đầy đủ tên tài liệu và tác giả.")
      return
    }
    // File là bắt buộc khi tạo mới
    if (!selectedDocument && !formData.file) {
      toast.error("Vui lòng chọn file đính kèm.")
      return
    }

    const payload = {
      documentName: formData.documentName,
      author: formData.author,
      ...(selectedDocument && { id: selectedDocument.id }), // Thêm ID nếu là chế độ sửa
    }

    try {
      await createOrUpdateDocument(payload, formData.file)
      toast.success(`Đã ${selectedDocument ? "cập nhật" : "thêm"} tài liệu thành công.`)
      setIsModalOpen(false)
      fetchDocuments() // Tải lại danh sách
    } catch (error) {
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.")
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedDocument) return
    try {
      await deleteDocument(selectedDocument.id)
      toast.success(`Đã xóa tài liệu "${selectedDocument.documentName}"`)
      fetchDocuments()
    } catch (error) {
      toast.error("Không thể xóa tài liệu. Vui lòng thử lại.")
    } finally {
      setIsDeleteDialogOpen(false)
      setSelectedDocument(null)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN")
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
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm tài liệu
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="flex items-center space-x-2 ml-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc tác giả"
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
                  Tên tài liệu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tác giả
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
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-red-500">
                    {error}
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10">
                    Không tìm thấy tài liệu nào.
                  </td>
                </tr>
              ) : (
                filteredData.map((doc, index) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getFileIcon(doc.filePath)}
                        <span className="ml-3 text-sm font-medium text-gray-900">{doc.documentName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(doc.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(doc.updatedAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedDocument(doc)
                            setIsDeleteDialogOpen(true)
                          }}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(doc)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreview(doc)}
                          className="text-green-600 hover:text-green-800 hover:bg-green-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(doc.id)}
                          className="text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {selectedDocument ? "Sửa tài liệu" : "Thêm tài liệu mới"}
            </DialogTitle>
            <DialogDescription>
              Điền thông tin chi tiết cho tài liệu của bạn tại đây.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="documentName" className="text-sm font-medium text-gray-700">
                  Tên tài liệu <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="documentName"
                  value={formData.documentName}
                  onChange={(e) => handleInputChange("documentName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author" className="text-sm font-medium text-gray-700">
                  Tên tác giả <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file" className="text-sm font-medium text-gray-700">
                  Tài liệu đính kèm{" "}
                  {!selectedDocument && <span className="text-red-500">*</span>}
                </Label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-300" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
                {formData.file && (
                  <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-100 p-3">
                    <div className="flex items-center gap-3">
                      <Paperclip className="h-5 w-5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-800">{formData.file.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, file: null }))
                        setFilePreview(null)
                      }}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                {selectedDocument ? "Cập nhật" : "Thêm tài liệu"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa tài liệu</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa tài liệu "{selectedDocument?.documentName}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedDocument(null)}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
