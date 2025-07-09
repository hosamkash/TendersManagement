"use client"

import { useState, useEffect } from "react"
import type { Project } from "@/types/project"
import { ProjectsService } from "@/lib/projects-service"

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProjects = () => {
      const savedProjects = ProjectsService.getProjects()
      setProjects(savedProjects)
      setLoading(false)
    }

    loadProjects()
  }, [])

  const addProject = (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
    const newProject = ProjectsService.addProject(project)
    setProjects((prev) => [...prev, newProject])
    return newProject
  }

  const updateProject = (id: string, updates: Partial<Project>) => {
    const updatedProject = ProjectsService.updateProject(id, updates)
    if (updatedProject) {
      setProjects((prev) => prev.map((project) => (project.id === id ? updatedProject : project)))
    }
    return updatedProject
  }

  const deleteProject = (id: string) => {
    const success = ProjectsService.deleteProject(id)
    if (success) {
      setProjects((prev) => prev.filter((project) => project.id !== id))
    }
    return success
  }

  return {
    projects,
    loading,
    addProject,
    updateProject,
    deleteProject,
  }
}
