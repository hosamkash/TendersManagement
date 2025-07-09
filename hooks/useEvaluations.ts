"use client"

import { useState, useEffect } from "react"
import type { BidEvaluation, EvaluationSummary } from "@/types/evaluation"
import { EvaluationsService } from "@/lib/evaluations-service"

export function useEvaluations() {
  const [evaluations, setEvaluations] = useState<BidEvaluation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEvaluations = () => {
      const savedEvaluations = EvaluationsService.getEvaluations()
      setEvaluations(savedEvaluations)
      setLoading(false)
    }

    loadEvaluations()
  }, [])

  const addEvaluation = (evaluation: Omit<BidEvaluation, "id" | "createdAt" | "updatedAt">) => {
    const newEvaluation = EvaluationsService.addEvaluation(evaluation)
    setEvaluations((prev) => [...prev, newEvaluation])
    return newEvaluation
  }

  const updateEvaluation = (id: string, updates: Partial<BidEvaluation>) => {
    const updatedEvaluation = EvaluationsService.updateEvaluation(id, updates)
    if (updatedEvaluation) {
      setEvaluations((prev) => prev.map((evaluation) => (evaluation.id === id ? updatedEvaluation : evaluation)))
    }
    return updatedEvaluation
  }

  const deleteEvaluation = (id: string) => {
    const success = EvaluationsService.deleteEvaluation(id)
    if (success) {
      setEvaluations((prev) => prev.filter((evaluation) => evaluation.id !== id))
    }
    return success
  }

  const getEvaluationsByTender = (tenderId: string) => {
    return evaluations.filter((evaluation) => evaluation.tenderId === tenderId)
  }

  const getEvaluationSummaries = (): EvaluationSummary[] => {
    return EvaluationsService.getEvaluationSummaries()
  }

  return {
    evaluations,
    loading,
    addEvaluation,
    updateEvaluation,
    deleteEvaluation,
    getEvaluationsByTender,
    getEvaluationSummaries,
  }
}
