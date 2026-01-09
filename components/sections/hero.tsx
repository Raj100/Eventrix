"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Own Your Production</h1>
            <p className="text-lg md:text-xl mb-8 opacity-90 text-pretty">
              Create stunning custom prints on mugs, t-shirts, business cards, and more. Premium quality, affordable
              prices, exceptional designs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto">
                  Shop Now
                </Button>
              </Link>
              <Link href="/custom-design">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 w-full sm:w-auto bg-transparent"
                >
                  Design Custom
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-muted rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl font-bold text-muted-foreground">Product Preview</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
