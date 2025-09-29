"use client"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import {
  ArrowLeft,
  Star,
  Mail,
  Phone,
  User,
  Briefcase,
  Calendar,
  Edit,
  Trash2,
  Save,
  X,
  Building,
  ClipboardList,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getPersonByEmail, registerOrUpdatePerson, deletePerson, validateAndUploadFace } from "@/services/person.service"
import { Person, RegistrationPayload } from "@/types/person.type"
import { toast } from "sonner"
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
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Trang chi tiết và chỉnh sửa khách mời
 * Hiển thị thông tin chi tiết của một khách mời và cho phép chỉnh sửa.
 */
export default function ChiTietKhachMoiPage() {
  const router = useRouter()
  const params = useParams()

  const personEmail = params.id as string

  const [person, setPerson] = useState<Person | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState<Partial<RegistrationPayload>>({})
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (personEmail) {
      const fetchPerson = async () => {
        setIsLoading(true)
        try {
          const data = await getPersonByEmail(personEmail)
          setPerson(data)
          // Initialize form data for editing
          setFormData({
            personId: data.personId,
            email: data.email,
            fullName: data.fullName,
            phone: data.phone,
            position: data.position,
            gender: data.gender,
            status: data.status,
            seatInfo: data.seatInfo,
            // Items are not part of the update payload structure from user request, so not included here
          })
        } catch (error) {
          toast.error("Không thể tải thông tin khách mời.")
        } finally {
          setIsLoading(false)
        }
      }
      fetchPerson()
    }
  }, [personEmail])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSeatInfoChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      seatInfo: {
        ...prev.seatInfo,
        seatNumber: prev.seatInfo?.seatNumber || "",
        paidPrice: prev.seatInfo?.paidPrice || 0,
        [field]: value,
      },
    }))
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAvatarFile(file)
    }
  }

  const handleUpdate = async () => {
    if (!person) return

    setIsSubmitting(true)
    try {
      // Bước 1: Nếu có avatar file, upload avatar trước
      if (avatarFile) {
        try {
          await validateAndUploadFace(person.personId, avatarFile)
          toast.success("Đã upload avatar thành công.")
        } catch (avatarError) {
          toast.warning("Upload avatar thất bại, nhưng sẽ tiếp tục cập nhật thông tin.")
        }
      }

      // Bước 2: Cập nhật thông tin người dùng
      const itemsPayload = person.items.map((item) => ({
        itemId: item.id,
        quantity: item.quantity,
        paidAmount: item.totalAmount,
      }))

      // Xác định payload cho seatInfo một cách chính xác
      const finalSeatNumber = formData.seatInfo?.seatNumber || person.seatInfo?.seatNumber
      const finalSeatInfo = finalSeatNumber
        ? {
            seatNumber: finalSeatNumber,
            paidPrice: formData.seatInfo?.paidPrice ?? person.seatInfo?.paidPrice ?? 0,
          }
        : null

      const payload: RegistrationPayload = {
        email: formData.email || person.email,
        fullName: formData.fullName || person.fullName,
        position: formData.position || person.position,
        phone: formData.phone || person.phone,
        gender: formData.gender || person.gender,
        status: formData.status !== undefined ? formData.status : person.status,
        seatInfo: finalSeatInfo,
        items: itemsPayload,
      }

      await registerOrUpdatePerson(payload)
      toast.success("Thông tin khách mời đã được cập nhật.")
      setIsEditMode(false)
      setAvatarFile(null) // Reset avatar file
      // Refetch data to show updated info
      const updatedData = await getPersonByEmail(personEmail)
      setPerson(updatedData)
    } catch (error) {
      toast.error("Không thể cập nhật thông tin khách mời.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!person) return
    try {
      await deletePerson(person.personId)
      toast.success("Khách mời đã được xóa.")
      router.push("/quan-ly-khach-moi")
    } catch (error) {
      toast.error("Không thể xóa khách mời.")
    }
  }

  const handleGoBack = () => {
    router.back()
  }

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

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-10 w-32" />
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-6">
                  <Skeleton className="w-24 h-24 rounded-full" />
                  <div className="flex-1 space-y-4">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-5 w-1/4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!person) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy khách mời</h2>
        <p className="text-gray-600 mb-6">
          Khách mời với ID này không tồn tại hoặc đã bị xóa.
        </p>
        <Button onClick={handleGoBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách
        </Button>
      </div>
    )
  }

  const getAvatarFallback = (name: string) => {
    if (!name) return ""
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="min-h-screen">
      {/* Hidden file input for avatar upload */}
      <input
        type="file"
        accept="image/*"
        onChange={handleAvatarChange}
        className="hidden"
        id="avatar-upload"
      />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={handleGoBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chi tiết khách mời</h1>
            <p className="text-sm text-gray-500">
              {isEditMode ? `Chỉnh sửa thông tin của ${person.fullName}` : `Thông tin chi tiết của ${person.fullName}`}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {isEditMode ? (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsEditMode(false)}>
                <X className="w-4 h-4 mr-2" />
                Hủy
              </Button>
              <Button size="sm" onClick={handleUpdate} disabled={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Đang xử lý..." : "Lưu"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsEditMode(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Xóa
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn xóa khách mời này? Hành động này không thể hoàn tác.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                      Xóa
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Thông tin cơ bản */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Thông tin cá nhân</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage
                      src={`data:image/jpeg;base64,${person.avatarUrl}`}
                      alt={person.fullName}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-3xl">{getAvatarFallback(person.fullName)}</AvatarFallback>
                  </Avatar>
                  {isEditMode && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  {isEditMode && avatarFile && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-700">
                        <strong>Ảnh mới đã chọn:</strong> {avatarFile.name}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Ảnh sẽ được upload khi bạn nhấn "Lưu"
                      </p>
                    </div>
                  )}
                  <div>
                    {isEditMode ? (
                      <Input
                        value={formData.fullName || ""}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className="text-xl font-semibold"
                      />
                    ) : (
                      <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                        <span>{person.fullName}</span>
                        {person.isVip && <Star className="w-5 h-5 text-yellow-400 fill-current" />}
                      </h3>
                    )}
                    {isEditMode ? (
                      <div className="flex items-center space-x-4 mt-2">
                        <Select
                          value={formData.status ? "true" : "false"}
                          onValueChange={(value) => handleInputChange("status", value === "true")}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Trạng thái" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Hoạt động</SelectItem>
                            <SelectItem value="false">Không hoạt động</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <Badge
                        variant={person.status ? "default" : "secondary"}
                        className={
                          person.status ? "bg-green-100 text-green-800 mt-2" : "bg-gray-100 text-gray-800 mt-2"
                        }
                      >
                        {person.status ? "Hoạt động" : "Không hoạt động"}
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoField
                      icon={<Mail />}
                      label="Email"
                      value={person.email}
                      isEditMode={isEditMode}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      formDataValue={formData.email}
                    />
                    <InfoField
                      icon={<Phone />}
                      label="Số điện thoại"
                      value={person.phone}
                      isEditMode={isEditMode}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      formDataValue={formData.phone}
                    />
                    <InfoField
                      icon={<Briefcase />}
                      label="Chức vụ"
                      value={person.position}
                      isEditMode={isEditMode}
                      onChange={(e) => handleInputChange("position", e.target.value)}
                      formDataValue={formData.position}
                    />
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 text-gray-400 mt-3 self-start" />
                      <div className="w-full">
                        <p className="text-sm text-gray-500">Giới tính</p>
                        {isEditMode ? (
                          <Select
                            value={formData.gender || ""}
                            onValueChange={(value) => handleInputChange("gender", value)}
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
                        ) : (
                          <p className="text-sm font-medium">{translateGender(person.gender)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thông tin vé & đồ ăn */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin vé & sản phẩm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InfoField
                  label="Số ghế"
                  value={person.seatInfo?.seatNumber || "Chưa có"}
                  isEditMode={isEditMode}
                  onChange={(e) => handleSeatInfoChange("seatNumber", e.target.value)}
                  formDataValue={formData.seatInfo?.seatNumber}
                />
                <InfoField
                  label="Giá vé đã trả"
                  value={person.seatInfo?.paidPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) || "0 VND"}
                  isEditMode={isEditMode}
                  type="number"
                  onChange={(e) => handleSeatInfoChange("paidPrice", Number(e.target.value))}
                  formDataValue={formData.seatInfo?.paidPrice}
                />
              </div>
              <div>
                <h4 className="font-medium mb-2">Sản phẩm đã mua:</h4>
                {person.items && person.items.length > 0 ? (
                  <ul className="space-y-2 list-disc pl-5">
                    {person.items.map((item) => (
                      <li key={item.id} className="text-sm">
                        {item.itemName} (x{item.quantity}) -{" "}
                        {item.totalAmount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">Chưa mua sản phẩm nào.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Thông tin đăng ký */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Thông tin hệ thống</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Ngày tạo</p>
                  <p className="text-sm font-medium">{new Date(person.createdAt).toLocaleString("vi-VN")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
                  <p className="text-sm font-medium">{new Date(person.updatedAt).toLocaleString("vi-VN")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Loại khách</p>
                  <p className="text-sm font-medium">{person.isVip ? "VIP" : "Thường"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Component phụ để hiển thị trường thông tin
const InfoField = ({
  icon,
  label,
  value,
  isEditMode,
  onChange,
  formDataValue,
  type = "text",
}: {
  icon?: React.ReactNode
  label: string
  value: any
  isEditMode: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  formDataValue: any
  type?: string
}) => (
  <div className="flex items-center space-x-3">
    {icon && <div className="w-4 h-4 text-gray-400 mt-3 self-start">{icon}</div>}
    <div className="w-full">
      <p className="text-sm text-gray-500">{label}</p>
      {isEditMode ? (
        <Input type={type} value={formDataValue || ""} onChange={onChange} />
      ) : (
        <p className="text-sm font-medium">{value}</p>
      )}
    </div>
  </div>
)
