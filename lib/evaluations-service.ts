import type { BidEvaluation, EvaluationSummary } from "@/types/evaluation"
import { BidsService } from "./bids-service"
import { TendersService } from "./tenders-service"

export class EvaluationsService {
  private static getKey(): string {
    return "tenders_evaluations"
  }

  static getEvaluations(): BidEvaluation[] {
    if (typeof window === "undefined") return []

    try {
      const data = localStorage.getItem(this.getKey())
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("Error reading evaluations from localStorage:", error)
      return []
    }
  }

  static saveEvaluations(evaluations: BidEvaluation[]): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(this.getKey(), JSON.stringify(evaluations))
    } catch (error) {
      console.error("Error saving evaluations to localStorage:", error)
    }
  }

  static addEvaluation(evaluation: Omit<BidEvaluation, "id" | "createdAt" | "updatedAt">): BidEvaluation {
    const evaluations = this.getEvaluations()
    const newEvaluation: BidEvaluation = {
      ...evaluation,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    evaluations.push(newEvaluation)
    this.saveEvaluations(evaluations)
    return newEvaluation
  }

  static updateEvaluation(id: string, updates: Partial<BidEvaluation>): BidEvaluation | null {
    const evaluations = this.getEvaluations()
    const index = evaluations.findIndex((evaluation) => evaluation.id === id)

    if (index === -1) return null

    evaluations[index] = {
      ...evaluations[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    this.saveEvaluations(evaluations)
    return evaluations[index]
  }

  static deleteEvaluation(id: string): boolean {
    const evaluations = this.getEvaluations()
    const filteredEvaluations = evaluations.filter((evaluation) => evaluation.id !== id)

    if (filteredEvaluations.length === evaluations.length) return false

    this.saveEvaluations(filteredEvaluations)
    return true
  }

  static getEvaluationsByTender(tenderId: string): BidEvaluation[] {
    return this.getEvaluations().filter((evaluation) => evaluation.tenderId === tenderId)
  }

  static getEvaluationByBid(bidId: string): BidEvaluation | null {
    return this.getEvaluations().find((evaluation) => evaluation.bidId === bidId) || null
  }

  static getEvaluationSummaries(): EvaluationSummary[] {
    const evaluations = this.getEvaluations()
    const tenders = TendersService.getTenders()
    const bids = BidsService.getBids()

    return tenders.map((tender) => {
      const tenderBids = bids.filter((bid) => bid.tenderId === tender.id)
      const tenderEvaluations = evaluations.filter((evaluation) => evaluation.tenderId === tender.id)

      const topBid =
        tenderEvaluations.length > 0
          ? tenderEvaluations.reduce((prev, current) => (prev.finalScore > current.finalScore ? prev : current))
          : null

      const averageScore =
        tenderEvaluations.length > 0
          ? tenderEvaluations.reduce((sum, evaluation) => sum + evaluation.finalScore, 0) / tenderEvaluations.length
          : 0

      return {
        tenderId: tender.id,
        tenderTitle: tender.tenderTitle,
        totalBids: tenderBids.length,
        evaluatedBids: tenderEvaluations.length,
        topBid,
        averageScore: Math.round(averageScore * 100) / 100,
      }
    })
  }

  static calculateFinalScore(
    technicalScore: number,
    financialScore: number,
    technicalWeight = 0.6,
    financialWeight = 0.4,
  ): number {
    return Math.round((technicalScore * technicalWeight + financialScore * financialWeight) * 100) / 100
  }
}
