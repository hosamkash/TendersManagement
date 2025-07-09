"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, Search, FileText, Calendar, DollarSign } from "lucide-react"
import type { Bid } from "@/types/bid"
import { BidForm } from "./bid-form"
import { useLanguage } from "@/contexts/language-context"
import { LocalStorageService } from "@/lib/localStorage"
import { TendersService } from "@/lib/tenders-service"

interface BidsTableProps {
  bids: Bid[]
  onAdd: (data: Omit<Bid, "id" | "createdAt" | "updatedAt">) => void
  onUpdate: (id: string, data: Partial<Bid>) => void
  onDelete: (id: string) => void
}

export function BidsTable({ bids, onAdd, onUpdate, onDelete }: BidsTableProps) {
  const { language, t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBid, setEditingBid] = useState<Bid | null>(null)

  const isRTL = language === "ar"

  // Get definition data for display
  const tenders = TendersService.getTenders()
  const suppliers = LocalStorageService.getItems("suppliers")
  const complianceStatuses = LocalStorageService.getItems("compliance-status")

  const getDisplayName = (code: string, items: any[], lang: "ar" | "en") => {
    const item = items.find((i) => i.code === code)
    return item ? (lang === "ar" ? item.nameAr : item.nameEn) : code
  }

  const getTenderInfo = (tenderId: string) => {
    const tender = tenders.find((t) => t.id === tenderId)
    return tender ? `${tender.tenderId} - ${tender.tenderTitle}` : tenderId
  }

  const getComplianceColor = (statusCode: string) => {
    switch (statusCode) {
      case "COMPLIANT":
        return "default"
      case "PARTIAL":
        return "outline"
      case "NON_COMPLIANT":
        return "destructive"
      case "PENDING":
        return "secondary"
      case "CONDITIONAL":
        return "outline"
      default:
        return "secondary"
    }
  }

  const filteredBids = bids.filter(
    (bid) =>
      getTenderInfo(bid.tenderId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getDisplayName(bid.supplierName, suppliers, language).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (bid: Bid) => {
    setEditingBid(bid)
    setIsFormOpen(true)
  }

  const handleFormSubmit = (data: Omit<Bid, "id" | "createdAt" | "updatedAt">) => {
    if (editingBid) {
      onUpdate(editingBid.id, data)
    } else {
      onAdd(data)
    }
    setEditingBid(null)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingBid(null)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === "ar" ? "ar-SA" : "en-US", {
      style: "currency",
      currency: "SAR",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")
  }

  return (
    <Card dir={isRTL ? "rtl" : "ltr"}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileText className="h-6 w-6" />
            {language === "ar" ? "تقديم العطاءات" : "Bid Submission"}
          </CardTitle>
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            {language === "ar" ? "إضافة عطاء جديد" : "Add New Bid"}
          </Button>
        </div>

        <div className="relative">
          <Search
            className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4`}
          />
          <Input
            placeholder={language === "ar" ? "البحث بالمناقصة أو المورد..." : "Search by tender or supplier..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={isRTL ? "pr-10" : "pl-10"}
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={isRTL ? "text-right" : "text-left"}>
                  {language === "ar" ? "المناقصة" : "Tender"}
                </TableHead>
                <TableHead className={isRTL ? "text-right" : "text-left"}>
                  {language === "ar" ? "المورد" : "Supplier"}
                </TableHead>
                <TableHead className={isRTL ? "text-right" : "text-left"}>
                  {language === "ar" ? "قيمة العطاء" : "Bid Amount"}
                </TableHead>
                <TableHead className={isRTL ? "text-right" : "text-left"}>
                  {language === "ar" ? "تاريخ التقديم" : "Submission Date"}
                </TableHead>
                <TableHead className={isRTL ? "text-right" : "text-left"}>
                  {language === "ar" ? "صلاحية العطاء" : "Validity Period"}
                </TableHead>
                <TableHead className={isRTL ? "text-right" : "text-left"}>
                  {language === "ar" ? "حالة المطابقة" : "Compliance"}
                </TableHead>
                <TableHead className={isRTL ? "text-right" : "text-left"}>
                  {language === "ar" ? "المستندات" : "Documents"}
                </TableHead>
                <TableHead className={isRTL ? "text-right" : "text-left"}>
                  {language === "ar" ? "الإجراءات" : "Actions"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBids.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    {t("msg.noData")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredBids.map((bid) => (
                  <TableRow key={bid.id}>
                    <TableCell className="font-medium" dir={isRTL ? "rtl" : "ltr"}>
                      <div className="max-w-[200px] truncate" title={getTenderInfo(bid.tenderId)}>
                        {getTenderInfo(bid.tenderId)}
                      </div>
                    </TableCell>
                    <TableCell dir={isRTL ? "rtl" : "ltr"}>
                      {getDisplayName(bid.supplierName, suppliers, language)}
                    </TableCell>
                    <TableCell dir="ltr" className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {formatCurrency(bid.bidAmount)}
                    </TableCell>
                    <TableCell dir="ltr" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(bid.submissionDate)}
                    </TableCell>
                    <TableCell dir="ltr">{formatDate(bid.bidValidityPeriod)}</TableCell>
                    <TableCell>
                      <Badge variant={getComplianceColor(bid.complianceStatus)}>
                        {getDisplayName(bid.complianceStatus, complianceStatuses, language)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs">
                          {language === "ar" ? "فني" : "Tech"}: {bid.technicalDocuments.length}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {language === "ar" ? "تجاري" : "Comm"}: {bid.commercialDocuments.length}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(bid)} className="gap-1">
                          <Pencil className="h-3 w-3" />
                          {t("action.edit")}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => onDelete(bid.id)} className="gap-1">
                          <Trash2 className="h-3 w-3" />
                          {t("action.delete")}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <BidForm isOpen={isFormOpen} onClose={handleFormClose} onSubmit={handleFormSubmit} initialData={editingBid} />
    </Card>
  )
}
