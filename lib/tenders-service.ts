import type { Tender } from "@/types/tender"

export class TendersService {
  private static getKey(): string {
    return "tenders_tenders"
  }

  static getTenders(): Tender[] {
    if (typeof window === "undefined") return []

    try {
      const data = localStorage.getItem(this.getKey())
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("Error reading tenders from localStorage:", error)
      return []
    }
  }

  static saveTenders(tenders: Tender[]): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(this.getKey(), JSON.stringify(tenders))
    } catch (error) {
      console.error("Error saving tenders to localStorage:", error)
    }
  }

  static addTender(tender: Omit<Tender, "id" | "createdAt" | "updatedAt">): Tender {
    const tenders = this.getTenders()
    const newTender: Tender = {
      ...tender,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    tenders.push(newTender)
    this.saveTenders(tenders)
    return newTender
  }

  static updateTender(id: string, updates: Partial<Tender>): Tender | null {
    const tenders = this.getTenders()
    const index = tenders.findIndex((tender) => tender.id === id)

    if (index === -1) return null

    tenders[index] = {
      ...tenders[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    this.saveTenders(tenders)
    return tenders[index]
  }

  static deleteTender(id: string): boolean {
    const tenders = this.getTenders()
    const filteredTenders = tenders.filter((tender) => tender.id !== id)

    if (filteredTenders.length === tenders.length) return false

    this.saveTenders(filteredTenders)
    return true
  }
}
