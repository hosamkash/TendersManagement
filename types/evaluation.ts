export interface BidEvaluation {
  id: string
  tenderId: string
  bidId: string
  supplierName: string
  technicalScore: number
  financialScore: number
  finalScore: number
  evaluationComments: string
  evaluationCommittee: string
  evaluatedBy: string
  evaluationDate: string
  createdAt: string
  updatedAt: string
}

export interface EvaluationSummary {
  tenderId: string
  tenderTitle: string
  totalBids: number
  evaluatedBids: number
  topBid: BidEvaluation | null
  averageScore: number
}
