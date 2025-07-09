"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from "lucide-react"
import type { PerformanceBond } from "@/types/contract"
import { useLanguage } from "@/contexts/language-context"

interface PerformanceBondFormProps {
  performanceBond: PerformanceBond
  onPerformanceBondChange: (bond: PerformanceBond) => void
}

export function PerformanceBondForm({ performanceBond, onPerformanceBondChange }: PerformanceBondFormProps) {
  const { language } = useLanguage()
  const isRTL = language === "ar"

  const handleChange = (field: keyof PerformanceBond, value: string | number) => {
    onPerformanceBondChange({
      ...performanceBond,
      [field]: value,
    })
  }

  const bondTypes = [
    { value: "PERFORMANCE", labelAr: "ضمان حسن تنفيذ", labelEn: "Performance Bond" },
    { value: "ADVANCE", labelAr: "ضمان دفعة مقدمة", labelEn: "Advance Payment Bond" },
    { value: "WARRANTY", labelAr: "ضمان صيانة", labelEn: "Warranty Bond" },
    { value: "BID", labelAr: "ضمان ابتدائي", labelEn: "Bid Bond" },
  ]

  return (
    <Card dir={isRTL ? "rtl" : "ltr"}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {language === "ar" ? "تفاصيل خطاب الضمان" : "Performance Bond Details"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bondNumber">{language === "ar" ? "رقم خطاب الضمان" : "Bond Number"}</Label>
            <Input
              id="bondNumber"
              value={performanceBond.bondNumber}
              onChange={(e) => handleChange("bondNumber", e.target.value)}
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bondType">{language === "ar" ? "نوع الضمان" : "Bond Type"}</Label>
            <Select value={performanceBond.bondType} onValueChange={(value) => handleChange("bondType", value)}>
              <SelectTrigger>
                <SelectValue placeholder={language === "ar" ? "اختر نوع الضمان" : "Select Bond Type"} />
              </SelectTrigger>
              <SelectContent>
                {bondTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {language === "ar" ? type.labelAr : type.labelEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bondValue">{language === "ar" ? "قيمة الضمان" : "Bond Value"}</Label>
            <Input
              id="bondValue"
              type="number"
              min="0"
              step="0.01"
              value={performanceBond.bondValue}
              onChange={(e) => handleChange("bondValue", Number.parseFloat(e.target.value) || 0)}
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bondPercentage">{language === "ar" ? "نسبة الضمان %" : "Bond Percentage %"}</Label>
            <Input
              id="bondPercentage"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={performanceBond.bondPercentage}
              onChange={(e) => handleChange("bondPercentage", Number.parseFloat(e.target.value) || 0)}
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankName">{language === "ar" ? "اسم البنك" : "Bank Name"}</Label>
            <Input
              id="bankName"
              value={performanceBond.bankName}
              onChange={(e) => handleChange("bankName", e.target.value)}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="issueDate">{language === "ar" ? "تاريخ الإصدار" : "Issue Date"}</Label>
            <Input
              id="issueDate"
              type="date"
              value={performanceBond.issueDate}
              onChange={(e) => handleChange("issueDate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate">{language === "ar" ? "تاريخ الانتهاء" : "Expiry Date"}</Label>
            <Input
              id="expiryDate"
              type="date"
              value={performanceBond.expiryDate}
              onChange={(e) => handleChange("expiryDate", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
