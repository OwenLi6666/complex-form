import { CompanyForm } from "./components/CompanyForm"

export default function Home() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">公司信息表单</h1>
      <CompanyForm />
    </main>
  )
} 