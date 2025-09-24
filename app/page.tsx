import { redirect } from "next/navigation"

/**
 * Trang chủ - Chuyển hướng về trang đăng nhập
 * Mặc định khi truy cập vào trang web sẽ chuyển về /login
 */
export default function HomePage() {
  redirect("/login")
}
