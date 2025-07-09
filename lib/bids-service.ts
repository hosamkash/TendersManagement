import type { Bid } from "@/types/bid"

export class BidsService {
  private static getKey(): string {
    return "tenders_bids"
  }

  static getBids(): Bid[] {
    if (typeof window === "undefined") return []

    try {
      const data = localStorage.getItem(this.getKey())
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("Error reading bids from localStorage:", error)
      return []
    }
  }

  static saveBids(bids: Bid[]): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(this.getKey(), JSON.stringify(bids))
    } catch (error) {
      console.error("Error saving bids to localStorage:", error)
    }
  }

  static addBid(bid: Omit<Bid, "id" | "createdAt" | "updatedAt">): Bid {
    const bids = this.getBids()
    const newBid: Bid = {
      ...bid,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    bids.push(newBid)
    this.saveBids(bids)
    return newBid
  }

  static updateBid(id: string, updates: Partial<Bid>): Bid | null {
    const bids = this.getBids()
    const index = bids.findIndex((bid) => bid.id === id)

    if (index === -1) return null

    bids[index] = {
      ...bids[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    this.saveBids(bids)
    return bids[index]
  }

  static deleteBid(id: string): boolean {
    const bids = this.getBids()
    const filteredBids = bids.filter((bid) => bid.id !== id)

    if (filteredBids.length === bids.length) return false

    this.saveBids(filteredBids)
    return true
  }

  static getBidsByTender(tenderId: string): Bid[] {
    return this.getBids().filter((bid) => bid.tenderId === tenderId)
  }
}
