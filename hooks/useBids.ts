"use client"

import { useState, useEffect } from "react"
import type { Bid } from "@/types/bid"
import { BidsService } from "@/lib/bids-service"

export function useBids() {
  const [bids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBids = () => {
      const savedBids = BidsService.getBids()
      setBids(savedBids)
      setLoading(false)
    }

    loadBids()
  }, [])

  const addBid = (bid: Omit<Bid, "id" | "createdAt" | "updatedAt">) => {
    const newBid = BidsService.addBid(bid)
    setBids((prev) => [...prev, newBid])
    return newBid
  }

  const updateBid = (id: string, updates: Partial<Bid>) => {
    const updatedBid = BidsService.updateBid(id, updates)
    if (updatedBid) {
      setBids((prev) => prev.map((bid) => (bid.id === id ? updatedBid : bid)))
    }
    return updatedBid
  }

  const deleteBid = (id: string) => {
    const success = BidsService.deleteBid(id)
    if (success) {
      setBids((prev) => prev.filter((bid) => bid.id !== id))
    }
    return success
  }

  const getBidsByTender = (tenderId: string) => {
    return bids.filter((bid) => bid.tenderId === tenderId)
  }

  return {
    bids,
    loading,
    addBid,
    updateBid,
    deleteBid,
    getBidsByTender,
  }
}
