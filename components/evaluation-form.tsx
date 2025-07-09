"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calculator, Star } from "lucide-react"
import type { BidEvaluation } from "@/types/evaluation"
import { useLanguage } from "@/contexts/language-context"
import { LocalStorageService } from "@/lib/localStorage"
import { TendersService } from "@/lib/tenders-service"
import { BidsService } from "@/lib/bids-service"
import { EvaluationsService } from "@/lib/evaluations-service"

interface EvaluationFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<BidEvaluation, "id" | "createdAt" | "updatedAt">) => void
  initialData?: BidEvaluation | null
}

export function EvaluationForm({ isOpen, onClose, onSubmit, initialData }: EvaluationFormProps) {
  const { language, t } = useLanguage()
  const [formData, setFormData] = useState({
    tenderId: "",
    bidId: "",
    supplierName: "",
    technicalScore: 0,
    financialScore: 0,
    finalScore: 0,
    evaluationComments: "",
    evaluationCommittee: "",
    evaluatedBy: "",
    evaluationDate: "",
  })

  const [availableBids, setAvailableBids] = useState<any[]>([])
  const [autoCalculate, setAutoCalculate] = useState(true)

  // Get data from definition screens
  const tenders = TendersService.getTenders()
  const evaluationCommittees = LocalStorageService.getItems("evaluation-committee")

  const isRTL = language === "ar"

  useEffect(() => {
    if (initialData) {
      setFormData({
        tenderId: initialData.tenderId,
        bidId: initialData.bidId,
        supplierName: initialData.supplierName,
        technicalScore: initialData.technicalScore,
        financialScore: initialData.financialScore,
        finalScore: initialData.finalScore,
        evaluationComments: initialData.evaluationComments,
        evaluationCommittee: initialData.evaluationCommittee,
        evaluatedBy: initialData.evaluatedBy,
        evaluationDate: initialData.evaluationDate,
      })
    } else {
      const today = new Date().toISOString().split("T")[0]
      setFormData({
        tenderId: "",
        bidId: "",
        supplierName: "",
        technicalScore: 0,
        financialScore: 0,
        finalScore: 0,
        evaluationComments: "",
        evaluationCommittee: "",
        evaluatedBy: "",
        evaluationDate: today,
      })
    }
  }, [initialData, isOpen])

  // Load available bids when tender is selected
  useEffect(() => {
    if (formData.tenderId) {
      const tenderBids = BidsService.getBidsByTender(formData.tenderId)
      // Filter out already evaluated bids (except current one being edited)
      const unevaluatedBids = tenderBids.filter((bid) => {
        const existingEvaluation = EvaluationsService.getEvaluationByBid(bid.id)
        return !existingEvaluation || (initialData && existingEvaluation.id === initialData.id)
      })
      setAvailableBids(unevaluatedBids)
    } else {
      setAvailableBids([])
    }
  }, [formData.tenderId, initialData])

  // Auto-calculate final score
  useEffect(() => {
    if (autoCalculate) {
      const calculated = EvaluationsService.calculateFinalScore(formData.technicalScore, formData.financialScore)
      setFormData((prev) => ({ ...prev, finalScore: calculated }))
    }
  }, [formData.technicalScore, formData.financialScore, autoCalculate])

  // Update supplier name when bid is selected
  useEffect(() => {
    if (formData.bidId) {
      const selectedBid = availableBids.find((bid) => bid.id === formData.bidId)
      if (selectedBid) {
        const suppliers = LocalStorageService.getItems("suppliers")
        const supplier = suppliers.find((s) => s.code === selectedBid.supplierName)
        const supplierDisplayName = supplier
          ? language === "ar"
            ? supplier.nameAr
            : supplier.nameEn
          : selectedBid.supplierName
        setFormData((prev) => ({ ...prev, supplierName: supplierDisplayName }))
      }
    }
  }, [formData.bidId, availableBids, language])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  const getTenderTitle = (tenderId: string) => {
    const tender = tenders.find((t) => t.id === tenderId)
    return tender ? `${tender.tenderId} - ${tender.tenderTitle}` : tenderId
  }

  const getBidInfo = (bidId: string) => {
    const bid = availableBids.find((b) => b.id === bidId)
    if (!bid) return ""

    const suppliers = LocalStorageService.getItems("suppliers")
    const supplier = suppliers.find((s) => s.code === bid.supplierName)
    const supplierName = supplier ? (language === "ar" ? supplier.nameAr : supplier.nameEn) : bid.supplierName

    return `${supplierName} - ${new Intl.NumberFormat(language === "ar" ? "ar-SA" : "en-US", {
      style: "currency",
      currency: "SAR",
    }).format(bid.bidAmount)}`
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    if (score >= 60) return "text-orange-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return language === "ar" ? "ممتاز" : "Excellent"
    if (score >= 80) return language === "ar" ? "جيد جداً" : "Very Good"
    if (score >= 70) return language === "ar" ? "جيد" : "Good"
    if (score >= 60) return language === "ar" ? "مقبول" : "Acceptable"
    return language === "ar" ? "ضعيف" : "Poor"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle>
            {initialData ? t("form.editTitle") : t("form.addTitle")}{" "}
            {language === "ar" ? "تقييم عطاء" : "Bid Evaluation"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tender and Bid Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tenderId">{language === "ar" ? "رقم المناقصة" : "Tender ID"}</Label>
              <Select
                value={formData.tenderId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, tenderId: value, bidId: "" }))}
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
              <Label htmlFor="bidId">{language === "ar" ? "العطاء" : "Bid"}</Label>
              <Select
                value={formData.bidId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, bidId: value }))}
                disabled={!formData.tenderId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === "ar" ? "اختر العطاء" : "Select Bid"} />
                </SelectTrigger>
                <SelectContent>
                  {availableBids.map((bid) => (
                    <SelectItem key={bid.id} value={bid.id}>
                      {getBidInfo(bid.id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Scores Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                {language === "ar" ? "درجات التقييم" : "Evaluation Scores"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="technicalScore">
                    {language === "ar" ? "الدرجة الفنية" : "Technical Score"} (0-100)
                  </Label>
                  <Input
                    id="technicalScore"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.technicalScore}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, technicalScore: Number.parseFloat(e.target.value) || 0 }))
                    }
                    required
                  />
                  {formData.technicalScore > 0 && (
                    <Badge variant="outline" className={getScoreColor(formData.technicalScore)}>
                      {getScoreLabel(formData.technicalScore)}
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="financialScore">
                    {language === "ar" ? "الدرجة المالية" : "Financial Score"} (0-100)
                  </Label>
                  <Input
                    id="financialScore"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.financialScore}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, financialScore: Number.parseFloat(e.target.value) || 0 }))
                    }
                    required
                  />
                  {formData.financialScore > 0 && (
                    <Badge variant="outline" className={getScoreColor(formData.financialScore)}>
                      {getScoreLabel(formData.financialScore)}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="finalScore">{language === "ar" ? "الدرجة النهائية" : "Final Score"}</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAutoCalculate(!autoCalculate)}
                    className="gap-2"
                  >
                    <Calculator className="h-3 w-3" />
                    {autoCalculate
                      ? language === "ar"
                        ? "حساب تلقائي"
                        : "Auto Calculate"
                      : language === "ar"
                        ? "حساب يدوي"
                        : "Manual"}
                  </Button>
                </div>
                <Input
                  id="finalScore"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.finalScore}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, finalScore: Number.parseFloat(e.target.value) || 0 }))
                  }
                  disabled={autoCalculate}
                  required
                />
                {formData.finalScore > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className={getScoreColor(formData.finalScore)}>
                      {getScoreLabel(formData.finalScore)}
                    </Badge>
                    {autoCalculate && (
                      <span className="text-xs text-gray-500">
                        {language === "ar"
                          ? "محسوب تلقائياً (60% فني + 40% مالي)"
                          : "Auto-calculated (60% Technical + 40% Financial)"}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Evaluation Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="evaluationCommittee">{language === "ar" ? "لجنة التقييم" : "Evaluation Committee"}</Label>
              <Select
                value={formData.evaluationCommittee}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, evaluationCommittee: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === "ar" ? "اختر لجنة التقييم" : "Select Committee"} />
                </SelectTrigger>
                <SelectContent>
                  {evaluationCommittees.map((committee) => (
                    <SelectItem key={committee.id} value={committee.code}>
                      {language === "ar" ? committee.nameAr : committee.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="evaluatedBy">{language === "ar" ? "المقيم" : "Evaluated By"}</Label>
              <Input
                id="evaluatedBy"
                value={formData.evaluatedBy}
                onChange={(e) => setFormData((prev) => ({ ...prev, evaluatedBy: e.target.value }))}
                required
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="evaluationDate">{language === "ar" ? "تاريخ التقييم" : "Evaluation Date"}</Label>
            <Input
              id="evaluationDate"
              type="date"
              value={formData.evaluationDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, evaluationDate: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="evaluationComments">{language === "ar" ? "ملاحظات التقييم" : "Evaluation Comments"}</Label>
            <Textarea
              id="evaluationComments"
              value={formData.evaluationComments}
              onChange={(e) => setFormData((prev) => ({ ...prev, evaluationComments: e.target.value }))}
              rows={4}
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
