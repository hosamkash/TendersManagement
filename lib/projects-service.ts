import type { Project } from "@/types/project"

export class ProjectsService {
  private static getKey(): string {
    return "tenders_projects"
  }

  static getProjects(): Project[] {
    if (typeof window === "undefined") return []

    try {
      const data = localStorage.getItem(this.getKey())
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("Error reading projects from localStorage:", error)
      return []
    }
  }

  static saveProjects(projects: Project[]): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(this.getKey(), JSON.stringify(projects))
    } catch (error) {
      console.error("Error saving projects to localStorage:", error)
    }
  }

  static addProject(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Project {
    const projects = this.getProjects()
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    projects.push(newProject)
    this.saveProjects(projects)
    return newProject
  }

  static updateProject(id: string, updates: Partial<Project>): Project | null {
    const projects = this.getProjects()
    const index = projects.findIndex((project) => project.id === id)

    if (index === -1) return null

    projects[index] = {
      ...projects[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    this.saveProjects(projects)
    return projects[index]
  }

  static deleteProject(id: string): boolean {
    const projects = this.getProjects()
    const filteredProjects = projects.filter((project) => project.id !== id)

    if (filteredProjects.length === projects.length) return false

    this.saveProjects(filteredProjects)
    return true
  }
}
