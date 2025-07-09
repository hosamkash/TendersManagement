"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Trash2, Plus, Search } from "lucide-react"
import type { DefinitionItem } from "@/types/definitions"
import { DefinitionForm } from "./definition-form"
import { useLanguage } from "@/contexts/language-context"

interface DefinitionsTableProps {
  items: DefinitionItem[]
  title: string
  onAdd: (data: Omit<DefinitionItem, "id" | "createdAt" | "updatedAt">) => void
  onUpdate: (id: string, data: Partial<DefinitionItem>) => void
  onDelete: (id: string) => void
}

export function DefinitionsTable({ items, title, onAdd, onUpdate, onDelete }: DefinitionsTableProps) {
  const { language, t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<DefinitionItem | null>(null)

  const isRTL = language === "ar"

  const filteredItems = items.filter(
    (item) =>
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nameAr.includes(searchTerm) ||
      item.nameEn.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (item: DefinitionItem) => {
    setEditingItem(item)
    setIsFormOpen(true)
  }

  const handleFormSubmit = (data: Omit<DefinitionItem, "id" | "createdAt" | "updatedAt">) => {
    if (editingItem) {
      onUpdate(editingItem.id, data)
    } else {
      onAdd(data)
    }
    setEditingItem(null)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingItem(null)
  }

  return (
    <Card dir={isRTL ? "rtl" : "ltr"}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">{title}</CardTitle>
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            {t("action.addNew")}
          </Button>
        </div>

        <div className="relative">
          <Search
            className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4`}
          />
          <Input
            placeholder={t("action.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={isRTL ? "pr-10" : "pl-10"}
          />
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={isRTL ? "text-right" : "text-left"}>{t("form.code")}</TableHead>
              <TableHead className={isRTL ? "text-right" : "text-left"}>{t("form.nameAr")}</TableHead>
              <TableHead className={isRTL ? "text-right" : "text-left"}>{t("form.nameEn")}</TableHead>
              <TableHead className={isRTL ? "text-right" : "text-left"}>{t("form.notes")}</TableHead>
              <TableHead className={isRTL ? "text-right" : "text-left"}>
                {language === "ar" ? "الإجراءات" : "Actions"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  {t("msg.noData")}
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.code}</TableCell>
                  <TableCell dir="rtl">{item.nameAr}</TableCell>
                  <TableCell dir="ltr">{item.nameEn}</TableCell>
                  <TableCell dir={isRTL ? "rtl" : "ltr"}>{item.notes || "-"}</TableCell>
                  <TableCell>
                    <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(item)} className="gap-1">
                        <Pencil className="h-3 w-3" />
                        {t("action.edit")}
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => onDelete(item.id)} className="gap-1">
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
      </CardContent>

      <DefinitionForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialData={editingItem}
        title={title}
      />
    </Card>
  )
}
