"use client"

import { cn } from "@/lib/utils"
import { useState, useMemo, useEffect } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { PaginatedApiResponse, Person } from "@/types/person.type"
import { Button } from "./ui/button"
import { Skeleton } from "./ui/skeleton"

interface CustomerListProps {
  data: PaginatedApiResponse<Person> | null
  isLoading: boolean
  selectedCustomer: Person | null
  onSelect: (customer: Person) => void
  onPageChange: (page: number) => void
  onSearch?: (keyword: string) => void
}

/**
 * Component danh sách khách hàng
 * Hiển thị danh sách khách hàng từ API, có phân trang, tìm kiếm và trạng thái loading.
 */
export function CustomerList({ data, isLoading, selectedCustomer, onSelect, onPageChange, onSearch }: CustomerListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCustomers = useMemo(() => {
    if (!data) return []
    if (!searchTerm.trim()) return data.content

    return data.content.filter(
      (customer) =>
        customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.position.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [searchTerm, data])

  // Debounce chuyển keyword ra ngoài cho parent (nếu có)
  useEffect(() => {
    if (!onSearch) return
    const id = setTimeout(() => onSearch(searchTerm.trim()), 300)
    return () => clearTimeout(id)
  }, [searchTerm])

  const handleSelectCustomer = (customer: Person) => {
    onSelect(customer)
  }

  // Hàm render skeleton loaders
  const renderSkeletons = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <Card key={index}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))
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
        {isLoading
          ? renderSkeletons()
          : filteredCustomers.map((customer) => (
              <Card
                key={customer.personId}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedCustomer?.personId === customer.personId
                    ? "ring-2 ring-orange-500 bg-orange-50"
                    : "hover:bg-gray-50",
                )}
                onClick={() => handleSelectCustomer(customer)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        customer.avatarUrl
                          ? `data:image/jpeg;base64,${customer.avatarUrl}`
                          : "/placeholder-user.jpg"
                      }
                      alt={customer.fullName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{customer.fullName}</h3>
                      <p className="text-sm text-gray-600">{customer.position}</p>
                    </div>
                    {selectedCustomer?.personId === customer.personId && (
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {!isLoading && filteredCustomers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {searchTerm.trim()
            ? `Không tìm thấy khách hàng nào phù hợp với "${searchTerm}"`
            : "Không có dữ liệu khách hàng."}
        </div>
      )}

      {/* Phân trang */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <Button onClick={() => onPageChange(data.page - 1)} disabled={data.first}>
            Trang trước
          </Button>
          <span className="flex items-center px-4">
            Trang {data.page + 1} / {data.totalPages}
          </span>
          <Button onClick={() => onPageChange(data.page + 1)} disabled={data.last}>
            Trang sau
          </Button>
        </div>
      )}
    </div>
  )
}
