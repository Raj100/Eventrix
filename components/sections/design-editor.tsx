"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Type, ImageIcon, Download, Undo2 } from "lucide-react"
import { useDesignStore } from "@/lib/zustand-store"

interface DesignEditorProps {
  product: any
  template: any
}

export function DesignEditor({ product, template }: DesignEditorProps) {
  const { customDesign, updateCustomDesign, setUploadedImage } = useDesignStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const image = event.target?.result as string
        setUploadedImage(image)
        setUploadedFile(image)
      }
      reader.readAsDataURL(file)
    }
  }

  // Draw preview on canvas
  const drawPreview = () => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, 500, 500)
    ctx.fillStyle = "#f5f5f5"
    ctx.fillRect(0, 0, 500, 500)

    // Draw product mockup
    if (template?.preview_image) {
      const img = new Image()
      img.src = template.preview_image
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 500, 500)
        drawText(ctx)
      }
    } else {
      drawText(ctx)
    }
  }

  const drawText = (ctx: CanvasRenderingContext2D) => {
    ctx.save()
    ctx.translate(250, 250)
    ctx.rotate((customDesign.rotation * Math.PI) / 180)

    ctx.font = `${customDesign.fontSize}px Arial`
    ctx.fillStyle = customDesign.textColor
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    const lines = customDesign.text.split("\n")
    const lineHeight = customDesign.fontSize + 10
    const totalHeight = lineHeight * lines.length

    lines.forEach((line, i) => {
      const y = -totalHeight / 2 + i * lineHeight
      ctx.fillText(line, 0, y)
    })

    ctx.restore()
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Design Editor</h3>

        {/* Canvas Preview */}
        <div className="mb-6 bg-secondary rounded-lg p-4">
          <canvas
            ref={canvasRef}
            width={500}
            height={500}
            className="w-full border border-border rounded"
            onLoad={drawPreview}
          />
          <button onClick={drawPreview} className="mt-2 text-xs text-muted-foreground">
            Update Preview
          </button>
        </div>

        {/* Text Editor */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Text Content</label>
            <textarea
              value={customDesign.text}
              onChange={(e) => updateCustomDesign({ text: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground resize-none"
              rows={3}
              placeholder="Enter your text here..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">Font Size</label>
              <input
                type="range"
                min="12"
                max="60"
                value={customDesign.fontSize}
                onChange={(e) => updateCustomDesign({ fontSize: Number(e.target.value) })}
                className="w-full"
              />
              <span className="text-xs text-muted-foreground">{customDesign.fontSize}px</span>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Text Color</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={customDesign.textColor}
                  onChange={(e) => updateCustomDesign({ textColor: e.target.value })}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <span className="text-xs font-mono">{customDesign.textColor}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Rotation</label>
            <input
              type="range"
              min="0"
              max="360"
              value={customDesign.rotation}
              onChange={(e) => updateCustomDesign({ rotation: Number(e.target.value) })}
              className="w-full"
            />
            <span className="text-xs text-muted-foreground">{customDesign.rotation}°</span>
          </div>
        </div>
      </Card>

      {/* Tools */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Tools</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="bg-transparent gap-2">
            <Type size={18} />
            Add Text
          </Button>
          <label className="flex items-center justify-center gap-2 px-3 py-2 border border-input rounded-lg hover:bg-muted transition cursor-pointer">
            <ImageIcon size={18} />
            <span>Upload</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
          <Button onClick={drawPreview} variant="outline" className="bg-transparent gap-2">
            <Download size={18} />
            Refresh
          </Button>
          <Button variant="outline" className="bg-transparent gap-2">
            <Undo2 size={18} />
            Reset
          </Button>
        </div>
      </Card>

      {/* Designer Request */}
      <Card className="p-6 bg-secondary">
        <h3 className="text-lg font-bold mb-2">Need Professional Help?</h3>
        <p className="text-sm text-muted-foreground mb-4">Our expert designers can create a custom design for you</p>
        <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Request Custom Design</Button>
      </Card>
    </div>
  )
}
