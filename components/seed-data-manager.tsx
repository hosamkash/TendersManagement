"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Database, Download, Trash2, AlertTriangle } from "lucide-react"
import { SeedService } from "@/lib/seed-service"
import { DEFINITION_TYPES } from "@/types/definitions"
import { useLanguage } from "@/contexts/language-context"

export function SeedDataManager() {
  const { language, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Record<string, number> | null>(null)

  const isRTL = language === "ar"
  const hasAnyData = SeedService.hasAnyData()

  const handleLoadSeedData = async () => {
    setLoading(true)
    try {
      const loadResults = SeedService.loadAllSeedData()
      setResults(loadResults)
    } catch (error) {
      console.error("Error loading seed data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleClearAllData = () => {
    SeedService.clearAllData()
    setResults(null)
    window.location.reload() // Refresh to update all components
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Database className="h-4 w-4" />
          {language === "ar" ? "إدارة البيانات الجاهزة" : "Manage Seed Data"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            {language === "ar" ? "إدارة البيانات الجاهزة" : "Seed Data Management"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {language === "ar" ? "تحميل البيانات الجاهزة" : "Load Seed Data"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                {language === "ar"
                  ? "سيتم تحميل بيانات جاهزة لجميع شاشات التعريف لتسهيل الاستخدام والاختبار."
                  : "This will load sample data for all definition screens to facilitate usage and testing."}
              </p>

              <div className="grid grid-cols-2 gap-2">
                {DEFINITION_TYPES.map((defType) => {
                  const hasData = SeedService.hasData(defType.key)
                  return (
                    <div key={defType.key} className="flex items-center justify-between text-sm">
                      <span>{t(defType.translationKey)}</span>
                      <Badge variant={hasData ? "default" : "secondary"}>
                        {hasData
                          ? language === "ar"
                            ? "يحتوي بيانات"
                            : "Has Data"
                          : language === "ar"
                            ? "فارغ"
                            : "Empty"}
                      </Badge>
                    </div>
                  )
                })}
              </div>

              <Button onClick={handleLoadSeedData} disabled={loading} className="w-full gap-2">
                <Download className="h-4 w-4" />
                {loading
                  ? language === "ar"
                    ? "جاري التحميل..."
                    : "Loading..."
                  : language === "ar"
                    ? "تحميل البيانات الجاهزة"
                    : "Load Seed Data"}
              </Button>

              {results && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">
                    {language === "ar" ? "تم تحميل البيانات بنجاح:" : "Data loaded successfully:"}
                  </h4>
                  <div className="space-y-1 text-sm text-green-700">
                    {Object.entries(results).map(([key, count]) => {
                      const defType = DEFINITION_TYPES.find((dt) => dt.key === key)
                      return (
                        <div key={key} className="flex justify-between">
                          <span>{defType ? t(defType.translationKey) : key}</span>
                          <span>
                            {count} {language === "ar" ? "عنصر" : "items"}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {hasAnyData && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-lg text-red-700 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  {language === "ar" ? "مسح جميع البيانات" : "Clear All Data"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-red-600">
                  {language === "ar"
                    ? "تحذير: سيتم حذف جميع البيانات المحفوظة في جميع شاشات التعريف. هذا الإجراء لا يمكن التراجع عنه."
                    : "Warning: This will delete all saved data in all definition screens. This action cannot be undone."}
                </p>

                <Button onClick={handleClearAllData} variant="destructive" className="w-full gap-2">
                  <Trash2 className="h-4 w-4" />
                  {language === "ar" ? "مسح جميع البيانات" : "Clear All Data"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
