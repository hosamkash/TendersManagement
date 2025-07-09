export interface BidDocument {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: string
}

export interface Bid {
  id: string
  tenderId: string
  supplierName: string
  bidAmount: number
  submissionDate: string
  bidValidityPeriod: string
  technicalDocuments: BidDocument[]
  commercialDocuments: BidDocument[]
  complianceStatus: string
  notes: string
  createdAt: string
  updatedAt: string
}
