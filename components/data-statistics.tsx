"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3 } from "lucide-react"
import { LocalStorageService } from "@/lib/localStorage"
import { DEFINITION_TYPES } from "@/types/definitions"
import { useLanguage } from "@/contexts/language-context"

export function DataStatistics() {
  const { language, t } = useLanguage()

  const getStatistics = () => {
    return DEFINITION_TYPES.map((defType) => {
      const items = LocalStorageService.getItems(defType.key)
      return {
        key: defType.key,
        name: t(defType.translationKey),
        icon: defType.icon,
        count: items.length,
      }
    })
  }

  const statistics = getStatistics()
  const totalItems = statistics.reduce((sum, stat) => sum + stat.count, 0)

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          {language === "ar" ? "إحصائيات البيانات" : "Data Statistics"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statistics.map((stat) => (
            <div key={stat.key} className="text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-sm font-medium mb-1">{stat.name}</div>
              <Badge variant={stat.count > 0 ? "default" : "secondary"}>{stat.count}</Badge>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t text-center">
          <span className="text-lg font-semibold">
            {language === "ar" ? "إجمالي العناصر: " : "Total Items: "}
            <Badge variant="outline" className="ml-2">
              {totalItems}
            </Badge>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
