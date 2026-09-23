/**
 * 全站宏观数据统计视图契约 (对齐后端 nexus-app BFF 模块 SiteStatsVO)
 */

export interface SiteStatsVO {
  articleCount: number
  categoryCount: number
  tagCount: number
  totalViewCount: number
}
