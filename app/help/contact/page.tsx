'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSettings } from '@/lib/settings-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { auth, db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react'
import Image from 'next/image'

export default function ContactSupportPage() {
  const router = useRouter()
  const { settings, t } = useSettings()
  const { toast } = useToast()
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Get user info if logged in
  const user = auth.currentUser
  if (user && !name) {
    setName(user.displayName || '')
    setEmail(user.email || '')
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: settings.language === 'tr' ? 'Hata' : 'Error',
          description: settings.language === 'tr' 
            ? 'Dosya boyutu 5MB\'dan küçük olmalıdır'
            : 'File size must be less than 5MB',
          variant: 'destructive',
        })
        return
      }
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImage(null)
    setImagePreview(null)
  }

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary not configured')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)
    formData.append('folder', 'support')

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error('Failed to upload image')
    }

    const data = await response.json()
    return data.secure_url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({
        title: settings.language === 'tr' ? 'Hata' : 'Error',
        description: settings.language === 'tr'
          ? 'Lütfen tüm zorunlu alanları doldurun'
          : 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast({
        title: settings.language === 'tr' ? 'Geçersiz Email' : 'Invalid Email',
        description: settings.language === 'tr'
          ? 'Lütfen geçerli bir email adresi girin'
          : 'Please enter a valid email address',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      let imageUrl: string | undefined

      // Upload image if present
      if (image) {
        setIsUploading(true)
        imageUrl = await uploadImageToCloudinary(image)
        setIsUploading(false)
      }

      // Save to Firestore
      await addDoc(collection(db, 'supportRequests'), {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        imageUrl: imageUrl || null,
        userId: user?.uid || null,
        status: 'pending',
        createdAt: serverTimestamp(),
      })

      // Success
      toast({
        title: settings.language === 'tr' ? 'Gönderildi!' : 'Submitted!',
        description: settings.language === 'tr'
          ? 'Mesajınız alındı. 24-48 saat içinde yanıt vereceğiz.'
          : 'Your message has been received. We\'ll respond within 24-48 hours.',
      })

      // Reset form
      setName(user?.displayName || '')
      setEmail(user?.email || '')
      setMessage('')
      setImage(null)
      setImagePreview(null)

      // Navigate back after 2 seconds
      setTimeout(() => {
        router.back()
      }, 2000)
    } catch (error) {
      console.error('Error submitting support request:', error)
      toast({
        title: settings.language === 'tr' ? 'Hata' : 'Error',
        description: settings.language === 'tr'
          ? 'Mesaj gönderilemedi. Lütfen tekrar deneyin.'
          : 'Failed to send message. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 max-w-4xl items-center px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {settings.language === 'tr' ? 'Geri' : 'Back'}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('contactSupport')}</h1>
          <p className="text-muted-foreground mt-2">
            {settings.language === 'tr'
              ? 'Sorularınız veya sorunlarınız için bize ulaşın. 24-48 saat içinde yanıt vereceğiz.'
              : 'Reach out to us for any questions or issues. We typically respond within 24-48 hours.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              {settings.language === 'tr' ? 'İsim Soyisim' : 'Full Name'}{' '}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={settings.language === 'tr' ? 'Adınız ve soyadınız' : 'Your full name'}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={settings.language === 'tr' ? 'ornek@email.com' : 'example@email.com'}
              required
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">
              {settings.language === 'tr' ? 'Mesajınız' : 'Your Message'}{' '}
              <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                settings.language === 'tr'
                  ? 'Sorununuzu veya önerinizi detaylıca açıklayın...'
                  : 'Describe your issue or suggestion in detail...'
              }
              rows={6}
              required
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>
              {settings.language === 'tr' ? 'Ekran Görüntüsü' : 'Screenshot'}{' '}
              <span className="text-muted-foreground text-sm font-normal">
                ({settings.language === 'tr' ? 'Opsiyonel' : 'Optional'})
              </span>
            </Label>
            <div className="border-2 border-dashed rounded-lg p-6">
              {!imagePreview ? (
                <label className="flex flex-col items-center cursor-pointer">
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground mb-1">
                    {settings.language === 'tr'
                      ? 'Fotoğraf yüklemek için tıklayın'
                      : 'Click to upload photo'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {settings.language === 'tr' ? 'Maks. 5MB' : 'Max 5MB'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative">
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting || isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isUploading
                  ? settings.language === 'tr'
                    ? 'Yükleniyor...'
                    : 'Uploading...'
                  : settings.language === 'tr'
                  ? 'Gönderiliyor...'
                  : 'Sending...'}
              </>
            ) : settings.language === 'tr' ? (
              'Gönder'
            ) : (
              'Submit'
            )}
          </Button>
        </form>

        {/* Info Box */}
        <div className="mt-8 bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
          <p>
            💡{' '}
            {settings.language === 'tr'
              ? 'Direkt email göndermek isterseniz: '
              : 'Prefer to send an email directly? '}
            <a
              href="mailto:support@hesappcim.app"
              className="text-primary hover:underline font-medium"
            >
              support@hesappcim.app
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
