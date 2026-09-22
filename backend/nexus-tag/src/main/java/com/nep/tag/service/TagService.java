package com.nep.tag.service;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import com.nep.common.page.PageQuery;
import com.nep.common.page.PageResult;
import com.nep.tag.entity.Tag;

public interface TagService {
    /**
     * 获取全量标签列表（按 ID 升序排序）
     *
     * @return 全量标签列表（无数据时返回空 List，不返回 null）
     */
    List<Tag> getAllTags();

    /**
     * 根据 ID 集合获取标签列表（内存流式过滤，零 DB 查询）
     *
     * @param tagIds 标签 ID 集合（支持 List/Set）
     * @return 匹配的标签实体列表；若入参为空或无匹配，返回空 List（不返回 null）
     */
    List<Tag> getTagsByIds(Collection<Long> tagIds);

    /**
     * 根据 ID 集合获取标签映射字典 (ID -> Tag)
     * 专为文章列表批量映射组装设计，避免调用方双重循环匹配
     *
     * @param tagIds 标签 ID 集合
     * @return key 为 tagId, value 为 Tag 实体的 Map；若入参为空，返回空 Map
     */
    Map<Long, Tag> getTagMapByIds(Collection<Long> tagIds);

    /**
     * 创建新标签
     *
     * @param name 标签名称
     */
    void createTag(String name);

    /**
     * 更新标签名称
     *
     * @param id   标签 ID
     * @param name 新标签名称
     */
    void updateTag(Long id, String name);

    /**
     * 删除标签
     *
     * @param id 标签 ID
     */
    void deleteTag(Long id);

    /**
     * 根据 ID 获取标签详情
     *
     * @param id 标签 ID
     * @return 标签实体（绝不返回 null）
     */
    Tag getTagById(Long id);

    /**
     * 管理端分页查询标签列表（直查数据库，不污染 Redis 全量缓存）
     * 
     * @param query 分页请求参数（包含 pageNum, pageSize）
     * @return 统一分页结果包装（PageResult<Tag>）
     */
    PageResult<Tag> pageQueryTags(PageQuery query);
}
