package com.nep.article.controller;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nep.article.dto.ArticleCreateDTO;
import com.nep.article.dto.ArticlePageQuery;
import com.nep.article.service.ArticleService;
import com.nep.article.vo.ArticleDetailVO;
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

    /**
     * 分页查询文章
     * 
     * @param query 分页查询参数
     * @return 文章分页结果
     */
    @GetMapping("/page")
    public Result<PageResult<ArticleListItemVO>> pageArticles(@Valid ArticlePageQuery query) {
        return Result.success(articleService.pageArticles(query));
    }

    /**
     * 创建文章
     * 
     * @param dto 文章创建DTO
     * @return 创建的文章ID
     */
    @PostMapping
    public Result<Long> createArticle(@Valid @RequestBody ArticleCreateDTO dto) {
        return Result.success(articleService.createArticle(dto));
    }

    /**
     * 获取文章详情
     * 
     * @param id 文章ID
     * @return 文章详情
     */
    @GetMapping("/{id}")
    public Result<ArticleDetailVO> getArticleDetail(@PathVariable Long id) {
        return Result.success(articleService.getArticleDetail(id));
    }
}
