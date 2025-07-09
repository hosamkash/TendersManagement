"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, Search } from "lucide-react"
import type { Project } from "@/types/project"
import { ProjectForm } from "./project-form"
import { useLanguage } from "@/contexts/language-context"
import { LocalStorageService } from "@/lib/localStorage"

interface ProjectsTableProps {
  projects: Project[]
  onAdd: (data: Omit<Project, "id" | "createdAt" | "updatedAt">) => void
  onUpdate: (id: string, data: Partial<Project>) => void
  onDelete: (id: string) => void
}

export function ProjectsTable({ projects, onAdd, onUpdate, onDelete }: ProjectsTableProps) {
  const { language, t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  const isRTL = language === "ar"

  // Get definition data for display
  const projectTypes = LocalStorageService.getItems("project-types")
  const departments = LocalStorageService.getItems("departments")
  const statuses = LocalStorageService.getItems("status")

  const getDisplayName = (code: string, items: any[], lang: "ar" | "en") => {
    const item = items.find((i) => i.code === code)
    return item ? (lang === "ar" ? item.nameAr : item.nameEn) : code
  }

  const getStatusColor = (statusCode: string) => {
    switch (statusCode) {
      case "DRAFT":
        return "secondary"
      case "PUBLISHED":
        return "default"
      case "CLOSED":
        return "destructive"
      case "EVAL":
        return "outline"
      case "AWARDED":
        return "default"
      case "CANCELLED":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setIsFormOpen(true)
  }

  const handleFormSubmit = (data: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
    if (editingProject) {
      onUpdate(editingProject.id, data)
    } else {
      onAdd(data)
    }
    setEditingProject(null)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingProject(null)
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
          <CardTitle className="text-2xl">{language === "ar" ? "إدارة المشاريع" : "Projects Management"}</CardTitle>
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            {language === "ar" ? "إضافة مشروع جديد" : "Add New Project"}
          </Button>
        </div>

        <div className="relative">
          <Search
            className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4`}
          />
          <Input
            placeholder={
              language === "ar" ? "البحث بالاسم أو الرقم أو الموقع..." : "Search by name, number, or location..."
            }
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
                  {language === "ar" ? "اسم المشروع" : "Project Title"}
                </TableHead>
                <TableHead className={isRTL ? "text-right" : "text-left"}>
                  {language === "ar" ? "رقم المشروع" : "Project Number"}
                </TableHead>
                <TableHead className={isRTL ? "text-right" : "text-left"}>
                  {language === "ar" ? "نوع المشروع" : "Project Type"}
                </TableHead>
                <TableHead className={isRTL ? "text-right" : "text-left"}>
                  {language === "ar" ? "الموقع" : "Location"}
                </TableHead>
                <TableHead className={isRTL ? "text-right" : "text-left"}>
                  {language === "ar" ? "الميزانية" : "Budget"}
                </TableHead>
                <TableHead className={isRTL ? "text-right" : "text-left"}>
                  {language === "ar" ? "القسم المسؤول" : "Department"}
                </TableHead>
                <TableHead className={isRTL ? "text-right" : "text-left"}>
                  {language === "ar" ? "الحالة" : "Status"}
                </TableHead>
                <TableHead className={isRTL ? "text-right" : "text-left"}>
                  {language === "ar" ? "الإجراءات" : "Actions"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    {t("msg.noData")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium" dir={isRTL ? "rtl" : "ltr"}>
                      {project.projectTitle}
                    </TableCell>
                    <TableCell dir="ltr">{project.projectNumber}</TableCell>
                    <TableCell dir={isRTL ? "rtl" : "ltr"}>
                      {getDisplayName(project.projectType, projectTypes, language)}
                    </TableCell>
                    <TableCell dir={isRTL ? "rtl" : "ltr"}>{project.location || "-"}</TableCell>
                    <TableCell dir="ltr">{formatCurrency(project.estimatedBudget)}</TableCell>
                    <TableCell dir={isRTL ? "rtl" : "ltr"}>
                      {getDisplayName(project.departmentResponsible, departments, language)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(project.status)}>
                        {getDisplayName(project.status, statuses, language)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(project)} className="gap-1">
                          <Pencil className="h-3 w-3" />
                          {t("action.edit")}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => onDelete(project.id)} className="gap-1">
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

      <ProjectForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialData={editingProject}
      />
    </Card>
  )
}
