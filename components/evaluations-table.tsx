"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2, Plus, Search, Trophy, BarChart3, Star, Medal } from "lucide-react"
import type { BidEvaluation } from "@/types/evaluation"
import { EvaluationForm } from "./evaluation-form"
import { useLanguage } from "@/contexts/language-context"
import { LocalStorageService } from "@/lib/localStorage"
import { TendersService } from "@/lib/tenders-service"

interface EvaluationsTableProps {
  evaluations: BidEvaluation[]
  onAdd: (data: Omit<BidEvaluation, "id" | "createdAt" | "updatedAt">) => void
  onUpdate: (id: string, data: Partial<BidEvaluation>) => void
  onDelete: (id: string) => void
}

export function EvaluationsTable({ evaluations, onAdd, onUpdate, onDelete }: EvaluationsTableProps) {
  const { language, t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTender, setSelectedTender] = useState<string>("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingEvaluation, setEditingEvaluation] = useState<BidEvaluation | null>(null)

  const isRTL = language === "ar"

  // Get definition data for display
  const tenders = TendersService.getTenders()
  const evaluationCommittees = LocalStorageService.getItems("evaluation-committee")

  const getDisplayName = (code: string, items: any[], lang: "ar" | "en") => {
    const item = items.find((i) => i.code === code)
    return item ? (lang === "ar" ? item.nameAr : item.nameEn) : code
  }

  const getTenderInfo = (tenderId: string) => {
    const tender = tenders.find((t) => t.id === tenderId)
    return tender ? `${tender.tenderId} - ${tender.tenderTitle}` : tenderId
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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-4 w-4 text-yellow-500" />
      case 2:
        return <Medal className="h-4 w-4 text-gray-400" />
      case 3:
        return <Medal className="h-4 w-4 text-orange-600" />
      default:
        return <span className="text-sm font-medium">{rank}</span>
    }
  }

  // Filter and sort evaluations
  const filteredEvaluations = evaluations
    .filter((evaluation) => {
      const matchesSearch =
        evaluation.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getTenderInfo(evaluation.tenderId).toLowerCase().includes(searchTerm.toLowerCase())

      const matchesTender = selectedTender === "all" || evaluation.tenderId === selectedTender

      return matchesSearch && matchesTender
    })
    .sort((a, b) => {
      // First sort by tender, then by final score (descending)
      if (a.tenderId !== b.tenderId) {
        return a.tenderId.localeCompare(b.tenderId)
      }
      return b.finalScore - a.finalScore
    })

  // Group evaluations by tender for ranking
  const evaluationsByTender = filteredEvaluations.reduce(
    (acc, evaluation) => {
      if (!acc[evaluation.tenderId]) {
        acc[evaluation.tenderId] = []
      }
      acc[evaluation.tenderId].push(evaluation)
      return acc
    },
    {} as Record<string, BidEvaluation[]>,
  )

  // Add ranking to evaluations
  const evaluationsWithRank = filteredEvaluations.map((evaluation) => {
    const tenderEvaluations = evaluationsByTender[evaluation.tenderId]
    const rank = tenderEvaluations.findIndex((e) => e.id === evaluation.id) + 1
    return { ...evaluation, rank }
  })

  const handleEdit = (evaluation: BidEvaluation) => {
    setEditingEvaluation(evaluation)
    setIsFormOpen(true)
  }

  const handleFormSubmit = (data: Omit<BidEvaluation, "id" | "createdAt" | "updatedAt">) => {
    if (editingEvaluation) {
      onUpdate(editingEvaluation.id, data)
    } else {
      onAdd(data)
    }
    setEditingEvaluation(null)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingEvaluation(null)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")
  }

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">{language === "ar" ? "إجمالي التقييمات" : "Total Evaluations"}</p>
                <p className="text-2xl font-bold">{evaluations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">{language === "ar" ? "أعلى درجة" : "Highest Score"}</p>
                <p className="text-2xl font-bold">
                  {evaluations.length > 0 ? Math.max(...evaluations.map((e) => e.finalScore)).toFixed(1) : "0"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">{language === "ar" ? "متوسط الدرجات" : "Average Score"}</p>
                <p className="text-2xl font-bold">
                  {evaluations.length > 0
                    ? (evaluations.reduce((sum, e) => sum + e.finalScore, 0) / evaluations.length).toFixed(1)
                    : "0"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Medal className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">{language === "ar" ? "المناقصات المقيمة" : "Evaluated Tenders"}</p>
                <p className="text-2xl font-bold">{new Set(evaluations.map((e) => e.tenderId)).size}</p>
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
              <BarChart3 className="h-6 w-6" />
              {language === "ar" ? "تقييم العطاءات" : "Bid Evaluation"}
            </CardTitle>
            <Button onClick={() => setIsFormOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              {language === "ar" ? "إضافة تقييم جديد" : "Add New Evaluation"}
            </Button>
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1">
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

            <Select value={selectedTender} onValueChange={setSelectedTender}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={language === "ar" ? "جميع المناقصات" : "All Tenders"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === "ar" ? "جميع المناقصات" : "All Tenders"}</SelectItem>
                {tenders.map((tender) => (
                  <SelectItem key={tender.id} value={tender.id}>
                    {tender.tenderId}
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
                    {language === "ar" ? "الترتيب" : "Rank"}
                  </TableHead>
                  <TableHead className={isRTL ? "text-right" : "text-left"}>
                    {language === "ar" ? "المناقصة" : "Tender"}
                  </TableHead>
                  <TableHead className={isRTL ? "text-right" : "text-left"}>
                    {language === "ar" ? "المورد" : "Supplier"}
                  </TableHead>
                  <TableHead className={isRTL ? "text-right" : "text-left"}>
                    {language === "ar" ? "الدرجة الفنية" : "Technical"}
                  </TableHead>
                  <TableHead className={isRTL ? "text-right" : "text-left"}>
                    {language === "ar" ? "الدرجة المالية" : "Financial"}
                  </TableHead>
                  <TableHead className={isRTL ? "text-right" : "text-left"}>
                    {language === "ar" ? "الدرجة النهائية" : "Final Score"}
                  </TableHead>
                  <TableHead className={isRTL ? "text-right" : "text-left"}>
                    {language === "ar" ? "لجنة التقييم" : "Committee"}
                  </TableHead>
                  <TableHead className={isRTL ? "text-right" : "text-left"}>
                    {language === "ar" ? "تاريخ التقييم" : "Date"}
                  </TableHead>
                  <TableHead className={isRTL ? "text-right" : "text-left"}>
                    {language === "ar" ? "الإجراءات" : "Actions"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluationsWithRank.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      {t("msg.noData")}
                    </TableCell>
                  </TableRow>
                ) : (
                  evaluationsWithRank.map((evaluation) => (
                    <TableRow key={evaluation.id}>
                      <TableCell className="text-center">{getRankIcon(evaluation.rank)}</TableCell>
                      <TableCell className="font-medium" dir={isRTL ? "rtl" : "ltr"}>
                        <div className="max-w-[150px] truncate" title={getTenderInfo(evaluation.tenderId)}>
                          {getTenderInfo(evaluation.tenderId)}
                        </div>
                      </TableCell>
                      <TableCell dir={isRTL ? "rtl" : "ltr"}>{evaluation.supplierName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={getScoreColor(evaluation.technicalScore)}>
                            {evaluation.technicalScore.toFixed(1)}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {getScoreLabel(evaluation.technicalScore)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={getScoreColor(evaluation.financialScore)}>
                            {evaluation.financialScore.toFixed(1)}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {getScoreLabel(evaluation.financialScore)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${getScoreColor(evaluation.finalScore)}`}>
                            {evaluation.finalScore.toFixed(1)}
                          </span>
                          <Badge variant="default" className={getScoreColor(evaluation.finalScore)}>
                            {getScoreLabel(evaluation.finalScore)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell dir={isRTL ? "rtl" : "ltr"}>
                        {getDisplayName(evaluation.evaluationCommittee, evaluationCommittees, language)}
                      </TableCell>
                      <TableCell dir="ltr">{formatDate(evaluation.evaluationDate)}</TableCell>
                      <TableCell>
                        <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(evaluation)} className="gap-1">
                            <Pencil className="h-3 w-3" />
                            {t("action.edit")}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onDelete(evaluation.id)}
                            className="gap-1"
                          >
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

        <EvaluationForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          initialData={editingEvaluation}
        />
      </Card>
    </div>
  )
}
