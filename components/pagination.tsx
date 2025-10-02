import React from "react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number)  => void
  itemName?: string // Tên loại item để hiển thị (ghế, món, tài liệu, link...)
}

/**
 * @fileoverview Component Pagination tái sử dụng cho các trang danh sách
 * @description Hiển thị phân trang với số trang, nút điều hướng và thông tin tổng số item
 * @version 1.0.0
 * @since 2025-10-03
 * @author Dũng Đàm
 * 
 * @example
 * <Pagination
 *   currentPage={currentPage}
 *   totalPages={totalPages}
 *   totalItems={filteredData.length}
 *   itemsPerPage={10}
 *   onPageChange={handlePageChange}
 *   itemName="ghế"
 * />
 */
export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemName = "mục"
}: PaginationProps) {
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  if (totalItems === 0) {
    return null
  }

  return (
    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
      <div className="text-sm text-gray-700">
        Hiển thị {startIndex + 1} đến {Math.min(endIndex, totalItems)} trong tổng số {totalItems} {itemName}
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handlePrevious} 
          disabled={currentPage === 1}
        >
          ← Trước
        </Button>
        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page)}
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
                onClick={() => onPageChange(totalPages)}
                className={currentPage === totalPages ? "bg-orange-500 text-white" : ""}
              >
                {totalPages}
              </Button>
            </>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleNext} 
          disabled={currentPage === totalPages}
        >
          Sau →
        </Button>
      </div>
    </div>
  )
}

