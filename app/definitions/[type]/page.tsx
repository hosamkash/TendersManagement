"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { DEFINITION_TYPES } from "@/types/definitions"
import { useDefinitions } from "@/hooks/useDefinitions"
import { DefinitionsTable } from "@/components/definitions-table"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function DefinitionPage() {
  const params = useParams()
  const router = useRouter()
  const { language, t } = useLanguage()
  const type = params.type as string

  const definitionType = DEFINITION_TYPES.find((dt) => dt.key === type)
  const { items, loading, addItem, updateItem, deleteItem } = useDefinitions(type)

  const isRTL = language === "ar"

  if (!definitionType) {
    return (
      <div className="container mx-auto p-6 text-center" dir={isRTL ? "rtl" : "ltr"}>
        <LanguageSwitcher />
        <h1 className="text-2xl font-bold mb-4 mt-12">{t("msg.pageNotFound")}</h1>
        <Button onClick={() => router.push("/")}>{t("nav.back")}</Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center" dir={isRTL ? "rtl" : "ltr"}>
        <LanguageSwitcher />
        <p className="mt-12">{t("msg.loading")}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6" dir={isRTL ? "rtl" : "ltr"}>
      <LanguageSwitcher />

      <div className="mb-6 mt-12">
        <Button variant="outline" onClick={() => router.push("/setup")} className="mb-4 gap-2">
          {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          {language === "ar" ? "العودة للتأسيس" : "Back to Setup"}
        </Button>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">{definitionType.icon}</span>
          <div>
            <h1 className="text-3xl font-bold">{t(definitionType.translationKey)}</h1>
            <p className="text-gray-600">
              {language === "ar" ? "إدارة بيانات" : "Manage"} {t(definitionType.translationKey)}
            </p>
          </div>
        </div>
      </div>

      <DefinitionsTable
        items={items}
        title={t(definitionType.translationKey)}
        onAdd={addItem}
        onUpdate={updateItem}
        onDelete={deleteItem}
      />
    </div>
  )
}
