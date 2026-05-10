import type { AgentTask, Chapter, CharacterCard, ExportAsset, Project } from '@/types'

const wait = <T>(data: T, ms = 180): Promise<T> =>
  new Promise((resolve) => window.setTimeout(() => resolve(data), ms))

export const mockProjects: Project[] = [
  {
    id: 'yunzhou',
    name: '云州旧梦',
    type: '古风女频',
    style: '国漫条漫',
    chapters: 120,
    words: '128W',
    progress: 68,
    stage: '分镜中',
    status: 'storyboarding',
    parsedChapters: 36,
    episodes: 4,
    panels: 186,
    latest: '第 1 话第 12 格 Prompt 调整',
  },
  {
    id: 'neon-end',
    name: '霓虹尽头',
    type: '赛博朋克',
    style: '悬疑向',
    chapters: 86,
    words: '74W',
    progress: 31,
    stage: '解析中',
    status: 'analyzing',
    parsedChapters: 18,
    episodes: 0,
    panels: 0,
    latest: 'HermesAgent 正在解析第 19 章',
  },
  {
    id: 'cat-girl',
    name: '社恐女孩与猫',
    type: '治愈短篇',
    style: '日系清新',
    chapters: 12,
    words: '8W',
    progress: 100,
    stage: '已导出',
    status: 'exported',
    parsedChapters: 12,
    episodes: 1,
    panels: 42,
    latest: '制作资料已导出，可下载',
  },
]

const chapters: Chapter[] = [
  { no: '001', title: '第1章 雨夜退婚', words: 3820, status: '已解析' },
  { no: '002', title: '第2章 重回沈家', words: 4120, status: '已解析' },
  { no: '003', title: '第3章 玉佩旧事', words: 5240, status: '解析中' },
  { no: '004', title: '第4章 暗处来客', words: 3910, status: '待解析' },
]

const characters: CharacterCard[] = [
  {
    name: '沈青禾',
    role: 'Heroine',
    desc: '沈家庶女，隐忍、聪慧、外柔内刚。黑色长发，浅青色古风衣裙。',
    rules: ['不能短发', '不能搞笑化'],
    prompt: '古风国漫，清冷少女，黑色长发，浅青色衣裙，雨夜氛围，克制表情...',
  },
  {
    name: '顾长渊',
    role: 'Lead',
    desc: '身份成谜的青年权臣，沉稳克制，暗中调查沈家旧事。',
    rules: ['身份不可提前暴露'],
    prompt: '古风国漫，黑衣青年，冷峻，暗处观察，低饱和光影...',
  },
  {
    name: '沈夫人',
    role: 'Antagonist',
    desc: '沈家主母，强势、精明，掌握女主母亲旧事。',
    rules: ['不能弱化压迫感'],
    prompt: '古风贵妇，华服，正厅烛光，压迫感，威严姿态...',
  },
]

const tasks: AgentTask[] = [
  { id: '#3001', agent: 'StoryboardAgent', target: 'Episode 01', status: 'success', duration: '128s', retry: 0 },
  { id: '#1024', agent: 'NovelChapterAnalysisAgent', target: 'Chapter 3', status: 'running', duration: '42s', retry: 0 },
  { id: '#1018', agent: 'NovelChapterAnalysisAgent', target: 'Chapter 2', status: 'failed', duration: '180s', retry: 1 },
]

const exportsData: ExportAsset[] = [
  { file: '云州旧梦_第1话_分镜表.xlsx', type: 'Excel', status: 'Success', size: '126KB' },
  { file: '云州旧梦_第1话_剧本.docx', type: 'Word', status: 'Success', size: '89KB' },
  { file: '云州旧梦_第1话_预览.html', type: 'HTML', status: 'Running', size: '-' },
]

export const mockApi = {
  login: () => wait({ token: 'mock-token', user: { name: 'Product Manager', email: 'demo@mangaforge.ai' } }),
  getProjects: () => wait(mockProjects),
  getProject: (projectId: string) => wait(mockProjects.find((p) => p.id === projectId) ?? mockProjects[0]),
  getDashboard: () =>
    wait({
      projects: 12,
      aiJobs: 47,
      exports: 91,
      teamMembers: 8,
    }),
  getChapters: () => wait(chapters),
  getCharacters: () => wait(characters),
  getTasks: () => wait(tasks),
  getExports: () => wait(exportsData),
  uploadNovel: () => wait({ progress: 100, chapters: 120, file: 'yunzhou_old_dream.txt' }, 550),
  runAnalysis: () => wait({ status: 'success', taskId: '#1021' }, 900),
}
