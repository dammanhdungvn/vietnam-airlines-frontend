import React from "react"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"

interface PageHeaderProps {
  title: string
  description?: string
  onAdd?: () => void
  addButtonText?: string
  showExport?: boolean
  onExport?: () => void
  children?: React.ReactNode
}

/**
 * @fileoverview Component PageHeader tái sử dụng cho header các trang
 * @description Hiển thị tiêu đề, mô tả và các action buttons (thêm mới, export...)
 * @version 1.0.0
 * @since 2025-10-03
 * @author Dũng Đàm
 * 
 * @example
 * <PageHeader
 *   title="Quản lý đồ ăn"
 *   description="Danh sách món ăn"
 *   onAdd={handleAdd}
 *   addButtonText="Thêm món mới"
 *   showExport
 *   onExport={handleExport}
 * />
 */
export function PageHeader({
  title,
  description,
  onAdd,
  addButtonText = "Thêm mới",
  showExport = false,
  onExport,
  children
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && <p className="text-gray-600 mt-1">{description}</p>}
      </div>
      <div className="flex items-center space-x-3">
        {showExport && onExport && (
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        )}
        {onAdd && (
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={onAdd}>
            <Plus className="w-4 h-4 mr-2" />
            {addButtonText}
          </Button>
        )}
        {children}
      </div>
    </div>
  )
}

