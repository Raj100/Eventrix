"use client"

import { useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Hero } from "@/components/sections/hero"
import { FeaturedProducts } from "@/components/sections/featured-products"
import { HowItWorks } from "@/components/sections/how-it-works"
import { Categories } from "@/components/sections/categories"
import { Footer } from "@/components/layout/footer"
import { useProductStore } from "@/lib/zustand-store"
import { bannerApi } from "@/lib/api-client"

export default function Home() {
  const { setBanners } = useProductStore()

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const bannersData = await bannerApi.getAll()
        setBanners(bannersData)
      } catch (error) {
        console.error("Failed to fetch banners:", error)
      }
    }

    fetchBanners()
  }, [setBanners])

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Hero />
        <BentoGrid />
        <Categories />
        <FeaturedProducts />
        <HowItWorks />
      </main>
      <Footer />
    </>
  )
}

// Bento Grid Component with Admin-managed Banners
function BentoGrid() {
  const { banners } = useProductStore()

  const displayBanners = banners.slice(0, 6)

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Collections</h2>
          <p className="text-muted-foreground text-lg">Discover our curated selection of premium products</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
          {displayBanners.length > 0 ? (
            displayBanners.map((banner: any, index: number) => (
              <div
                key={banner._id || index}
                className={`relative overflow-hidden rounded-xl cursor-pointer hover:shadow-xl transition group ${
                  index === 0 ? "lg:col-span-2 lg:row-span-2" : ""
                }`}
              >
                <img
                  src={banner.image_url || "/placeholder.svg"}
                  alt={banner.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">{banner.title}</h3>
                  {banner.description && <p className="text-sm opacity-90">{banner.description}</p>}
                  {banner.link && (
                    <a
                      href={banner.link}
                      className="inline-block mt-4 bg-accent text-accent-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent/90 transition w-fit"
                    >
                      View Collection
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center h-96 bg-secondary rounded-lg">
              <p className="text-muted-foreground">No banners available</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
