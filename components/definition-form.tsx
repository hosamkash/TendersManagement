"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { DefinitionItem } from "@/types/definitions"
import { useLanguage } from "@/contexts/language-context"

interface DefinitionFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<DefinitionItem, "id" | "createdAt" | "updatedAt">) => void
  initialData?: DefinitionItem | null
  title: string
}

export function DefinitionForm({ isOpen, onClose, onSubmit, initialData, title }: DefinitionFormProps) {
  const { language, t } = useLanguage()
  const [formData, setFormData] = useState({
    code: "",
    nameAr: "",
    nameEn: "",
    notes: "",
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code,
        nameAr: initialData.nameAr,
        nameEn: initialData.nameEn,
        notes: initialData.notes,
      })
    } else {
      setFormData({
        code: "",
        nameAr: "",
        nameEn: "",
        notes: "",
      })
    }
  }, [initialData, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  const isRTL = language === "ar"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle>
            {initialData ? t("form.editTitle") : t("form.addTitle")} {title}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">{t("form.code")}</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
              required
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nameAr">{t("form.nameAr")}</Label>
            <Input
              id="nameAr"
              value={formData.nameAr}
              onChange={(e) => setFormData((prev) => ({ ...prev, nameAr: e.target.value }))}
              required
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nameEn">{t("form.nameEn")}</Label>
            <Input
              id="nameEn"
              value={formData.nameEn}
              onChange={(e) => setFormData((prev) => ({ ...prev, nameEn: e.target.value }))}
              required
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t("form.notes")}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              rows={3}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>

          <div className={`flex justify-end space-x-2 ${isRTL ? "space-x-reverse" : ""}`}>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("action.cancel")}
            </Button>
            <Button type="submit">{initialData ? t("action.update") : t("action.add")}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
