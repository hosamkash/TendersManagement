export interface ContractAttachment {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: string
}

export interface PerformanceBond {
  bondNumber: string
  bondValue: number
  bondPercentage: number
  issueDate: string
  expiryDate: string
  bankName: string
  bondType: string
}

export interface Contract {
  id: string
  contractNumber: string
  contractTitle: string
  supplierName: string
  startDate: string
  endDate: string
  contractValue: number
  paymentTerms: string
  contractAttachments: ContractAttachment[]
  contractStatus: string
  performanceBond: PerformanceBond
  relatedTenderId?: string
  relatedBidId?: string
  createdAt: string
  updatedAt: string
}
