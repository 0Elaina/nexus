import { useQuery } from '@tanstack/react-query'
import request from '@/lib/api-client'
import type { SiteStatsVO } from '../types'

export const siteKeys = {
  all: ['site'] as const,
  stats: () => [...siteKeys.all, 'stats'] as const,
}

/**
 * 查询全站宏观数据统计（nexus-app BFF 门面聚合）
 */
export function useSiteStatsQuery() {
  return useQuery({
    queryKey: siteKeys.stats(),
    queryFn: () =>
      request<SiteStatsVO>({
        url: '/site/stats',
        method: 'GET',
      }),
  })
}
