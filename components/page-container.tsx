/**
 * @fileoverview Component container cho các trang
 * Đảm bảo tất cả các trang có chiều rộng cố định, tránh scroll ngang
 * @version 1.0.0
 * @since 2025-10-02
 * @author Dũng Đàm
 */

import type React from "react"

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

/**
 * Component PageContainer
 * Bọc nội dung trang với chiều rộng cố định, tránh scroll ngang
 * @param children - Nội dung trang
 * @param className - Class CSS tùy chỉnh (optional)
 */
export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className={`w-full max-w-[100vw] overflow-x-hidden ${className}`}>
      {children}
    </div>
  )
}

