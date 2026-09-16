import request from "./request";
import type { PageQuery, PageResult } from "./types";

export interface Category {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * 获取所有分类
 */
export function getAllCategories(): Promise<Category[]> {
    return request<Category[]>({
        url: '/categories',
        method: 'GET'
    });
}

/**
 * 创建分类
 * 
 * @param name 分类名称
 */
export function createCategory(name: string): Promise<void> {
    return request<void>({
        url: '/categories',
        method: 'POST',
        params: { name }
    });
}

/**
 * 更新分类
 * 
 * @param id 分类ID
 * @param name 分类名称
 */
export function updateCategory(id: number, name: string): Promise<void> {
    return request<void>({
        url: `/categories/${id}`,
        method: 'PUT',
        params: { name }
    })
}

/**
 * 删除分类
 * 
 * @param id 分类ID
 */
export function deleteCategory(id: number): Promise<void> {
    return request<void>({
        url: `/categories/${id}`,
        method: 'DELETE'
    });
}

/**
 * 分页查询分类
 * 
 * @param query 分页查询参数
 * @returns 分页查询结果
 */
export function pageQueryCategories(query: PageQuery): Promise<PageResult<Category>> {
    return request<PageResult<Category>>({
        url: '/categories/page',
        method: 'GET',
        params: query
    });
}