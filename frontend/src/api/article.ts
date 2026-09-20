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
 * 文章创建入参 DTO（对齐后端 ArticleCreateDTO 契约）
 */
export interface ArticleCreateDTO {
    title: string;
    content: string;
    categoryId: number | string;
    summary?: string;
    status: number; // 0: 草稿, 1: 已发布
}

/**
 * 分页查询已发布文章列表 (面向前台访客，对齐 GET /api/articles/page)
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

/**
 * 管理端：分页查询全量文章列表 (支持草稿与全量状态，对齐 GET /api/admin/articles/page)
 * 
 * @param query 分页与检索参数（含 status、categoryId、keyword、sortBy、isAsc）
 * @returns 分页包装结果
 */
export function adminPageQueryArticles(query: ArticlePageQuery): Promise<PageResult<ArticleListItem>> {
    return request<PageResult<ArticleListItem>>({
        url: '/admin/articles/page',
        method: 'GET',
        params: query,
    });
}

/**
 * 管理端：创建并保存文章/草稿 (对齐 POST /api/admin/articles)
 * 
 * @param data 创建文章载荷
 * @returns 新增的文章ID
 */
export function createArticle(data: ArticleCreateDTO): Promise<number | string> {
    return request<number | string>({
        url: '/admin/articles',
        method: 'POST',
        data,
    });
}
