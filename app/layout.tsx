import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "公司表单",
  description: "公司信息表单",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
} 