"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ProjectsTable } from "@/components/projects-table"
import { useProjects } from "@/hooks/useProjects"

export default function ProjectsPage() {
  const { language, t } = useLanguage()
  const router = useRouter()
  const { projects, loading, addProject, updateProject, deleteProject } = useProjects()

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
          <h1 className="text-3xl font-bold mb-2">{language === "ar" ? "إدارة المشاريع" : "Projects Management"}</h1>
          <p className="text-gray-600">
            {language === "ar" ? "إدارة جميع مشاريع العطاءات والمناقصات" : "Manage all tender and procurement projects"}
          </p>
        </div>
      </div>

      <ProjectsTable projects={projects} onAdd={addProject} onUpdate={updateProject} onDelete={deleteProject} />
    </div>
  )
}
