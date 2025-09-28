"use client"

import { useState, useMemo, useEffect } from "react"
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
import { getItems } from "@/services/item.service"
import { IItem, IItemData } from "@/types/item.type"

/**
 * Trang Quản lý đồ ăn
 * Hiển thị danh sách thực đơn với giá cả và mô tả, được lấy từ API.
 */
export default function QuanLyDoAnPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("itemName") // Sửa giá trị mặc định để khớp với API
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 // Cập nhật số lượng item mỗi trang

  const [items, setItems] = useState<IItem[]>([])
  const [pagination, setPagination] = useState<Omit<IItemData, "content">>({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedDoAn, setSelectedDoAn] = useState<IItem | null>(null)
  const [editFormData, setEditFormData] = useState({
    itemName: "",
    price: "",
    description: "",
  })

  /**
   * Lấy dữ liệu danh sách sản phẩm từ API mỗi khi có sự thay đổi
   * về trang, từ khóa tìm kiếm hoặc tiêu chí sắp xếp.
   */
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const params = {
          page: currentPage - 1,
          size: itemsPerPage,
          sortBy: sortBy,
          sortDir: sortDir,
          itemName: searchTerm,
        }
        const data = await getItems(params)
        setItems(data.content)
        setPagination({
          page: data.page,
          size: data.size,
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          first: data.first,
          last: data.last,
        })
      } catch (err) {
        setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchItems()
  }, [currentPage, searchTerm, sortBy, sortDir])

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, pagination.totalPages)))
  }

  // TODO: Chức năng edit và delete sẽ được cập nhật để gọi API sau
  const handleEdit = (doAn: IItem) => {
    setSelectedDoAn(doAn)
    setEditFormData({
      itemName: doAn.itemName,
      price: doAn.price.toString(),
      description: doAn.description || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (doAn: IItem) => {
    setSelectedDoAn(doAn)
    setIsDeleteDialogOpen(true)
  }

  const confirmEdit = () => {
    if (!selectedDoAn) return
    // Logic cập nhật API sẽ ở đây
    setIsEditDialogOpen(false)
    toast({
      title: "Cập nhật thành công (chưa gọi API)",
      description: `Đã cập nhật thông tin món ${editFormData.itemName}`,
    })
  }

  const confirmDelete = () => {
    if (!selectedDoAn) return
    // Logic xóa API sẽ ở đây
    setIsDeleteDialogOpen(false)
    toast({
      title: "Xóa thành công (chưa gọi API)",
      description: `Đã xóa món ${selectedDoAn.itemName}`,
      variant: "destructive",
    })
  }

  /**
   * Định dạng số thành chuỗi tiền tệ Việt Nam.
   * @param price - Số tiền cần định dạng.
   * @returns Chuỗi đã định dạng (ví dụ: 100.000đ).
   */
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
  }

  /**
   * Định dạng chuỗi ngày ISO 8601 thành ngày/tháng/năm.
   * @param dateString - Chuỗi ngày cần định dạng.
   * @returns Chuỗi ngày đã định dạng (ví dụ: 24/09/2025).
   */
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN")
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
        <div className="flex items-center space-x-2 ml-auto">
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value)
              setCurrentPage(1) // Reset về trang đầu khi đổi sort
            }}
          >
            <option value="itemName">Tên món</option>
            <option value="price">Giá</option>
            <option value="createdAt">Ngày tạo</option>
          </select>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            value={sortDir}
            onChange={(e) => {
              setSortDir(e.target.value as "asc" | "desc")
              setCurrentPage(1) // Reset về trang đầu khi đổi sort
            }}
          >
            <option value="asc">Tăng dần</option>
            <option value="desc">Giảm dần</option>
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
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-red-500">
                    {error}
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10">
                    Không tìm thấy sản phẩm nào.
                  </td>
                </tr>
              ) : (
                items.map((mon, index) => (
                  <tr key={mon.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="mr-4 text-sm text-gray-500">{pagination.page * itemsPerPage + index + 1}</span>
                        <span className="text-sm font-medium text-gray-900">{mon.itemName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPrice(mon.price)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="truncate">{mon.description || "Không có mô tả"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(mon.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(mon.updatedAt)}</td>
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={pagination.first}
          >
            ← Previous
          </Button>
          <div className="flex items-center space-x-2">
            {/* TODO: Cập nhật logic phân trang phức tạp hơn nếu cần */}
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant="outline"
                size="sm"
                className={currentPage === page ? "bg-orange-500 text-white" : ""}
                onClick={() => goToPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={pagination.last}
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
            <DialogDescription>Cập nhật thông tin món {selectedDoAn?.itemName}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tenMon" className="text-right">
                Tên món
              </Label>
              <Input
                id="tenMon"
                value={editFormData.itemName}
                onChange={(e) => setEditFormData({ ...editFormData, itemName: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gia" className="text-right">
                Giá
              </Label>
              <Input
                id="gia"
                value={editFormData.price}
                onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                className="col-span-3"
                placeholder="VD: 100000"
                type="number"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="chiTiet" className="text-right mt-2">
                Chi tiết
              </Label>
              <Textarea
                id="chiTiet"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
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
              Bạn có chắc chắn muốn xóa món {selectedDoAn?.itemName}? Hành động này không thể hoàn tác.
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
