import type { DefinitionItem } from "@/types/definitions"

export class LocalStorageService {
  private static getKey(type: string): string {
    return `tenders_${type}`
  }

  static getItems(type: string): DefinitionItem[] {
    if (typeof window === "undefined") return []

    try {
      const data = localStorage.getItem(this.getKey(type))
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("Error reading from localStorage:", error)
      return []
    }
  }

  static saveItems(type: string, items: DefinitionItem[]): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(this.getKey(type), JSON.stringify(items))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  }

  static addItem(type: string, item: Omit<DefinitionItem, "id" | "createdAt" | "updatedAt">): DefinitionItem {
    const items = this.getItems(type)
    const newItem: DefinitionItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    items.push(newItem)
    this.saveItems(type, items)
    return newItem
  }

  static updateItem(type: string, id: string, updates: Partial<DefinitionItem>): DefinitionItem | null {
    const items = this.getItems(type)
    const index = items.findIndex((item) => item.id === id)

    if (index === -1) return null

    items[index] = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    this.saveItems(type, items)
    return items[index]
  }

  static deleteItem(type: string, id: string): boolean {
    const items = this.getItems(type)
    const filteredItems = items.filter((item) => item.id !== id)

    if (filteredItems.length === items.length) return false

    this.saveItems(type, filteredItems)
    return true
  }
}
