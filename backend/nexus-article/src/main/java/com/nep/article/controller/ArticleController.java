package com.nep.article.controller;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nep.article.dto.ArticlePageQuery;
import com.nep.article.entity.Article;
import com.nep.article.service.ArticleService;
import com.nep.article.vo.ArticleListItemVO;
import com.nep.common.api.Result;
import com.nep.common.page.PageResult;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Validated
@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {
    private final ArticleService articleService;

    /**
     * 分页查询已发布文章列表
     * 
     * @param query 分页查询参数
     * @return 文章列表VO列表
     */
    @GetMapping("/page")
    public Result<PageResult<ArticleListItemVO>> pageArticles(@Valid ArticlePageQuery query) {
        query.setStatus(Article.STATUS_PUBLISHED);
        return Result.success(articleService.pageArticles(query));
    }
}
