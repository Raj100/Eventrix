"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle2, Upload, Eye, Zap } from "lucide-react"

const steps = [
  {
    number: "1",
    title: "Choose Product",
    description: "Browse our collection of printable items and select what you want to customize.",
    icon: CheckCircle2,
  },
  {
    number: "2",
    title: "Design or Upload",
    description: "Use our templates or upload your own design. Customize colors, text, and images.",
    icon: Upload,
  },
  {
    number: "3",
    title: "Preview & Review",
    description: "See how your design looks on the product before confirming your order.",
    icon: Eye,
  },
  {
    number: "4",
    title: "Order & Deliver",
    description: "Complete payment and we'll print and ship your custom items directly to you.",
    icon: Zap,
  },
]

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-balance">How It Works</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Creating your custom prints is simple and straightforward. Follow these four easy steps.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <Card key={step.number} className="p-6 text-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 text-2xl text-muted-foreground">
                    →
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
