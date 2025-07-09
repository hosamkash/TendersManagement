"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Contract } from "@/types/contract"
import { useLanguage } from "@/contexts/language-context"
import { LocalStorageService } from "@/lib/localStorage"
import { TendersService } from "@/lib/tenders-service"
import { EvaluationsService } from "@/lib/evaluations-service"
import { FileUpload } from "./file-upload"
import { PerformanceBondForm } from "./performance-bond-form"

interface ContractFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Contract, "id" | "createdAt" | "updatedAt">) => void
  initialData?: Contract | null
}

export function ContractForm({ isOpen, onClose, onSubmit, initialData }: ContractFormProps) {
  const { language, t } = useLanguage()
  const [formData, setFormData] = useState({
    contractNumber: "",
    contractTitle: "",
    supplierName: "",
    startDate: "",
    endDate: "",
    contractValue: 0,
    paymentTerms: "",
    contractAttachments: [] as any[],
    contractStatus: "",
    performanceBond: {
      bondNumber: "",
      bondValue: 0,
      bondPercentage: 0,
      issueDate: "",
      expiryDate: "",
      bankName: "",
      bondType: "",
    },
    relatedTenderId: "",
    relatedBidId: "",
  })

  // Get data from definition screens and related entities
  const suppliers = LocalStorageService.getItems("suppliers")
  const paymentTerms = LocalStorageService.getItems("payment-terms")
  const contractStatuses = LocalStorageService.getItems("contract-status")
  const tenders = TendersService.getTenders()
  const evaluations = EvaluationsService.getEvaluations()

  const isRTL = language === "ar"

  useEffect(() => {
    if (initialData) {
      setFormData({
        contractNumber: initialData.contractNumber,
        contractTitle: initialData.contractTitle,
        supplierName: initialData.supplierName,
        startDate: initialData.startDate,
        endDate: initialData.endDate,
        contractValue: initialData.contractValue,
        paymentTerms: initialData.paymentTerms,
        contractAttachments: initialData.contractAttachments,
        contractStatus: initialData.contractStatus,
        performanceBond: initialData.performanceBond,
        relatedTenderId: initialData.relatedTenderId || "",
        relatedBidId: initialData.relatedBidId || "",
      })
    } else {
      const today = new Date().toISOString().split("T")[0]
      setFormData({
        contractNumber: "",
        contractTitle: "",
        supplierName: "",
        startDate: today,
        endDate: "",
        contractValue: 0,
        paymentTerms: "",
        contractAttachments: [],
        contractStatus: "",
        performanceBond: {
          bondNumber: "",
          bondValue: 0,
          bondPercentage: 10, // Default 10%
          issueDate: today,
          expiryDate: "",
          bankName: "",
          bondType: "PERFORMANCE",
        },
        relatedTenderId: "",
        relatedBidId: "",
      })
    }
  }, [initialData, isOpen])

  // Auto-calculate bond value when contract value or percentage changes
  useEffect(() => {
    if (formData.contractValue > 0 && formData.performanceBond.bondPercentage > 0) {
      const bondValue = (formData.contractValue * formData.performanceBond.bondPercentage) / 100
      setFormData((prev) => ({
        ...prev,
        performanceBond: {
          ...prev.performanceBond,
          bondValue: Math.round(bondValue * 100) / 100,
        },
      }))
    }
  }, [formData.contractValue, formData.performanceBond.bondPercentage])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  const getSupplierName = (supplierCode: string) => {
    const supplier = suppliers.find((s) => s.code === supplierCode)
    return supplier ? (language === "ar" ? supplier.nameAr : supplier.nameEn) : supplierCode
  }

  const getTenderTitle = (tenderId: string) => {
    const tender = tenders.find((t) => t.id === tenderId)
    return tender ? `${tender.tenderId} - ${tender.tenderTitle}` : tenderId
  }

  // Get winning bids for contract creation
  const getWinningBids = () => {
    return evaluations
      .filter((evaluation) => evaluation.finalScore >= 80) // Assuming 80+ is winning score
      .sort((a, b) => b.finalScore - a.finalScore)
  }

  const winningBids = getWinningBids()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle>
            {initialData ? t("form.editTitle") : t("form.addTitle")} {language === "ar" ? "عقد" : "Contract"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contractNumber">{language === "ar" ? "رقم العقد" : "Contract Number"}</Label>
              <Input
                id="contractNumber"
                value={formData.contractNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, contractNumber: e.target.value }))}
                required
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contractStatus">{language === "ar" ? "حالة العقد" : "Contract Status"}</Label>
              <Select
                value={formData.contractStatus}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, contractStatus: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === "ar" ? "اختر حالة العقد" : "Select Contract Status"} />
                </SelectTrigger>
                <SelectContent>
                  {contractStatuses.map((status) => (
                    <SelectItem key={status.id} value={status.code}>
                      {language === "ar" ? status.nameAr : status.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contractTitle">{language === "ar" ? "عنوان العقد" : "Contract Title"}</Label>
            <Input
              id="contractTitle"
              value={formData.contractTitle}
              onChange={(e) => setFormData((prev) => ({ ...prev, contractTitle: e.target.value }))}
              required
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>

          {/* Related Tender and Bid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="relatedTenderId">{language === "ar" ? "المناقصة المرتبطة" : "Related Tender"}</Label>
              <Select
                value={formData.relatedTenderId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, relatedTenderId: value }))}
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

          {/* Contract Dates and Value */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">{language === "ar" ? "تاريخ البداية" : "Start Date"}</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">{language === "ar" ? "تاريخ النهاية" : "End Date"}</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contractValue">{language === "ar" ? "قيمة العقد" : "Contract Value"}</Label>
              <Input
                id="contractValue"
                type="number"
                min="0"
                step="0.01"
                value={formData.contractValue}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, contractValue: Number.parseFloat(e.target.value) || 0 }))
                }
                required
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentTerms">{language === "ar" ? "شروط الدفع" : "Payment Terms"}</Label>
            <Select
              value={formData.paymentTerms}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentTerms: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={language === "ar" ? "اختر شروط الدفع" : "Select Payment Terms"} />
              </SelectTrigger>
              <SelectContent>
                {paymentTerms.map((term) => (
                  <SelectItem key={term.id} value={term.code}>
                    {language === "ar" ? term.nameAr : term.nameEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Performance Bond */}
          <PerformanceBondForm
            performanceBond={formData.performanceBond}
            onPerformanceBondChange={(bond) => setFormData((prev) => ({ ...prev, performanceBond: bond }))}
          />

          {/* Contract Attachments */}
          <FileUpload
            attachments={formData.contractAttachments}
            onAttachmentsChange={(attachments) =>
              setFormData((prev) => ({ ...prev, contractAttachments: attachments }))
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
