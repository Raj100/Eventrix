"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

const templates = {
  mug: [
    {
      id: "template-1",
      name: "Classic Text",
      preview: "/mug-template-classic-text.jpg",
      price: 0,
    },
    {
      id: "template-2",
      name: "Photo & Text",
      preview: "/mug-template-photo-and-text.jpg",
      price: 0,
    },
    {
      id: "template-3",
      name: "Gradient Design",
      preview: "/mug-template-gradient.jpg",
      price: 99,
      isPremium: true,
    },
    {
      id: "template-4",
      name: "Minimalist",
      preview: "/mug-minimalist-design.jpg",
      price: 0,
    },
  ],
  "business-card": [
    {
      id: "bc-1",
      name: "Professional",
      preview: "/business-card-professional.jpg",
      price: 0,
    },
    {
      id: "bc-2",
      name: "Creative",
      preview: "/business-card-creative.jpg",
      price: 0,
    },
    {
      id: "bc-3",
      name: "Premium Gold",
      preview: "/business-card-gold-premium.jpg",
      price: 149,
      isPremium: true,
    },
    {
      id: "bc-4",
      name: "Tech Startup",
      preview: "/tech-startup-business-card.jpg",
      price: 99,
      isPremium: true,
    },
  ],
}

interface TemplateSelectorProps {
  product: string
  onSelect: (template: string) => void
  onBack: () => void
}

export function TemplateSelector({ product, onSelect, onBack }: TemplateSelectorProps) {
  const productTemplates = templates[product as keyof typeof templates] || []

  return (
    <div className="mb-8">
      <Button variant="ghost" onClick={onBack} className="mb-6 gap-2">
        <ChevronLeft size={20} />
        Back
      </Button>

      <h2 className="text-2xl font-bold mb-6">Choose a Template</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {productTemplates.map((template) => (
          <Card
            key={template.id}
            className="overflow-hidden hover:shadow-lg transition cursor-pointer flex flex-col"
            onClick={() => onSelect(template.id)}
          >
            <div className="relative bg-muted h-48 flex items-center justify-center overflow-hidden group">
              <img
                src={template.preview || "/placeholder.svg"}
                alt={template.name}
                className="w-full h-full object-cover group-hover:scale-110 transition"
              />
              {template.isPremium && (
                <div className="top-2 right-2 bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-bold">
                  Premium
                </div>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold mb-2">{template.name}</h3>
              {template.price > 0 && <p className="text-sm text-accent font-bold">+₹{template.price}</p>}
            </div>
            <div className="p-4 border-t border-border">
              <Button size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                Use Template
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Upload Custom Design */}
      <div className="mt-12 p-8 border-2 border-dashed border-border rounded-lg text-center">
        <h3 className="text-xl font-bold mb-2">Or Upload Your Own Design</h3>
        <p className="text-muted-foreground mb-4">Have your own design? Upload a PNG, JPG, or PDF file (Max 10MB)</p>
        <div className="flex flex-col items-center gap-4">
          <div className="w-full max-w-md">
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.pdf"
              className="hidden"
              id="file-input"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  // Handle file upload
                  onSelect("custom-upload")
                }
              }}
            />
            <label htmlFor="file-input">
              <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <span>Choose File</span>
              </Button>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
