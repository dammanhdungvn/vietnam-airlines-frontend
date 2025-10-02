"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, Filter, Download, Plus, Trash2, Edit, RefreshCw, ChevronDown } from "lucide-react"
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
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { SeatMap } from "@/components/seat-map"
import { getSeatsInfo, updateSeat, deleteSeat } from "@/services/seat.service"
import { ISeat, SeatType } from "@/types/seat.type"

/**
 * Trang Quản lý ghế
 * Hiển thị sơ đồ ghế và danh sách ghế với thông tin chi tiết
 */
export default function QuanLyGhePage() {
  const [seats, setSeats] = useState<ISeat[]>([])
  const [totalElements, setTotalElements] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("ID")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const router = useRouter()

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedGhe, setSelectedGhe] = useState<ISeat | null>(null)
  const [editFormData, setEditFormData] = useState({
    seatNumber: "",
    type: "",
    basePrice: "",
  })

  /**
   * @function fetchInitialSeatInfo
   * @description Lấy thông tin tổng số ghế để biết kích thước đầy đủ.
   */
  useEffect(() => {
    const fetchInitialSeatInfo = async () => {
      setLoading(true)
      try {
        const data = await getSeatsInfo({ page: 0, size: 1, sortBy: 'id', sortDir: 'asc' })
        setTotalElements(data.totalElements)
      } catch (error) {
        console.error("Lỗi khi tải thông tin tổng số ghế:", error)
        toast.error("Không thể tải dữ liệu ban đầu. Vui lòng thử lại.")
        setLoading(false)
      }
    }
    fetchInitialSeatInfo()
  }, [])

  /**
   * @function fetchAllSeats
   * @description Lấy toàn bộ danh sách ghế sau khi đã biết tổng số.
   */
  useEffect(() => {
    if (totalElements === null) return

    const fetchAllSeats = async () => {
      if (totalElements === 0) {
        setSeats([])
        setLoading(false)
        return
      }
      
      try {
        const data = await getSeatsInfo({ page: 0, size: totalElements, sortBy: 'id', sortDir: 'asc' })
        const sortedSeats = data.content.sort((a, b) => a.id - b.id);
        setSeats(sortedSeats)
      } catch (error) {
        console.error("Lỗi khi tải toàn bộ danh sách ghế:", error)
        toast.error("Không thể tải danh sách ghế. Vui lòng thử lại.")
      } finally {
        setLoading(false)
      }
    }

    fetchAllSeats()
  }, [totalElements])


  const handleRefresh = () => {
    window.location.reload()
  }

  /**
   * @function getSeatTypeLabel
   * @description Chuyển đổi SeatType enum thành label tiếng Việt.
   * @param {SeatType} type - Loại ghế.
   * @returns {string} Label tiếng Việt.
   */
  const getSeatTypeLabel = (type: SeatType): string => {
    switch (type) {
      case SeatType.VIP:
        return "VIP"
      case SeatType.NORMAL:
        return "Thường"
      case SeatType.FREE:
        return "Free"
      case SeatType.BLOCK:
        return "Bị khóa"
      default:
        return "Không xác định"
    }
  }

  /**
   * @function getSeatStatusLabel
   * @description Chuyển đổi trạng thái isBooked thành label tiếng Việt.
   * @param {boolean} isBooked - Trạng thái ghế.
   * @returns {string} Label tiếng Việt.
   */
  const getSeatStatusLabel = (isBooked: boolean): string => {
    return isBooked ? "Đã đặt" : "Trống"
  }

  const filteredSeats = useMemo(() => {
    let filtered = seats

    // Filter theo search term
    if (searchTerm) {
      filtered = filtered.filter(
        (seat) =>
          seat.seatNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          getSeatTypeLabel(seat.type).toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter theo loại ghế
    if (selectedFilters.length > 0) {
        filtered = filtered.filter((seat) => {
            if (selectedFilters.includes("VIP") && seat.type === SeatType.VIP) return true;
            if (selectedFilters.includes("Thường") && seat.type === SeatType.NORMAL) return true;
            if (selectedFilters.includes("Free") && seat.type === SeatType.FREE) return true;
            if (selectedFilters.includes("Bị khóa") && seat.type === SeatType.BLOCK) return true;
            if (selectedFilters.includes("Có giá") && seat.basePrice > 0) return true;
            if (selectedFilters.includes("Đã đặt") && seat.isBooked) return true;
            if (selectedFilters.includes("Trống") && !seat.isBooked) return true;
            return false;
        });
    }


    // Sort theo tiêu chí được chọn
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "ID":
          return a.id - b.id
        case "Tên số ghế":
          return a.seatNumber.localeCompare(b.seatNumber)
        case "Loại ghế":
          return a.type.localeCompare(b.type)
        case "Giá":
          return (a.basePrice || 0) - (b.basePrice || 0)
        case "Trạng thái":
          return (a.isBooked ? 1 : 0) - (b.isBooked ? 1 : 0)
        default: // Mặc định sắp xếp theo ID
          return a.id - b.id
      }
    })

    return filtered
  }, [seats, searchTerm, selectedFilters, sortBy])

  const totalPages = Math.ceil(filteredSeats.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredSeats.slice(startIndex, endIndex)

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

  const handleViewDetail = (seatId: number) => {
    router.push(`/quan-ly-ghe/${seatId}`)
  }

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
  }

  const removeFilter = (filter: string) => {
    setSelectedFilters(selectedFilters.filter((f) => f !== filter))
  }

  /**
   * @function getBadgeColor
   * @description Xác định màu sắc cho badge dựa trên loại ghế.
   * @param {SeatType} type - Loại ghế.
   * @returns {string} Class CSS cho màu sắc.
   */
  const getBadgeColor = (type: SeatType) => {
    switch (type) {
      case SeatType.VIP:
        return "bg-yellow-100 text-yellow-800"
      case SeatType.NORMAL:
        return "bg-teal-100 text-teal-800"
      case SeatType.FREE:
        return "bg-green-100 text-green-800"
      case SeatType.BLOCK:
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleEdit = (seat: ISeat) => {
    setSelectedGhe(seat)
    setEditFormData({
      seatNumber: seat.seatNumber,
      type: seat.type,
      basePrice: seat.basePrice?.toString() || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (seat: ISeat) => {
    setSelectedGhe(seat)
    setIsDeleteDialogOpen(true)
  }

  const confirmEdit = async () => {
    if (!selectedGhe) return

    const payload = {
      id: selectedGhe.id,
      seatNumber: editFormData.seatNumber,
      type: editFormData.type as SeatType,
      basePrice: editFormData.basePrice ? parseFloat(editFormData.basePrice) : 0,
      paidPrice: selectedGhe.paidPrice // Giữ nguyên giá đã trả
    };

    try {
      await updateSeat(payload);
      
      // Cập nhật lại state ở client
      const updatedSeats = seats.map((seat) =>
        seat.id === selectedGhe.id ? { ...seat, ...payload } : seat,
      )
      setSeats(updatedSeats)
      
      toast.success(`Đã cập nhật thông tin ghế ${payload.seatNumber}`)

    } catch (error) {
      toast.error("Không thể cập nhật thông tin ghế. Vui lòng thử lại.")
    } finally {
      setIsEditDialogOpen(false)
      setSelectedGhe(null)
    }
  }

  const confirmDelete = async () => {
    if (!selectedGhe) return
    
    try {
      await deleteSeat(selectedGhe.id);

      const updatedSeats = seats.filter((seat) => seat.id !== selectedGhe.id)
      setSeats(updatedSeats)

      toast.success(`Đã xóa ghế ${selectedGhe.seatNumber}`)

    } catch (error) {
       toast.error("Không thể xóa ghế. Vui lòng thử lại.")
    } finally {
      setIsDeleteDialogOpen(false)
      setSelectedGhe(null)
    }
  }

  if (loading) {
    return (
      <PageContainer>
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center" role="status">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-500" />
            <p className="text-gray-600">Đang tải dữ liệu ghế...</p>
          </div>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Quản lý Ghế</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Tổng cộng {seats.length} ghế</p>
        </div>
        <div className="flex items-center gap-2 sm:space-x-3">
          <Button variant="outline" size="sm" onClick={handleRefresh} className="flex-1 sm:flex-none">
            <RefreshCw className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Làm mới</span>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Download className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600 flex-1 sm:flex-none">
            <Plus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Thêm mới</span>
          </Button>
        </div>
      </div>

      {/* Sơ đồ ghế */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Sơ đồ ghế</h2>
        <div className="overflow-x-auto">
          <SeatMap seats={seats} />
        </div>
      </div>

      {/* Danh sách ghế */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Danh sách ghế</h2>
        
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
                Bộ lọc
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
                checked={selectedFilters.includes("Bị khóa")}
                onCheckedChange={() => toggleFilter("Bị khóa")}
              >
                Ghế bị khóa
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedFilters.includes("Có giá")}
                onCheckedChange={() => toggleFilter("Có giá")}
              >
                Ghế có giá
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedFilters.includes("Đã đặt")}
                onCheckedChange={() => toggleFilter("Đã đặt")}
              >
                Đã đặt
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedFilters.includes("Trống")}
                onCheckedChange={() => toggleFilter("Trống")}
              >
                Trống
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex items-center space-x-2 ml-auto">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ID">ID</SelectItem>
                <SelectItem value="Tên số ghế">Tên số ghế</SelectItem>
                <SelectItem value="Loại ghế">Loại ghế</SelectItem>
                <SelectItem value="Giá">Giá</SelectItem>
                <SelectItem value="Trạng thái">Trạng thái</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm ghế..."
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số ghế
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại ghế
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((seat) => (
                  <tr key={seat.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{seat.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{seat.seatNumber}</span>
                        <Badge className={getBadgeColor(seat.type)}>{getSeatTypeLabel(seat.type)}</Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getSeatTypeLabel(seat.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {seat.basePrice > 0 ? `${seat.basePrice.toLocaleString('vi-VN')}đ` : 'Miễn phí'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant={!seat.isBooked ? "default" : "secondary"}
                        className={!seat.isBooked ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                      >
                        {getSeatStatusLabel(seat.isBooked)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(seat)}
                          className="text-green-600 hover:text-green-800 hover:bg-green-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(seat)}
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
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Hiển thị {startIndex + 1} đến {Math.min(endIndex, filteredSeats.length)} trong tổng số {filteredSeats.length} ghế
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handlePrevious} disabled={currentPage === 1}>
                ← Trước
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
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
                {totalPages > 5 && (
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
                Sau →
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sửa thông tin ghế</DialogTitle>
            <DialogDescription>Cập nhật thông tin ghế {selectedGhe?.seatNumber}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="seatNumber" className="text-right">
                Số ghế
              </Label>
              <Input
                id="seatNumber"
                value={editFormData.seatNumber}
                onChange={(e) => setEditFormData({ ...editFormData, seatNumber: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Loại ghế
              </Label>
              <Select
                value={editFormData.type}
                onValueChange={(value) => setEditFormData({ ...editFormData, type: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn loại ghế" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SeatType.VIP}>VIP</SelectItem>
                  <SelectItem value={SeatType.NORMAL}>Thường</SelectItem>
                  <SelectItem value={SeatType.FREE}>Free</SelectItem>
                  <SelectItem value={SeatType.BLOCK}>Bị khóa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="basePrice" className="text-right">
                Giá gốc
              </Label>
              <Input
                id="basePrice"
                type="number"
                value={editFormData.basePrice}
                onChange={(e) => setEditFormData({ ...editFormData, basePrice: e.target.value })}
                className="col-span-3"
                placeholder="Nhập giá (VND)"
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
              Bạn có chắc chắn muốn xóa ghế {selectedGhe?.seatNumber}? Hành động này không thể hoàn tác.
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
