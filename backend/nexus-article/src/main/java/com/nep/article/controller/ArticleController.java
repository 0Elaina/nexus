package com.nep.article.controller;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nep.article.dto.ArticlePageQuery;
import com.nep.article.dto.ArticleSaveDTO;
import com.nep.article.entity.Article;
import com.nep.article.service.ArticleService;
import com.nep.article.vo.ArticleDetailVO;
import com.nep.article.vo.ArticleListItemVO;
import com.nep.common.annotation.RequireRole;
import com.nep.common.api.Result;
import com.nep.common.constant.RoleConstants;
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
     * 前台分页查询已发布文章列表
     */
    @GetMapping("/page")
    public Result<PageResult<ArticleListItemVO>> pageArticles(@Valid ArticlePageQuery query) {
        query.setStatus(Article.STATUS_PUBLISHED);
        return Result.success(articleService.pageArticles(query));
    }

    /**
     * 获取文章详情
     */
    @GetMapping("/{id}")
    public Result<ArticleDetailVO> getArticleDetail(@PathVariable Long id) {
        return Result.success(articleService.getArticleDetail(id));
    }

    /**
     * 后台管理分页查询文章列表
     */
    @RequireRole(RoleConstants.ROLE_ADMIN)
    @GetMapping("/manage/page")
    public Result<PageResult<ArticleListItemVO>> pageManageArticles(@Valid ArticlePageQuery query) {
        return Result.success(articleService.pageArticles(query));
    }

    /**
     * 创建文章
     */
    @RequireRole(RoleConstants.ROLE_ADMIN)
    @PostMapping
    public Result<Long> createArticle(@Valid @RequestBody ArticleSaveDTO dto) {
        return Result.success(articleService.createArticle(dto));
    }

    /**
     * 修改文章
     */
    @RequireRole(RoleConstants.ROLE_ADMIN)
    @PutMapping("/{id}")
    public Result<Void> updateArticle(@PathVariable Long id, @Valid @RequestBody ArticleSaveDTO dto) {
        articleService.updateArticle(id, dto);
        return Result.success();
    }

    /**
     * 删除文章
     */
    @RequireRole(RoleConstants.ROLE_ADMIN)
    @DeleteMapping("/{id}")
    public Result<Void> deleteArticle(@PathVariable Long id) {
        articleService.deleteArticle(id);
        return Result.success();
    }
}
