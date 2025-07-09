"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ContractsTable } from "@/components/contracts-table"
import { useContracts } from "@/hooks/useContracts"

export default function ContractsPage() {
  const { language, t } = useLanguage()
  const router = useRouter()
  const { contracts, loading, addContract, updateContract, deleteContract } = useContracts()

  const isRTL = language === "ar"

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
        <Button variant="outline" onClick={() => router.push("/")} className="mb-4 gap-2">
          {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          {t("nav.back")}
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{language === "ar" ? "إدارة العقود" : "Contract Management"}</h1>
          <p className="text-gray-600">
            {language === "ar" ? "إدارة جميع العقود وخطابات الضمان" : "Manage all contracts and performance bonds"}
          </p>
        </div>
      </div>

      <ContractsTable contracts={contracts} onAdd={addContract} onUpdate={updateContract} onDelete={deleteContract} />
    </div>
  )
}
