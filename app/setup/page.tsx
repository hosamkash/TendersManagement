"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { DEFINITION_TYPES } from "@/types/definitions"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { SeedDataManager } from "@/components/seed-data-manager"
import { DataStatistics } from "@/components/data-statistics"

export default function SetupPage() {
  const { language, t } = useLanguage()
  const router = useRouter()
  const isRTL = language === "ar"

  return (
    <div className="container mx-auto p-6" dir={isRTL ? "rtl" : "ltr"}>
      <LanguageSwitcher />

      <div className="mb-6 mt-12">
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" onClick={() => router.push("/")} className="gap-2">
            {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            {t("nav.back")}
          </Button>

          <SeedDataManager />
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{t("setup.title")}</h1>
          <p className="text-gray-600">{t("setup.subtitle")}</p>
        </div>

        <DataStatistics />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DEFINITION_TYPES.map((type) => (
          <Link key={type.key} href={`/definitions/${type.key}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{type.icon}</div>
                <CardTitle className="text-xl">{t(type.translationKey)}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 text-sm">
                  {language === "ar" ? "إدارة بيانات" : "Manage"} {t(type.translationKey)}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
