package com.nep.article.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.nep.article.dto.ArticlePageQuery;
import com.nep.article.entity.Article;
import com.nep.article.mapper.ArticleMapper;
import com.nep.article.service.ArticleService;
import com.nep.article.vo.ArticleListItemVO;
import com.nep.common.page.PageResult;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ArticleServiceImpl implements ArticleService {
    private final ArticleMapper articleMapper;

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
                .map(ArticleListItemVO::fromArticle)
                .toList();
        return PageResult.<ArticleListItemVO>builder()
                .records(voList)
                .total(page.getTotal())
                .currentPage(page.getCurrent())
                .pageSize(page.getSize())
                .build();
    }

}
