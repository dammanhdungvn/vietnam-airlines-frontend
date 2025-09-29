"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
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
import { getPersonsPaginated, deletePerson, importPersons, addPerson, validateAndUploadFace } from "@/services/person.service"
import { Person, PaginatedApiResponse, AddPersonPayload } from "@/types/person.type"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

/**
 * Trang Quản lý khách mời
 * Hiển thị danh sách khách mời với các tính năng lọc, tìm kiếm và quản lý
 */
export default function QuanLyKhachMoiPage() {
  const router = useRouter()

  const [persons, setPersons] = useState<Person[]>([])
  const [pagination, setPagination] = useState<Omit<PaginatedApiResponse<Person>, "content">>({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: false,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("personId")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newPersonData, setNewPersonData] = useState<AddPersonPayload>({
    email: "",
    fullName: "",
    phone: "",
    position: "",
    avatarUrl: "", // Sẽ được cập nhật sau khi upload avatar
    status: "TRUE",
    isVip: "NORMAL",
    gender: "MALE",
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const fetchPersons = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getPersonsPaginated({
        page: pagination.page,
        size: pagination.size,
        sortBy: sortBy,
        sortDir: sortDir,
        // NOTE: API doesn't seem to support search term, filtering will be client-side for now
      })
      setPersons(data.content)
      const computedTotalPages = data && data.size ? Math.max(1, Math.ceil((data.totalElements || 0) / data.size)) : 1
      setPagination({
        page: data.page,
        size: data.size,
        totalElements: data.totalElements,
        totalPages: data.totalPages && data.totalPages > 0 ? data.totalPages : computedTotalPages,
        first: data.first,
        last: data.last,
      })
    } catch (error) {
      toast.error("Không thể tải danh sách khách mời.")
    } finally {
      setIsLoading(false)
    }
  }, [pagination.page, pagination.size, sortBy, sortDir])

  useEffect(() => {
    fetchPersons()
  }, [fetchPersons])

  const translateGender = (gender: "MALE" | "FEMALE" | "OTHER" | string) => {
    switch (gender) {
      case "MALE":
        return "Nam"
      case "FEMALE":
        return "Nữ"
      case "OTHER":
        return "Khác"
      default:
        return gender
    }
  }

  const handleViewDetails = (personEmail: string) => {
    router.push(`/quan-ly-khach-moi/${personEmail}`)
  }

  const handleEditGuest = (personEmail: string) => {
    router.push(`/quan-ly-khach-moi/${personEmail}`)
  }

  const handleDeleteGuest = async (person: Person) => {
    try {
      await deletePerson(person.personId)
      toast.success(`Đã xóa khách mời "${person.fullName}".`)
      fetchPersons() // Tải lại danh sách sau khi xóa
    } catch (error) {
      toast.error(`Không thể xóa khách mời "${person.fullName}".`)
    }
  }

  const handleTriggerImport = () => {
    if (isImporting) return
    fileInputRef.current?.click()
  }

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      toast.info("Bạn chưa chọn file để import.")
      return
    }
    try {
      setIsImporting(true)
      await importPersons(file)
      toast.success("Đã nhập danh sách khách mời thành công.")
      fetchPersons() // Tải lại danh sách
    } catch (error) {
      toast.error("Không thể nhập danh sách khách mời từ file.")
    } finally {
      // Reset input & state
      event.target.value = ""
      setIsImporting(false)
    }
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      // Tạo preview URL cho avatar
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewPersonData(prev => ({ ...prev, avatarUrl: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddSubmit = async () => {
    // Basic validation
    if (!newPersonData.fullName || !newPersonData.email) {
      toast.error("Vui lòng điền các trường bắt buộc (Họ tên, Email).")
      return
    }

    setIsSubmitting(true)
    try {
      // Bước 1: Tạo người dùng trước theo schema mới (không có personId)
      const createResponse = await addPerson(newPersonData)
      
      // Bước 2: Nếu có avatar file và tạo thành công, upload avatar
      if (avatarFile && createResponse?.data?.personId) {
        try {
          await validateAndUploadFace(createResponse.data.personId, avatarFile)
          toast.success("Đã thêm khách mời mới và upload avatar thành công.")
        } catch (avatarError) {
          // Nếu upload avatar thất bại nhưng tạo người dùng thành công
          toast.warning("Đã thêm khách mời mới nhưng upload avatar thất bại. Bạn có thể cập nhật avatar sau.")
        }
      } else {
        toast.success("Đã thêm khách mời mới.")
      }
      
      // Reset form và đóng modal
      setNewPersonData({
        email: "",
        fullName: "",
        phone: "",
        position: "",
        avatarUrl: "",
        status: "TRUE",
        isVip: "NORMAL",
        gender: "MALE",
      })
      setAvatarFile(null)
      setIsAddModalOpen(false)
      fetchPersons() // Tải lại danh sách
    } catch (error) {
      toast.error("Không thể thêm khách mời mới. Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  const filteredPersons = persons.filter(
    (person) =>
      person.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.position.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen">
      <input ref={fileInputRef} type="file" accept=".xlsx, .xls" onChange={handleImportFile} className="hidden" />
      <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý khách mời</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={handleTriggerImport} disabled={isImporting}>
            <Upload className="w-4 h-4 mr-2" />
            {isImporting ? "Đang import..." : "Import"}
          </Button>
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm mới
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex items-center space-x-2 ml-auto">
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            value={`${sortBy},${sortDir}`}
            onChange={(e) => {
              const [newSortBy, newSortDir] = e.target.value.split(",")
              setSortBy(newSortBy)
              setSortDir(newSortDir as "asc" | "desc")
            }}
          >
            <option value="personId,asc">ID (Tăng dần)</option>
            <option value="personId,desc">ID (Giảm dần)</option>
            <option value="fullName,asc">Tên (A-Z)</option>
            <option value="fullName,desc">Tên (Z-A)</option>
            <option value="email,asc">Email (A-Z)</option>
            <option value="email,desc">Email (Z-A)</option>
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm theo tên, email, chức vụ..."
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
                  STT
                </th>
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
              {isLoading ? (
                Array.from({ length: pagination.size }).map((_, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4"><Skeleton className="h-8 w-12" /></td>
                    <td className="px-6 py-4" colSpan={7}>
                      <Skeleton className="h-8 w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredPersons.length > 0 ? (
                filteredPersons.map((person, idx) => (
                  <tr key={person.personId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pagination.page * pagination.size + idx + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div
                            className="text-sm font-medium text-gray-900 cursor-pointer hover:text-orange-600"
                              onClick={() => handleViewDetails(person.email)}
                            >
                              {person.fullName}
                            </div>
                            <div className="text-sm text-gray-500">{person.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{person.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{person.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {translateGender(person.gender)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                          variant={person.status ? "default" : "secondary"}
                          className={person.status ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                        >
                          {person.status ? "Hoạt động" : "Không hoạt động"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {person.isVip === "SUPER_VIP" ? (
                        <Badge className="bg-purple-100 text-purple-800">Siêu VIP</Badge>
                      ) : person.isVip === "VIP" ? (
                        <Badge className="bg-yellow-100 text-yellow-800">VIP</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">Thường</Badge>
                      )}
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
                                  Bạn có chắc chắn muốn xóa khách mời "{person.fullName}"? Hành động này không thể hoàn
                                  tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                  onClick={() => handleDeleteGuest(person)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                          <Button variant="ghost" size="sm" onClick={() => handleEditGuest(person.email)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                      </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-500">
                    Không tìm thấy khách mời nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Hiển thị {pagination.page * pagination.size + 1} đến{" "}
            {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} trong tổng số{" "}
            {pagination.totalElements} khách mời
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.first}
            >
              ← Trước
            </Button>
            <div className="flex items-center space-x-1">
              {/* Logic hiển thị các nút trang */}
              {Array.from({ length: pagination.totalPages }, (_, i) => i).map((pageIndex) => {
                const pageNumber = pageIndex + 1
                const isCurrent = pagination.page === pageIndex

                // Logic để hiển thị giới hạn các nút trang và dấu "..."
                if (
                  pagination.totalPages <= 7 || // Hiển thị tất cả nếu ít hơn hoặc bằng 7 trang
                  pageIndex < 3 || // Luôn hiển thị 3 trang đầu
                  pageIndex > pagination.totalPages - 4 || // Luôn hiển thị 3 trang cuối
                  Math.abs(pagination.page - pageIndex) < 2 // Luôn hiển thị trang hiện tại và các trang lân cận
                ) {
                  return (
                    <Button
                      key={pageNumber}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pageIndex)}
                      className={isCurrent ? "bg-orange-500 text-white" : ""}
                    >
                      {pageNumber}
                    </Button>
                  )
                } else if (
                  (pageIndex === 3 && pagination.page > 4) ||
                  (pageIndex === pagination.totalPages - 4 && pagination.page < pagination.totalPages - 5)
                ) {
                  return (
                    <span key={`dots-${pageIndex}`} className="text-sm text-gray-500 px-2">
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
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.last}
            >
              Sau →
            </Button>
          </div>
        </div>
      </div>

      {/* Modal form thêm khách mời */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thêm khách mời mới</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email*</label>
              <Input
                type="email"
                value={newPersonData.email}
                onChange={(e) => setNewPersonData({ ...newPersonData, email: e.target.value })}
                placeholder="Nhập email"
              />
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Họ và tên*</label>
              <Input
                value={newPersonData.fullName}
                onChange={(e) => setNewPersonData({ ...newPersonData, fullName: e.target.value })}
                placeholder="Nhập họ và tên"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Số điện thoại</label>
              <Input
                value={newPersonData.phone}
                onChange={(e) => setNewPersonData({ ...newPersonData, phone: e.target.value })}
                placeholder="Nhập số điện thoại"
              />
            </div>

            {/* Position */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Chức vụ</label>
              <Input
                value={newPersonData.position}
                onChange={(e) => setNewPersonData({ ...newPersonData, position: e.target.value })}
                placeholder="Nhập chức vụ"
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Giới tính</label>
              <Select
                value={newPersonData.gender}
                onValueChange={(value: "MALE" | "FEMALE" | "OTHER") =>
                  setNewPersonData({ ...newPersonData, gender: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Nam</SelectItem>
                  <SelectItem value="FEMALE">Nữ</SelectItem>
                  <SelectItem value="OTHER">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Trạng thái</label>
              <Select
                value={newPersonData.status}
                onValueChange={(value: "TRUE" | "FALSE") => setNewPersonData({ ...newPersonData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRUE">Hoạt động</SelectItem>
                  <SelectItem value="FALSE">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* VIP */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Loại khách</label>
              <Select
                value={newPersonData.isVip}
                onValueChange={(value: "SUPER_VIP" | "VIP" | "NORMAL") => setNewPersonData({ ...newPersonData, isVip: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại khách" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUPER_VIP">Siêu VIP</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="NORMAL">Thường</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Avatar Upload */}
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium">Ảnh đại diện</label>
              <div className="flex items-center space-x-4">
                {newPersonData.avatarUrl && (
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
                    <img
                      src={newPersonData.avatarUrl}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  {avatarFile ? "Thay đổi ảnh" : "Chọn ảnh"}
                </Button>
                {avatarFile && (
                  <span className="text-sm text-gray-500">{avatarFile.name}</span>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button 
              onClick={handleAddSubmit} 
              className="bg-orange-500 hover:bg-orange-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang xử lý..." : "Thêm khách mời"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
