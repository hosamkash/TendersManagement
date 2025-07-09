"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2, Plus, Search, FileText, Calendar, DollarSign, Shield, AlertTriangle } from "lucide-react"
import type { Contract } from "@/types/contract"
import { ContractForm } from "./contract-form"
import { useLanguage } from "@/contexts/language-context"
import { LocalStorageService } from "@/lib/localStorage"

interface ContractsTableProps {
  contracts: Contract[]
  onAdd: (data: Omit<Contract, "id" | "createdAt" | "updatedAt">) => void
  onUpdate: (id: string, data: Partial<Contract>) => void
  onDelete: (id: string) => void
}

export function ContractsTable({ contracts, onAdd, onUpdate, onDelete }: ContractsTableProps) {
  const { language, t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingContract, setEditingContract] = useState<Contract | null>(null)

  const isRTL = language === "ar"

  // Get definition data for display
  const suppliers = LocalStorageService.getItems("suppliers")
  const paymentTerms = LocalStorageService.getItems("payment-terms")
  const contractStatuses = LocalStorageService.getItems("contract-status")

  const getDisplayName = (code: string, items: any[], lang: "ar" | "en") => {
    const item = items.find((i) => i.code === code)
    return item ? (lang === "ar" ? item.nameAr : item.nameEn) : code
  }

  const getStatusColor = (statusCode: string) => {
    switch (statusCode) {
      case "DRAFT":
        return "secondary"
      case "REVIEW":
        return "outline"
      case "APPROVED":
        return "default"
      case "SIGNED":
        return "default"
      case "ACTIVE":
        return "default"
      case "COMPLETED":
        return "default"
      case "TERMINATED":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const isContractExpiring = (endDate: string, daysAhead = 30) => {
    const now = new Date()
    const contractEnd = new Date(endDate)
    const futureDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000)
    return contractEnd <= futureDate && contractEnd > now
  }

  const isContractExpired = (endDate: string) => {
    const now = new Date()
    const contractEnd = new Date(endDate)
    return contractEnd < now
  }

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contractTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getDisplayName(contract.supplierName, suppliers, language).toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || contract.contractStatus === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleEdit = (contract: Contract) => {
    setEditingContract(contract)
    setIsFormOpen(true)
  }

  const handleFormSubmit = (data: Omit<Contract, "id" | "createdAt" | "updatedAt">) => {
    if (editingContract) {
      onUpdate(editingContract.id, data)
    } else {
      onAdd(data)
    }
    setEditingContract(null)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingContract(null)
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

  const calculateDaysRemaining = (endDate: string) => {
    const now = new Date()
    const contractEnd = new Date(endDate)
    const diffTime = contractEnd.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Statistics
  const activeContracts = contracts.filter((c) => c.contractStatus === "ACTIVE").length
  const expiringContracts = contracts.filter((c) => isContractExpiring(c.endDate)).length
  const totalValue = contracts.reduce((sum, c) => sum + c.contractValue, 0)

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">{language === "ar" ? "إجمالي العقود" : "Total Contracts"}</p>
                <p className="text-2xl font-bold">{contracts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">{language === "ar" ? "العقود النشطة" : "Active Contracts"}</p>
                <p className="text-2xl font-bold">{activeContracts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">{language === "ar" ? "عقود منتهية قريباً" : "Expiring Soon"}</p>
                <p className="text-2xl font-bold">{expiringContracts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">{language === "ar" ? "إجمالي القيمة" : "Total Value"}</p>
                <p className="text-lg font-bold">{formatCurrency(totalValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl flex items-center gap-2">
              <FileText className="h-6 w-6" />
              {language === "ar" ? "إدارة العقود" : "Contract Management"}
            </CardTitle>
            <Button onClick={() => setIsFormOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              {language === "ar" ? "إضافة عقد جديد" : "Add New Contract"}
            </Button>
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search
                className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4`}
              />
              <Input
                placeholder={
                  language === "ar" ? "البحث بالرقم أو العنوان أو المورد..." : "Search by number, title, or supplier..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={isRTL ? "pr-10" : "pl-10"}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={language === "ar" ? "جميع الحالات" : "All Statuses"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === "ar" ? "جميع الحالات" : "All Statuses"}</SelectItem>
                {contractStatuses.map((status) => (
                  <SelectItem key={status.id} value={status.code}>
                    {language === "ar" ? status.nameAr : status.nameEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={isRTL ? "text-right" : "text-left"}>
                    {language === "ar" ? "رقم العقد" : "Contract Number"}
                  </TableHead>
                  <TableHead className={isRTL ? "text-right" : "text-left"}>
                    {language === "ar" ? "عنوان العقد" : "Contract Title"}
                  </TableHead>
                  <TableHead className={isRTL ? "text-right" : "text-left"}>
                    {language === "ar" ? "المورد" : "Supplier"}
                  </TableHead>
                  <TableHead className={isRTL ? "text-right" : "text-left"}>
                    {language === "ar" ? "قيمة العقد" : "Contract Value"}
                  </TableHead>
                  <TableHead className={isRTL ? "text-right" : "text-left"}>
                    {language === "ar" ? "تاريخ النهاية" : "End Date"}
                  </TableHead>
                  <TableHead className={isRTL ? "text-right" : "text-left"}>
                    {language === "ar" ? "الحالة" : "Status"}
                  </TableHead>
                  <TableHead className={isRTL ? "text-right" : "text-left"}>
                    {language === "ar" ? "خطاب الضمان" : "Bond"}
                  </TableHead>
                  <TableHead className={isRTL ? "text-right" : "text-left"}>
                    {language === "ar" ? "المرفقات" : "Attachments"}
                  </TableHead>
                  <TableHead className={isRTL ? "text-right" : "text-left"}>
                    {language === "ar" ? "الإجراءات" : "Actions"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContracts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      {t("msg.noData")}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContracts.map((contract) => {
                    const daysRemaining = calculateDaysRemaining(contract.endDate)
                    const isExpiring = isContractExpiring(contract.endDate)
                    const isExpired = isContractExpired(contract.endDate)

                    return (
                      <TableRow key={contract.id}>
                        <TableCell className="font-medium" dir="ltr">
                          {contract.contractNumber}
                        </TableCell>
                        <TableCell className="font-medium" dir={isRTL ? "rtl" : "ltr"}>
                          <div className="max-w-[200px] truncate" title={contract.contractTitle}>
                            {contract.contractTitle}
                          </div>
                        </TableCell>
                        <TableCell dir={isRTL ? "rtl" : "ltr"}>
                          {getDisplayName(contract.supplierName, suppliers, language)}
                        </TableCell>
                        <TableCell dir="ltr" className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {formatCurrency(contract.contractValue)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span dir="ltr">{formatDate(contract.endDate)}</span>
                            {isExpired && (
                              <Badge variant="destructive" className="text-xs">
                                {language === "ar" ? "منتهي" : "Expired"}
                              </Badge>
                            )}
                            {isExpiring && !isExpired && (
                              <Badge variant="outline" className="text-xs text-orange-600">
                                {daysRemaining} {language === "ar" ? "يوم" : "days"}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(contract.contractStatus)}>
                            {getDisplayName(contract.contractStatus, contractStatuses, language)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            <span className="text-sm">{formatCurrency(contract.performanceBond.bondValue)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{contract.contractAttachments.length}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                            <Button variant="outline" size="sm" onClick={() => handleEdit(contract)} className="gap-1">
                              <Pencil className="h-3 w-3" />
                              {t("action.edit")}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => onDelete(contract.id)}
                              className="gap-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              {t("action.delete")}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        <ContractForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          initialData={editingContract}
        />
      </Card>
    </div>
  )
}
