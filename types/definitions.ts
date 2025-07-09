export interface DefinitionItem {
  id: string
  code: string
  nameAr: string
  nameEn: string
  notes: string
  createdAt: string
  updatedAt: string
}

export interface DefinitionType {
  key: string
  translationKey: string
  icon: string
}

export const DEFINITION_TYPES: DefinitionType[] = [
  { key: "project-types", translationKey: "def.project-types", icon: "🏗️" },
  { key: "departments", translationKey: "def.departments", icon: "🏢" },
  { key: "status", translationKey: "def.status", icon: "📊" },
  { key: "evaluation-criteria", translationKey: "def.evaluation-criteria", icon: "📋" },
  { key: "technical-requirements", translationKey: "def.technical-requirements", icon: "⚙️" },
  { key: "suppliers", translationKey: "def.suppliers", icon: "🏪" },
  { key: "compliance-status", translationKey: "def.compliance-status", icon: "✅" },
  { key: "evaluation-committee", translationKey: "def.evaluation-committee", icon: "👥" },
  { key: "payment-terms", translationKey: "def.payment-terms", icon: "💰" },
  { key: "contract-status", translationKey: "def.contract-status", icon: "📄" },
  { key: "tender-methods", translationKey: "def.tender-methods", icon: "📢" }, // New addition
]
