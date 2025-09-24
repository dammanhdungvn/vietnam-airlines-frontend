"use client"

import { cn } from "@/lib/utils"
import { useState, useMemo } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface Customer {
  id: string
  name: string
  position: string
  avatar: string
}

interface CustomerListProps {
  onSelect: (customer: Customer) => void
}

/**
 * Component danh sách khách hàng
 * Hiển thị danh sách khách hàng có thể chọn để đăng ký
 */
export function CustomerList({ onSelect }: CustomerListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)

  // Dữ liệu mẫu khách hàng
  const customers: Customer[] = [
    { id: "1", name: "Đàm Mạnh Dũng", position: "Giám đốc chi nhánh", avatar: "/business-man-avatar.png" },
    { id: "2", name: "Nguyễn Văn An", position: "Phó giám đốc", avatar: "/business-woman-avatar.png" },
    { id: "3", name: "Trần Thị Mai", position: "Trưởng phòng", avatar: "/business-man-avatar.png" },
    { id: "4", name: "Lê Hoàng Minh", position: "Chuyên viên", avatar: "/business-woman-avatar.png" },
    { id: "5", name: "Phạm Thị Dung", position: "Kế toán trưởng", avatar: "/business-man-avatar.png" },
    { id: "6", name: "Vũ Đức Mạnh", position: "Nhân viên kinh doanh", avatar: "/business-woman-avatar.png" },
    { id: "7", name: "Hoàng Thị Diệu", position: "Thư ký", avatar: "/business-man-avatar.png" },
    { id: "8", name: "Bùi Văn Dương", position: "Tài xế", avatar: "/business-woman-avatar.png" },
  ]

  const filteredCustomers = useMemo(() => {
    if (!searchTerm.trim()) return customers

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.position.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [searchTerm])

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomerId(customer.id)
    onSelect(customer)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Danh sách khách hàng</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm theo tên hoặc chức vụ..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCustomers.map((customer) => (
          <Card
            key={customer.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              selectedCustomerId === customer.id ? "ring-2 ring-orange-500 bg-orange-50" : "hover:bg-gray-50",
            )}
            onClick={() => handleSelectCustomer(customer)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <img
                  src={customer.avatar || "/placeholder.svg"}
                  alt={customer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{customer.name}</h3>
                  <p className="text-sm text-gray-600">{customer.position}</p>
                </div>
                {selectedCustomerId === customer.id && (
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && searchTerm.trim() && (
        <div className="text-center py-8 text-gray-500">Không tìm thấy khách hàng nào phù hợp với "{searchTerm}"</div>
      )}
    </div>
  )
}
