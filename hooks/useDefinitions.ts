"use client"

import { useState, useEffect } from "react"
import type { DefinitionItem } from "@/types/definitions"
import { LocalStorageService } from "@/lib/localStorage"

export function useDefinitions(type: string) {
  const [items, setItems] = useState<DefinitionItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadItems = () => {
      const savedItems = LocalStorageService.getItems(type)
      setItems(savedItems)
      setLoading(false)
    }

    loadItems()
  }, [type])

  const addItem = (item: Omit<DefinitionItem, "id" | "createdAt" | "updatedAt">) => {
    const newItem = LocalStorageService.addItem(type, item)
    setItems((prev) => [...prev, newItem])
    return newItem
  }

  const updateItem = (id: string, updates: Partial<DefinitionItem>) => {
    const updatedItem = LocalStorageService.updateItem(type, id, updates)
    if (updatedItem) {
      setItems((prev) => prev.map((item) => (item.id === id ? updatedItem : item)))
    }
    return updatedItem
  }

  const deleteItem = (id: string) => {
    const success = LocalStorageService.deleteItem(type, id)
    if (success) {
      setItems((prev) => prev.filter((item) => item.id !== id))
    }
    return success
  }

  return {
    items,
    loading,
    addItem,
    updateItem,
    deleteItem,
  }
}
