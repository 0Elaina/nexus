package com.nep.tag.service.impl;

import com.nep.tag.service.TagService;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.core.type.TypeReference;
import com.nep.common.exception.BusinessException;
import com.nep.common.page.PageQuery;
import com.nep.common.page.PageResult;
import com.nep.common.util.JsonUtils;
import com.nep.tag.constant.TagApiCode;
import com.nep.tag.constant.TagRedisConstants;
import com.nep.tag.entity.Tag;
import com.nep.tag.mapper.TagMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {
    private final TagMapper tagMapper;
    private final StringRedisTemplate stringRedisTemplate;

    /**
     * 获取全量标签列表（按 ID 升序排序）
     *
     * @return 全量标签列表（无数据时返回空 List，不返回 null）
     */
    @Override
    public List<Tag> getAllTags() {
        String cacheTags = stringRedisTemplate.opsForValue().get(TagRedisConstants.TAG_ALL_KEY);
        // 查询到缓存, 返回
        if (StringUtils.hasText(cacheTags)) {
            return JsonUtils.fromJson(cacheTags, new TypeReference<List<Tag>>() {
            });
        }
        // 未命中缓存, 查库
        List<Tag> tags = tagMapper.selectList(new LambdaQueryWrapper<Tag>()
                .orderByAsc(Tag::getId));
        // 缓存并设置 ttl
        stringRedisTemplate.opsForValue().set(TagRedisConstants.TAG_ALL_KEY, JsonUtils.toJson(tags),
                TagRedisConstants.TAG_ALL_TTL);
        return tags;
    }

    /**
     * 根据 ID 集合获取标签列表（内存流式过滤，零 DB 查询）
     *
     * @param tagIds 标签 ID 集合（支持 List/Set）
     * @return 匹配的标签实体列表；若入参为空或无匹配，返回空 List（不返回 null）
     */
    @Override
    public List<Tag> getTagsByIds(Collection<Long> tagIds) {
        if (tagIds == null || tagIds.isEmpty()) {
            return List.of();
        }

        // 转换为 Set，去重
        Set<Long> tagIdsSet = new HashSet<>(tagIds);

        return getAllTags().stream()
                .filter(tag -> tagIdsSet.contains(tag.getId()))
                .toList();
    }

    /**
     * 根据 ID 集合获取标签映射字典 (ID -> Tag)
     * 专为文章列表批量映射组装设计，避免调用方双重循环匹配
     *
     * @param tagIds 标签 ID 集合
     * @return key 为 tagId, value 为 Tag 实体的 Map；若入参为空，返回空 Map
     */
    @Override
    public Map<Long, Tag> getTagMapByIds(Collection<Long> tagIds) {
        if (tagIds == null || tagIds.isEmpty()) {
            return Map.of();
        }
        return getTagsByIds(tagIds)
                .stream()
                .collect(Collectors.toMap(Tag::getId, Function.identity()));
    }

    /**
     * 创建新标签
     *
     * @param name 标签名称
     */
    @Override
    public void createTag(String name) {
        if (!StringUtils.hasText(name)) {
            throw new BusinessException(TagApiCode.TAG_NAME_EMPTY);
        }
        name = name.strip();
        Tag exist = tagMapper.selectOne(new LambdaQueryWrapper<Tag>()
                .eq(Tag::getName, name));
        if (exist != null) {
            throw new BusinessException(TagApiCode.TAG_NAME_DUPLICATE);
        }
        Tag tag = new Tag();
        tag.setName(name);
        tagMapper.insert(tag);
        // 刷新缓存
        stringRedisTemplate.delete(TagRedisConstants.TAG_ALL_KEY);
    }

    /**
     * 更新标签名称
     *
     * @param id   标签 ID
     * @param name 新标签名称
     */
    @Override
    public void updateTag(Long id, String name) {
        if (id == null) {
            throw new BusinessException(TagApiCode.TAG_ID_EMPTY);
        }
        if (!StringUtils.hasText(name)) {
            throw new BusinessException(TagApiCode.TAG_NAME_EMPTY);
        }
        name = name.strip();

        // 校验标签是否存在
        Tag exist = tagMapper.selectById(id);
        if (exist == null) {
            throw new BusinessException(TagApiCode.TAG_NOT_FOUND);
        }
        if (name.equals(exist.getName())) {
            return;
        }
        // 查询是否存在相同名称的标签，且不是当前标签的
        Tag sameTag = tagMapper.selectOne(new LambdaQueryWrapper<Tag>()
                .eq(Tag::getName, name)
                .ne(Tag::getId, id));
        // 校验新名称是否已存在
        if (sameTag != null) {
            throw new BusinessException(TagApiCode.TAG_NAME_DUPLICATE);
        }

        // 更新标签名称
        Tag updateTag = new Tag();
        updateTag.setId(id);
        updateTag.setName(name);
        tagMapper.updateById(updateTag);
        // 刷新缓存
        stringRedisTemplate.delete(TagRedisConstants.TAG_ALL_KEY);
    }

    /**
     * 删除标签
     *
     * @param id 标签 ID
     */
    @Override
    public void deleteTag(Long id) {
        if (id == null) {
            throw new BusinessException(TagApiCode.TAG_ID_EMPTY);
        }
        Tag exist = tagMapper.selectById(id);
        if (exist == null) {
            throw new BusinessException(TagApiCode.TAG_NOT_FOUND);
        }
        tagMapper.deleteById(id);
        // 刷新缓存
        stringRedisTemplate.delete(TagRedisConstants.TAG_ALL_KEY);
    }

    /**
     * 根据 ID 获取标签详情
     *
     * @param id 标签 ID
     * @return 标签实体（绝不返回 null）
     */
    @Override
    public Tag getTagById(Long id) {
        if (id == null) {
            throw new BusinessException(TagApiCode.TAG_ID_EMPTY);
        }
        Tag tag = tagMapper.selectById(id);
        if (tag == null) {
            throw new BusinessException(TagApiCode.TAG_NOT_FOUND);
        }
        return tag;
    }

    /**
     * 管理端分页查询标签列表（直查数据库，不污染 Redis 全量缓存）
     * 
     * @param query 分页请求参数（包含 pageNum, pageSize）
     * @return 统一分页结果包装（PageResult<Tag>）
     */
    @Override
    public PageResult<Tag> pageQueryTags(PageQuery query) {
        if (query == null) {
            query = new PageQuery();
        }
        Page<Tag> page = new Page<>(query.getPageNum(), query.getPageSize());
        tagMapper.selectPage(page, new LambdaQueryWrapper<Tag>()
                .orderByAsc(Tag::getId));
        return PageResult.fromMpPage(page);
    }
}
