"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, Search, FileText, Calendar } from "lucide-react"
import type { Tender } from "@/types/tender"
import { TenderForm } from "./tender-form"
import { useLanguage } from "@/contexts/language-context"
import { LocalStorageService } from "@/lib/localStorage"
import { ProjectsService } from "@/lib/projects-service"

interface TendersTableProps {
  tenders: Tender[]
  onAdd: (data: Omit<Tender, "id" | "createdAt" | "updatedAt">) => void
  onUpdate: (id: string, data: Partial<Tender>) => void
  onDelete: (id: string) => void
}

export function TendersTable({ tenders, onAdd, onUpdate, onDelete }: TendersTableProps) {
  const { language, t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTender, setEditingTender] = useState<Tender | null>(null)

  const isRTL = language === "ar"

  // Get definition data for display
  const projects = ProjectsService.getProjects()
  const projectTypes = LocalStorageService.getItems("project-types")
  const tenderMethods = LocalStorageService.getItems("tender-methods")

  const getDisplayName = (code: string, items: any[], lang: "ar" | "en") => {
    const item = items.find((i) => i.code === code)
    return item ? (lang === "ar" ? item.nameAr : item.nameEn) : code
  }

  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    return project ? project.projectTitle : projectId
  }

  const getStatusColor = (issueDate: string, closingDate: string) => {
    const now = new Date()
    const issue = new Date(issueDate)
    const closing = new Date(closingDate)

    if (now < issue) return "secondary" // Not started
    if (now > closing) return "destructive" // Closed
    return "default" // Active
  }

  const getStatusText = (issueDate: string, closingDate: string) => {
    const now = new Date()
    const issue = new Date(issueDate)
    const closing = new Date(closingDate)

    if (now < issue) return language === "ar" ? "لم تبدأ" : "Not Started"
    if (now > closing) return language === "ar" ? "مغلقة" : "Closed"
    return language === "ar" ? "نشطة" : "Active"
  }

  const filteredTenders = tenders.filter(
    (tender) =>
      tender.tenderTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.tenderId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (tender: Tender) => {
    setEditingTender(tender)
    setIsFormOpen(true)
  }

  const handleFormSubmit = (data: Omit<Tender, "id" | "createdAt" | "updatedAt">) => {
    if (editingTender) {
      onUpdate(editingTender.id, data)
    } else {
      onAdd(data)
    }
    setEditingTender(null)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingTender(null)
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
            {language === "ar" ? "إعداد المناقصات" : "Tender Preparation"}
          </CardTitle>
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            {language === "ar" ? "إضافة مناقصة جديدة" : "Add New Tender"}
          </Button>
        </div>

        <div className="relative">
          <Search
            className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4`}
          />
          <Input
            placeholder={language === "ar" ? "البحث بالعنوان أو الرقم..." : "Search by title or ID..."}
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
                  {language === "ar" ? "رقم المناقصة" : "Tender ID"}
                </TableHead>
                <TableHead className={isRTL ? "text-right" : "text-left"}>
                  {language === "ar" ? "عنوان المناقصة" : "Tender Title"}
                </TableHead>
                <TableHead className={isRTL ? "text-right" : "text-left"}>
                  {language === "ar" ? "المشروع المرجعي" : "Project Reference"}
                </TableHead>
                <TableHead className={isRTL ? "text-right" : "text-left"}>
                  {language === "ar" ? "طريقة الطرح" : "Tender Method"}
                </TableHead>
                <TableHead className={isRTL ? "text-right" : "text-left"}>
                  {language === "ar" ? "تاريخ الإغلاق" : "Closing Date"}
                </TableHead>
                <TableHead className={isRTL ? "text-right" : "text-left"}>
                  {language === "ar" ? "الحالة" : "Status"}
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
              {filteredTenders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    {t("msg.noData")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTenders.map((tender) => (
                  <TableRow key={tender.id}>
                    <TableCell className="font-medium" dir="ltr">
                      {tender.tenderId}
                    </TableCell>
                    <TableCell className="font-medium" dir={isRTL ? "rtl" : "ltr"}>
                      {tender.tenderTitle}
                    </TableCell>
                    <TableCell dir={isRTL ? "rtl" : "ltr"}>{getProjectName(tender.projectReference)}</TableCell>
                    <TableCell dir={isRTL ? "rtl" : "ltr"}>
                      {getDisplayName(tender.tenderMethod, tenderMethods, language)}
                    </TableCell>
                    <TableCell dir="ltr" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(tender.tenderClosingDate)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(tender.tenderIssueDate, tender.tenderClosingDate)}>
                        {getStatusText(tender.tenderIssueDate, tender.tenderClosingDate)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{tender.attachments.length}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(tender)} className="gap-1">
                          <Pencil className="h-3 w-3" />
                          {t("action.edit")}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => onDelete(tender.id)} className="gap-1">
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

      <TenderForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialData={editingTender}
      />
    </Card>
  )
}
