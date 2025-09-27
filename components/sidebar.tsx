"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3,
  Users,
  Plane,
  FileText,
  Utensils,
  LinkIcon,
  UserPlus,
  ChevronDown,
  ChevronRight,
  User,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/context/AuthContext"

/**
 * Component Sidebar - Thanh điều hướng chính của ứng dụng
 * Hiển thị logo Vietnam Airlines và các menu chính theo cấu trúc:
 * 1. Thống kê
 * 2. Administrator (submenu)
 * 3. Đăng ký hộ
 */
export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isAdminExpanded, setIsAdminExpanded] = useState(true)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const { user, logout } = useAuth()

  const adminMenuItems = [
    {
      title: "Quản lý khách mời",
      href: "/quan-ly-khach-moi",
      icon: Users,
    },
    {
      title: "Quản lý ghế",
      href: "/quan-ly-ghe",
      icon: Plane,
    },
    {
      title: "Quản lý đồ ăn",
      href: "/quan-ly-do-an",
      icon: Utensils,
    },
    {
      title: "Quản lý tài liệu",
      href: "/quan-ly-tai-lieu",
      icon: FileText,
    },
    {
      title: "Quản lý link trực tuyến",
      href: "/quan-ly-link-truc-tuyen",
      icon: LinkIcon,
    },
  ]

  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white border-r shadow-sm z-50">
      {/* Logo Vietnam Airlines */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Vietnam Airlines</h1>
            <p className="text-sm text-gray-500">Hệ thống quản lý</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <div className="space-y-1">
          {/* 1. Thống kê */}
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === "/dashboard"
                ? "bg-orange-50 text-orange-700 border-r-2 border-orange-500"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Thống kê</span>
          </Link>

          {/* 2. Administrator Section */}
          <div className="mt-4">
            <button
              onClick={() => setIsAdminExpanded(!isAdminExpanded)}
              className="flex items-center justify-between w-full p-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Administrator</span>
              </div>
              {isAdminExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {/* Submenu Administrator */}
            {isAdminExpanded && (
              <div className="ml-4 mt-2 space-y-1">
                {adminMenuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-orange-50 text-orange-700 border-r-2 border-orange-500"
                          : "text-gray-700 hover:bg-gray-100",
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* 3. Đăng ký hộ */}
          <Link
            href="/dang-ky-ho"
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mt-4",
              pathname === "/dang-ky-ho"
                ? "bg-orange-50 text-orange-700 border-r-2 border-orange-500"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            <UserPlus className="w-5 h-5" />
            <span>Đăng ký hộ</span>
          </Link>
        </div>
      </nav>

      {/* User Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-3 w-full hover:bg-gray-50 rounded-lg p-2 transition-colors">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">AD</span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-gray-900">Admin</p>
                <p className="text-xs text-gray-500 truncate">@adminaccount</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              {user?.username || "Tài khoản"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
