import type {
  PlatformDashboardDTO,
  PlatformProjectDTO,
  ProjectDatasetDTO,
} from '@/types/mock'

export const platformDashboard: PlatformDashboardDTO = {
  activeProjects: 12,
  parsedChapters: 286,
  comicEpisodes: 38,
  exportAssets: 91,
}

export const platformProjects: PlatformProjectDTO[] = [
  { id: 'p1', name: '云州旧梦', subtitle: '古风国漫 / 分镜中 / 68%', status: 'Storyboarding', progress: 68 },
  { id: 'p2', name: '霓虹尽头', subtitle: '赛博悬疑 / 解析中 / 31%', status: 'Analyzing', progress: 31 },
  { id: 'p3', name: '社恐女孩与猫', subtitle: '治愈短篇 / 已导出 / 100%', status: 'Exported', progress: 100 },
]

export const projectData: Record<string, ProjectDatasetDTO> = {
  '云州旧梦': {
    overview: {
      name: '云州旧梦',
      meta: '古风国漫 · 分镜中 · 68%',
      stage: 'Storyboarding',
      chapterProgress: '36/120',
      episodeProgress: '4/12',
    },
    chapters: [
      { id: 'c1', title: '第1章 雨夜退婚', words: 3820, status: 'analyzed' },
      { id: 'c2', title: '第2章 重回沈家', words: 4120, status: 'analyzed' },
      { id: 'c3', title: '第3章 玉佩旧事', words: 5240, status: 'running' },
      { id: 'c4', title: '第4章 暗处来客', words: 3910, status: 'pending' },
    ],
    analysis: {
      summary: '沈青竹在雨夜回到沈家，当众拒绝被安排的婚事，与沈夫人发生正面冲突。',
      characters: ['沈青竹', '沈夫人', '顾长渊', '春桃'],
      events: ['雨夜归家', '正厅逼婚', '当众退婚', '顾长渊注意到玉佩'],
      suggestion: '前5格快速建立雨夜、压迫和反抗，心理描写转镜头动作。',
      status: 'Success',
    },
    storyboardPanels: [
      {
        id: 's1',
        title: 'Panel 01 · 沈家府门',
        status: 'AI Draft',
        shot: '远景',
        characters: '沈青竹',
        imageDescription: '雨夜，沈家府门前，少女独自站在雨幕中。',
        narration: '她终于回来了。',
        sfx: '哗——',
        prompt: '古风国漫，雨夜府门，清冷少女，电影感远景，条漫分镜。',
      },
      {
        id: 's2',
        title: 'Panel 02 · 玉佩特写',
        status: 'Edited',
        shot: '特写',
        characters: '沈青竹',
        imageDescription: '少女袖中手指攥紧玉佩，雨光掠过纹理。',
        narration: '',
        sfx: '咔',
        prompt: '玉佩特写，少女手指，雨夜冷光，悬念氛围。',
      },
    ],
    exports: [
      { file: '云州旧梦_第1话_分镜表.xlsx', type: 'Excel', status: 'Success', size: '126KB' },
      { file: '云州旧梦_第1话_预览.html', type: 'HTML', status: 'Running', size: '-' },
    ],
    tasks: [
      { id: '#3001', agent: 'StoryboardAgent', target: 'Episode 01', status: 'Success', duration: '128s', retry: 0 },
      { id: '#1024', agent: 'NovelChapterAnalysisAgent', target: 'Chapter 3', status: 'Running', duration: '42s', retry: 0 },
      { id: '#1018', agent: 'NovelChapterAnalysisAgent', target: 'Chapter 2', status: 'Failed', duration: '180s', retry: 1 },
    ],
  },
}
