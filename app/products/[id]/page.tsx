import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductDetailView } from "@/components/sections/product-detail"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params   // 👈 destructure properly

  console.log("PAGE ID:", id)
  const pid = String(id)
  console.log(typeof id,"rrr")

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {pid ?<ProductDetailView productId={pid} /> :""}
          {/* 👈 now a string */}
      </main>
      <Footer />
    </>
  )
}
