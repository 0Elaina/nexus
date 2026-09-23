package com.nep.article.service.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.nep.article.constant.ArticleApiCode;
import com.nep.article.dto.ArticlePageQuery;
import com.nep.article.dto.ArticleSaveDTO;
import com.nep.article.entity.Article;
import com.nep.article.entity.ArticleTag;
import com.nep.article.mapper.ArticleMapper;
import com.nep.article.mapper.ArticleTagMapper;
import com.nep.article.service.ArticleService;
import com.nep.article.vo.ArticleDetailVO;
import com.nep.article.vo.ArticleListItemVO;
import com.nep.category.entity.Category;
import com.nep.category.service.CategoryService;
import com.nep.common.exception.BusinessException;
import com.nep.common.page.PageResult;
import com.nep.common.util.IpUtils;
import com.nep.tag.constant.TagApiCode;
import com.nep.tag.entity.Tag;
import com.nep.tag.service.TagService;

import static com.nep.article.constant.ArticleRedisConstants.KEY_ARTICLE_VIEW_COUNT;
import static com.nep.article.constant.ArticleRedisConstants.KEY_ARTICLE_VIEW_DIRTY;
import static com.nep.article.constant.ArticleRedisConstants.KEY_PREFIX_UV;
import static com.nep.article.constant.ArticleRedisConstants.UV_COOLDOWN;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ArticleServiceImpl implements ArticleService {
    private final ArticleMapper articleMapper;
    private final CategoryService categoryService;
    private final TagService tagService;
    private final ArticleTagMapper articleTagMapper;
    private final StringRedisTemplate stringRedisTemplate;

    private static final String VIEW_COUNT = "viewCount";
    private static final String UPDATED_AT = "updatedAt";

    /**
     * 分页查询文章列表
     * 
     * @param query 分页查询参数
     * @return 文章列表VO列表
     */
    @Override
    public PageResult<ArticleListItemVO> pageArticles(ArticlePageQuery query) {
        Page<Article> page = new Page<>(query.getPageNum(), query.getPageSize());
        LambdaQueryWrapper<Article> wrapper = new LambdaQueryWrapper<>();

        // 排除正文超长字段
        wrapper.select(Article.class, info -> !info.getProperty().equals("content"));

        // 精准匹配分类
        wrapper.eq(query.getCategoryId() != null, Article::getCategoryId, query.getCategoryId());

        // 获取目标标签ID列表
        Set<Long> targetTagIds = new HashSet<>();
        if (query.getTagIds() != null && !query.getTagIds().isEmpty()) {
            targetTagIds.addAll(query.getTagIds());
        }

        if (!targetTagIds.isEmpty()) {
            // 完全匹配
            if (Boolean.TRUE.equals(query.getMatchAllTags())) {
                for (Long tagId : targetTagIds) {
                    wrapper.exists(
                            "SELECT 1 FROM article_tag at WHERE at.article_id = article.id AND at.tag_id = {0}",
                            tagId);
                }
            } else {
                // 匹配其一
                String tagIdsStr = targetTagIds.stream()
                        .map(String::valueOf)
                        .collect(Collectors.joining(","));
                wrapper.exists("SELECT 1 FROM article_tag at WHERE at.article_id = article.id AND at.tag_id IN ("
                        + tagIdsStr + ")");
            }
        }

        wrapper.eq(query.getStatus() != null, Article::getStatus, query.getStatus());

        // 模糊匹配标题与摘要
        if (StringUtils.hasText(query.getKeyword())) {
            String value = query.getKeyword().strip();
            wrapper.and(w -> w.like(Article::getTitle, value)
                    .or()
                    .like(Article::getSummary, value));
        }

        // 排序
        boolean asc = Boolean.TRUE.equals(query.getIsAsc());
        String sortBy = query.getSortBy() == null ? "" : query.getSortBy().strip();
        switch (sortBy) {
            case VIEW_COUNT -> wrapper.orderBy(true, asc, Article::getViewCount);
            case UPDATED_AT -> wrapper.orderBy(true, asc, Article::getUpdatedAt);
            default -> wrapper.orderBy(true, asc, Article::getCreatedAt);
        }

        // 执行查询
        articleMapper.selectPage(page, wrapper);

        // 转换为VO列表
        List<ArticleListItemVO> voList = page.getRecords().stream()
                .map(ArticleListItemVO::from)
                .toList();
        // 批量取回所有文章的最新浏览量
        fillRealtimeViewCounts(voList);
        // 批量取回所有文章的最新标签
        fillArticleTags(voList);

        return PageResult.<ArticleListItemVO>builder()
                .records(voList)
                .total(page.getTotal())
                .currentPage(page.getCurrent())
                .pageSize(page.getSize())
                .build();
    }

    /**
     * 创建文章
     * 
     * @param dto 文章保存DTO
     * @return 创建的文章ID
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createArticle(ArticleSaveDTO dto) {
        // 校验分类是否存在
        categoryService.getCategoryById(dto.getCategoryId());

        // 生成摘要
        String summary = StringUtils.hasText(dto.getSummary())
                ? dto.getSummary()
                : extractSummary(dto.getContent());

        // 创建文章实体
        Article article = new Article();
        article.setTitle(dto.getTitle());
        article.setSummary(summary);
        article.setContent(dto.getContent());
        article.setCategoryId(dto.getCategoryId());
        article.setStatus(dto.getStatus());
        article.setViewCount(0L);

        // 执行插入操作
        articleMapper.insert(article);
        // 绑定标签
        bindArticleTags(article.getId(), dto.getTagIds());

        // 确保新文章一经发布，在 Redis 中就已有合法初值，后续详情读取与列表批量读取立即可见
        stringRedisTemplate.opsForHash().put(KEY_ARTICLE_VIEW_COUNT, article.getId().toString(), "0");
        return article.getId();
    }

    /**
     * 获取文章详情
     * 
     * @param articleId 文章ID
     * @return 文章详情VO
     * @throws BusinessException 如果文章不存在
     */
    @Override
    public ArticleDetailVO getArticleDetail(Long id) {
        Article article = articleMapper.selectById(id);
        if (article == null) {
            throw new BusinessException(ArticleApiCode.ARTICLE_NOT_FOUND);
        }

        // 在 Redis 中记录并获取最新访问量
        Long latestViewCount = recordAndGetViewCount(id, article.getViewCount());
        article.setViewCount(latestViewCount);

        Category category = categoryService.getCategoryById(article.getCategoryId());

        // 获取绑定的标签列表
        List<Long> tagIds = articleTagMapper.selectList(new LambdaQueryWrapper<ArticleTag>()
                .eq(ArticleTag::getArticleId, id))
                .stream()
                .map(ArticleTag::getTagId)
                .toList();
        List<Tag> tags = tagService.getTagsByIds(tagIds);

        return ArticleDetailVO.from(article, category.getName(), tags);
    }

    /**
     * 批量从 Redis 中获取最新浏览量并覆盖到列表 VO 中
     *
     * @param voList 分页文章 VO 列表
     */
    private void fillRealtimeViewCounts(List<ArticleListItemVO> voList) {
        if (voList == null || voList.isEmpty()) {
            return;
        }
        List<Object> articleIds = voList.stream()
                .map(a -> (Object) a.getId())
                .toList();

        // 批量取回所有文章的最新浏览量
        List<Object> redisViewCounts = stringRedisTemplate.opsForHash().multiGet(KEY_ARTICLE_VIEW_COUNT, articleIds);
        // 按下标一一对应覆盖
        for (int i = 0; i < voList.size(); i++) {
            Object countObj = redisViewCounts.get(i);
            if (countObj != null) {
                voList.get(i).setViewCount(Long.parseLong(countObj.toString()));
            }
        }
    }

    /**
     * 从文章内容中提取纯文本摘要
     * 
     * @param content Markdown 源码
     * @return 纯净文本摘要 (最多 150 字符)
     */
    private String extractSummary(String content) {
        if (!StringUtils.hasText(content)) {
            return "";
        }
        String plainText = content
                // 1. 剔除多行代码块 ```...```
                .replaceAll("```[\\s\\S]*?```", " ")
                // 2. 剔除 LaTeX 块级公式 ($$ ... $$ 或 $$$ ... $$$)
                .replaceAll("\\${2,}[\\s\\S]*?\\${2,}", " ")
                // 3. 剔除行内图片 ![alt](url)
                .replaceAll("!\\[[^\\]]*\\]\\([^\\)]*\\)", " ")
                // 4. 将超链接 [文本](url) 降级为单纯的 "文本"
                .replaceAll("\\[([^\\]]+)\\]\\([^\\)]*\\)", "$1")
                // 5. 剔除 HTML 标签 <...> </...>
                .replaceAll("<[^>]+>", " ")
                // 6. 剔除行内公式定界符 $ 以及常见的 MD 语法标号 (# * > ` _ ~ | 等)
                .replaceAll("[#*>`_~|\\[\\]\\$\\-\\+]", " ")
                // 7. 将多个连续的换行、制表符、空格归一化为单个空格
                .replaceAll("\\s+", " ")
                .strip();

        return plainText.length() > 150 ? plainText.substring(0, 150) + "..." : plainText;
    }

    /**
     * 修改文章
     *
     * @param id  文章主键 ID
     * @param dto 文章保存DTO
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateArticle(Long id, ArticleSaveDTO dto) {
        Article article = articleMapper.selectById(id);
        if (article == null) {
            throw new BusinessException(ArticleApiCode.ARTICLE_NOT_FOUND);
        }
        // 校验目标分类是否存在
        categoryService.getCategoryById(dto.getCategoryId());

        String summary = StringUtils.hasText(dto.getSummary())
                ? dto.getSummary()
                : extractSummary(dto.getContent());

        article.setTitle(dto.getTitle());
        article.setContent(dto.getContent());
        article.setSummary(summary);
        article.setCategoryId(dto.getCategoryId());
        article.setStatus(dto.getStatus());

        articleMapper.updateById(article);

        // 清理旧标签关联
        articleTagMapper.delete(new LambdaQueryWrapper<ArticleTag>()
                .eq(ArticleTag::getArticleId, id));
        // 绑定新标签
        bindArticleTags(id, dto.getTagIds());
    }

    /**
     * 删除文章
     *
     * @param id 文章主键 ID
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteArticle(Long id) {
        Article article = articleMapper.selectById(id);
        if (article == null) {
            throw new BusinessException(ArticleApiCode.ARTICLE_NOT_FOUND);
        }
        articleMapper.deleteById(id);
        // 清理文章标签关联记录
        articleTagMapper.delete(new LambdaQueryWrapper<ArticleTag>()
                .eq(ArticleTag::getArticleId, id));

        // 删除 Redis 中的访问量记录
        stringRedisTemplate.opsForHash().delete(KEY_ARTICLE_VIEW_COUNT, id.toString());
        // 删除脏数据
        stringRedisTemplate.opsForSet().remove(KEY_ARTICLE_VIEW_DIRTY, id.toString());
    }

    /**
     * 绑定文章标签
     * 
     * @param articleId 文章ID
     * @param tagIds    标签ID列表
     */
    private void bindArticleTags(Long articleId, List<Long> tagIds) {
        if (tagIds == null || tagIds.isEmpty()) {
            return;
        }
        if (articleId == null) {
            throw new BusinessException(ArticleApiCode.ARTICLE_ID_EMPTY);
        }

        // 校验是否存在不存在的标签ID
        Set<Long> uniqueTagIds = new HashSet<>(tagIds);
        List<Tag> existTagIds = tagService.getTagsByIds(uniqueTagIds);
        if (uniqueTagIds.size() != existTagIds.size()) {
            throw new BusinessException(TagApiCode.TAG_NOT_FOUND);
        }

        // 构建文章标签列表
        List<ArticleTag> articleTags = new ArrayList<>();
        for (Long tagId : uniqueTagIds) {
            ArticleTag articleTag = new ArticleTag();
            articleTag.setArticleId(articleId);
            articleTag.setTagId(tagId);
            articleTags.add(articleTag);
        }
        articleTagMapper.insert(articleTags);
    }

    /**
     * 记录并获取文章访问量
     * 
     * @param articleId   文章ID
     * @param dbViewCount 数据库中当前访问量
     * @return 更新后的访问量
     */
    private Long recordAndGetViewCount(Long articleId, Long dbViewCount) {
        long baseCount = dbViewCount == null ? 0L : dbViewCount;
        String idStr = articleId.toString();
        String clientIp = IpUtils.getClientIp();
        // 生成 UV 键
        String uvKey = KEY_PREFIX_UV + idStr + ":" + clientIp;

        Boolean setSuccess = stringRedisTemplate.opsForValue().setIfAbsent(uvKey, "1", UV_COOLDOWN);
        // 首次访问，记录 UV 并增加访问量
        if (Boolean.TRUE.equals(setSuccess)) {
            stringRedisTemplate.opsForHash().putIfAbsent(KEY_ARTICLE_VIEW_COUNT, idStr, String.valueOf(baseCount));
            long newCount = stringRedisTemplate.opsForHash().increment(KEY_ARTICLE_VIEW_COUNT, idStr, 1L);
            stringRedisTemplate.opsForSet().add(KEY_ARTICLE_VIEW_DIRTY, idStr);
            return newCount;
        } else {
            // 冷却期内重复访问
            Object value = stringRedisTemplate.opsForHash().get(KEY_ARTICLE_VIEW_COUNT, idStr);
            return value == null ? baseCount : Long.parseLong(value.toString());
        }
    }

    /**
     * 批量获取并装配文章列表的标签数据
     *
     * @param voList 分页文章 VO 列表
     */
    private void fillArticleTags(List<ArticleListItemVO> voList) {
        if (voList == null || voList.isEmpty()) {
            return;
        }
        // 获取所有文章ID列表
        List<Long> articleIds = voList.stream()
                .map(a -> Long.parseLong(a.getId()))
                .toList();
        // 获取所有文章标签关联记录
        List<ArticleTag> articleTags = articleTagMapper.selectList(new LambdaQueryWrapper<ArticleTag>()
                .in(ArticleTag::getArticleId, articleIds));

        // 如果没有关联记录，直接返回空列表
        if (articleTags == null || articleTags.isEmpty()) {
            return;
        }
        // 获取所有标签ID列表并去重
        Set<Long> tagIds = articleTags.stream()
                .map(ArticleTag::getTagId)
                .distinct()
                .collect(Collectors.toSet());
        // 获取 id 实体映射表
        Map<Long, Tag> tagMap = tagService.getTagMapByIds(tagIds);

        // 构建文章标签映射表
        Map<Long, List<Long>> articleToTagIds = articleTags.stream()
                .collect(Collectors.groupingBy(ArticleTag::getArticleId,
                        Collectors.mapping(ArticleTag::getTagId, Collectors.toList())));

        // 遍历文章 VO 列表，装配标签数据
        for (ArticleListItemVO vo : voList) {
            Long articleId = Long.parseLong(vo.getId());
            List<Long> tagIdList = articleToTagIds.getOrDefault(articleId, List.of());
            List<Tag> tags = tagIdList.stream()
                    .map(tagMap::get)
                    .filter(Objects::nonNull)
                    .toList();
            vo.setTags(tags);
        }
    }
}
