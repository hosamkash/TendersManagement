import { LocalStorageService } from "./localStorage"
import { SEED_DATA } from "@/data/seed-data"
import { DEFINITION_TYPES } from "@/types/definitions"
// Add import for projects seed data
import { PROJECTS_SEED_DATA } from "@/data/projects-seed-data"
import { ProjectsService } from "./projects-service"
// Add import for evaluations seed data
import { EVALUATIONS_SEED_DATA } from "@/data/evaluations-seed-data"
import { EvaluationsService } from "./evaluations-service"
// Add import for contracts seed data
import { CONTRACTS_SEED_DATA } from "@/data/contracts-seed-data"
import { ContractsService } from "./contracts-service"

export class SeedService {
  static loadSeedData(type: string): number {
    const seedItems = SEED_DATA[type] || []
    let addedCount = 0

    seedItems.forEach((item) => {
      try {
        LocalStorageService.addItem(type, item)
        addedCount++
      } catch (error) {
        console.error(`Error adding seed item for ${type}:`, error)
      }
    })

    return addedCount
  }

  // Add method to load projects seed data
  static loadProjectsSeedData(): number {
    let addedCount = 0

    PROJECTS_SEED_DATA.forEach((project) => {
      try {
        ProjectsService.addProject(project)
        addedCount++
      } catch (error) {
        console.error("Error adding seed project:", error)
      }
    })

    return addedCount
  }

  // Add method to load evaluations seed data
  static loadEvaluationsSeedData(): number {
    let addedCount = 0

    EVALUATIONS_SEED_DATA.forEach((evaluation) => {
      try {
        EvaluationsService.addEvaluation(evaluation)
        addedCount++
      } catch (error) {
        console.error("Error adding seed evaluation:", error)
      }
    })

    return addedCount
  }

  // Add method to load contracts seed data
  static loadContractsSeedData(): number {
    let addedCount = 0

    CONTRACTS_SEED_DATA.forEach((contract) => {
      try {
        ContractsService.addContract(contract)
        addedCount++
      } catch (error) {
        console.error("Error adding seed contract:", error)
      }
    })

    return addedCount
  }

  // Update loadAllSeedData method to include projects
  static loadAllSeedData(): Record<string, number> {
    const results: Record<string, number> = {}

    DEFINITION_TYPES.forEach((defType) => {
      results[defType.key] = this.loadSeedData(defType.key)
    })

    // Add projects seed data
    results["projects"] = this.loadProjectsSeedData()

    // Add evaluations seed data
    results["evaluations"] = this.loadEvaluationsSeedData()

    // Add contracts seed data
    results["contracts"] = this.loadContractsSeedData()

    return results
  }

  // Update clearAllData method to include projects
  static clearAllData(): void {
    DEFINITION_TYPES.forEach((defType) => {
      LocalStorageService.saveItems(defType.key, [])
    })

    // Clear projects data
    ProjectsService.saveProjects([])

    // Clear evaluations data
    EvaluationsService.saveEvaluations([])

    // Clear contracts data
    ContractsService.saveContracts([])
  }

  // Update hasAnyData method to include projects
  static hasAnyData(): boolean {
    const hasDefinitionData = DEFINITION_TYPES.some((defType) => this.hasData(defType.key))
    const hasProjectsData = ProjectsService.getProjects().length > 0
    const hasEvaluationsData = EvaluationsService.getEvaluations().length > 0
    const hasContractsData = ContractsService.getContracts().length > 0
    return hasDefinitionData || hasProjectsData || hasEvaluationsData || hasContractsData
  }

  static hasData(type: string): boolean {
    const items = LocalStorageService.getItems(type)
    return items.length > 0
  }
}
