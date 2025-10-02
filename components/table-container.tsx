import React from "react"
import { cn } from "@/lib/utils"

interface TableContainerProps {
  children: React.ReactNode
  className?: string
}

/**
 * @fileoverview Component TableContainer để wrap table với layout cố định
 * @description Đảm bảo table không bị scroll ngang và có border/shadow đồng nhất
 * @version 1.0.0
 * @since 2025-10-03
 * @author Dũng Đàm
 * 
 * @example
 * <TableContainer>
 *   <table className="w-full table-fixed">
 *     ...
 *   </table>
 * </TableContainer>
 */
export function TableContainer({ children, className }: TableContainerProps) {
  return (
    <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200", className)}>
      <div className="w-full">
        {children}
      </div>
    </div>
  )
}

