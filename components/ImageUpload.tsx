"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Camera, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface ImageUploadProps {
  file?: File | null
  onChange: (file: File | null) => void
  label?: string
  disabled?: boolean
}

export function ImageUpload({ file, onChange, label, disabled }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast({
        title: "❌ Dosya çok büyük",
        description: "Dosya boyutu maksimum 5MB olmalıdır",
        variant: "destructive",
      })
      return
    }

    // Validate file type
    if (!selectedFile.type.startsWith("image/")) {
      toast({
        title: "❌ Geçersiz dosya tipi",
        description: "Sadece resim dosyaları yüklenebilir",
        variant: "destructive",
      })
      return
    }

    // Create preview URL
    const url = URL.createObjectURL(selectedFile)
    setPreviewUrl(url)
    onChange(selectedFile)

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    onChange(null)
  }

  const cloudinaryConfigured = 
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && 
    process.env.NEXT_PUBLIC_CLOUDINARY_RECEIPT_PRESET

  if (!cloudinaryConfigured) {
    return (
      <div className="space-y-2">
        {label && <Label className="text-xs sm:text-sm text-muted-foreground">{label}</Label>}
        <div className="p-4 border border-dashed rounded-lg bg-muted/50 text-center">
          <p className="text-sm text-muted-foreground">
            Fatura yükleme şu anda kullanılamıyor
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {label && <Label className="text-xs sm:text-sm text-muted-foreground">{label}</Label>}
      
      {previewUrl ? (
        // Preview state - compact
        <div className="relative group">
          <div className="relative w-full h-28 sm:h-32 rounded-lg overflow-hidden border bg-muted/50">
            <Image 
              src={previewUrl} 
              alt="Receipt Preview" 
              fill
              className="object-contain"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute top-1 right-1 h-7 w-7 p-0 bg-black/70 hover:bg-black/90 text-white rounded-full"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        // Upload button - modern & compact
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={disabled}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Camera className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Fatura Yükle</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">• Max 5MB</span>
          </button>
        </div>
      )}
    </div>
  )
}

// Export upload function to be called from parent
export async function uploadReceiptToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_RECEIPT_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary not configured")
  }

  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", uploadPreset)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  )

  if (!response.ok) {
    throw new Error("Upload failed")
  }

  const data = await response.json()
  return data.secure_url
}
