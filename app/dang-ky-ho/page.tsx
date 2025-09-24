"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { StepIndicator } from "@/components/step-indicator"
import { CustomerList } from "@/components/customer-list"
import { SeatMap } from "@/components/seat-map"
import { FoodComboModal } from "@/components/food-combo-modal"
import { SuccessModal } from "@/components/success-modal"
import { User, Info, Plane, Utensils, Minus, Plus } from "lucide-react"

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
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [customerInfo, setCustomerInfo] = useState({
    name: "NGUYEN VAN A",
    email: "nguyenvana@email.com",
  })
  const [autoRegister, setAutoRegister] = useState(false)
  const [faceIdImage, setFaceIdImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedCombo, setSelectedCombo] = useState<FoodCombo | null>(null)
  const [showComboModal, setShowComboModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [combos, setCombos] = useState<FoodCombo[]>([
    {
      id: 1,
      name: "Combo 1",
      description: "bao gồm 1 nước 1 bim bim",
      price: 40000,
      image: "/snack-combo.jpg",
      details:
        "Lorem ipsum vens telelägt. Rejogt fara men fal eller sosösor inte nor. Mysös bibid, i senoledes hypovell. Eur joren visaktiga att endotet krolur. Prost aska om apomodern då trekvartspudel nos. Gigar selung för att vavovas, i homorenas kötin. Skamma hypongar bivis i tenejist ongen. Disysade sörat. Efterföljarsskap tör de bijan. Nuvänar tögärade. Netisonade reabel terak i prejybelt. Monorar deka",
      quantity: 0,
    },
    {
      id: 2,
      name: "Combo 2",
      description: "bao gồm 1 nước",
      price: 15000,
      image: "/refreshing-cola.png",
      details: "Combo bao gồm 1 lon nước ngọt Coca Cola 330ml, thích hợp để giải khát trong suốt sự kiện.",
      quantity: 0,
    },
    {
      id: 3,
      name: "Combo 3",
      description: "thịt bò và rau",
      price: 80000,
      image: "/beef-and-vegetables.jpg",
      details: "Combo thịt bò nướng với rau củ tươi ngon, bổ dưỡng và đầy đủ chất dinh dưỡng.",
      quantity: 0,
    },
    {
      id: 4,
      name: "Combo 4",
      description: "hamburger và khoai tây chiên",
      price: 120000,
      image: "/hamburger-and-fries.jpg",
      details: "Hamburger thơm ngon với khoai tây chiên giòn rụm, món ăn nhanh được yêu thích.",
      quantity: 0,
    },
    {
      id: 5,
      name: "Combo 5",
      description: "phở và trà đá",
      price: 100000,
      image: "/pho-and-iced-tea.jpg",
      details: "Tô phở Việt Nam truyền thống với nước dùng đậm đà, kèm theo ly trà đá mát lạnh.",
      quantity: 0,
    },
  ])

  // Các bước trong quy trình đăng ký
  const steps = [
    { number: 1, title: "Khách hàng", subtitle: "Chọn từ danh sách", icon: User },
    { number: 2, title: "Lấy thông tin", subtitle: "Face ID để tham gia", icon: Info },
    { number: 3, title: "Ghế ngồi", subtitle: "Chọn vị trí trong hội nghị", icon: Plane },
    { number: 4, title: "Khu trải nghiệm", subtitle: "Đồ ăn, thức uống trong hội nghị", icon: Utensils },
  ]

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      // Hiển thị modal thành công khi hoàn thành
      setShowSuccessModal(true)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComboClick = (combo: FoodCombo) => {
    setSelectedCombo(combo)
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFaceIdImage(e.target?.result as string)
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
        return <CustomerList onSelect={setSelectedCustomer} />
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
              <h3 className="font-medium">Đăng ký nhận điện tử động</h3>
              <p className="text-sm text-gray-600">
                * Anh được dùng để hỗ thông nhận điện khi ban đến Hội nghị, giúp thu tục check-in diễn ra nhanh và thuận
                tiện hơn. Thông tin sẽ được quản lý an toàn và được xóa bỏ ngay khi sự kiện kết thúc.
              </p>
              <div className="flex items-center space-x-2">
                <Checkbox id="auto-register" checked={autoRegister} onCheckedChange={setAutoRegister} />
                <Label htmlFor="auto-register" className="text-sm">
                  Tôi đồng ý đăng ký nhận thông tin tự động
                </Label>
              </div>
            </div>

            <Card
              className="border-2 border-dashed border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
              onClick={handleImageClick}
            >
              <CardContent className="flex items-center justify-center py-12">
                {faceIdImage ? (
                  <div className="text-center">
                    <img
                      src={faceIdImage || "/placeholder.svg"}
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
        return <SeatMap />
      case 4:
        return (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {combos.map((combo) => (
                <Card
                  key={combo.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleComboClick(combo)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={combo.image || "/placeholder.svg"}
                        alt={combo.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{combo.name}</h3>
                        <p className="text-sm text-gray-600">{combo.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg">{combo.price.toLocaleString()}đ</span>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            updateComboQuantity(combo.id, -1)
                          }}
                          disabled={combo.quantity === 0}
                          className="w-8 h-8 p-0"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{combo.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            updateComboQuantity(combo.id, 1)
                          }}
                          className="w-8 h-8 p-0 text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      default:
        return null
    }
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
        <Button onClick={handleNext} className="bg-orange-500 hover:bg-orange-600">
          {currentStep === 4 ? "Hoàn tất" : "Tiếp tục"}
        </Button>
      </div>

      {selectedCombo && (
        <FoodComboModal
          isOpen={showComboModal}
          onClose={() => setShowComboModal(false)}
          combo={selectedCombo}
          onConfirm={handleComboConfirm}
        />
      )}

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
    </div>
  )
}
