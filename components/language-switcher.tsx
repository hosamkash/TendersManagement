"use client"

import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar")
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2 fixed top-4 left-4 z-50 bg-transparent"
    >
      <Globe className="h-4 w-4" />
      {language === "ar" ? "English" : "العربية"}
    </Button>
  )
}
