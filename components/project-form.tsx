"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Project } from "@/types/project"
import { useLanguage } from "@/contexts/language-context"
import { LocalStorageService } from "@/lib/localStorage"

interface ProjectFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Project, "id" | "createdAt" | "updatedAt">) => void
  initialData?: Project | null
}

export function ProjectForm({ isOpen, onClose, onSubmit, initialData }: ProjectFormProps) {
  const { language, t } = useLanguage()
  const [formData, setFormData] = useState({
    projectTitle: "",
    projectNumber: "",
    projectDescription: "",
    projectType: "",
    location: "",
    estimatedBudget: 0,
    startDate: "",
    endDate: "",
    departmentResponsible: "",
    status: "",
  })

  // Get data from definition screens
  const projectTypes = LocalStorageService.getItems("project-types")
  const departments = LocalStorageService.getItems("departments")
  const statuses = LocalStorageService.getItems("status")

  const isRTL = language === "ar"

  useEffect(() => {
    if (initialData) {
      setFormData({
        projectTitle: initialData.projectTitle,
        projectNumber: initialData.projectNumber,
        projectDescription: initialData.projectDescription,
        projectType: initialData.projectType,
        location: initialData.location,
        estimatedBudget: initialData.estimatedBudget,
        startDate: initialData.startDate,
        endDate: initialData.endDate,
        departmentResponsible: initialData.departmentResponsible,
        status: initialData.status,
      })
    } else {
      setFormData({
        projectTitle: "",
        projectNumber: "",
        projectDescription: "",
        projectType: "",
        location: "",
        estimatedBudget: 0,
        startDate: "",
        endDate: "",
        departmentResponsible: "",
        status: "",
      })
    }
  }, [initialData, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle>
            {initialData ? t("form.editTitle") : t("form.addTitle")} {language === "ar" ? "مشروع" : "Project"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectTitle">{language === "ar" ? "اسم المشروع" : "Project Title"}</Label>
              <Input
                id="projectTitle"
                value={formData.projectTitle}
                onChange={(e) => setFormData((prev) => ({ ...prev, projectTitle: e.target.value }))}
                required
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectNumber">{language === "ar" ? "رقم المشروع" : "Project Number"}</Label>
              <Input
                id="projectNumber"
                value={formData.projectNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, projectNumber: e.target.value }))}
                required
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectDescription">{language === "ar" ? "وصف المشروع" : "Project Description"}</Label>
            <Textarea
              id="projectDescription"
              value={formData.projectDescription}
              onChange={(e) => setFormData((prev) => ({ ...prev, projectDescription: e.target.value }))}
              rows={3}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectType">{language === "ar" ? "نوع المشروع" : "Project Type"}</Label>
              <Select
                value={formData.projectType}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, projectType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === "ar" ? "اختر نوع المشروع" : "Select Project Type"} />
                </SelectTrigger>
                <SelectContent>
                  {projectTypes.map((type) => (
                    <SelectItem key={type.id} value={type.code}>
                      {language === "ar" ? type.nameAr : type.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">{language === "ar" ? "الموقع" : "Location"}</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedBudget">{language === "ar" ? "الميزانية التقديرية" : "Estimated Budget"}</Label>
            <Input
              id="estimatedBudget"
              type="number"
              min="0"
              step="0.01"
              value={formData.estimatedBudget}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, estimatedBudget: Number.parseFloat(e.target.value) || 0 }))
              }
              dir="ltr"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">{language === "ar" ? "تاريخ البداية" : "Start Date"}</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">{language === "ar" ? "تاريخ النهاية" : "End Date"}</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departmentResponsible">
                {language === "ar" ? "القسم المسؤول" : "Department Responsible"}
              </Label>
              <Select
                value={formData.departmentResponsible}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, departmentResponsible: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === "ar" ? "اختر القسم المسؤول" : "Select Department"} />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.code}>
                      {language === "ar" ? dept.nameAr : dept.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">{language === "ar" ? "الحالة" : "Status"}</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === "ar" ? "اختر الحالة" : "Select Status"} />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.id} value={status.code}>
                      {language === "ar" ? status.nameAr : status.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
