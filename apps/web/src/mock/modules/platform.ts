import { platformDashboard, platformProjects } from '@/mock/data'

const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms))

export async function getPlatformDashboard() {
  await delay()
  return structuredClone(platformDashboard)
}

export async function listProjects() {
  await delay()
  return structuredClone(platformProjects)
}
