"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Search, Filter, Upload, Plus, Star, Trash2, Edit, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { PageContainer } from "@/components/page-container"
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
import { getPersonsPaginated, deletePerson, importPersons, addPerson, validateAndUploadFace, registerOrUpdatePerson } from "@/services/person.service"
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
  const [allPersons, setAllPersons] = useState<Person[]>([])
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
  const [debouncedTerm, setDebouncedTerm] = useState("")
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

  const fetchPersonsFull = useCallback(async () => {
    setIsLoading(true)
    try {
      const first = await getPersonsPaginated({ page: 0, size: 1, sortBy: sortBy, sortDir: sortDir })
      const total = first.totalElements || 0
      if (total > 0) {
        const all = await getPersonsPaginated({ page: 0, size: total, sortBy: sortBy, sortDir: sortDir })
        setAllPersons(all.content)
      } else {
        setAllPersons([])
      }
    } catch (error) {
      toast.error("Không thể tải danh sách khách mời.")
    } finally {
      setIsLoading(false)
    }
  }, [sortBy, sortDir])

  useEffect(() => {
    fetchPersonsFull()
  }, [fetchPersonsFull])

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

  // Edit modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingPerson, setEditingPerson] = useState<Person | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<Person>>({})
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // Delete confirmation states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingPerson, setDeletingPerson] = useState<Person | null>(null)
  
  const editAvatarInputRef = useRef<HTMLInputElement>(null)

  const handleViewDetails = (person: Person) => {
    setEditingPerson(person)
    setEditFormData({
      email: person.email,
      fullName: person.fullName,
      phone: person.phone,
      position: person.position,
      gender: person.gender,
      status: person.status,
      isVip: person.isVip,
    })
    setIsEditModalOpen(true)
  }

  const handleEditGuest = (person: Person) => {
    handleViewDetails(person)
  }

  const handleDeleteGuest = (person: Person) => {
    setDeletingPerson(person)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!deletingPerson) return
    try {
      await deletePerson(deletingPerson.personId)
      toast.success(`Đã xóa khách mời "${deletingPerson.fullName}".`)
      setIsDeleteDialogOpen(false)
      setDeletingPerson(null)
      fetchPersonsFull()
    } catch (error) {
      toast.error(`Không thể xóa khách mời "${deletingPerson.fullName}".`)
    }
  }

  const handleEditAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setEditAvatarFile(file)
    }
  }

  const handleUpdateSubmit = async () => {
    if (!editingPerson) return
    
    setIsUpdating(true)
    try {
      // Upload avatar if changed
      if (editAvatarFile) {
        try {
          await validateAndUploadFace(editingPerson.personId, editAvatarFile)
        } catch (avatarError) {
          toast.warning("Upload avatar thất bại, nhưng sẽ tiếp tục cập nhật thông tin.")
        }
      }

      // Update person info
      const payload: any = {
        email: editFormData.email || editingPerson.email,
        fullName: editFormData.fullName || editingPerson.fullName,
        phone: editFormData.phone || editingPerson.phone,
        position: editFormData.position || editingPerson.position,
        gender: (editFormData.gender || editingPerson.gender) as any,
        status: editFormData.status !== undefined ? editFormData.status : editingPerson.status,
        isVip: editFormData.isVip || editingPerson.isVip,
      }

      // Include seat info if exists
      if (editingPerson.seatInfo) {
        payload.seatInfo = {
          seatNumber: editingPerson.seatInfo.seatNumber,
          paidPrice: editingPerson.seatInfo.paidPrice || 0,
        }
      }

      // Include items if exists
      if (editingPerson.items && editingPerson.items.length > 0) {
        payload.items = editingPerson.items.map((item: any) => ({
          itemId: item.id,
          quantity: item.quantity,
          paidAmount: item.totalAmount,
        }))
      }

      await registerOrUpdatePerson(payload)
      toast.success("Thông tin khách mời đã được cập nhật.")
      setIsEditModalOpen(false)
      setEditingPerson(null)
      setEditFormData({})
      setEditAvatarFile(null)
      fetchPersonsFull()
    } catch (error) {
      toast.error("Không thể cập nhật thông tin khách mời.")
    } finally {
      setIsUpdating(false)
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
      fetchPersonsFull() // Tải lại danh sách
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
      fetchPersonsFull() // Tải lại danh sách
    } catch (error) {
      toast.error("Không thể thêm khách mời mới. Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  // Debounce search term (client-side) and reset to first page
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedTerm(searchTerm.trim())
      setPagination((prev) => ({ ...prev, page: 0 }))
    }, 300)
    return () => clearTimeout(id)
  }, [searchTerm])

  const filteredPersons = (allPersons.length ? allPersons : persons).filter(
    (person) =>
      person.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.position.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const clientTotalPages = Math.max(1, Math.ceil(filteredPersons.length / pagination.size))
  const isFirstPage = pagination.page <= 0
  const isLastPage = pagination.page >= clientTotalPages - 1

  return (
    <PageContainer>
      <input ref={fileInputRef} type="file" accept=".xlsx, .xls" onChange={handleImportFile} className="hidden" />
      <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
      <input ref={editAvatarInputRef} type="file" accept="image/*" onChange={handleEditAvatarChange} className="hidden" />

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
                filteredPersons
                  .slice(pagination.page * pagination.size, pagination.page * pagination.size + pagination.size)
                  .map((person, idx) => (
                  <tr key={person.personId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pagination.page * pagination.size + idx + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div
                            className="text-sm font-medium text-gray-900 cursor-pointer hover:text-orange-600"
                            onClick={() => handleViewDetails(person)}
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
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteGuest(person)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditGuest(person)}>
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

        {/* Pagination (client-side) */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Hiển thị {pagination.page * pagination.size + 1} đến{" "}
            {Math.min((pagination.page + 1) * pagination.size, filteredPersons.length)} trong tổng số{" "}
            {filteredPersons.length} khách mời
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={isFirstPage}
            >
              ← Trước
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: clientTotalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant="outline"
                  size="sm"
                  className={pagination.page + 1 === page ? "bg-orange-500 text-white" : ""}
                  onClick={() => handlePageChange(page - 1)}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={isLastPage}
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

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin khách mời</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email*</label>
              <Input
                type="email"
                value={editFormData.email || ""}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                placeholder="Nhập email"
              />
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Họ và tên*</label>
              <Input
                value={editFormData.fullName || ""}
                onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                placeholder="Nhập họ và tên"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Số điện thoại</label>
              <Input
                value={editFormData.phone || ""}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                placeholder="Nhập số điện thoại"
              />
            </div>

            {/* Position */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Chức vụ</label>
              <Input
                value={editFormData.position || ""}
                onChange={(e) => setEditFormData({ ...editFormData, position: e.target.value })}
                placeholder="Nhập chức vụ"
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Giới tính</label>
              <Select
                value={editFormData.gender || ""}
                onValueChange={(value: "MALE" | "FEMALE" | "OTHER") =>
                  setEditFormData({ ...editFormData, gender: value })
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
                value={editFormData.status ? "TRUE" : "FALSE"}
                onValueChange={(value: "TRUE" | "FALSE") => 
                  setEditFormData({ ...editFormData, status: value === "TRUE" })
                }
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
                value={editFormData.isVip || ""}
                onValueChange={(value: "SUPER_VIP" | "VIP" | "NORMAL") => 
                  setEditFormData({ ...editFormData, isVip: value as any })
                }
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
                {editingPerson?.avatarUrl && !editAvatarFile && (
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
                    <img
                      src={`data:image/jpeg;base64,${editingPerson.avatarUrl}`}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => editAvatarInputRef.current?.click()}
                >
                  {editAvatarFile ? "Thay đổi ảnh" : "Chọn ảnh mới"}
                </Button>
                {editAvatarFile && (
                  <span className="text-sm text-gray-500">{editAvatarFile.name}</span>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={isUpdating}>
              Hủy
            </Button>
            <Button 
              onClick={handleUpdateSubmit} 
              className="bg-orange-500 hover:bg-orange-600"
              disabled={isUpdating}
            >
              {isUpdating ? "Đang xử lý..." : "Cập nhật"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa khách mời</DialogTitle>
          </DialogHeader>

          {deletingPerson && (
            <div className="space-y-4 py-4">
              <p className="text-sm text-gray-600">
                Bạn có chắc chắn muốn xóa khách mời sau? Hành động này không thể hoàn tác.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-3 border border-gray-200">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Họ và tên</p>
                    <p className="text-sm font-medium text-gray-900">{deletingPerson.fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{deletingPerson.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Số điện thoại</p>
                    <p className="text-sm font-medium text-gray-900">{deletingPerson.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Chức vụ</p>
                    <p className="text-sm font-medium text-gray-900">{deletingPerson.position}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Giới tính</p>
                    <p className="text-sm font-medium text-gray-900">{translateGender(deletingPerson.gender)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Loại khách</p>
                    <Badge className={
                      deletingPerson.isVip === "SUPER_VIP" ? "bg-purple-100 text-purple-800" :
                      deletingPerson.isVip === "VIP" ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-800"
                    }>
                      {deletingPerson.isVip === "SUPER_VIP" ? "Siêu VIP" : 
                       deletingPerson.isVip === "VIP" ? "VIP" : "Thường"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
