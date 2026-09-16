/**
 * 分页查询参数
 */
export interface PageQuery {
    pageNum: number;
    pageSize: number;
}

/**
 * 分页结果
 */
export interface PageResult<T> {
    records: T[],
    total: number;
    currentPage: number;
    pageSize: number;
}