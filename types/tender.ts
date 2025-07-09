export interface TenderAttachment {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: string
}

export interface Tender {
  id: string
  tenderId: string
  projectReference: string
  tenderTitle: string
  tenderType: string
  tenderMethod: string
  budgetReference: string
  tenderIssueDate: string
  tenderClosingDate: string
  tenderDescription: string
  evaluationCriteria: string[]
  technicalRequirements: string[]
  attachments: TenderAttachment[]
  createdAt: string
  updatedAt: string
}
