package com.nep.article.controller;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nep.article.dto.ArticlePageQuery;
import com.nep.article.service.ArticleService;
import com.nep.article.vo.ArticleListItemVO;
import com.nep.common.api.Result;
import com.nep.common.page.PageResult;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Validated
@RestController
@RequestMapping("/api/admin/articles")
@RequiredArgsConstructor
public class AdminArticleController {
    private final ArticleService articleService;

    @GetMapping("/page")
    public Result<PageResult<ArticleListItemVO>> pageArticles(@Valid ArticlePageQuery query) {
        return Result.success(articleService.pageArticles(query));
    }
}
