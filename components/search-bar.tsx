import React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

/**
 * @fileoverview Component SearchBar tái sử dụng cho tìm kiếm
 * @description Input search với icon kính lúp
 * @version 1.0.0
 * @since 2025-10-03
 * @author Dũng Đàm
 * 
 * @example
 * <SearchBar
 *   value={searchTerm}
 *   onChange={setSearchTerm}
 *   placeholder="Tìm kiếm theo tên"
 * />
 */
export function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Tìm kiếm...",
  className = "w-64"
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  )
}

