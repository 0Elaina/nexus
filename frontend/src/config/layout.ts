/**
 * Nexus 全局布局与交互标尺规范 (Anime-UI-Craft)
 * 供 TypeScript 逻辑、响应式计算与组件共享，杜绝魔法值
 */

export const LAYOUT_CONFIG = {
  // 顶部天际光学微胶囊导航高度 (px)
  NAV_HEIGHT: 56,
  // 黄金视线宽幅阅读展台最大宽度 (px)
  STAGE_MAX_WIDTH: 1120,
  // 头条漫画分镜比例 (21:9)
  MANGA_RATIO_HEADLINE: '21/9',
  // 标准篇章分镜比例 (16:9)
  MANGA_RATIO_STANDARD: '16/9',
  // 角落物性抽屉 (Toy-Dock) 折叠触柄尺寸 (px)
  TOY_DOCK_COLLAPSED_SIZE: 44,
  // 角落物性抽屉展开宽度 (px)
  TOY_DOCK_EXPANDED_WIDTH: 320,
  // 默认服务端分页条数
  DEFAULT_PAGE_SIZE: 10,
} as const

export type LayoutConfig = typeof LAYOUT_CONFIG
