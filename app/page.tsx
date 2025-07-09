"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  FileText,
  FolderOpen,
  Send,
  BarChart3,
  ArrowRight,
  ArrowDown,
  CheckCircle,
  ArrowLeft,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { LocalStorageService } from "@/lib/localStorage"
import { ProjectsService } from "@/lib/projects-service"
import { TendersService } from "@/lib/tenders-service"
import { BidsService } from "@/lib/bids-service"
import { EvaluationsService } from "@/lib/evaluations-service"
import { ContractsService } from "@/lib/contracts-service"

export default function HomePage() {
  const { language, t } = useLanguage()
  const isRTL = language === "ar"

  // Get data counts for progress indicators
  const getDataCounts = () => {
    const definitionsCount =
      LocalStorageService.getItems("project-types").length +
      LocalStorageService.getItems("suppliers").length +
      LocalStorageService.getItems("departments").length
    const projectsCount = ProjectsService.getProjects().length
    const tendersCount = TendersService.getTenders().length
    const bidsCount = BidsService.getBids().length
    const evaluationsCount = EvaluationsService.getEvaluations().length
    const contractsCount = ContractsService.getContracts().length

    return {
      definitions: definitionsCount,
      projects: projectsCount,
      tenders: tendersCount,
      bids: bidsCount,
      evaluations: evaluationsCount,
      contracts: contractsCount,
    }
  }

  const counts = getDataCounts()

  const getStepStatus = (step: number) => {
    switch (step) {
      case 1:
        return counts.definitions > 0 ? "completed" : "pending"
      case 2:
        return counts.projects > 0 ? "completed" : counts.definitions > 0 ? "available" : "locked"
      case 3:
        return counts.tenders > 0 ? "completed" : counts.projects > 0 ? "available" : "locked"
      case 4:
        return counts.bids > 0 ? "completed" : counts.tenders > 0 ? "available" : "locked"
      case 5:
        return counts.evaluations > 0 ? "completed" : counts.bids > 0 ? "available" : "locked"
      case 6:
        return counts.contracts > 0 ? "completed" : counts.evaluations > 0 ? "available" : "locked"
      default:
        return "locked"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200"
      case "available":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "pending":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "locked":
        return "text-gray-400 bg-gray-50 border-gray-200"
      default:
        return "text-gray-400 bg-gray-50 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "available":
        return <div className="h-5 w-5 rounded-full bg-blue-600" />
      case "pending":
        return <div className="h-5 w-5 rounded-full bg-orange-600" />
      case "locked":
        return <div className="h-5 w-5 rounded-full bg-gray-400" />
      default:
        return <div className="h-5 w-5 rounded-full bg-gray-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return language === "ar" ? "مكتمل" : "Completed"
      case "available":
        return language === "ar" ? "متاح" : "Available"
      case "pending":
        return language === "ar" ? "ابدأ هنا" : "Start Here"
      case "locked":
        return language === "ar" ? "مقفل" : "Locked"
      default:
        return language === "ar" ? "مقفل" : "Locked"
    }
  }

  const steps = [
    {
      number: 1,
      title: language === "ar" ? "التأسيس والإعدادات" : "Setup & Settings",
      description: language === "ar" ? "إعداد البيانات الأساسية والتعريفات" : "Configure basic data and definitions",
      icon: <Settings className="h-8 w-8" />,
      href: "/setup",
      count: counts.definitions,
      status: getStepStatus(1),
    },
    {
      number: 2,
      title: language === "ar" ? "إدارة المشاريع" : "Projects Management",
      description: language === "ar" ? "إنشاء وإدارة مشاريع العطاءات" : "Create and manage tender projects",
      icon: <FolderOpen className="h-8 w-8" />,
      href: "/projects",
      count: counts.projects,
      status: getStepStatus(2),
    },
    {
      number: 3,
      title: language === "ar" ? "إعداد المناقصات" : "Tender Preparation",
      description: language === "ar" ? "إنشاء وإدارة المناقصات" : "Create and manage tenders",
      icon: <FileText className="h-8 w-8" />,
      href: "/tenders",
      count: counts.tenders,
      status: getStepStatus(3),
    },
    {
      number: 4,
      title: language === "ar" ? "تقديم العطاءات" : "Bid Submission",
      description: language === "ar" ? "تقديم وإدارة العطاءات" : "Submit and manage bids",
      icon: <Send className="h-8 w-8" />,
      href: "/bids",
      count: counts.bids,
      status: getStepStatus(4),
    },
    {
      number: 5,
      title: language === "ar" ? "تقييم العطاءات" : "Bid Evaluation",
      description: language === "ar" ? "تقييم ومقارنة العطاءات" : "Evaluate and compare bids",
      icon: <BarChart3 className="h-8 w-8" />,
      href: "/evaluations",
      count: counts.evaluations,
      status: getStepStatus(5),
    },
    {
      number: 6,
      title: language === "ar" ? "إدارة العقود" : "Contract Management",
      description: language === "ar" ? "إدارة العقود وخطابات الضمان" : "Manage contracts and performance bonds",
      icon: <FileText className="h-8 w-8" />,
      href: "/contracts",
      count: counts.contracts,
      status: getStepStatus(6),
    },
  ]

  const StepCard = ({ step, index }: { step: any; index: number }) => {
    const isLocked = step.status === "locked"
    const CardComponent = isLocked ? "div" : Link

    return (
      <div className="relative">
        <CardComponent href={isLocked ? undefined : step.href}>
          <Card
            className={`
            hover:shadow-lg transition-all duration-300 cursor-pointer h-full
            ${getStatusColor(step.status)}
            ${isLocked ? "opacity-60 cursor-not-allowed" : "hover:scale-105"}
            border-2
          `}
          >
            <CardHeader className="text-center pb-4">
              {/* Step Number Badge */}
              <div className="flex justify-center mb-3">
                <div
                  className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg
                  ${
                    step.status === "completed"
                      ? "bg-green-600"
                      : step.status === "available"
                        ? "bg-blue-600"
                        : step.status === "pending"
                          ? "bg-orange-600"
                          : "bg-gray-400"
                  }
                `}
                >
                  {step.number}
                </div>
              </div>

              {/* Icon */}
              <div
                className={`
                mx-auto mb-3
                ${
                  step.status === "completed"
                    ? "text-green-600"
                    : step.status === "available"
                      ? "text-blue-600"
                      : step.status === "pending"
                        ? "text-orange-600"
                        : "text-gray-400"
                }
              `}
              >
                {step.icon}
              </div>

              {/* Title */}
              <CardTitle
                className={`
                text-lg
                ${
                  step.status === "completed"
                    ? "text-green-700"
                    : step.status === "available"
                      ? "text-blue-700"
                      : step.status === "pending"
                        ? "text-orange-700"
                        : "text-gray-500"
                }
              `}
              >
                {step.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="text-center pt-0">
              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 min-h-[40px]">{step.description}</p>

              {/* Status and Count */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(step.status)}
                  <span className="text-sm font-medium">{getStatusText(step.status)}</span>
                </div>

                {step.count > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {step.count} {language === "ar" ? "عنصر" : "items"}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </CardComponent>

        {/* Arrow between steps */}
        {index < steps.length - 1 && (
          <div className="flex justify-center my-4">
            <ArrowDown className="h-6 w-6 text-gray-400" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6" dir={isRTL ? "rtl" : "ltr"}>
      <LanguageSwitcher />

      {/* Header */}
      <div className="mb-8 mt-12 text-center">
        <h1 className="text-4xl font-bold mb-2">{t("app.title")}</h1>
        <p className="text-gray-600 mb-6">{t("app.subtitle")}</p>

        {/* Progress Overview */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-8">
          <h2 className="text-lg font-semibold mb-3">
            {language === "ar" ? "نظرة عامة على التقدم" : "Progress Overview"}
          </h2>
          <div className="flex justify-center gap-4 flex-wrap">
            {steps.map((step) => (
              <div key={step.number} className="flex items-center gap-2">
                <div
                  className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold
                  ${
                    step.status === "completed"
                      ? "bg-green-600"
                      : step.status === "available"
                        ? "bg-blue-600"
                        : step.status === "pending"
                          ? "bg-orange-600"
                          : "bg-gray-400"
                  }
                `}
                >
                  {step.number}
                </div>
                <span className="text-sm font-medium">{step.title}</span>
                {step.number < steps.length &&
                  (isRTL ? (
                    <ArrowLeft className="h-4 w-4 text-gray-400 mx-1" />
                  ) : (
                    <ArrowRight className="h-4 w-4 text-gray-400 mx-1" />
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Steps Flow */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`
              ${index === 0 ? "md:col-span-2 lg:col-span-3" : ""}
              ${index === 1 || index === 2 ? "lg:col-span-1" : ""}
              ${index === 3 || index === 4 ? "lg:col-span-1" : ""}
            `}
            >
              <StepCard step={step} index={index} />
            </div>
          ))}
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">
              {language === "ar" ? "كيفية البدء" : "How to Get Started"}
            </h3>
            <p className="text-blue-700 text-sm">
              {language === "ar"
                ? "ابدأ بالخطوة الأولى (التأسيس والإعدادات) لإعداد البيانات الأساسية، ثم تابع الخطوات بالترتيب المعروض أعلاه."
                : "Start with Step 1 (Setup & Settings) to configure basic data, then follow the steps in the order shown above."}
            </p>
          </div>
        </div>

        {/* Future Features */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-6">{language === "ar" ? "مميزات قادمة" : "Coming Soon"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2 border-dashed border-gray-300 opacity-60">
              <CardHeader className="text-center">
                <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <CardTitle className="text-gray-500">
                  {language === "ar" ? "التقارير والتحليلات" : "Reports & Analytics"}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-400 text-sm">
                  {language === "ar" ? "تقارير شاملة وتحليلات متقدمة" : "Comprehensive reports and advanced analytics"}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-dashed border-gray-300 opacity-60">
              <CardHeader className="text-center">
                <BarChart3 className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <CardTitle className="text-gray-500">{language === "ar" ? "لوحة التحكم" : "Dashboard"}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-400 text-sm">
                  {language === "ar" ? "لوحة تحكم تفاعلية مع مؤشرات الأداء" : "Interactive dashboard with KPIs"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
