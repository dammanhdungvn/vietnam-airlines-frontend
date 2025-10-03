"use client"

import { useState, useMemo } from "react"
import { Search, Filter, Download, Plus, Trash2, Edit, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { PageContainer } from "@/components/page-container"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Stream } from "@/types/stream.type"
import { createOrUpdateStream, deleteStream, getStreams } from "@/services/stream.service"
import React, { useEffect } from "react"

/**
 * Trang Quản lý link trực tuyến
 * Hiển thị danh sách các link trực tuyến với ghi chú và ngày tạo/sửa
 */
export default function QuanLyLinkTrucTuyenPage() {
  const [streams, setStreams] = useState<Stream[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("streamName")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null)
  const [formData, setFormData] = useState({
    id: 0,
    streamName: "",
    streamUrl: "",
  })

  // Hàm tải danh sách stream từ API
  const fetchStreams = async () => {
    try {
      const data = await getStreams()
      setStreams(data)
    } catch (error) {
      toast.error("Không thể tải danh sách link.")
    }
  }

  useEffect(() => {
    fetchStreams()
  }, [])

  const filteredData = useMemo(() => {
    let filtered = streams

    // Lọc theo search term
    if (searchTerm) {
      filtered = streams.filter(
        (item) =>
          item.streamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.streamUrl.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sắp xếp theo sortBy bằng cách tạo một bản sao của mảng để tránh thay đổi state gốc
    return [...filtered].sort((a, b) => {
      if (sortBy === "streamName") return a.streamName.localeCompare(b.streamName)
      if (sortBy === "streamUrl") return a.streamUrl.localeCompare(b.streamUrl)
      return 0
    })
  }, [searchTerm, sortBy, streams])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredData.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const handleAddNew = () => {
    setSelectedStream(null)
    setFormData({
      id: 0,
      streamName: "",
      streamUrl: "",
    })
    setIsModalOpen(true)
  }

  const handleEdit = (stream: Stream) => {
    setSelectedStream(stream)
    setFormData({
      id: stream.id,
      streamName: stream.streamName,
      streamUrl: stream.streamUrl,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (stream: Stream) => {
    setSelectedStream(stream)
    setIsDeleteDialogOpen(true)
  }

  const confirmSubmit = async () => {
    try {
      // Khi tạo mới, không gửi `id` trong payload. Backend sẽ tự tạo.
      const payload =
        formData.id === 0
          ? { streamName: formData.streamName, streamUrl: formData.streamUrl }
          : formData

      await createOrUpdateStream(payload)
      setIsModalOpen(false)
      fetchStreams() // Tải lại dữ liệu
      toast.success(`Đã ${formData.id ? "cập nhật" : "tạo mới"} link thành công.`)
    } catch (error) {
      toast.error(`Không thể ${formData.id ? "cập nhật" : "tạo mới"} link.`)
    }
  }

  const confirmDelete = async () => {
    if (!selectedStream) return

    try {
      await deleteStream(selectedStream.id)
      setIsDeleteDialogOpen(false)
      fetchStreams() // Tải lại dữ liệu
      toast.success(`Đã xóa link ${selectedStream.streamName}`)
    } catch (error) {
      toast.error(`Không thể xóa link ${selectedStream.streamName}.`)
    }
  }

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý link trực tuyến</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600 flex-1 sm:flex-none" onClick={handleAddNew}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm link mới
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc URL"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10 w-full"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="w-full overflow-x-auto">
          <table className="min-w-[800px] w-full table-auto">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-1/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STT
                </th>
                <th className="w-5/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên link
                </th>
                <th className="w-4/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đường dẫn
                </th>
                <th className="w-2/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((stream, index) => (
                <tr key={stream.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900 break-words">{stream.streamName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={stream.streamUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm inline-flex items-center gap-1"
                    >
                      Truy cập
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(stream)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(stream)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-center sm:justify-between w-full space-x-2 ">
          <div className="text-sm text-gray-700 hidden sm:block">
            Hiển thị {startIndex + 1} đến {Math.min(endIndex, filteredData.length)} trong tổng số {filteredData.length} link
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
              ← Trước
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(page)}
                  className={currentPage === page ? "bg-orange-500 text-white" : ""}
                >
                  {page}
                </Button>
              ))}
              {totalPages > 5 && (
                <>
                  <span className="text-sm text-gray-500">...</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(totalPages)}
                    className={currentPage === totalPages ? "bg-orange-500 text-white" : ""}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
              Sau →
            </Button>
          </div>
        </div>
      </div>

      {/* Modal Thêm/Sửa */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[95vw] sm:w-[560px] md:w-[600px] max-w-none sm:max-w-none max-h-[90vh] overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 break-words">
          <DialogHeader>
            <DialogTitle>{selectedStream ? "Sửa thông tin link" : "Thêm link mới"}</DialogTitle>
            <DialogDescription>
              {selectedStream ? `Cập nhật thông tin cho "${selectedStream.streamName}"` : "Nhập thông tin link mới."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="streamName" className="text-left sm:text-right">
                Tên link
              </Label>
              <div className="sm:col-span-3 min-w-0">
                <Input
                  id="streamName"
                  value={formData.streamName}
                  onChange={(e) => setFormData({ ...formData, streamName: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="streamUrl" className="text-left sm:text-right">
                URL
              </Label>
              <div className="sm:col-span-3 min-w-0">
                <Input
                  id="streamUrl"
                  value={formData.streamUrl}
                  onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={confirmSubmit} className="bg-orange-500 hover:bg-orange-600">
              {selectedStream ? "Lưu thay đổi" : "Tạo mới"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Xóa */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa link "{selectedStream?.streamName}"? Hành động này không thể hoàn tác.
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
    </PageContainer>
  )
}
