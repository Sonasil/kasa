'use client'

import { useRouter } from 'next/navigation'
import { useSettings } from '@/lib/settings-context'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function FAQPage() {
  const router = useRouter()
  const { settings, t } = useSettings()

  const faqsEN = [
    {
      question: "What is HesAppcım?",
      answer: "HesAppcım is a shared expense tracking application that helps you manage group expenses with friends, family, or roommates. Split bills, track who owes what, and settle debts easily."
    },
    {
      question: "How do I create a group?",
      answer: "Go to the Groups page and click 'Create New Group'. Enter a group name (e.g., 'Weekend Trip', 'Apartment 4B') and you're ready to start adding expenses."
    },
    {
      question: "How do I invite people to my group?",
      answer: "Open your group, go to the Members tab, and click 'Generate Invite Code'. Share this code with your friends, and they can join by clicking 'Join Group' and entering the code."
    },
    {
      question: "How do I add an expense?",
      answer: "Open the group, click 'Add Expense', enter the description, amount, category (optional), and select who paid and who should split the expense. You can split equally or customize amounts for each person."
    },
    {
      question: "Can I upload receipt photos?",
      answer: "Yes! When adding an expense, you can upload a receipt photo from your camera or photo library. This helps keep track of all your expenses visually."
    },
    {
      question: "How do I mark an expense as paid?",
      answer: "Open the expense details and click 'Mark as Paid'. You can mark partial or full payments. The group balance will update automatically."
    },
    {
      question: "What does 'You owe' and 'You're owed' mean?",
      answer: "'You owe' shows the total amount you need to pay to others in the group. 'You're owed' shows the total amount others need to pay you. When settled, you'll see 'All Settled!'"
    },
    {
      question: "How do I change the currency?",
      answer: "Go to Settings → General → Currency and select your preferred currency (TRY, USD, EUR, or GBP). All amounts will be displayed in your chosen currency."
    },
    {
      question: "Can I use the app in Turkish?",
      answer: "Yes! Go to Settings → General → Language and select 'Türkçe'. The entire app interface will switch to Turkish."
    },
    {
      question: "How do I leave a group?",
      answer: "Open the group, go to Members tab, and click 'Leave Group'. If you're the owner, you'll need to transfer ownership first or you'll be the last member (which deletes the group)."
    },
    {
      question: "Is my data secure?",
      answer: "Yes! We use Firebase Authentication and Firestore for secure data storage. Your personal information is encrypted and we follow industry-standard security practices. See our Privacy Policy for details."
    },
    {
      question: "Can I delete my account?",
      answer: "Yes, you can delete your account from the Profile settings. Please note that this will permanently delete all your data including groups, expenses, and settlements."
    },
    {
      question: "Is HesAppcım free?",
      answer: "Yes, HesAppcım is completely free to use with all features available at no cost."
    },
    {
      question: "How do I contact support?",
      answer: "You can reach us at support@hesappcim.app for any questions, issues, or feedback. We typically respond within 24-48 hours."
    }
  ]

  const faqsTR = [
    {
      question: "HesAppcım nedir?",
      answer: "HesAppcım, arkadaşlarınız, aileniz veya ev arkadaşlarınızla grup harcamalarını yönetmenize yardımcı olan bir paylaşımlı harcama takip uygulamasıdır. Faturaları bölün, kimin ne borçlu olduğunu takip edin ve borçları kolayca kapatın."
    },
    {
      question: "Nasıl grup oluştururum?",
      answer: "Gruplar sayfasına gidin ve 'Yeni Grup Oluştur'a tıklayın. Bir grup adı girin (örn. 'Hafta Sonu Gezisi', 'Daire 4B') ve harcama eklemeye başlayabilirsiniz."
    },
    {
      question: "Gruba nasıl kişi davet ederim?",
      answer: "Grubunuzu açın, Üyeler sekmesine gidin ve 'Davet Kodu Oluştur'a tıklayın. Bu kodu arkadaşlarınızla paylaşın, onlar da 'Gruba Katıl'a tıklayıp kodu girerek katılabilirler."
    },
    {
      question: "Nasıl harcama eklerim?",
      answer: "Grubu açın, 'Harcama Ekle'ye tıklayın, açıklama, tutar, kategori (opsiyonel) girin ve kimin ödediğini ve harcamayı kimlerin paylaşacağını seçin. Eşit paylaşabilir veya her kişi için tutarı özelleştirebilirsiniz."
    },
    {
      question: "Fiş fotoğrafı yükleyebilir miyim?",
      answer: "Evet! Harcama eklerken kamera veya fotoğraf galerinizden fiş fotoğrafı yükleyebilirsiniz. Bu, tüm harcamalarınızı görsel olarak takip etmenize yardımcı olur."
    },
    {
      question: "Harcamayı ödendi olarak nasıl işaretlerim?",
      answer: "Harcama detaylarını açın ve 'Ödendi Olarak İşaretle'ye tıklayın. Kısmi veya tam ödemeleri işaretleyebilirsiniz. Grup bakiyesi otomatik olarak güncellenecektir."
    },
    {
      question: "'Borçlusun' ve 'Alacaklısın' ne anlama gelir?",
      answer: "'Borçlusun' gruptaki diğer kişilere ödemeniz gereken toplam tutarı gösterir. 'Alacaklısın' başkalarının size ödemesi gereken toplam tutarı gösterir. Hesaplar kapandığında 'Herkes Ödedi!' göreceksiniz."
    },
    {
      question: "Para birimini nasıl değiştirebilirim?",
      answer: "Ayarlar → Genel → Para Birimi'ne gidin ve tercih ettiğiniz para birimini seçin (TRY, USD, EUR veya GBP). Tüm tutarlar seçtiğiniz para biriminde gösterilecektir."
    },
    {
      question: "Uygulamayı Türkçe kullanabilir miyim?",
      answer: "Evet! Ayarlar → Genel → Dil'e gidin ve 'Türkçe' seçin. Tüm uygulama arayüzü Türkçe'ye geçecektir."
    },
    {
      question: "Gruptan nasıl ayrılırım?",
      answer: "Grubu açın, Üyeler sekmesine gidin ve 'Gruptan Ayrıl'a tıklayın. Eğer kurucuysanız, önce sahipliği devretmeniz gerekecek veya son üyeyseniz (bu grubu siler)."
    },
    {
      question: "Verilerim güvende mi?",
      answer: "Evet! Güvenli veri depolama için Firebase Authentication ve Firestore kullanıyoruz. Kişisel bilgileriniz şifrelenir ve sektör standardı güvenlik uygulamalarını takip ederiz. Detaylar için Gizlilik Politikamızı inceleyin."
    },
    {
      question: "Hesabımı silebilir miyim?",
      answer: "Evet, Profil ayarlarından hesabınızı silebilirsiniz. Bunun gruplar, harcamalar ve ödemeler dahil tüm verilerinizi kalıcı olarak sileceğini unutmayın."
    },
    {
      question: "HesAppcım ücretsiz mi?",
      answer: "Evet, HesAppcım tüm özellikleriyle tamamen ücretsizdir."
    },
    {
      question: "Destek ekibiyle nasıl iletişime geçebilirim?",
      answer: "Her türlü soru, sorun veya geri bildirim için support@hesappcim.app adresinden bize ulaşabilirsiniz. Genellikle 24-48 saat içinde yanıt veriyoruz."
    }
  ]

  const faqs = settings.language === 'tr' ? faqsTR : faqsEN

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
      <div className="border-b bg-card">
        <div className="container mx-auto max-w-4xl px-4 py-6">
          <h1 className="text-3xl font-bold">{t('faq')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('frequentlyAsked')}
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border rounded-lg bg-card px-6 data-[state=open]:shadow-md transition-shadow"
            >
              <AccordionTrigger className="text-left hover:no-underline py-4">
                <div className="flex items-start gap-3 pr-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  <span className="font-semibold text-base">
                    {faq.question}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4 pl-9 text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Still have questions? */}
        <div className="mt-12 bg-primary/5 dark:bg-primary/10 rounded-lg p-6 border border-primary/20 text-center">
          <h2 className="text-xl font-bold mb-2">
            {settings.language === 'tr' ? 'Hala sorularınız mı var?' : 'Still have questions?'}
          </h2>
          <p className="text-muted-foreground mb-4">
            {settings.language === 'tr' 
              ? 'Size yardımcı olmaktan mutluluk duyarız!'
              : 'We\'re happy to help!'}
          </p>
          <Button
            onClick={() => router.push('/help/contact')}
            className="inline-flex items-center justify-center"
          >
            {t('contactSupport')}
          </Button>
        </div>
      </div>
    </div>
  )
}
