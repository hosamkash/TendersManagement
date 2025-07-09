import type { Contract } from "@/types/contract"

export class ContractsService {
  private static getKey(): string {
    return "tenders_contracts"
  }

  static getContracts(): Contract[] {
    if (typeof window === "undefined") return []

    try {
      const data = localStorage.getItem(this.getKey())
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("Error reading contracts from localStorage:", error)
      return []
    }
  }

  static saveContracts(contracts: Contract[]): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(this.getKey(), JSON.stringify(contracts))
    } catch (error) {
      console.error("Error saving contracts to localStorage:", error)
    }
  }

  static addContract(contract: Omit<Contract, "id" | "createdAt" | "updatedAt">): Contract {
    const contracts = this.getContracts()
    const newContract: Contract = {
      ...contract,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    contracts.push(newContract)
    this.saveContracts(contracts)
    return newContract
  }

  static updateContract(id: string, updates: Partial<Contract>): Contract | null {
    const contracts = this.getContracts()
    const index = contracts.findIndex((contract) => contract.id === id)

    if (index === -1) return null

    contracts[index] = {
      ...contracts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    this.saveContracts(contracts)
    return contracts[index]
  }

  static deleteContract(id: string): boolean {
    const contracts = this.getContracts()
    const filteredContracts = contracts.filter((contract) => contract.id !== id)

    if (filteredContracts.length === contracts.length) return false

    this.saveContracts(filteredContracts)
    return true
  }

  static getContractsBySupplier(supplierCode: string): Contract[] {
    return this.getContracts().filter((contract) => contract.supplierName === supplierCode)
  }

  static getActiveContracts(): Contract[] {
    const now = new Date()
    return this.getContracts().filter((contract) => {
      const endDate = new Date(contract.endDate)
      return contract.contractStatus === "ACTIVE" && endDate > now
    })
  }

  static getExpiringContracts(daysAhead = 30): Contract[] {
    const now = new Date()
    const futureDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000)

    return this.getContracts().filter((contract) => {
      const endDate = new Date(contract.endDate)
      return contract.contractStatus === "ACTIVE" && endDate <= futureDate && endDate > now
    })
  }
}
