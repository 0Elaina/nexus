package com.nep.article.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.nep.article.constant.ArticleApiCode;
import com.nep.article.dto.ArticleCreateDTO;
import com.nep.article.dto.ArticlePageQuery;
import com.nep.article.entity.Article;
import com.nep.article.mapper.ArticleMapper;
import com.nep.article.service.ArticleService;
import com.nep.article.vo.ArticleDetailVO;
import com.nep.article.vo.ArticleListItemVO;
import com.nep.category.entity.Category;
import com.nep.category.service.CategoryService;
import com.nep.common.exception.BusinessException;
import com.nep.common.page.PageResult;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ArticleServiceImpl implements ArticleService {
    private final ArticleMapper articleMapper;
    private final CategoryService categoryService;

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

        // 精准匹配状态与分类
        wrapper.eq(query.getCategoryId() != null, Article::getCategoryId, query.getCategoryId());
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
     * @param dto 文章创建DTO
     * @return 创建的文章ID
     */
    @Override
    public Long createArticle(ArticleCreateDTO dto) {
        // 校验分类是否存在
        categoryService.getCategoryById(dto.getCategoryId());
        String summary = StringUtils.hasText(dto.getSummary())
                ? dto.getSummary()
                : extractSummary(dto.getContent());
        Article article = new Article();
        article.setTitle(dto.getTitle());
        article.setSummary(summary);
        article.setContent(dto.getContent());
        article.setCategoryId(dto.getCategoryId());
        article.setStatus(dto.getStatus());
        article.setViewCount(0L);
        articleMapper.insert(article);
        return article.getId();
    }

    /**
     * 获取文章详情
     * 
     * @param articleId 文章ID
     * @return 文章详情VO
     * @throws IllegalArgumentException 如果文章不存在
     */
    @Override
    public ArticleDetailVO getArticleDetail(Long id) {
        Article article = articleMapper.selectById(id);
        if (article == null) {
            throw new BusinessException(ArticleApiCode.ARTICLE_NOT_FOUND);
        }
        Category category = categoryService.getCategoryById(article.getCategoryId());
        return ArticleDetailVO.from(article, category.getName());
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

}
