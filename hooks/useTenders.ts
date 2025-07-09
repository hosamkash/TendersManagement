"use client"

import { useState, useEffect } from "react"
import type { Tender } from "@/types/tender"
import { TendersService } from "@/lib/tenders-service"

export function useTenders() {
  const [tenders, setTenders] = useState<Tender[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTenders = () => {
      const savedTenders = TendersService.getTenders()
      setTenders(savedTenders)
      setLoading(false)
    }

    loadTenders()
  }, [])

  const addTender = (tender: Omit<Tender, "id" | "createdAt" | "updatedAt">) => {
    const newTender = TendersService.addTender(tender)
    setTenders((prev) => [...prev, newTender])
    return newTender
  }

  const updateTender = (id: string, updates: Partial<Tender>) => {
    const updatedTender = TendersService.updateTender(id, updates)
    if (updatedTender) {
      setTenders((prev) => prev.map((tender) => (tender.id === id ? updatedTender : tender)))
    }
    return updatedTender
  }

  const deleteTender = (id: string) => {
    const success = TendersService.deleteTender(id)
    if (success) {
      setTenders((prev) => prev.filter((tender) => tender.id !== id))
    }
    return success
  }

  return {
    tenders,
    loading,
    addTender,
    updateTender,
    deleteTender,
  }
}
