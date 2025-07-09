import type { DefinitionItem } from "@/types/definitions"

export const SEED_DATA: Record<string, Omit<DefinitionItem, "id" | "createdAt" | "updatedAt">[]> = {
  "project-types": [
    {
      code: "CONST",
      nameAr: "مشاريع إنشائية",
      nameEn: "Construction Projects",
      notes: "مشاريع البناء والتشييد والأعمال المدنية",
    },
    {
      code: "IT",
      nameAr: "مشاريع تقنية المعلومات",
      nameEn: "IT Projects",
      notes: "مشاريع البرمجيات والأنظمة والشبكات",
    },
    {
      code: "SUPPLY",
      nameAr: "مشاريع التوريد",
      nameEn: "Supply Projects",
      notes: "توريد المعدات والمواد والأجهزة",
    },
    {
      code: "MAINT",
      nameAr: "مشاريع الصيانة",
      nameEn: "Maintenance Projects",
      notes: "أعمال الصيانة والتشغيل",
    },
    {
      code: "CONSULT",
      nameAr: "مشاريع استشارية",
      nameEn: "Consulting Projects",
      notes: "الخدمات الاستشارية والدراسات",
    },
  ],

  departments: [
    {
      code: "PROC",
      nameAr: "إدارة المشتريات",
      nameEn: "Procurement Department",
      notes: "مسؤولة عن جميع عمليات الشراء والتعاقد",
    },
    {
      code: "ENG",
      nameAr: "الإدارة الهندسية",
      nameEn: "Engineering Department",
      notes: "مسؤولة عن المشاريع الهندسية والفنية",
    },
    {
      code: "IT",
      nameAr: "إدارة تقنية المعلومات",
      nameEn: "IT Department",
      notes: "مسؤولة عن المشاريع التقنية والأنظمة",
    },
    {
      code: "FIN",
      nameAr: "الإدارة المالية",
      nameEn: "Finance Department",
      notes: "مسؤولة عن الجوانب المالية والميزانيات",
    },
    {
      code: "ADMIN",
      nameAr: "الإدارة العامة",
      nameEn: "Administration Department",
      notes: "مسؤولة عن الخدمات الإدارية العامة",
    },
  ],

  status: [
    {
      code: "DRAFT",
      nameAr: "مسودة",
      nameEn: "Draft",
      notes: "العطاء في مرحلة الإعداد",
    },
    {
      code: "PUBLISHED",
      nameAr: "منشور",
      nameEn: "Published",
      notes: "تم نشر العطاء للموردين",
    },
    {
      code: "CLOSED",
      nameAr: "مغلق",
      nameEn: "Closed",
      notes: "انتهت فترة تقديم العروض",
    },
    {
      code: "EVAL",
      nameAr: "قيد التقييم",
      nameEn: "Under Evaluation",
      notes: "جاري تقييم العروض المقدمة",
    },
    {
      code: "AWARDED",
      nameAr: "تم الترسية",
      nameEn: "Awarded",
      notes: "تم ترسية العطاء على المورد الفائز",
    },
    {
      code: "CANCELLED",
      nameAr: "ملغي",
      nameEn: "Cancelled",
      notes: "تم إلغاء العطاء",
    },
  ],

  "evaluation-criteria": [
    {
      code: "PRICE",
      nameAr: "السعر",
      nameEn: "Price",
      notes: "تقييم العروض بناءً على السعر المقدم",
    },
    {
      code: "TECH",
      nameAr: "المواصفات الفنية",
      nameEn: "Technical Specifications",
      notes: "مدى مطابقة العرض للمواصفات الفنية المطلوبة",
    },
    {
      code: "EXP",
      nameAr: "الخبرة",
      nameEn: "Experience",
      notes: "خبرة المورد في المجال المطلوب",
    },
    {
      code: "QUALITY",
      nameAr: "الجودة",
      nameEn: "Quality",
      notes: "جودة المنتجات أو الخدمات المقدمة",
    },
    {
      code: "TIME",
      nameAr: "الوقت",
      nameEn: "Time",
      notes: "مدة التنفيذ والالتزام بالجدول الزمني",
    },
    {
      code: "SUPPORT",
      nameAr: "الدعم الفني",
      nameEn: "Technical Support",
      notes: "مستوى الدعم الفني والصيانة المقدم",
    },
  ],

  "technical-requirements": [
    {
      code: "CERT",
      nameAr: "الشهادات المطلوبة",
      nameEn: "Required Certifications",
      notes: "الشهادات والتراخيص اللازمة للمورد",
    },
    {
      code: "STANDARD",
      nameAr: "المعايير الفنية",
      nameEn: "Technical Standards",
      notes: "المعايير الفنية الواجب الالتزام بها",
    },
    {
      code: "PERFORM",
      nameAr: "مؤشرات الأداء",
      nameEn: "Performance Indicators",
      notes: "مؤشرات الأداء المطلوب تحقيقها",
    },
    {
      code: "SECURITY",
      nameAr: "متطلبات الأمان",
      nameEn: "Security Requirements",
      notes: "متطلبات الأمان والحماية",
    },
    {
      code: "COMPAT",
      nameAr: "التوافق",
      nameEn: "Compatibility",
      notes: "التوافق مع الأنظمة الحالية",
    },
  ],

  suppliers: [
    {
      code: "SUP001",
      nameAr: "شركة البناء المتقدم",
      nameEn: "Advanced Construction Company",
      notes: "شركة متخصصة في المشاريع الإنشائية الكبيرة",
    },
    {
      code: "SUP002",
      nameAr: "مؤسسة التقنيات الحديثة",
      nameEn: "Modern Technologies Corporation",
      notes: "متخصصة في حلول تقنية المعلومات",
    },
    {
      code: "SUP003",
      nameAr: "شركة الخدمات الاستشارية",
      nameEn: "Consulting Services Company",
      notes: "تقدم خدمات استشارية في مختلف المجالات",
    },
    {
      code: "SUP004",
      nameAr: "مجموعة التوريدات الشاملة",
      nameEn: "Comprehensive Supply Group",
      notes: "متخصصة في توريد المعدات والمواد",
    },
    {
      code: "SUP005",
      nameAr: "شركة الصيانة المتكاملة",
      nameEn: "Integrated Maintenance Company",
      notes: "خدمات الصيانة والتشغيل",
    },
  ],

  "compliance-status": [
    {
      code: "COMPLIANT",
      nameAr: "مطابق",
      nameEn: "Compliant",
      notes: "العرض مطابق لجميع المتطلبات",
    },
    {
      code: "PARTIAL",
      nameAr: "مطابق جزئياً",
      nameEn: "Partially Compliant",
      notes: "العرض مطابق لبعض المتطلبات فقط",
    },
    {
      code: "NON_COMPLIANT",
      nameAr: "غير مطابق",
      nameEn: "Non-Compliant",
      notes: "العرض غير مطابق للمتطلبات الأساسية",
    },
    {
      code: "PENDING",
      nameAr: "قيد المراجعة",
      nameEn: "Pending Review",
      notes: "جاري مراجعة مدى المطابقة",
    },
    {
      code: "CONDITIONAL",
      nameAr: "مطابق بشروط",
      nameEn: "Conditionally Compliant",
      notes: "مطابق بشرط استيفاء متطلبات إضافية",
    },
  ],

  "evaluation-committee": [
    {
      code: "TECH_COMM",
      nameAr: "لجنة التقييم الفني",
      nameEn: "Technical Evaluation Committee",
      notes: "مسؤولة عن تقييم الجوانب الفنية للعروض",
    },
    {
      code: "FIN_COMM",
      nameAr: "لجنة التقييم المالي",
      nameEn: "Financial Evaluation Committee",
      notes: "مسؤولة عن تقييم الجوانب المالية والأسعار",
    },
    {
      code: "LEGAL_COMM",
      nameAr: "لجنة التقييم القانوني",
      nameEn: "Legal Evaluation Committee",
      notes: "مسؤولة عن مراجعة الجوانب القانونية والتعاقدية",
    },
    {
      code: "MAIN_COMM",
      nameAr: "اللجنة الرئيسية",
      nameEn: "Main Committee",
      notes: "اللجنة الرئيسية لاتخاذ القرار النهائي",
    },
    {
      code: "SPEC_COMM",
      nameAr: "لجنة متخصصة",
      nameEn: "Specialized Committee",
      notes: "لجنة متخصصة حسب طبيعة المشروع",
    },
  ],

  "payment-terms": [
    {
      code: "ADVANCE",
      nameAr: "دفعة مقدمة",
      nameEn: "Advance Payment",
      notes: "نسبة من القيمة تدفع مقدماً",
    },
    {
      code: "MILESTONE",
      nameAr: "دفع على مراحل",
      nameEn: "Milestone Payment",
      notes: "الدفع حسب إنجاز المراحل المحددة",
    },
    {
      code: "DELIVERY",
      nameAr: "دفع عند التسليم",
      nameEn: "Payment on Delivery",
      notes: "الدفع عند تسليم المنتج أو الخدمة",
    },
    {
      code: "NET30",
      nameAr: "دفع خلال 30 يوم",
      nameEn: "Net 30 Days",
      notes: "الدفع خلال 30 يوم من التسليم",
    },
    {
      code: "NET60",
      nameAr: "دفع خلال 60 يوم",
      nameEn: "Net 60 Days",
      notes: "الدفع خلال 60 يوم من التسليم",
    },
    {
      code: "RETENTION",
      nameAr: "دفع مع ضمان",
      nameEn: "Payment with Retention",
      notes: "الدفع مع احتجاز نسبة كضمان",
    },
  ],

  "contract-status": [
    {
      code: "DRAFT",
      nameAr: "مسودة عقد",
      nameEn: "Draft Contract",
      notes: "العقد في مرحلة الإعداد",
    },
    {
      code: "REVIEW",
      nameAr: "قيد المراجعة",
      nameEn: "Under Review",
      notes: "العقد قيد المراجعة القانونية",
    },
    {
      code: "APPROVED",
      nameAr: "معتمد",
      nameEn: "Approved",
      notes: "تم اعتماد العقد من الجهات المختصة",
    },
    {
      code: "SIGNED",
      nameAr: "موقع",
      nameEn: "Signed",
      notes: "تم توقيع العقد من جميع الأطراف",
    },
    {
      code: "ACTIVE",
      nameAr: "ساري المفعول",
      nameEn: "Active",
      notes: "العقد ساري المفعول وقيد التنفيذ",
    },
    {
      code: "COMPLETED",
      nameAr: "مكتمل",
      nameEn: "Completed",
      notes: "تم تنفيذ العقد بالكامل",
    },
    {
      code: "TERMINATED",
      nameAr: "منتهي",
      nameEn: "Terminated",
      notes: "تم إنهاء العقد",
    },
  ],

  // New addition: Tender Methods
  "tender-methods": [
    {
      code: "OPEN",
      nameAr: "مناقصة عامة",
      nameEn: "Open Tender",
      notes: "مناقصة مفتوحة لجميع المؤهلين",
    },
    {
      code: "RESTRICTED",
      nameAr: "مناقصة محدودة",
      nameEn: "Restricted Tender",
      notes: "مناقصة محدودة لموردين مختارين",
    },
    {
      code: "SELECTIVE",
      nameAr: "مناقصة انتقائية",
      nameEn: "Selective Tender",
      notes: "مناقصة بناءً على معايير انتقائية محددة",
    },
    {
      code: "NEGOTIATED",
      nameAr: "تفاوض مباشر",
      nameEn: "Negotiated Procedure",
      notes: "إجراء تفاوضي مباشر مع موردين محددين",
    },
    {
      code: "FRAMEWORK",
      nameAr: "اتفاقية إطارية",
      nameEn: "Framework Agreement",
      notes: "اتفاقية إطارية طويلة المدى",
    },
    {
      code: "ELECTRONIC",
      nameAr: "مزاد إلكتروني",
      nameEn: "Electronic Auction",
      notes: "مزاد إلكتروني عبر المنصات الرقمية",
    },
  ],
}
