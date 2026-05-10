import { projectData } from '@/mock/data'

const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms))

function clone(name: string) {
  const key = projectData[name] ? name : '云州旧梦'
  return structuredClone(projectData[key])
}

export async function getProjectDetail(name: string) {
  await delay()
  return clone(name)
}

export async function simulateUpload(name: string) {
  await delay(200)
  const project = projectData[name] || projectData['云州旧梦']
  return {
    status: 'Uploaded',
    progress: 100,
    text: 'Upload progress: 100% · 120 chapters detected',
    chapters: project.chapters,
  }
}

export async function rerunAnalysis(name: string) {
  await delay(300)
  const project = projectData[name] || projectData['云州旧梦']
  project.analysis.status = 'Success'
  return structuredClone(project.analysis)
}

export async function generateEpisodePlan() {
  await delay(240)
  return { ok: true }
}

export async function saveStoryboardPanel() {
  await delay(150)
  return { ok: true }
}

export async function startExport() {
  await delay(200)
  return { ok: true }
}

export async function retryTask(name: string, id: string) {
  await delay(180)
  const project = projectData[name] || projectData['云州旧梦']
  const task = project.tasks.find((x) => x.id === id)
  if (task) {
    task.status = 'Running'
    task.retry += 1
    task.duration = '0s'
  }
  return structuredClone(project.tasks)
}
