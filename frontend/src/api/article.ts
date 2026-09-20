import request from "./request";
import type { PageQuery, PageResult } from "./types";

/**
 * 文章列表项 VO（对齐后端 ArticleListItemVO 契约）
 */
export interface ArticleListItem {
    id: string;
    title: string;
    summary: string;
    categoryId: string;
    status: number; // 0: 草稿, 1: 已发布
    viewCount: number;
    createdAt: string;
    updatedAt: string;
}

/**
 * 文章分页检索参数（对齐后端 ArticlePageQuery 契约）
 */
export interface ArticlePageQuery extends PageQuery {
    keyword?: string;
    categoryId?: number | string;
    status?: number;
    sortBy?: string;
    isAsc?: boolean;
}

/**
 * 分页查询已发布文章列表 (对齐 GET /api/articles/page)
 * 
 * @param query 分页与检索参数
 * @returns 分页包装结果
 */
export function pageQueryArticles(query: ArticlePageQuery): Promise<PageResult<ArticleListItem>> {
    return request<PageResult<ArticleListItem>>({
        url: '/articles/page',
        method: 'GET',
        params: query,
    });
}
