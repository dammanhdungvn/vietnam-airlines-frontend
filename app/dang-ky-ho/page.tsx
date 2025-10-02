"use client"

import type React from "react"

import { useState, useRef, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { StepIndicator } from "@/components/step-indicator"
import { CustomerList } from "@/components/customer-list"
import { SeatMapInteractive } from "@/components/seat-map-interactive"
import { FoodComboModal } from "@/components/food-combo-modal"
import { SuccessModal } from "@/components/success-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageContainer } from "@/components/page-container"

import { useToast } from "@/hooks/use-toast";
import { ISeat } from "@/types/seat.type"
import { getSeatsInfo } from "@/services/seat.service"
import { IItem, IItemData } from "@/types/item.type"
import { getItems } from "@/services/item.service"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, Info, Plane, Utensils, Minus, Plus, RefreshCw } from "lucide-react"
import {
  getPersonsPaginated,
  validateAndUploadFace,
  registerOrUpdatePerson,
  GetPersonsParams,
  addPerson,
} from "@/services/person.service"
import {
  PaginatedApiResponse,
  Person,
  RegistrationPayload,
  AddPersonPayload,
} from "@/types/person.type"

interface FoodCombo {
  id: number
  name: string
  description: string
  price: number
  image: string
  details: string
  quantity: number
}

/**
 * Trang đăng ký hộ - Quy trình đăng ký khách hàng tham gia sự kiện
 * Bao gồm 4 bước: Chọn khách hàng, Lấy thông tin, Chọn ghế, Khu trải nghiệm
 */
export default function DangKyHoPage() {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedCustomer, setSelectedCustomer] = useState<Person | null>(null)
  const [customerInfo, setCustomerInfo] = useState({
    name: "NGUYEN VAN A",
    email: "nguyenvana@email.com",
  })
  const [hasAgreed, setHasAgreed] = useState(false)
  const [faceIdImage, setFaceIdImage] = useState<File | null>(null)
  const [faceIdImageUrl, setFaceIdImageUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingFace, setIsUploadingFace] = useState(false)
  
  // States for step 3: Seat selection
  const [seats, setSeats] = useState<ISeat[]>([])
  const [selectedSeat, setSelectedSeat] = useState<ISeat | null>(null)
  const [isLoadingSeats, setIsLoadingSeats] = useState(false)

  // States for step 4: Item selection
  const [items, setItems] = useState<IItem[]>([])
  const [selectedItems, setSelectedItems] = useState<Map<number, number>>(new Map()) // Map<itemId, quantity>
  const [isLoadingItems, setIsLoadingItems] = useState(false)
  const [combos, setCombos] = useState<FoodCombo[]>([]);
  const [selectedCombo, setSelectedCombo] = useState<FoodCombo | null>(null);
  
  const [showComboModal, setShowComboModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [personsResponse, setPersonsResponse] = useState<PaginatedApiResponse<Person> | null>(null)
  const [allPersons, setAllPersons] = useState<Person[]>([])
  const [clientPage, setClientPage] = useState(0)
  const [clientSize, setClientSize] = useState(10)
  const [searchTermFull, setSearchTermFull] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<{ title: string; message: string } | null>(null)
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // States for quick add customer modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newPersonData, setNewPersonData] = useState<AddPersonPayload>({
    email: "",
    fullName: "",
    phone: "",
    position: "",
    avatarUrl: "",
    status: "TRUE",
    isVip: "NORMAL",
    gender: "MALE",
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isSubmittingNewPerson, setIsSubmittingNewPerson] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  // Remove hardcoded combos
  
  // Hàm tải danh sách khách hàng
  const fetchPersonsFull = async () => {
    setIsLoading(true)
    try {
      const initial = await getPersonsPaginated({ page: 0, size: 1, sortBy: 'personId', sortDir: 'asc' })
      const total = initial.totalElements || 0
      if (total > 0) {
        const all = await getPersonsPaginated({ page: 0, size: total, sortBy: 'personId', sortDir: 'asc' })
        setAllPersons(all.content)
        // dựng response phân trang đầu tiên theo client
        const sliced = all.content.slice(0, clientSize)
        setPersonsResponse({
          content: sliced,
          page: 0,
          size: clientSize,
          totalElements: all.content.length,
          totalPages: Math.max(1, Math.ceil(all.content.length / clientSize)),
          first: true,
          last: all.content.length <= clientSize,
        })
      } else {
        setAllPersons([])
        setPersonsResponse({ content: [], page: 0, size: clientSize, totalElements: 0, totalPages: 0, first: true, last: true })
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách khách hàng. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Tải dữ liệu lần đầu
  useEffect(() => {
    if (currentStep === 1 && allPersons.length === 0) {
      fetchPersonsFull()
    }
    // Fetch seats for step 3
    if (currentStep === 3 && seats.length === 0) {
      fetchSeats()
    }
    // Fetch items for step 4
    if (currentStep === 4 && items.length === 0) {
      fetchItems()
    }
  }, [currentStep])

  // Prefill ảnh khuôn mặt từ khách đã chọn (nếu có)
  useEffect(() => {
    if (selectedCustomer?.avatarUrl) {
      const raw = selectedCustomer.avatarUrl
      const isDataUrl = raw.startsWith("data:")
      const isHttpUrl = raw.startsWith("http://") || raw.startsWith("https://")
      const normalized = isDataUrl || isHttpUrl ? raw : `data:image/jpeg;base64,${raw}`
      setFaceIdImageUrl(normalized)
    }
  }, [selectedCustomer])

  /**
   * @function fetchSeats
   * @description Lấy dữ liệu tất cả các ghế cho sơ đồ.
   */
  const fetchSeats = async () => {
    setIsLoadingSeats(true)
    try {
      // First call to get totalElements
      const initialData = await getSeatsInfo({ page: 0, size: 1, sortBy: 'id', sortDir: 'asc' });
      const totalElements = initialData.totalElements;

      if (totalElements > 0) {
        // Second call to get all seats
        const allSeatsData = await getSeatsInfo({ page: 0, size: totalElements, sortBy: 'id', sortDir: 'asc' });
        setSeats(allSeatsData.content);
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải sơ đồ ghế. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSeats(false)
    }
  }

  /**
   * @function fetchItems
   * @description Lấy dữ liệu tất cả các sản phẩm.
   */
  const fetchItems = async () => {
    setIsLoadingItems(true);
    try {
      const initialData = await getItems({ page: 0, size: 1 });
      const totalElements = initialData.totalElements;

      if (totalElements > 0) {
        const allItemsData = await getItems({ page: 0, size: totalElements, sortBy: 'id', sortDir: 'asc' });
        setItems(allItemsData.content);
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách sản phẩm. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingItems(false);
    }
  };

  const totalItemPrice = useMemo(() => {
    let total = 0;
    for (const [itemId, quantity] of selectedItems.entries()) {
        const item = items.find(i => i.id === itemId);
        if (item) {
            total += item.price * quantity;
        }
    }
    return total;
  }, [selectedItems, items]);

  /**
   * Lọc danh sách khách hàng theo từ khóa và loại bỏ người đã đăng ký ghế
   * @param list - Danh sách khách hàng gốc
   * @param keyword - Từ khóa tìm kiếm
   * @returns Danh sách đã được lọc
   */
  const filterPersons = (list: Person[], keyword: string) => {
    const kw = keyword.trim().toLowerCase()
    
    // Lọc bỏ những người đã đăng ký ghế
    let filtered = list.filter(p => !p.seatInfo || !p.seatInfo.seatNumber)
    
    // Nếu có từ khóa, tiếp tục lọc theo tên, email, chức vụ
    if (kw) {
      filtered = filtered.filter(p =>
        p.fullName.toLowerCase().includes(kw) ||
        p.email.toLowerCase().includes(kw) ||
        p.position.toLowerCase().includes(kw)
      )
    }
    
    return filtered
  }

  // Recompute client-side pagination when search term or page/size changes
  useEffect(() => {
    if (currentStep !== 1) return
    const base = filterPersons(allPersons, searchTermFull)
    const totalPages = Math.max(1, Math.ceil(base.length / clientSize))
    const safePage = Math.min(clientPage, totalPages - 1)
    const sliced = base.slice(safePage * clientSize, safePage * clientSize + clientSize)
    setPersonsResponse({
      content: sliced,
      page: safePage,
      size: clientSize,
      totalElements: base.length,
      totalPages: base.length === 0 ? 0 : totalPages,
      first: safePage === 0,
      last: safePage >= totalPages - 1,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTermFull, clientPage, clientSize, allPersons, currentStep])

  // Các bước trong quy trình đăng ký
  const steps = [
    { number: 1, title: "Khách hàng", subtitle: "Chọn từ danh sách", icon: User },
    { number: 2, title: "Lấy thông tin", subtitle: "Face ID để tham gia", icon: Info },
    { number: 3, title: "Ghế ngồi", subtitle: "Chọn vị trí trong hội nghị", icon: Plane },
    { number: 4, title: "Khu trải nghiệm", subtitle: "Đồ ăn, thức uống trong hội nghị", icon: Utensils },
  ]

  const handleNext = async () => {
    // Step 1 validation
    if (currentStep === 1) {
      if (!selectedCustomer) {
        toast({ title: "Vui lòng chọn một khách hàng", variant: "destructive" })
        return
      }
      setCustomerInfo({
        name: selectedCustomer.fullName,
        email: selectedCustomer.email,
      })
    }

    // Step 2 validation and API call
    if (currentStep === 2) {
      if (!hasAgreed) {
        toast({ title: "Bạn phải đồng ý với điều khoản", variant: "destructive" })
        return
      }
      if (!selectedCustomer) {
        toast({ title: "Không tìm thấy thông tin khách hàng", variant: "destructive" })
        return
      }
      
      // Kiểm tra xem khách hàng đã có ảnh nhận diện chưa
      const hasExistingImage = Boolean(selectedCustomer.avatarUrl)
      const hasNewImage = Boolean(faceIdImage)
      
      // Bắt buộc phải có ảnh (cũ hoặc mới) mới được next
      if (!hasExistingImage && !hasNewImage) {
        setError({ 
          title: "Chưa có ảnh nhận diện", 
          message: "Khách hàng chưa có ảnh nhận diện. Vui lòng tải lên ảnh Face ID để tiếp tục." 
        })
        return
      }

      setIsUploadingFace(true);
      try {
        // Nếu có ảnh mới thì upload
        if (hasNewImage) {
          const response = await validateAndUploadFace(selectedCustomer.personId, faceIdImage!);
          if (response.code !== 200) {
            setError({ title: "Xác thực khuôn mặt thất bại", message: response.message })
            return // Stop moving to next step
          }
          toast({ title: "Xác thực khuôn mặt thành công" })
        } else if (hasExistingImage) {
          // Nếu đã có ảnh cũ, chỉ cần thông báo
          toast({ title: "Khách hàng đã có ảnh nhận diện" })
        }
      } catch (error) {
        setError({ title: "Lỗi", message: "Có lỗi xảy ra khi tải ảnh lên." })
        return // Stop moving to next step
      } finally {
        setIsUploadingFace(false)
      }
    }
    
    // Step 3 validation
    if (currentStep === 3) {
      if (!selectedSeat) {
        toast({ title: "Vui lòng chọn một ghế ngồi", variant: "destructive" })
        return
      }
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      // Final submission logic
      if (!selectedCustomer) return;

      const itemsPayload = Array.from(selectedItems.entries())
        .filter(([, quantity]) => quantity > 0)
        .map(([itemId, quantity]) => {
          const item = items.find(i => i.id === itemId);
          return {
            itemId,
            quantity,
            paidAmount: (item?.price || 0) * quantity,
          };
        });

      // seatInfo: ưu tiên ghế mới nếu có; ngược lại dùng ghế cũ (nếu có)
      const mergedSeatInfo = selectedSeat
        ? { seatNumber: selectedSeat.seatNumber, paidPrice: selectedSeat.basePrice ?? 0 }
        : (selectedCustomer.seatInfo
            ? { seatNumber: selectedCustomer.seatInfo.seatNumber, paidPrice: selectedCustomer.seatInfo.paidPrice ?? 0 }
            : null)

      // DỮ LIỆU ĐẦY ĐỦ: lấy dữ liệu cũ làm baseline, override những trường người dùng chỉnh
      const fullPayload: any = {
        email: customerInfo.email || selectedCustomer.email,
        fullName: customerInfo.name || selectedCustomer.fullName,
        position: selectedCustomer.position,
        phone: selectedCustomer.phone,
        gender: selectedCustomer.gender,
        status: selectedCustomer.status,
        isVip: selectedCustomer.isVip,
        seatInfo: mergedSeatInfo,
        items: itemsPayload,
      }

      try {
        // Chuẩn hóa payload
        const safePayload = {
          ...fullPayload,
          ...(fullPayload.gender ? { gender: String(fullPayload.gender).toUpperCase() } : {}),
          ...(typeof fullPayload.status === 'boolean' ? { status: Boolean(fullPayload.status) } : {}),
        }
        if (!safePayload.seatInfo) delete (safePayload as any).seatInfo
        if (!safePayload.items?.length) delete (safePayload as any).items

        const response = await registerOrUpdatePerson(safePayload as any);
        if (response.code === 200) {
          setShowSuccessModal(true);
          // Refresh trang sau 2 giây
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        } else {
           let errorMessage = response.message || "Dữ liệu không hợp lệ.";
           if (response.data && typeof response.data === 'object') {
                const validationErrors = Object.values(response.data).join('\n');
                if (validationErrors) {
                    errorMessage = `${errorMessage}\n${validationErrors}`;
                }
            }
           setError({
            title: "Đăng ký thất bại",
            message: errorMessage,
          });
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi đăng ký."
        setError({
          title: "Lỗi",
          message: errorMessage,
        });
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComboClick = (combo: FoodCombo) => {
    setShowComboModal(true)
  }

  const handleComboConfirm = (quantity: number) => {
    if (selectedCombo) {
      setCombos((prev) => prev.map((combo) => (combo.id === selectedCombo.id ? { ...combo, quantity } : combo)))
    }
  }

  const updateComboQuantity = (comboId: number, change: number) => {
    setCombos((prev) =>
      prev.map((combo) =>
        combo.id === comboId ? { ...combo, quantity: Math.max(0, combo.quantity + change) } : combo,
      ),
    )
  }

  const updateItemQuantity = (itemId: number, change: number) => {
    const newQuantity = Math.max(0, (selectedItems.get(itemId) || 0) + change);
    const newSelectedItems = new Map(selectedItems);
    if (newQuantity === 0) {
      newSelectedItems.delete(itemId);
    } else {
      newSelectedItems.set(itemId, newQuantity);
    }
    setSelectedItems(newSelectedItems);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFaceIdImage(file) // Store the File object
      const reader = new FileReader()
      reader.onload = (e) => {
        setFaceIdImageUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  // Handle avatar change for quick add modal
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewPersonData(prev => ({ ...prev, avatarUrl: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle quick add new person
  const handleQuickAddSubmit = async () => {
    if (!newPersonData.fullName || !newPersonData.email) {
      toast({
        title: "Vui lòng điền các trường bắt buộc (Họ tên, Email).",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingNewPerson(true)
    try {
      const createResponse = await addPerson(newPersonData)
      
      if (avatarFile && createResponse?.data?.personId) {
        try {
          await validateAndUploadFace(createResponse.data.personId, avatarFile)
          toast({
            title: "Đã thêm khách mời mới và upload avatar thành công.",
          })
        } catch (avatarError) {
          toast({
            title: "Đã thêm khách mời mới nhưng upload avatar thất bại.",
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Đã thêm khách mời mới.",
        })
      }
      
      // Reset form and close modal
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
      
      // Reload the persons list
      await fetchPersonsFull()
    } catch (error) {
      toast({
        title: "Không thể thêm khách mời mới. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingNewPerson(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm khách mới
              </Button>
            </div>
            <CustomerList
              data={personsResponse}
              isLoading={isLoading}
              onSelect={setSelectedCustomer}
              selectedCustomer={selectedCustomer}
              onPageChange={(page) => {
                const base = filterPersons(allPersons, searchTermFull)
                setClientPage(page)
                const sliced = base.slice(page * clientSize, page * clientSize + clientSize)
                setPersonsResponse({
                  content: sliced,
                  page,
                  size: clientSize,
                  totalElements: base.length,
                  totalPages: Math.max(1, Math.ceil(base.length / clientSize)),
                  first: page === 0,
                  last: page >= Math.max(1, Math.ceil(base.length / clientSize)) - 1,
                })
              }}
              onSearch={(keyword) => {
                setSearchTermFull(keyword)
                setClientPage(0)
              }}
            />
          </div>
        )
      case 2:
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Đăng ký nhận diện tự động</h3>
              <p className="text-sm text-gray-600">
                * Ảnh được dùng để hỗ trợ nhận diện khi bạn đến Hội nghị, giúp thủ tục check-in diễn ra nhanh và thuận
                tiện hơn. Thông tin sẽ được quản lý an toàn và được xóa bỏ ngay khi sự kiện kết thúc.
              </p>
              <div className="flex items-center space-x-2">
                <Checkbox id="agreement" checked={hasAgreed} onCheckedChange={(checked) => setHasAgreed(checked as boolean)} />
                <Label htmlFor="agreement" className="text-sm">
                  Tôi đồng ý đăng ký nhận thông tin tự động
                </Label>
              </div>
            </div>

            <Card
              className="border-2 border-dashed border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
              onClick={handleImageClick}
            >
              <CardContent className="flex items-center justify-center py-12">
                {faceIdImageUrl ? (
                  <div className="text-center">
                    <img
                      src={faceIdImageUrl}
                      alt="Face ID"
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                    />
                    <p className="text-gray-700 font-medium">Ảnh Face ID hiện tại</p>
                    <p className="text-sm text-gray-500 mt-1">Click để thay đổi</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">+</span>
                    </div>
                    <p className="text-gray-500">Thêm ảnh Face ID</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>
        )
      case 3:
        return (
          <SeatMapInteractive 
            seats={seats}
            selectedSeat={selectedSeat}
            onSelectSeat={setSelectedSeat}
            isLoading={isLoadingSeats}
          />
        );
      case 4:
        return (
          <div className="max-w-4xl mx-auto">
            {isLoadingItems ? (
               <div className="flex items-center justify-center h-64">
                <div className="text-center" role="status">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-500" />
                  <p className="text-gray-600">Đang tải sản phẩm...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <Card
                    key={item.id}
                    className="flex flex-col"
                  >
                    <CardContent className="p-4 flex flex-col flex-grow">
                      <div className="flex-grow">
                        <h3 className="font-semibold">{item.itemName}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="font-bold text-lg text-orange-600">{item.price.toLocaleString('vi-VN')}đ</span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateItemQuantity(item.id, -1);
                            }}
                            disabled={(selectedItems.get(item.id) || 0) === 0}
                            className="w-8 h-8 p-0"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center font-semibold">{selectedItems.get(item.id) || 0}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateItemQuantity(item.id, 1);
                            }}
                            className="w-8 h-8 p-0"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {totalItemPrice > 0 && (
              <div className="mt-8 pt-4 border-t-2 border-dashed">
                <div className="flex justify-between items-center max-w-sm mx-auto">
                  <h3 className="text-lg font-semibold">Tổng tiền sản phẩm:</h3>
                  <p className="text-2xl font-bold text-orange-600">
                    {totalItemPrice.toLocaleString('vi-VN')}đ
                  </p>
                </div>
              </div>
            )}
          </div>
        )
      default:
        return null
    }
  }

  /**
   * Kiểm tra xem nút Tiếp tục có bị disable hay không
   * @returns true nếu nút bị disable, false nếu có thể click
   */
  const isNextButtonDisabled = () => {
    // Bước 1: Phải chọn khách hàng
    if (currentStep === 1 && !selectedCustomer) return true;
    
    // Bước 2: Phải đồng ý điều khoản VÀ phải có ảnh đại diện
    if (currentStep === 2) {
      const hasAnyImage = Boolean(faceIdImage) || Boolean(selectedCustomer?.avatarUrl)
      // Phải có cả checkbox đồng ý VÀ ảnh đại diện mới được tiếp tục
      if (!hasAgreed || !hasAnyImage) return true
    }
    
    // Bước 3: Phải chọn ghế
    if (currentStep === 3 && !selectedSeat) return true;
    
    // Disable khi đang upload face
    return isUploadingFace;
  }

  return (
    <PageContainer className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Đăng ký hộ</h1>
        <p className="text-gray-600 mt-2">Đăng ký hộ khách tại sự kiện</p>
      </div>

      {/* Chỉ báo bước */}
      <StepIndicator steps={steps} currentStep={currentStep} />

      {/* Nội dung bước hiện tại */}
      <div className="mt-8 mb-8">{renderStepContent()}</div>

      {/* Nút điều hướng */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
          Bỏ qua
        </Button>
        <Button onClick={handleNext} className="bg-orange-500 hover:bg-orange-600" disabled={isUploadingFace}>
          {isUploadingFace ? 'Đang xử lý...' : (currentStep === 4 ? "Hoàn tất" : "Tiếp tục")}
        </Button>
      </div>
      
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          // Reset về bước đầu hoặc chuyển hướng
          setCurrentStep(1)
        }}
        title="Đăng ký thành công"
        message="Cảm ơn bạn đã hoàn thành đăng ký!"
      />
      
      <AlertDialog open={!!error} onOpenChange={() => setError(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{error?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {error?.message.split('\n').map((line, i) => <p key={i}>{line}</p>)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setError(null)}>Đã hiểu</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Quick Add Customer Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thêm khách mời mới</DialogTitle>
          </DialogHeader>

          <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />

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
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)} disabled={isSubmittingNewPerson}>
              Hủy
            </Button>
            <Button 
              onClick={handleQuickAddSubmit} 
              className="bg-orange-500 hover:bg-orange-600"
              disabled={isSubmittingNewPerson}
            >
              {isSubmittingNewPerson ? "Đang xử lý..." : "Thêm khách mời"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
