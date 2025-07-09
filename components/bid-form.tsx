"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Bid } from "@/types/bid"
import { useLanguage } from "@/contexts/language-context"
import { LocalStorageService } from "@/lib/localStorage"
import { TendersService } from "@/lib/tenders-service"
import { BidDocumentsUpload } from "./bid-documents-upload"

interface BidFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Bid, "id" | "createdAt" | "updatedAt">) => void
  initialData?: Bid | null
}

export function BidForm({ isOpen, onClose, onSubmit, initialData }: BidFormProps) {
  const { language, t } = useLanguage()
  const [formData, setFormData] = useState({
    tenderId: "",
    supplierName: "",
    bidAmount: 0,
    submissionDate: "",
    bidValidityPeriod: "",
    technicalDocuments: [] as any[],
    commercialDocuments: [] as any[],
    complianceStatus: "",
    notes: "",
  })

  // Get data from definition screens and tenders
  const tenders = TendersService.getTenders()
  const suppliers = LocalStorageService.getItems("suppliers")
  const complianceStatuses = LocalStorageService.getItems("compliance-status")

  const isRTL = language === "ar"

  useEffect(() => {
    if (initialData) {
      setFormData({
        tenderId: initialData.tenderId,
        supplierName: initialData.supplierName,
        bidAmount: initialData.bidAmount,
        submissionDate: initialData.submissionDate,
        bidValidityPeriod: initialData.bidValidityPeriod,
        technicalDocuments: initialData.technicalDocuments,
        commercialDocuments: initialData.commercialDocuments,
        complianceStatus: initialData.complianceStatus,
        notes: initialData.notes,
      })
    } else {
      // Set default submission date to today
      const today = new Date().toISOString().split("T")[0]
      setFormData({
        tenderId: "",
        supplierName: "",
        bidAmount: 0,
        submissionDate: today,
        bidValidityPeriod: "",
        technicalDocuments: [],
        commercialDocuments: [],
        complianceStatus: "",
        notes: "",
      })
    }
  }, [initialData, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  const getTenderTitle = (tenderId: string) => {
    const tender = tenders.find((t) => t.id === tenderId)
    return tender ? `${tender.tenderId} - ${tender.tenderTitle}` : tenderId
  }

  const getSupplierName = (supplierCode: string) => {
    const supplier = suppliers.find((s) => s.code === supplierCode)
    return supplier ? (language === "ar" ? supplier.nameAr : supplier.nameEn) : supplierCode
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle>
            {initialData ? t("form.editTitle") : t("form.addTitle")} {language === "ar" ? "عطاء" : "Bid"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tenderId">{language === "ar" ? "رقم المناقصة" : "Tender ID"}</Label>
              <Select
                value={formData.tenderId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, tenderId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === "ar" ? "اختر المناقصة" : "Select Tender"} />
                </SelectTrigger>
                <SelectContent>
                  {tenders.map((tender) => (
                    <SelectItem key={tender.id} value={tender.id}>
                      {getTenderTitle(tender.id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplierName">{language === "ar" ? "اسم المورد" : "Supplier Name"}</Label>
              <Select
                value={formData.supplierName}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, supplierName: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === "ar" ? "اختر المورد" : "Select Supplier"} />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.code}>
                      {getSupplierName(supplier.code)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bidAmount">{language === "ar" ? "قيمة العطاء" : "Bid Amount"}</Label>
              <Input
                id="bidAmount"
                type="number"
                min="0"
                step="0.01"
                value={formData.bidAmount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bidAmount: Number.parseFloat(e.target.value) || 0 }))
                }
                required
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="submissionDate">{language === "ar" ? "تاريخ التقديم" : "Submission Date"}</Label>
              <Input
                id="submissionDate"
                type="date"
                value={formData.submissionDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, submissionDate: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bidValidityPeriod">
                {language === "ar" ? "مدة صلاحية العطاء" : "Bid Validity Period"}
              </Label>
              <Input
                id="bidValidityPeriod"
                type="date"
                value={formData.bidValidityPeriod}
                onChange={(e) => setFormData((prev) => ({ ...prev, bidValidityPeriod: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="complianceStatus">{language === "ar" ? "حالة المطابقة" : "Compliance Status"}</Label>
              <Select
                value={formData.complianceStatus}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, complianceStatus: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === "ar" ? "اختر حالة المطابقة" : "Select Compliance Status"} />
                </SelectTrigger>
                <SelectContent>
                  {complianceStatuses.map((status) => (
                    <SelectItem key={status.id} value={status.code}>
                      {language === "ar" ? status.nameAr : status.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{language === "ar" ? "ملاحظات" : "Notes"}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              rows={3}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>

          {/* Documents Upload */}
          <BidDocumentsUpload
            technicalDocuments={formData.technicalDocuments}
            commercialDocuments={formData.commercialDocuments}
            onTechnicalDocumentsChange={(documents) =>
              setFormData((prev) => ({ ...prev, technicalDocuments: documents }))
            }
            onCommercialDocumentsChange={(documents) =>
              setFormData((prev) => ({ ...prev, commercialDocuments: documents }))
            }
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
