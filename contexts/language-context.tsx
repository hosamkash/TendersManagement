"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "ar" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.setup": "التأسيس - الإعدادات",
    "nav.back": "العودة للرئيسية",

    // Main titles
    "app.title": "نظام إدارة العطاءات والمناقصات",
    "app.subtitle": "إدارة شاشات التعريف الأساسية",
    "setup.title": "التأسيس والإعدادات",
    "setup.subtitle": "إدارة البيانات الأساسية للنظام",

    // Definition types
    "def.project-types": "نوع المشروع",
    "def.departments": "القسم المسؤول",
    "def.status": "الحالة",
    "def.evaluation-criteria": "معايير التقييم",
    "def.technical-requirements": "المتطلبات الفنية",
    "def.suppliers": "الموردين",
    "def.compliance-status": "حالة المطابقة",
    "def.evaluation-committee": "لجان التقييم",
    "def.payment-terms": "شروط الدفع",
    "def.contract-status": "حالة العقد",
    "def.tender-methods": "طريقة الطرح", // New addition

    // Form fields
    "form.code": "الكود",
    "form.nameAr": "الاسم العربي",
    "form.nameEn": "الاسم الإنجليزي",
    "form.notes": "الملاحظات",

    // Actions
    "action.add": "إضافة",
    "action.edit": "تعديل",
    "action.delete": "حذف",
    "action.cancel": "إلغاء",
    "action.update": "تحديث",
    "action.addNew": "إضافة جديد",
    "action.search": "البحث بالكود أو الاسم...",

    // Messages
    "msg.noData": "لا توجد بيانات",
    "msg.loading": "جاري التحميل...",
    "msg.pageNotFound": "الصفحة غير موجودة",

    // Form titles
    "form.addTitle": "إضافة",
    "form.editTitle": "تعديل",

    // Stats
    "stats.title": "إحصائيات البيانات",
    "stats.totalItems": "إجمالي العناصر",

    // Seed Data
    "seed.title": "إدارة البيانات الجاهزة",
    "seed.load": "تحميل البيانات الجاهزة",
    "seed.clear": "مسح جميع البيانات",
    "seed.loading": "جاري التحميل...",
    "seed.success": "تم تحميل البيانات بنجاح",
    "seed.warning": "تحذير: سيتم حذف جميع البيانات المحفوظة",
    "seed.hasData": "يحتوي بيانات",
    "seed.empty": "فارغ",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.setup": "Setup - Settings",
    "nav.back": "Back to Home",

    // Main titles
    "app.title": "Tenders Management System",
    "app.subtitle": "Manage Basic Definition Screens",
    "setup.title": "Setup and Settings",
    "setup.subtitle": "Manage System Basic Data",

    // Definition types
    "def.project-types": "Project Type",
    "def.departments": "Department Responsible",
    "def.status": "Status",
    "def.evaluation-criteria": "Evaluation Criteria",
    "def.technical-requirements": "Technical Requirements",
    "def.suppliers": "Suppliers",
    "def.compliance-status": "Compliance Status",
    "def.evaluation-committee": "Evaluation Committee",
    "def.payment-terms": "Payment Terms",
    "def.contract-status": "Contract Status",
    "def.tender-methods": "Tender Method", // New addition

    // Form fields
    "form.code": "Code",
    "form.nameAr": "Arabic Name",
    "form.nameEn": "English Name",
    "form.notes": "Notes",

    // Actions
    "action.add": "Add",
    "action.edit": "Edit",
    "action.delete": "Delete",
    "action.cancel": "Cancel",
    "action.update": "Update",
    "action.addNew": "Add New",
    "action.search": "Search by code or name...",

    // Messages
    "msg.noData": "No data available",
    "msg.loading": "Loading...",
    "msg.pageNotFound": "Page not found",

    // Form titles
    "form.addTitle": "Add",
    "form.editTitle": "Edit",

    // Stats
    "stats.title": "Data Statistics",
    "stats.totalItems": "Total Items",

    // Seed Data
    "seed.title": "Seed Data Management",
    "seed.load": "Load Seed Data",
    "seed.clear": "Clear All Data",
    "seed.loading": "Loading...",
    "seed.success": "Data loaded successfully",
    "seed.warning": "Warning: This will delete all saved data",
    "seed.hasData": "Has Data",
    "seed.empty": "Empty",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "ar" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
