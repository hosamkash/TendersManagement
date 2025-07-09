"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import type { Tender } from "@/types/tender"
import { useLanguage } from "@/contexts/language-context"
import { LocalStorageService } from "@/lib/localStorage"
import { ProjectsService } from "@/lib/projects-service"
import { FileUpload } from "./file-upload"

interface TenderFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Tender, "id" | "createdAt" | "updatedAt">) => void
  initialData?: Tender | null
}

export function TenderForm({ isOpen, onClose, onSubmit, initialData }: TenderFormProps) {
  const { language, t } = useLanguage()
  const [formData, setFormData] = useState({
    tenderId: "",
    projectReference: "",
    tenderTitle: "",
    tenderType: "",
    tenderMethod: "",
    budgetReference: "",
    tenderIssueDate: "",
    tenderClosingDate: "",
    tenderDescription: "",
    evaluationCriteria: [] as string[],
    technicalRequirements: [] as string[],
    attachments: [] as any[],
  })

  // Get data from definition screens and projects
  const projects = ProjectsService.getProjects()
  const projectTypes = LocalStorageService.getItems("project-types")
  const tenderMethods = LocalStorageService.getItems("tender-methods")
  const evaluationCriteria = LocalStorageService.getItems("evaluation-criteria")
  const technicalRequirements = LocalStorageService.getItems("technical-requirements")

  const isRTL = language === "ar"

  useEffect(() => {
    if (initialData) {
      setFormData({
        tenderId: initialData.tenderId,
        projectReference: initialData.projectReference,
        tenderTitle: initialData.tenderTitle,
        tenderType: initialData.tenderType,
        tenderMethod: initialData.tenderMethod,
        budgetReference: initialData.budgetReference,
        tenderIssueDate: initialData.tenderIssueDate,
        tenderClosingDate: initialData.tenderClosingDate,
        tenderDescription: initialData.tenderDescription,
        evaluationCriteria: initialData.evaluationCriteria,
        technicalRequirements: initialData.technicalRequirements,
        attachments: initialData.attachments,
      })
    } else {
      setFormData({
        tenderId: "",
        projectReference: "",
        tenderTitle: "",
        tenderType: "",
        tenderMethod: "",
        budgetReference: "",
        tenderIssueDate: "",
        tenderClosingDate: "",
        tenderDescription: "",
        evaluationCriteria: [],
        technicalRequirements: [],
        attachments: [],
      })
    }
  }, [initialData, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  const handleCriteriaChange = (criteriaCode: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        evaluationCriteria: [...prev.evaluationCriteria, criteriaCode],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        evaluationCriteria: prev.evaluationCriteria.filter((c) => c !== criteriaCode),
      }))
    }
  }

  const handleRequirementsChange = (requirementCode: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        technicalRequirements: [...prev.technicalRequirements, requirementCode],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        technicalRequirements: prev.technicalRequirements.filter((r) => r !== requirementCode),
      }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle>
            {initialData ? t("form.editTitle") : t("form.addTitle")} {language === "ar" ? "مناقصة" : "Tender"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tenderId">{language === "ar" ? "رقم المناقصة" : "Tender ID"}</Label>
              <Input
                id="tenderId"
                value={formData.tenderId}
                onChange={(e) => setFormData((prev) => ({ ...prev, tenderId: e.target.value }))}
                required
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectReference">{language === "ar" ? "مرجع المشروع" : "Project Reference"}</Label>
              <Select
                value={formData.projectReference}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, projectReference: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === "ar" ? "اختر المشروع" : "Select Project"} />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.projectTitle} ({project.projectNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tenderTitle">{language === "ar" ? "عنوان المناقصة" : "Tender Title"}</Label>
            <Input
              id="tenderTitle"
              value={formData.tenderTitle}
              onChange={(e) => setFormData((prev) => ({ ...prev, tenderTitle: e.target.value }))}
              required
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tenderType">{language === "ar" ? "نوع المناقصة" : "Tender Type"}</Label>
              <Select
                value={formData.tenderType}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, tenderType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === "ar" ? "اختر نوع المناقصة" : "Select Tender Type"} />
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
              <Label htmlFor="tenderMethod">{language === "ar" ? "طريقة الطرح" : "Tender Method"}</Label>
              <Select
                value={formData.tenderMethod}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, tenderMethod: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === "ar" ? "اختر طريقة الطرح" : "Select Tender Method"} />
                </SelectTrigger>
                <SelectContent>
                  {tenderMethods.map((method) => (
                    <SelectItem key={method.id} value={method.code}>
                      {language === "ar" ? method.nameAr : method.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budgetReference">{language === "ar" ? "مرجع الميزانية" : "Budget Reference"}</Label>
            <Input
              id="budgetReference"
              value={formData.budgetReference}
              onChange={(e) => setFormData((prev) => ({ ...prev, budgetReference: e.target.value }))}
              dir="ltr"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tenderIssueDate">
                {language === "ar" ? "تاريخ إصدار المناقصة" : "Tender Issue Date"}
              </Label>
              <Input
                id="tenderIssueDate"
                type="date"
                value={formData.tenderIssueDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, tenderIssueDate: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tenderClosingDate">{language === "ar" ? "تاريخ الإغلاق" : "Tender Closing Date"}</Label>
              <Input
                id="tenderClosingDate"
                type="date"
                value={formData.tenderClosingDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, tenderClosingDate: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tenderDescription">{language === "ar" ? "وصف المناقصة" : "Tender Description"}</Label>
            <Textarea
              id="tenderDescription"
              value={formData.tenderDescription}
              onChange={(e) => setFormData((prev) => ({ ...prev, tenderDescription: e.target.value }))}
              rows={4}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>

          {/* Evaluation Criteria */}
          <div className="space-y-3">
            <Label>{language === "ar" ? "معايير التقييم" : "Evaluation Criteria"}</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {evaluationCriteria.map((criteria) => (
                <div key={criteria.id} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id={`criteria-${criteria.id}`}
                    checked={formData.evaluationCriteria.includes(criteria.code)}
                    onCheckedChange={(checked) => handleCriteriaChange(criteria.code, checked as boolean)}
                  />
                  <Label htmlFor={`criteria-${criteria.id}`} className="text-sm">
                    {language === "ar" ? criteria.nameAr : criteria.nameEn}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Requirements */}
          <div className="space-y-3">
            <Label>{language === "ar" ? "المتطلبات الفنية" : "Technical Requirements"}</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {technicalRequirements.map((requirement) => (
                <div key={requirement.id} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id={`requirement-${requirement.id}`}
                    checked={formData.technicalRequirements.includes(requirement.code)}
                    onCheckedChange={(checked) => handleRequirementsChange(requirement.code, checked as boolean)}
                  />
                  <Label htmlFor={`requirement-${requirement.id}`} className="text-sm">
                    {language === "ar" ? requirement.nameAr : requirement.nameEn}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <FileUpload
            attachments={formData.attachments}
            onAttachmentsChange={(attachments) => setFormData((prev) => ({ ...prev, attachments }))}
          />

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
