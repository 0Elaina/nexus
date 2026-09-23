package com.nep.site.service;

import org.springframework.stereotype.Service;

import com.nep.article.service.ArticleService;
import com.nep.category.service.CategoryService;
import com.nep.site.vo.SiteStatsVO;
import com.nep.tag.service.TagService;

import lombok.RequiredArgsConstructor;

/**
 * 全站数据统计应用门面服务
 */
@Service
@RequiredArgsConstructor
public class SiteStatsService {

    private final ArticleService articleService;
    private final CategoryService categoryService;
    private final TagService tagService;

    /**
     * 获取全站宏观数据统计
     *
     * @return 全站数据统计视图对象
     */
    public SiteStatsVO getSiteStats() {
        return SiteStatsVO.builder()
                .articleCount(articleService.getPublishedArticleCount())
                .categoryCount((long) categoryService.getAllCategories().size())
                .tagCount((long) tagService.getAllTags().size())
                .totalViewCount(articleService.getTotalViewCount())
                .build();
    }
}
