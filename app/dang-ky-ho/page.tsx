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
import { User, Info, Plane, Utensils, Minus, Plus, RefreshCw } from "lucide-react"
import {
  getPersonsPaginated,
  validateAndUploadFace,
  registerOrUpdatePerson,
  GetPersonsParams,
} from "@/services/person.service"
import {
  PaginatedApiResponse,
  Person,
  RegistrationPayload,
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
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<{ title: string; message: string } | null>(null)

  // Remove hardcoded combos
  
  // Hàm tải danh sách khách hàng
  const fetchPersons = async (params: GetPersonsParams = {}) => {
    setIsLoading(true)
    try {
      const data = await getPersonsPaginated(params)
      setPersonsResponse(data)
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
    if (currentStep === 1) {
      fetchPersons()
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
      if (!faceIdImage || !selectedCustomer) {
        toast({ title: "Vui lòng tải lên ảnh Face ID", variant: "destructive" })
        return
      }

      setIsUploadingFace(true);
      try {
        const response = await validateAndUploadFace(selectedCustomer.personId, faceIdImage);
        if (response.code !== 200) {
          setError({ title: "Xác thực khuôn mặt thất bại", message: response.message })
          return // Stop moving to next step
        }
        toast({ title: "Xác thực khuôn mặt thành công" })
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

      const registrationPayload: RegistrationPayload = {
        email: customerInfo.email,
        fullName: customerInfo.name,
        position: selectedCustomer.position,
        phone: selectedCustomer.phone,
        gender: selectedCustomer.gender,
        status: selectedCustomer.status,
        seatInfo: selectedSeat ? {
          seatNumber: selectedSeat.seatNumber,
          paidPrice: selectedSeat.basePrice,
        } : null,
        items: itemsPayload,
      };

      try {
        const response = await registerOrUpdatePerson(registrationPayload);
        if (response.code === 200) {
          setShowSuccessModal(true);
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <CustomerList
            data={personsResponse}
            isLoading={isLoading}
            onSelect={setSelectedCustomer}
            selectedCustomer={selectedCustomer}
            onPageChange={(page) => fetchPersons({ page })}
          />
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
                    <p className="text-gray-700 font-medium">Ảnh Face ID đã chọn</p>
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

  const isNextButtonDisabled = () => {
    if (currentStep === 1 && !selectedCustomer) return true;
    if (currentStep === 2 && (!hasAgreed || !faceIdImage)) return true;
    if (currentStep === 3 && !selectedSeat) return true;
    return isUploadingFace;
  }

  return (
    <div className="p-8">
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
    </div>
  )
}
