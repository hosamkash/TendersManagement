"use client"

import { useState, useEffect } from "react"
import type { Contract } from "@/types/contract"
import { ContractsService } from "@/lib/contracts-service"

export function useContracts() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContracts = () => {
      const savedContracts = ContractsService.getContracts()
      setContracts(savedContracts)
      setLoading(false)
    }

    loadContracts()
  }, [])

  const addContract = (contract: Omit<Contract, "id" | "createdAt" | "updatedAt">) => {
    const newContract = ContractsService.addContract(contract)
    setContracts((prev) => [...prev, newContract])
    return newContract
  }

  const updateContract = (id: string, updates: Partial<Contract>) => {
    const updatedContract = ContractsService.updateContract(id, updates)
    if (updatedContract) {
      setContracts((prev) => prev.map((contract) => (contract.id === id ? updatedContract : contract)))
    }
    return updatedContract
  }

  const deleteContract = (id: string) => {
    const success = ContractsService.deleteContract(id)
    if (success) {
      setContracts((prev) => prev.filter((contract) => contract.id !== id))
    }
    return success
  }

  const getActiveContracts = () => {
    return ContractsService.getActiveContracts()
  }

  const getExpiringContracts = (daysAhead = 30) => {
    return ContractsService.getExpiringContracts(daysAhead)
  }

  return {
    contracts,
    loading,
    addContract,
    updateContract,
    deleteContract,
    getActiveContracts,
    getExpiringContracts,
  }
}
